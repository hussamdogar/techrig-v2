-- BOC-3 price A/B test (owner decision, 2026-09-14): a second Google Ads
-- landing page (/lp/boc-3-filing-b/) sells the same filing at $70 instead of
-- $100, through its own quick-buy service key `boc-3-b`. Orders stay in the
-- existing quick_buy_orders table (not a separate one) so payments/filings'
-- FKs and the whole /buy/ checkout chain need zero changes; this migration
-- only widens the service_key check and adds a read-only comparison view.

-- ============================================== widen quick_buy_orders check
alter table public.quick_buy_orders drop constraint if exists quick_buy_orders_service_key_check;
alter table public.quick_buy_orders add constraint quick_buy_orders_service_key_check
  check (service_key in ('boc-3','ucr','clearinghouse','consortium','dq-files','boc-3-b'));

-- ============================================ boc3_price_test_comparison view
-- Side-by-side reporting for the two BOC-3 price variants: one order row per
-- line, joined to its payment (if any). `security_invoker = true` makes the
-- view respect the base tables' RLS instead of running as the view owner, so
-- it inherits the same "no client-facing read path" posture quick_buy_orders
-- already has (RLS on, zero policies) — only the service role can read it,
-- same as the tables it selects from. Revokes below are belt-and-suspenders
-- in case PostgREST auto-exposes it since it lives in `public`.
create or replace view public.boc3_price_test_comparison
with (security_invoker = true) as
select
  o.id            as order_id,
  o.service_key,
  o.usdot_number,
  o.reference_id,
  o.status        as order_status,
  o.confirmed_at,
  o.created_at    as order_created_at,
  p.amount        as payment_amount,
  p.status        as payment_status,
  p.paid_at
from public.quick_buy_orders o
left join public.payments p on p.quick_buy_order_id = o.id
where o.service_key in ('boc-3', 'boc-3-b')
order by o.created_at desc;

revoke all on public.boc3_price_test_comparison from anon, authenticated;
