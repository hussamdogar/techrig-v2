-- Carriers are not all US-domiciled (confirmed live: USDOT 3678098 is an
-- Ontario, Canada carrier) — the address captured in migration 0014 needs a
-- country too, so Stripe's Customer/shipping address never wrongly defaults
-- to "US" for a foreign carrier. ISO 3166-1 alpha-2 (e.g. "US", "CA", "MX"),
-- sourced from MOTUS's location.country / QCMobile's phyCountry.
alter table public.quick_buy_orders add column if not exists address_country text;
