-- Stripe Customer objects for the quick-buy fast path (owner decision,
-- 2026-09-15): every new client gets a real Stripe Customer instead of a
-- guest PaymentIntent, for Radar fraud scoring, dispute-evidence pre-fill,
-- and a real per-carrier record in the Stripe dashboard. Deduped by USDOT
-- number, not lead_id or order id: leads.usdot_number has no uniqueness
-- constraint (a fresh lookup session creates a new lead row even for a
-- carrier that's ordered before), and USDOT is the stable identifier tied to
-- the business entity itself, not whoever happened to fill out a given form.
create table if not exists public.stripe_customers (
  usdot_number       text primary key,
  stripe_customer_id text not null unique,
  created_at         timestamptz not null default now()
);

-- RLS on, no policies: service-role only, same posture as quick_buy_orders
-- (migration 0008) — no client-facing read path needed for this mapping.
alter table public.stripe_customers enable row level security;
