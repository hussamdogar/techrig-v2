import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { service } from "@/lib/server/supabase";
import { checkRateLimit, verifyLeadAccessToken } from "@/lib/server/security";
import { QUICK_BUY_TOKEN_COOKIE } from "@/lib/server/quick-buy";
import { stripe } from "@/lib/stripe";
import { computeQuickBuyPricing, isQuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";

/**
 * POST /api/quick-buy-checkout (quick-buy fast path). Sibling to /api/checkout,
 * NOT a modification of it: this keeps the already-shipped /apply payment path's
 * blast radius untouched. SERVER-PRICED, same as /apply: the amount is
 * recomputed from the registry + the order's confirmed service/fields, the
 * client never sends an amount.
 *
 * Auth is capability-based, not a Supabase session: the confirm screen's signed
 * lead token (the same primitive /apply's lead_token uses) is carried here in an
 * httpOnly cookie and verified against the order's lead_id. Idempotency key =
 * hash("quick-buy" | orderId | serviceKey | amount), a distinct namespace from
 * /api/checkout's key so the two can never collide even coincidentally.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOINDEX = { "X-Robots-Tag": "noindex" } as const;
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: NOINDEX });

type QuickBuyOrderRow = {
  usdot_number: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  address_country: string | null;
};

/**
 * Validates a country value is a real ISO 3166-1 alpha-2 code before it ever
 * reaches Stripe, returning undefined (omit the field) otherwise. Carriers
 * are not all US-domiciled (confirmed live: USDOT 3678098 is an Ontario,
 * Canada carrier) — never default a missing/malformed value to "US". This
 * also guards against QCMobile's country field name being unconfirmed (see
 * lib/lookup/qcmobile.ts): a wrong field name just means undefined here, not
 * a bad value silently sent as fact, and never something that could break the
 * whole PaymentIntent create call the way an invalid Stripe address shape
 * would.
 */
function validCountry(value: string | null): string | undefined {
  return value && /^[A-Za-z]{2}$/.test(value) ? value.toUpperCase() : undefined;
}

/**
 * Finds or creates the Stripe Customer for this carrier (owner decision,
 * 2026-09-15: every new client gets a real Customer, not a guest charge),
 * deduped by USDOT via the stripe_customers table (migration 0015) so a
 * repeat order never creates a second Customer for the same carrier.
 *
 * The create call carries a USDOT-derived idempotency key, so even if two
 * requests for a never-seen-before USDOT race each other, Stripe itself
 * returns the identical Customer id to both — the upsert below just needs to
 * not error on the second write, not resolve which id "won".
 *
 * Best-effort: any failure here (Stripe API error, DB error) returns null so
 * the caller falls back to a guest PaymentIntent rather than blocking the
 * charge. A Customer record is an enhancement, not a checkout dependency.
 */
async function findOrCreateStripeCustomer(
  db: ReturnType<typeof service>,
  order: QuickBuyOrderRow,
): Promise<string | null> {
  if (!order.usdot_number) return null;

  const { data: existing } = await db
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("usdot_number", order.usdot_number)
    .maybeSingle();
  if (existing?.stripe_customer_id) return existing.stripe_customer_id;

  const name = `${order.first_name ?? ""} ${order.last_name ?? ""}`.trim() || undefined;
  const idempotencyKey = createHash("sha256").update(`stripe-customer|${order.usdot_number}`).digest("hex");

  try {
    const customer = await stripe().customers.create(
      {
        name,
        email: order.email ?? undefined,
        phone: order.phone ?? undefined,
        address: order.address_line1
          ? {
              line1: order.address_line1,
              line2: order.address_line2 ?? undefined,
              city: order.address_city ?? undefined,
              state: order.address_state ?? undefined,
              postal_code: order.address_zip ?? undefined,
              country: validCountry(order.address_country),
            }
          : undefined,
      },
      { idempotencyKey },
    );

    await db
      .from("stripe_customers")
      .upsert({ usdot_number: order.usdot_number, stripe_customer_id: customer.id }, { onConflict: "usdot_number", ignoreDuplicates: true });

    return customer.id;
  } catch (error) {
    console.error("stripe customer create failed:", error instanceof Error ? error.message : "error");
    return null;
  }
}

export async function POST(request: Request) {
  if (!(await checkRateLimit({ headers: request.headers, key: "quick-buy-checkout", limit: 20, windowMs: 15 * 60 * 1000 }))) {
    return json({ error: "Too many attempts. Please wait a moment." }, 429);
  }

  let orderId: unknown;
  try {
    orderId = (await request.json())?.orderId;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (typeof orderId !== "string") return json({ error: "Missing orderId." }, 400);

  const store = await cookies();
  const token = store.get(QUICK_BUY_TOKEN_COOKIE)?.value;

  const db = service();
  const { data: order } = await db.from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) return json({ error: "Order not found." }, 404);

  // Capability check: possession of a token that verifies against this order's
  // lead is what authorizes the charge, not a login session.
  if (!verifyLeadAccessToken(token, order.lead_id)) return json({ error: "Not authorized." }, 401);

  // Scope guard, independent of what's in the row: this endpoint only ever
  // prices/charges the five quick-buy services.
  if (!isQuickBuyServiceKey(order.service_key)) return json({ error: "Unsupported service." }, 400);
  if (!order.confirmed_at) return json({ error: "Order not confirmed yet." }, 400);
  if (!order.signature_name || !order.terms_accepted_at) return json({ error: "Order not signed yet." }, 400);
  if (order.status === "paid" || order.status === "fulfilled") return json({ error: "Already paid." }, 409);

  // Price the FULL selected set: the primary service plus any upsells added on
  // the review screen. Always standalone pricing: bundles are exclusively an
  // /apply concept.
  const additional = (Array.isArray(order.additional_service_keys) ? order.additional_service_keys : []).filter(
    isQuickBuyServiceKey,
  ) as ServiceKey[];
  const selected = Array.from(new Set<ServiceKey>([order.service_key as ServiceKey, ...additional]));
  // computeQuickBuyPricing, not computePricing: this is what actually charges
  // the combined UCR total (service fee + government fee in one amount) when
  // UCR is in the selected set. order.power_units is the qualifying-CMV count
  // (truck tractors + straight trucks), not the carrier's general reported
  // power units — trailers and non-commercial vehicles never affect the
  // government fee bracket.
  const pricing = computeQuickBuyPricing(selected, {
    powerUnits: order.power_units,
    driverCount: order.driver_count,
  });
  const amountCents = Math.round(pricing.total * 100);
  if (amountCents <= 0) {
    return json({ error: "Nothing to charge for this order. Contact us for a quote." }, 400);
  }

  const idempotencyKey = createHash("sha256")
    .update(`quick-buy|${orderId}|${[...selected].sort().join(",")}|${amountCents}`)
    .digest("hex");

  // Customer identity on the charge (owner decision, 2026-09-15): a real
  // Stripe Customer (deduped by USDOT, see findOrCreateStripeCustomer above)
  // plus a structured `shipping` address on the PaymentIntent itself, so
  // Radar's fraud scoring and Stripe's dispute-evidence form both have a real
  // person to work with. Not `receipt_email`: receipts stay on our own Resend
  // pipeline (lib/email/lifecycle.ts) — attaching a Customer's email doesn't
  // trigger Stripe's own auto-receipt, only `receipt_email` does, so there's
  // no conflict leaving it out.
  const customerName = `${order.first_name ?? ""} ${order.last_name ?? ""}`.trim();
  const stripeCustomerId = await findOrCreateStripeCustomer(db, order);

  let intent;
  try {
    intent = await stripe().paymentIntents.create(
      {
        amount: amountCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),
        ...(order.address_line1
          ? {
              shipping: {
                name: customerName || "Unknown",
                phone: order.phone ?? undefined,
                address: {
                  line1: order.address_line1,
                  line2: order.address_line2 ?? undefined,
                  city: order.address_city ?? undefined,
                  state: order.address_state ?? undefined,
                  postal_code: order.address_zip ?? undefined,
                  country: validCountry(order.address_country),
                },
              },
            }
          : {}),
        metadata: {
          quick_buy_order_id: orderId,
          reference_id: order.reference_id ?? "",
          service_key: order.service_key,
          usdot_number: order.usdot_number ?? "",
          customer_email: order.email ?? "",
        },
      },
      { idempotencyKey },
    );
  } catch (error) {
    console.error("stripe intent create failed:", error instanceof Error ? error.message : "error");
    return json({ error: "Payment could not be started. Try again in a moment." }, 502);
  }

  // Record the payment intent (service role; clients never write payment state).
  // Idempotent: one row per intent id.
  const { data: existing } = await db
    .from("payments")
    .select("id")
    .eq("stripe_payment_intent_id", intent.id)
    .maybeSingle();
  if (!existing) {
    await db.from("payments").insert({
      quick_buy_order_id: orderId,
      stripe_payment_intent_id: intent.id,
      amount: pricing.total,
      currency: "usd",
      status: "created",
      idempotency_key: idempotencyKey,
    });
  }

  // Re-sync filings.price_amount / ucr_tier to what's actually being charged
  // right now. review's submit wrote these once, at review time; if a
  // registry price (or the UCR government bracket, which is fleet-size
  // dependent) changed between then and now, that snapshot is stale relative
  // to the real charge computed just above. This is the one place price is
  // authoritative (it's what Stripe is about to bill), so this is where the
  // stored rows get corrected — keeps the receipt email (and anything else
  // reading filings later, e.g. admin) showing the actual invoiced amount,
  // not a possibly-outdated one.
  for (const f of pricing.filings) {
    await db
      .from("filings")
      .update({ price_amount: f.price_amount, ucr_tier: f.ucr_tier })
      .eq("quick_buy_order_id", orderId)
      .eq("service_key", f.service_key);
  }

  return json({ clientSecret: intent.client_secret, amount: pricing.total });
}
