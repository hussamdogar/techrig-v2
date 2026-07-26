-- Quick-buy fast path — review & sign step (order summary, upsell, signature)
-- between carrier confirmation and payment. Additive to migration 0008/0009's
-- quick_buy_orders table.

-- Upsold services on top of the primary `service_key`, from the same 5-key
-- quick-buy set. Validated in application code (isQuickBuyServiceKey), same
-- posture as applications.selected_services (no DB-level array check there
-- either).
alter table public.quick_buy_orders add column if not exists additional_service_keys jsonb not null default '[]'::jsonb;

-- Typed-name signature + terms acceptance, same fields applications already
-- carries (dev/supabase/migrations/0003_applications_filings.sql).
alter table public.quick_buy_orders add column if not exists signature_name text;
alter table public.quick_buy_orders add column if not exists terms_accepted_at timestamptz;
