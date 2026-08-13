import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { service } from "@/lib/server/supabase";
import { sendReceiptIfNeeded, sendQuickBuyReceiptIfNeeded, sendQuickBuyPaidAdminAlert } from "@/lib/email/lifecycle";
import { findPaymentByIntent } from "@/lib/server/payments";

/**
 * POST /api/stripe-webhook  (M4). The SOURCE OF TRUTH for paid state. Verifies
 * the Stripe signature against STRIPE_WEBHOOK_SECRET (raw body), then idempotently
 * advances state: on payment_intent.succeeded -> payments.paid + applications.paid
 * + that application's filings -> queued (skipped if already paid, so webhook
 * replays are safe). All writes use the service role; clients never write here.
 *
 * Also branches (additively) for the quick-buy fast path: a payment's
 * `quick_buy_order_id` (set only by /api/quick-buy-checkout) takes the sibling
 * path -> quick_buy_orders.paid + its filing(s) -> queued. The two branches are
 * mutually exclusive per the payments_parent_xor / filings_parent_xor check
 * constraints (migration 0008), so a row only ever matches one.
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
    // findPaymentByIntent, not .maybeSingle(): stripe_payment_intent_id has no
    // DB-level uniqueness yet (migration 0012 adds it), and a duplicate row
    // makes .maybeSingle() silently return nothing, no-opping this whole
    // function while still returning 200 to Stripe. See lib/server/payments.ts.
    const row = (await findPaymentByIntent(intentId, "id, status, application_id, quick_buy_order_id")) as {
      id: string;
      status: string;
      application_id: string | null;
      quick_buy_order_id: string | null;
    } | null;
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
      // Receipt email (M6), guarded by payments.receipt_sent_at (no double-send).
      await sendReceiptIfNeeded(intentId);
    } else if (status === "paid" && row.quick_buy_order_id) {
      await db.from("quick_buy_orders").update({ status: "paid" }).eq("id", row.quick_buy_order_id);
      await db
        .from("filings")
        .update({ status: "queued" })
        .eq("quick_buy_order_id", row.quick_buy_order_id)
        .in("status", ["not_started", "awaiting_info"]);
      await sendQuickBuyReceiptIfNeeded(intentId);
      await sendQuickBuyPaidAdminAlert(intentId);
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
