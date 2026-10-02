-- Offline conversions, Supabase-only workflow (owner decision, 2026-10-01):
-- no admin page. Staff add a row per phone / follow-up sale directly in the
-- Supabase Table Editor, then download a ready-to-upload Google Ads CSV from
-- one of two views below (SQL Editor: select * from <view>; Download CSV).
-- Replaces the 0017 table, which was designed for the removed admin page and
-- never held data. The click-id columns 0017 added to leads and
-- quick_buy_orders stay: the follow-up view reads them.

drop table if exists public.offline_conversions;

-- ============================================================ helpers
-- E.164 phone (what Google requires). US/Canada numbers typed any way, e.g.
-- "(555) 123-4567", become +15551234567; an unrecognisable value becomes null.
create or replace function public.to_e164(phone text)
returns text language sql immutable as $$
  select case
    when phone is null then null
    when phone ~ '^\s*\+' and length(regexp_replace(phone, '\D', '', 'g')) between 8 and 15
      then '+' || regexp_replace(phone, '\D', '', 'g')
    when length(regexp_replace(phone, '\D', '', 'g')) = 10
      then '+1' || regexp_replace(phone, '\D', '', 'g')
    when length(regexp_replace(phone, '\D', '', 'g')) = 11 and regexp_replace(phone, '\D', '', 'g') like '1%'
      then '+' || regexp_replace(phone, '\D', '', 'g')
  end
$$;

-- Google's email normalization before hashing: trim, lowercase, and for
-- gmail.com / googlemail.com remove the dots in the name part.
create or replace function public.google_normalized_email(email text)
returns text language sql immutable as $$
  select case
    when email is null or trim(email) = '' then null
    when split_part(lower(trim(email)), '@', 2) in ('gmail.com', 'googlemail.com')
      then replace(split_part(lower(trim(email)), '@', 1), '.', '') || '@' || split_part(lower(trim(email)), '@', 2)
    else lower(trim(email))
  end
$$;

-- SHA-256 hex (Postgres built-in sha256, no extension needed). Google accepts
-- hashed emails/phones, so plain contact details never leave in a CSV.
create or replace function public.sha256_hex(value text)
returns text language sql immutable as $$
  select case when value is null then null else encode(sha256(convert_to(value, 'UTF8')), 'hex') end
$$;

-- Google upload time format, from a US Eastern wall-clock time (what staff
-- read off the phone log), converted to UTC, DST-aware.
create or replace function public.google_ads_time(eastern timestamp)
returns text language sql immutable as $$
  select to_char((eastern at time zone 'America/New_York') at time zone 'UTC', 'YYYY-MM-DD HH24:MI:SS') || '+0000'
$$;

-- ============================================================ the table
-- One row per sale that Google Ads could not see on its own. Fill in from the
-- Supabase Table Editor ("Insert row"). Times are US Eastern, as they appear
-- on the phone log / calendar, no conversion needed.
create table public.offline_conversions (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),

  -- 'phone_call'   = the customer called us (from an ad or the website)
  -- 'website_lead' = entered their USDOT/details online, closed after follow-up
  sale_type            text not null check (sale_type in ('phone_call', 'website_lead')),

  -- website_lead: the lead/order reference, e.g. DGR-20261001-012 (from the
  -- lead alert email or the order). The view looks up the ad click and the
  -- customer's contact details from it.
  reference_id         text,

  -- phone_call: copy both from your phone's call log.
  caller_phone         text,
  call_started_eastern timestamp,

  -- website_lead without a reference: the customer's own email and/or phone.
  customer_email       text,
  customer_phone       text,

  sold_eastern         timestamp not null default (now() at time zone 'America/New_York'),
  -- Your fee only, in USD, without government fees (e.g. UCR's $46).
  value                numeric(10, 2) not null check (value > 0),
  notes                text,

  -- Set by mark_offline_sales_uploaded() after the CSV is uploaded to Google,
  -- so the views only ever show sales not yet uploaded.
  uploaded_at          timestamptz,

  constraint offline_conversions_phone_call_fields check (
    sale_type <> 'phone_call' or (caller_phone is not null and call_started_eastern is not null)
  ),
  constraint offline_conversions_call_before_sale check (
    call_started_eastern is null or call_started_eastern <= sold_eastern
  ),
  constraint offline_conversions_website_lead_fields check (
    sale_type <> 'website_lead' or coalesce(reference_id, customer_email, customer_phone) is not null
  )
);

-- RLS on, no policies: never readable through the website's API keys; staff
-- use the Supabase dashboard (which bypasses RLS), same posture as orders.
alter table public.offline_conversions enable row level security;

