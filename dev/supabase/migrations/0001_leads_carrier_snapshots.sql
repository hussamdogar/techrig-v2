-- Application Platform M1 — leads + carrier_snapshots
-- Adds the front-door lead capture and the immutable FMCSA/MOTUS snapshot to the
-- EXISTING live Supabase project (ADR-6). Additive only: no legacy table touched.
-- Per 02-data-model.md. user_id references auth.users (profiles is added in M2 as
-- a 1:1 with auth.users, so this stays compatible). RLS: anonymous insert allowed
-- for lead capture; reads are owner-only (token-gated reads go through the
-- service-role API, which bypasses RLS); snapshots are write-once.

create extension if not exists "pgcrypto";

-- updated_at touch trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================ leads
create table if not exists public.leads (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references auth.users (id) on delete set null,
  usdot_number          text check (usdot_number is null or usdot_number ~ '^\d{1,12}$'),
  source                text not null default 'hero_lookup'
                          check (source in ('hero_lookup', 'no_usdot_file_now', 'apply_direct')),
  lookup_status         text not null default 'started'
                          check (lookup_status in ('started', 'success', 'not_found', 'manual_required')),
  email                 text,
  phone                 text,
  full_name             text,
  reference_id          text unique,
  access_token_hash     text,
  welcome_email_sent_at   timestamptz,
  reminder_24h_sent_at    timestamptz,
  reminder_72h_sent_at    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists leads_usdot_number_idx on public.leads (usdot_number);
create index if not exists leads_reference_id_idx  on public.leads (reference_id);
create index if not exists leads_created_at_idx     on public.leads (created_at);
create index if not exists leads_user_id_idx        on public.leads (user_id);

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

-- Anyone (anon or authenticated) may create a lead (the public front door).
drop policy if exists leads_insert_anon on public.leads;
create policy leads_insert_anon on public.leads
  for insert to anon, authenticated with check (true);

-- A signed-in owner may read/update only their own claimed leads. Pre-account
-- token reads are performed by the service-role API, which bypasses RLS, so no
-- anon SELECT policy exists: anonymous clients cannot read any lead row.
drop policy if exists leads_select_owner on public.leads;
create policy leads_select_owner on public.leads
  for select to authenticated using (user_id = auth.uid());

drop policy if exists leads_update_owner on public.leads;
create policy leads_update_owner on public.leads
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================== carrier_snapshots
create table if not exists public.carrier_snapshots (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid references public.leads (id) on delete cascade,
  application_id  uuid,  -- FK added in M3 when applications exists
  usdot_number    text,
  data_json       jsonb not null,
  source          text not null check (source in ('motus', 'qcmobile', 'manual')),
  fetched_at      timestamptz not null default now()
);

create index if not exists carrier_snapshots_lead_id_idx on public.carrier_snapshots (lead_id);
create index if not exists carrier_snapshots_usdot_idx    on public.carrier_snapshots (usdot_number);

alter table public.carrier_snapshots enable row level security;

-- Write-once + owner-read. Inserts come from the service-role API (bypasses RLS);
-- there is intentionally NO update/delete policy, so the snapshot is immutable to
-- clients. An owner may read snapshots tied to their own leads.
drop policy if exists carrier_snapshots_select_owner on public.carrier_snapshots;
create policy carrier_snapshots_select_owner on public.carrier_snapshots
  for select to authenticated using (
    lead_id in (select id from public.leads where user_id = auth.uid())
  );
