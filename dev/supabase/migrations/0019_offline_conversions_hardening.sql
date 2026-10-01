-- Offline conversions hardening (audit 2026-10-01, checked against Google's
-- documentation by two independent reviews). Builds on 0017/0018.
--
-- 1. leads.visitor_hash: a keyed one-way fingerprint (IP + browser) so a
--    reload or error redirect of the quick-buy confirm screen reuses the
--    visitor's lead instead of creating a new lead, reference number, admin
--    alert and Google Ads lead conversion each time (lib/server/lookup-capture.ts).
-- 2. Paid orders Google never heard about: the site reports a sale online only
--    when the customer returns from Stripe with a succeeded payment. A payment
--    that settles later (e.g. a bank debit), or a customer who closes the tab
--    before returning, used to be reported nowhere. Orders now carry their net
--    value (set at checkout) and a stamp when the sale was reported online;
--    paid orders with a value but no stamp go into the follow-up upload
--    automatically.
-- 3. Upload by batch instead of "mark everything": the google_ads_upload_*()
--    functions return
--    the rows for the CSV AND marks exactly those rows uploaded in one step,
--    so a sale added after the download is never marked by mistake. It only
--    includes sales recorded more than a day ago, because Google rejects
--    clicks under 6 hours old and may not have very recent calls yet.
-- 4. GBRAID / WBRAID (iPhone ad clicks) are now exported. Google recommends
--    sending them whenever available.

-- ============================================================ columns
alter table public.leads
  add column if not exists visitor_hash text;
create index if not exists leads_usdot_visitor_recent_idx
  on public.leads (usdot_number, visitor_hash, created_at desc);

alter table public.quick_buy_orders
  add column if not exists conversion_value              numeric(10, 2),
  add column if not exists online_conversion_reported_at timestamptz,
  add column if not exists offline_uploaded_at           timestamptz;

-- ============================================================ guard update
-- Same checks as 0018, with a clearer message for paid orders: an order paid
-- online is either already counted by the site, or (if it settled later) is
-- uploaded automatically, so it must never be entered by hand.
create or replace function public.offline_conversions_guard()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.reference_id is not null
     and (tg_op = 'INSERT' or new.reference_id is distinct from old.reference_id) then
    new.reference_id := upper(trim(new.reference_id));
    if new.reference_id = '' then
      new.reference_id := null;
    elsif exists (select 1 from quick_buy_orders where reference_id = new.reference_id and status in ('paid', 'fulfilled')) then
      raise exception 'Order % was paid on the website. It is reported to Google Ads automatically, so do not record it here. For a separate, additional sale, leave reference_id empty and fill customer_email / customer_phone (or record it as a phone_call).', new.reference_id;
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

-- ============================================================ previews
-- The two views stay as read-only PREVIEWS of what the next upload will
-- contain (nothing is marked by looking at them). The real export is
-- google_ads_upload_phone_sales() / google_ads_upload_followup_sales() below.
drop view if exists public.google_ads_followup_sales;
drop view if exists public.google_ads_phone_sales;

create view public.google_ads_phone_sales
with (security_invoker = true) as
select
  public.to_e164(c.caller_phone)                 as "Caller's Phone Number",
  public.google_ads_time(c.call_started_eastern) as "Call Start Time",
  'Phone sale (offline)'                         as "Conversion Name",
  public.google_ads_time(c.sold_eastern)         as "Conversion Time",
  c.value                                        as "Conversion Value",
  'USD'                                          as "Conversion Currency"
from public.offline_conversions c
where c.sale_type = 'phone_call' and c.uploaded_at is null
order by c.sold_eastern;

create view public.google_ads_followup_sales
with (security_invoker = true) as
-- Sales staff recorded by hand.
select
  coalesce(o.gclid, l.gclid)                     as "Google Click ID",
  coalesce(o.gbraid, l.gbraid)                   as "GBRAID",
  coalesce(o.wbraid, l.wbraid)                   as "WBRAID",
  'Offline sale (follow-up)'                     as "Conversion Name",
  public.google_ads_time(c.sold_eastern)         as "Conversion Time",
  c.value                                        as "Conversion Value",
  'USD'                                          as "Conversion Currency",
  c.id::text                                     as "Order ID",
  public.sha256_hex(public.google_normalized_email(coalesce(c.customer_email, o.email))) as "Email",
  public.sha256_hex(public.to_e164(coalesce(c.customer_phone, o.phone)))                 as "Phone Number"
