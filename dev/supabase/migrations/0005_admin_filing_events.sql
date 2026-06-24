-- Application Platform M5 — back-office roles + filing event history
-- Additive to the prod project (pqbynaaihauifomfhcxo). Reuses set_updated_at().
--
-- ROLE MODEL DECISION (M5 §1): a separate `admin_users` table, NOT a profiles.role
-- column. Rationale/security: the M2 profiles UPDATE policy lets a client update
-- their OWN profile row, so a `role` column there would be a self-escalation path
-- to admin. `admin_users` has RLS enabled with NO policies, so clients/anon cannot
-- read or write it at all — only the service role (after a server-side admin
-- check) touches it. The privilege boundary never lives in client-writable state.
--
-- FIRST-ADMIN SEED (run manually by the team; there is no self-serve admin signup):
--   insert into public.admin_users (user_id, role)
--   values ('<the-auth-user-uuid>', 'admin');

-- ============================================================ admin_users
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'admin' check (role in ('staff', 'admin')),
  created_at timestamptz not null default now()
);
-- RLS on, but intentionally NO policies: unreachable by anon/authenticated.
-- Only the service role (which bypasses RLS) reads/writes it.
alter table public.admin_users enable row level security;

-- ============================================================ filing_events
create table if not exists public.filing_events (
  id             uuid primary key default gen_random_uuid(),
  filing_id      uuid not null references public.filings (id) on delete cascade,
  from_status    text,
  to_status      text not null,
  note           text,
  actor          text not null, -- 'system' | 'admin:{uuid}' | 'webhook'
  client_visible boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists filing_events_filing_id_idx  on public.filing_events (filing_id);
create index if not exists filing_events_created_at_idx on public.filing_events (created_at);

alter table public.filing_events enable row level security;

-- Owner may READ the client-visible events on their own filings (curated subset).
-- There is intentionally NO client write policy: events are written only by the
-- service role from the admin-guarded transition path. Admin reads go through the
-- service role after a server-side admin check.
drop policy if exists filing_events_select_owner on public.filing_events;
create policy filing_events_select_owner on public.filing_events
  for select to authenticated using (
    client_visible
    and filing_id in (
      select f.id from public.filings f
      join public.applications a on a.id = f.application_id
      where a.user_id = auth.uid()
    )
  );
