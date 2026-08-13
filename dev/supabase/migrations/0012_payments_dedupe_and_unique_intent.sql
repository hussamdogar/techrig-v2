-- Application Platform — dedupe payments.stripe_payment_intent_id + enforce uniqueness
--
-- Fixes a race in /api/checkout and /api/quick-buy-checkout's select-then-insert
-- idempotency check: two near-simultaneous requests for the same intent (a
-- double-click on Pay, a client retry, a dev-mode double effect) can both pass
-- the "does a payments row already exist for this intent" check before either
-- request's insert has landed, producing two payments rows for one
-- stripe_payment_intent_id. The webhook's markPayment() (and every lifecycle
-- function that looks up a payment by intent id) used .maybeSingle(), which
-- does not throw when more than one row matches, it just silently returns no
-- row, no-opping the whole handler while the webhook still returns 200 to
-- Stripe. Application code was hardened separately (lib/server/payments.ts) to
-- tolerate this without a schema change, but the schema should not allow the
-- duplicate to occur at all.

-- Step 1: for any stripe_payment_intent_id with more than one row, keep the
-- earliest (first created) row and delete the rest. Safe: a duplicate row is
-- always a race-condition artifact of the SAME checkout attempt, never a
-- second real payment (the idempotencyKey passed to Stripe already guarantees
-- only one real PaymentIntent was ever created for the request).
delete from public.payments
where id in (
  select id from (
    select id, row_number() over (
      partition by stripe_payment_intent_id
      order by created_at asc, id asc
    ) as rn
    from public.payments
    where stripe_payment_intent_id is not null
  ) ranked
  where rn > 1
);

-- Step 2: enforce it going forward. Partial index so rows without a Stripe
-- intent id yet (if any ever exist) are unaffected by the uniqueness rule.
create unique index if not exists payments_stripe_payment_intent_id_unique
  on public.payments (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
