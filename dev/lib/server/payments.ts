import "server-only";
import { service } from "@/lib/server/supabase";

/**
 * Looks up a `payments` row by Stripe payment_intent_id, tolerant of
 * duplicate rows for the same intent. `stripe_payment_intent_id` has no
 * database-level uniqueness (see migration 0012), and both checkout routes'
 * select-then-insert idempotency check has a race window (a double-click, a
 * client retry, or a dev-mode double effect can fire two requests before
 * either finishes inserting), so more than one row can exist for one intent.
 *
 * `.maybeSingle()` on such a query doesn't throw when that happens; it
 * silently returns no row. Every caller here used to rely on `.maybeSingle()`
 * directly, which meant payment settlement, filings, receipts, and admin
 * alerts could all silently no-op while the webhook still returned 200 to
 * Stripe (no retry, no error, no email, nothing). Ordering by created_at and
 * taking the oldest row is a safe, deterministic choice: a duplicate is
 * always an artifact of the SAME checkout attempt (the idempotency key
 * already guarantees Stripe only created one real PaymentIntent), never a
 * second real payment.
 *
 * Remove this indirection once migration 0012's unique index is applied and
 * duplicates become structurally impossible; `.maybeSingle()` is then safe
 * again everywhere.
 */
export async function findPaymentByIntent(intentId: string, columns: string): Promise<Record<string, unknown> | null> {
  const db = service();
  const { data } = await db
    .from("payments")
    .select(columns)
    .eq("stripe_payment_intent_id", intentId)
    .order("created_at", { ascending: true })
    .limit(1);
  return (data?.[0] as Record<string, unknown> | undefined) ?? null;
}
