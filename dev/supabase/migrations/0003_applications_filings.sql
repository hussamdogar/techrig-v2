-- Application Platform M3 — applications + filings (the application engine)
-- Additive to the prod project (pqbynaaihauifomfhcxo), plus ONE alter on our own
-- M1 table: carrier_snapshots.application_id FK -> applications (pre-flight that
-- no orphan application_id values exist first). No legacy table is touched.
-- Reuses public.set_updated_at() from 0001. Per 02-data-model.md / M3 work order.

-- ============================================================ applications
create table if not exists public.applications (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  lead_id                uuid references public.leads (id) on delete set null,
  reference_id           text unique,
  status                 text not null default 'draft'
                           check (status in ('draft','in_progress','awaiting_payment','paid','in_fulfilment','completed','cancelled')),
  current_step           text,
  selected_services      jsonb not null default '[]'::jsonb,
  -- carrier identity (pre-filled from the snapshot, editable)
  company_legal_name     text,
  dba                    text,
  usdot_number           text,
  mc_number              text,
  entity_type            text,
  power_units            integer,
  -- carrier-data diff (boc3 pattern)
  carrier_data_changed   boolean not null default false,
  carrier_user_diff_json jsonb,
  needs_mcs150_update    boolean not null default false,
  -- per-step payload (dynamic; zod-validated). Sensitive fields encrypted/omitted.
  application_data       jsonb not null default '{}'::jsonb,
  signature_name         text,
  terms_accepted_at      timestamptz,
  -- server-computed pricing, recorded at review for M4
  subtotal               numeric,
  total_amount           numeric,
  -- lifecycle
  started_at             timestamptz not null default now(),
  submitted_at           timestamptz,
  completed_at           timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists applications_user_id_idx      on public.applications (user_id);
create index if not exists applications_reference_id_idx on public.applications (reference_id);
create index if not exists applications_status_idx       on public.applications (status);
create index if not exists applications_lead_id_idx      on public.applications (lead_id);

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at before update on public.applications
  for each row execute function public.set_updated_at();

alter table public.applications enable row level security;

-- Owner-only: a user reads/writes only their own applications.
drop policy if exists applications_select_owner on public.applications;
create policy applications_select_owner on public.applications
  for select to authenticated using (user_id = auth.uid());
drop policy if exists applications_insert_owner on public.applications;
create policy applications_insert_owner on public.applications
  for insert to authenticated with check (user_id = auth.uid());
drop policy if exists applications_update_owner on public.applications;
create policy applications_update_owner on public.applications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================ filings
create table if not exists public.filings (
  id                uuid primary key default gen_random_uuid(),
  application_id    uuid not null references public.applications (id) on delete cascade,
  service_key       text not null,
  service_name      text not null,
  price_amount      numeric, -- null = quote / manual review
  ucr_tier          text,
  status            text not null default 'not_started'
                      check (status in ('not_started','awaiting_info','queued','filed','active','completed','manual_review','cancelled')),
  expected_timeline text,
  filed_at          timestamptz,
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists filings_application_id_idx on public.filings (application_id);
create index if not exists filings_status_idx         on public.filings (status);

drop trigger if exists filings_set_updated_at on public.filings;
create trigger filings_set_updated_at before update on public.filings
  for each row execute function public.set_updated_at();

alter table public.filings enable row level security;

-- Owner may READ filings on their own applications. Status writes are back-office
-- (M5, service role); for M3 the server (service role) creates/prices filings and
-- the client never mutates filing status, so there is no client write policy.
drop policy if exists filings_select_owner on public.filings;
create policy filings_select_owner on public.filings
  for select to authenticated using (
    application_id in (select id from public.applications where user_id = auth.uid())
  );

-- =================================== carrier_snapshots.application_id FK (M1 table)
-- Safe ALTER on our own table. Pre-flight (run separately) confirms there are no
-- non-null application_id values that lack a matching application before this.
alter table public.carrier_snapshots
  drop constraint if exists carrier_snapshots_application_id_fkey;
alter table public.carrier_snapshots
  add constraint carrier_snapshots_application_id_fkey
  foreign key (application_id) references public.applications (id) on delete set null;
create index if not exists carrier_snapshots_application_id_idx
  on public.carrier_snapshots (application_id);
