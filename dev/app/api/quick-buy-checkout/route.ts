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

  let intent;
  try {
    intent = await stripe().paymentIntents.create(
      {
        amount: amountCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: { quick_buy_order_id: orderId, reference_id: order.reference_id ?? "", service_key: order.service_key },
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
