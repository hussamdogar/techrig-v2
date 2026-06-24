import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { service } from "@/lib/server/supabase";

/**
 * POST /api/stripe-webhook  (M4). The SOURCE OF TRUTH for paid state. Verifies
 * the Stripe signature against STRIPE_WEBHOOK_SECRET (raw body), then idempotently
 * advances state: on payment_intent.succeeded -> payments.paid + applications.paid
 * + that application's filings -> queued (skipped if already paid, so webhook
 * replays are safe). All writes use the service role; clients never write here.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 500 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const raw = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, signature, secret);
  } catch {
    // Bad signature: do not log the body; just reject.
    return new Response("Invalid signature", { status: 400 });
  }

  const db = service();

  async function markPayment(intentId: string, status: "paid" | "processing" | "failed") {
    const { data: row } = await db
      .from("payments")
      .select("id, status, application_id")
      .eq("stripe_payment_intent_id", intentId)
      .maybeSingle();
    if (!row) return;
    if (row.status === "paid") return; // idempotent: already settled, skip replays

    await db
      .from("payments")
      .update({ status, ...(status === "paid" ? { paid_at: new Date().toISOString() } : {}) })
      .eq("stripe_payment_intent_id", intentId);

    if (status === "paid" && row.application_id) {
      await db.from("applications").update({ status: "paid" }).eq("id", row.application_id);
      await db
        .from("filings")
        .update({ status: "queued" })
        .eq("application_id", row.application_id)
        .in("status", ["not_started", "awaiting_info"]);
    }
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      await markPayment((event.data.object as Stripe.PaymentIntent).id, "paid");
      break;
    case "payment_intent.processing":
      await markPayment((event.data.object as Stripe.PaymentIntent).id, "processing");
      break;
    case "payment_intent.payment_failed":
      await markPayment((event.data.object as Stripe.PaymentIntent).id, "failed");
      break;
    default:
      break; // ignore other events
  }

  return new Response("ok", { status: 200 });
}
