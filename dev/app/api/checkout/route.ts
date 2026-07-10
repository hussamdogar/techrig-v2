import { createHash } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { service } from "@/lib/server/supabase";
import { checkRateLimit } from "@/lib/server/security";
import { stripe } from "@/lib/stripe";
import { computePricing, isBundleKey, isServiceKey, type ServiceKey } from "@/lib/services-registry";

/**
 * POST /api/checkout  (M4). Creates (or reuses) a Stripe PaymentIntent for a
 * completed application. SERVER-PRICED: the amount is recomputed from the registry
 * + the application's selected services; the client never sends an amount. Auth +
 * ownership enforced (RLS loads only the caller's application). Idempotency key =
 * hash(applicationId | sorted services | amount) prevents double charges on
 * retry/refresh. Metadata carries only applicationId + reference_id (never PII).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOINDEX = { "X-Robots-Tag": "noindex" } as const;
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: NOINDEX });

export async function POST(request: Request) {
  if (!(await checkRateLimit({ headers: request.headers, key: "checkout", limit: 20, windowMs: 15 * 60 * 1000 }))) {
    return json({ error: "Too many attempts. Please wait a moment." }, 429);
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return json({ error: "Not signed in." }, 401);

  let applicationId: unknown;
  try {
    applicationId = (await request.json())?.applicationId;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (typeof applicationId !== "string") return json({ error: "Missing applicationId." }, 400);

  // RLS scopes this to the caller's own application (ownership enforced).
  const { data: app } = await supabase.from("applications").select("*").eq("id", applicationId).maybeSingle();
  if (!app) return json({ error: "Application not found." }, 404);

  const selected = (Array.isArray(app.selected_services) ? app.selected_services : []).filter(isServiceKey) as ServiceKey[];
  const pricing = computePricing(selected, {
    powerUnits: app.power_units,
    driverCount: app.application_data?.drivers?.driver_count,
    bundle: isBundleKey(app.selected_bundle) ? app.selected_bundle : null,
  });
  const amountCents = Math.round(pricing.total * 100);
  if (amountCents <= 0) {
    return json({ error: "Nothing to charge yet. Add a billable service or contact us for quoted items." }, 400);
  }

  // Keep the persisted total in sync with the freshly recomputed (authoritative) one.
  if (Number(app.total_amount) !== pricing.total) {
    await supabase.from("applications").update({ subtotal: pricing.subtotal, total_amount: pricing.total }).eq("id", applicationId);
  }

  const idempotencyKey = createHash("sha256")
    .update(`${applicationId}|${[...selected].sort().join(",")}|${amountCents}`)
    .digest("hex");

  let intent;
  try {
    intent = await stripe().paymentIntents.create(
      {
        amount: amountCents,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: { applicationId, reference_id: app.reference_id ?? "" },
      },
      { idempotencyKey },
    );
  } catch (error) {
    console.error("stripe intent create failed:", error instanceof Error ? error.message : "error");
    return json({ error: "Payment could not be started. Try again in a moment." }, 502);
  }

  // Record the payment intent (service role; clients never write payment state).
  // Idempotent: one row per intent id.
  const db = service();
  const { data: existing } = await db
    .from("payments")
    .select("id")
    .eq("stripe_payment_intent_id", intent.id)
    .maybeSingle();
  if (!existing) {
    await db.from("payments").insert({
      application_id: applicationId,
      stripe_payment_intent_id: intent.id,
      amount: pricing.total,
      currency: "usd",
      status: "created",
      idempotency_key: idempotencyKey,
    });
  }

  return json({ clientSecret: intent.client_secret, amount: pricing.total });
}