from public.offline_conversions c
left join lateral (
  select q.gclid, q.gbraid, q.wbraid, q.email, q.phone
  from public.quick_buy_orders q
  where q.reference_id = c.reference_id
  order by q.created_at desc
  limit 1
) o on true
left join lateral (
  select ld.gclid, ld.gbraid, ld.wbraid from public.leads ld where ld.reference_id = c.reference_id limit 1
) l on true
where c.sale_type = 'website_lead' and c.uploaded_at is null
union all
-- Website orders paid but never reported online (settled later, or the
-- customer didn't return to the thank-you page). conversion_value is only set
-- by checkout from this release on, so older orders never appear here.
select
  q.gclid, q.gbraid, q.wbraid,
  'Offline sale (follow-up)',
  to_char(p.paid_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI:SS') || '+0000',
  q.conversion_value,
  'USD',
  q.reference_id,
  public.sha256_hex(public.google_normalized_email(q.email)),
  public.sha256_hex(public.to_e164(q.phone))
from public.quick_buy_orders q
join lateral (
  select pay.paid_at from public.payments pay
  where pay.quick_buy_order_id = q.id and pay.status = 'paid' and pay.paid_at is not null
  order by pay.paid_at
  limit 1
) p on true
where q.status in ('paid', 'fulfilled')
  and q.conversion_value is not null
  and q.online_conversion_reported_at is null
  and q.offline_uploaded_at is null;

-- ============================================================ the export
-- Run in the SQL Editor, then click "Download CSV" on the result:
--   select * from public.google_ads_upload_phone_sales();
--   select * from public.google_ads_upload_followup_sales();
-- Each returns exactly the rows for the file and marks exactly those rows
-- uploaded, in one step. Only includes sales recorded (or paid) more than a
-- day ago, so Google won't reject them as too recent; newer ones wait for the
-- next weekly run. If Google rejects a row for another reason, fix it and run
-- select public.retry_offline_sale('<id>'); to put it back in the queue.
create or replace function public.google_ads_upload_phone_sales()
returns table (
  "Caller's Phone Number" text,
  "Call Start Time"       text,
  "Conversion Name"       text,
  "Conversion Time"       text,
  "Conversion Value"      numeric,
  "Conversion Currency"   text
) language sql set search_path = public as $$
  with batch as (
    update offline_conversions
    set uploaded_at = now()
    where sale_type = 'phone_call' and uploaded_at is null
      and created_at < now() - interval '1 day'
    returning caller_phone, call_started_eastern, sold_eastern, value
  )
  select to_e164(caller_phone), google_ads_time(call_started_eastern), 'Phone sale (offline)',
         google_ads_time(sold_eastern), value, 'USD'
  from batch
  order by sold_eastern
$$;

create or replace function public.google_ads_upload_followup_sales()
returns table (
  "Google Click ID"     text,
  "GBRAID"              text,
  "WBRAID"              text,
  "Conversion Name"     text,
  "Conversion Time"     text,
  "Conversion Value"    numeric,
  "Conversion Currency" text,
  "Order ID"            text,
  "Email"               text,
  "Phone Number"        text
) language plpgsql set search_path = public as $$
declare
  hand_ids uuid[];
  auto_ids uuid[];
begin
  -- Snapshot the eligible rows first, then return and mark exactly that set.
  select coalesce(array_agg(c.id), '{}') into hand_ids
  from offline_conversions c
  where c.sale_type = 'website_lead' and c.uploaded_at is null
    and c.created_at < now() - interval '1 day';

  select coalesce(array_agg(distinct q.id), '{}') into auto_ids
  from quick_buy_orders q
  join payments pay on pay.quick_buy_order_id = q.id and pay.status = 'paid' and pay.paid_at is not null
  where q.status in ('paid', 'fulfilled')
    and q.conversion_value is not null
    and q.online_conversion_reported_at is null
    and q.offline_uploaded_at is null
    and pay.paid_at < now() - interval '1 day';

  return query
    select v.* from google_ads_followup_sales v
    where v."Order ID" in (select unnest(hand_ids)::text)
       or v."Order ID" in (select q.reference_id from quick_buy_orders q where q.id = any(auto_ids));

  update offline_conversions set uploaded_at = now() where id = any(hand_ids);
  update quick_buy_orders set offline_uploaded_at = now() where id = any(auto_ids);
end
$$;

-- Put one rejected sale back in the queue (by its id, shown in Table Editor).
create or replace function public.retry_offline_sale(p_id uuid)
returns boolean language sql set search_path = public as $$
  update offline_conversions set uploaded_at = null where id = p_id returning true
$$;

-- The old "mark everything" function is replaced by the batch functions above.
drop function if exists public.mark_offline_sales_uploaded(text);

-- Dashboard / service role only.
revoke all on public.google_ads_phone_sales, public.google_ads_followup_sales from anon, authenticated;
revoke execute on function public.google_ads_upload_phone_sales()    from public, anon, authenticated;
revoke execute on function public.google_ads_upload_followup_sales() from public, anon, authenticated;
revoke execute on function public.retry_offline_sale(uuid)           from public, anon, authenticated;
