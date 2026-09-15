-- Quick-buy orders: capture the carrier's physical address from the FMCSA
-- lookup (owner decision, 2026-09-15) so it can be passed to Stripe as a real
-- Customer/shipping address for fraud scoring and dispute evidence, alongside
-- the name, email, phone, and USDOT number already on this table. Structured
-- columns, not one text blob: both QCMobile and MOTUS already return
-- street/city/state/zip as separate fields (lib/lookup/qcmobile.ts,
-- lib/lookup/motus.ts) — our own code was just flattening them for display.
alter table public.quick_buy_orders add column if not exists address_line1 text;
alter table public.quick_buy_orders add column if not exists address_line2 text;
alter table public.quick_buy_orders add column if not exists address_city  text;
alter table public.quick_buy_orders add column if not exists address_state text;
alter table public.quick_buy_orders add column if not exists address_zip   text;
