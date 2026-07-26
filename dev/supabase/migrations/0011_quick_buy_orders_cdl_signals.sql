-- Quick-buy fast path — dynamic "You may also need" upsell menu on the review
-- screen. Additive to quick_buy_orders. Raw signal from the FMCSA/MOTUS
-- lookup, captured at confirm time (like power_units/first_name/etc.), so the
-- eligibility rule can live in application code and evolve without another
-- migration. MOTUS-only (see equipmentSummary's comment in
-- dev/lib/lookup/types.ts) — 0 for QCMobile-sourced lookups, which correctly
-- falls back to the narrower upsell menu.

alter table public.quick_buy_orders add column if not exists truck_tractors integer;
