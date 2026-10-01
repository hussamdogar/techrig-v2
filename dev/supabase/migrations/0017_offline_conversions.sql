-- Offline conversion tracking (owner decision, 2026-10-01): some sales close
-- by phone or after follow-ups, which Google Ads never sees on its own. This
-- migration stores what is needed to report those sales back to Google Ads
-- (Goals > Uploads) so the ad that brought the customer gets the credit.

-- ===================================================== Google Ads click ids
-- Captured from the landing URL (gclid / gbraid / wbraid) into a first-party
-- cookie, then saved on the lead (every USDOT lookup) and on the order
-- (contact details submitted). A sale closed days later can then be uploaded
-- against the exact ad click. All nullable: most visitors are not from an ad.
alter table public.leads
  add column if not exists gclid  text,
  add column if not exists gbraid text,
  add column if not exists wbraid text;

alter table public.quick_buy_orders
  add column if not exists gclid  text,
  add column if not exists gbraid text,
  add column if not exists wbraid text;

-- ================================================== offline_conversions
-- One row per sale recorded by staff in /admin/sales/. Each row is exported
-- exactly once, in exactly one of Google's two upload formats, decided when
-- the sale is recorded (`match_method`), so the same sale can never be
-- counted twice across two conversion actions:
--   'call'  -> "conversions from calls": caller's number + call start time,
--              matched to Google's forwarding-number call record.
--   'click' -> "conversions from clicks": the ad click id, and/or the
--              customer's email/phone (enhanced conversions for leads).
create table if not exists public.offline_conversions (
  id                 uuid primary key default gen_random_uuid(),
  match_method       text not null check (match_method in ('call', 'click')),
  -- The website lead/order this sale came from, if any (reference id like
  -- DGR-20261001-012). Plain text, not an FK: it can point at a lead row (USDOT
  -- lookup only) or a quick-buy order, which share the reference format.
  reference_id       text,
  quick_buy_order_id uuid references public.quick_buy_orders(id) on delete set null,
  caller_phone       text,          -- E.164, required for 'call'
  call_started_at    timestamptz,   -- required for 'call'
  gclid              text,
  gbraid             text,
  wbraid             text,
  email              text,          -- customer's own email (lowercased)
  phone              text,          -- customer's own phone, E.164
  sold_at            timestamptz not null,
  value              numeric(10, 2) not null check (value > 0),
  currency           text not null default 'USD',
  notes              text,
  recorded_by        uuid,          -- auth user id of the admin who recorded it
  exported_at        timestamptz,   -- set when included in a downloaded CSV
  created_at         timestamptz not null default now(),
  constraint offline_conversions_call_fields check (
    match_method <> 'call' or (caller_phone is not null and call_started_at is not null)
  ),
  constraint offline_conversions_click_fields check (
    match_method <> 'click' or coalesce(gclid, gbraid, wbraid, email, phone) is not null
  )
);

create index if not exists offline_conversions_export_idx
  on public.offline_conversions (match_method, exported_at);

-- RLS on, no policies: service-role only (admin pages read/write it after
-- the server-side getAdminUser() gate), same posture as quick_buy_orders.
alter table public.offline_conversions enable row level security;