-- Guard rails the Table Editor can't give you on its own: tidy the reference,
-- reject a reference that doesn't exist, and refuse an order already paid on
-- the website (the site's purchase tag already reported it to Google Ads;
-- uploading it again would count the sale twice).
create or replace function public.offline_conversions_guard()
returns trigger language plpgsql set search_path = public as $$
begin
  -- Only when the reference is entered or changed: marking rows uploaded
  -- (an update) must never fail because an order was paid online later.
  if new.reference_id is not null
     and (tg_op = 'INSERT' or new.reference_id is distinct from old.reference_id) then
    new.reference_id := upper(trim(new.reference_id));
    if new.reference_id = '' then
      new.reference_id := null;
    elsif exists (select 1 from quick_buy_orders where reference_id = new.reference_id and status in ('paid', 'fulfilled')) then
      raise exception 'Order % was already paid on the website, so Google Ads already counted it. For a separate, additional sale, leave reference_id empty and fill customer_email / customer_phone (or record it as a phone_call).', new.reference_id;
    elsif not exists (select 1 from quick_buy_orders where reference_id = new.reference_id)
      and not exists (select 1 from leads where reference_id = new.reference_id) then
      raise exception 'No lead or order found with reference %. Check the number in the lead alert email.', new.reference_id;
    end if;
  end if;
  if new.sale_type = 'phone_call' and public.to_e164(new.caller_phone) is null then
    raise exception 'caller_phone "%" is not a valid phone number. Include the area code.', new.caller_phone;
  end if;
  return new;
end
$$;

create trigger offline_conversions_guard
  before insert or update on public.offline_conversions
  for each row execute function public.offline_conversions_guard();

-- ============================================================ the views
-- Each view is a ready-to-upload Google Ads CSV for sales not yet uploaded.
-- Column names are Google's template headers, exactly. Each sale appears in
-- exactly one view (by sale_type), so it is never counted twice.

-- Google Ads > Goals > Uploads, type "Conversions from calls". Matched to
-- Google's forwarding-number call record by caller number + call start time.
create view public.google_ads_phone_sales
with (security_invoker = true) as
select
  public.to_e164(c.caller_phone)              as "Caller's Phone Number",
  public.google_ads_time(c.call_started_eastern) as "Call Start Time",
  'Phone sale (offline)'                      as "Conversion Name",
  public.google_ads_time(c.sold_eastern)      as "Conversion Time",
  c.value                                     as "Conversion Value",
  'USD'                                       as "Conversion Currency"
from public.offline_conversions c
where c.sale_type = 'phone_call' and c.uploaded_at is null
order by c.sold_eastern;

-- Google Ads > Goals > Uploads, type "Conversions from clicks" (with
-- enhanced conversions for leads). Matched by the ad click id saved on the
-- lead/order, and/or the customer's hashed email and phone. Order ID is the
-- sale's own id, so Google drops only a genuine re-upload, never a repeat
-- customer's second sale.
create view public.google_ads_followup_sales
with (security_invoker = true) as
select
  coalesce(o.gclid, l.gclid)                  as "Google Click ID",
  'Offline sale (follow-up)'                  as "Conversion Name",
  public.google_ads_time(c.sold_eastern)      as "Conversion Time",
  c.value                                     as "Conversion Value",
  'USD'                                       as "Conversion Currency",
  c.id::text                                  as "Order ID",
  public.sha256_hex(public.google_normalized_email(coalesce(c.customer_email, o.email))) as "Email",
  public.sha256_hex(public.to_e164(coalesce(c.customer_phone, o.phone)))                 as "Phone Number"
from public.offline_conversions c
left join lateral (
  select q.gclid, q.email, q.phone
  from public.quick_buy_orders q
  where q.reference_id = c.reference_id
  order by q.created_at desc
  limit 1
) o on true
left join lateral (
  select ld.gclid from public.leads ld where ld.reference_id = c.reference_id limit 1
) l on true
where c.sale_type = 'website_lead' and c.uploaded_at is null
order by c.sold_eastern;

-- After uploading a CSV to Google, run ONE of these in the SQL Editor so the
-- view starts empty for next week:
--   select public.mark_offline_sales_uploaded('phone_call');
--   select public.mark_offline_sales_uploaded('website_lead');
-- Returns how many sales were marked.
create or replace function public.mark_offline_sales_uploaded(p_sale_type text)
returns integer language sql set search_path = public as $$
  with marked as (
    update offline_conversions set uploaded_at = now()
    where sale_type = p_sale_type and uploaded_at is null
    returning 1
  )
  select count(*)::int from marked
$$;

-- Dashboard / service role only: nothing here is reachable with the
-- website's public API keys.
revoke all on public.google_ads_phone_sales, public.google_ads_followup_sales from anon, authenticated;
revoke execute on function public.mark_offline_sales_uploaded(text) from public, anon, authenticated;
