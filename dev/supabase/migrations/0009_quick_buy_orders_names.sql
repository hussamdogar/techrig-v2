-- Quick-buy fast path — add first/last name to the confirm screen (additive to
-- migration 0008's quick_buy_orders table). Pre-filled from the lookup's
-- contactFirstName/contactLastName, editable, same pattern as email/phone.

alter table public.quick_buy_orders add column if not exists first_name text;
alter table public.quick_buy_orders add column if not exists last_name text;
