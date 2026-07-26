-- Quick-buy fast path — BOC-3, UCR, Clearinghouse, Consortium, DQ files.
-- Adds a lightweight, account-free order record for the five services that need
-- nothing beyond a confirmed USDOT lookup (plus one optional numeric field for
-- UCR/DQ). Deliberately NOT an `applications` row: that table is shaped for the
-- full multi-step engine (20+ columns) and is `user_id not null references
-- auth.users`, which is structurally incompatible with "no account, ever".
-- Reuses public.set_updated_at() from 0001. Additive: existing /apply rows are
-- unaffected (they always set application_id, never quick_buy_order_id).

-- ============================================================ quick_buy_orders
create table if not exists public.quick_buy_orders (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid not null references public.leads (id) on delete cascade,
  usdot_number   text,
  service_key    text not null check (service_key in ('boc-3','ucr','clearinghouse','consortium','dq-files')),
  power_units    integer, -- ucr only
  driver_count   integer, -- dq-files only
  email          text,    -- pre-filled from the lookup's contactEmail, editable
  phone          text,    -- pre-filled from the lookup's contactPhone, editable
  reference_id   text unique,
  confirmed_at   timestamptz, -- set when the visitor clicks "Confirm and pay"
  status         text not null default 'created'
                   check (status in ('created','awaiting_payment','paid','fulfilled','cancelled')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists quick_buy_orders_lead_id_idx      on public.quick_buy_orders (lead_id);
create index if not exists quick_buy_orders_reference_id_idx on public.quick_buy_orders (reference_id);
create index if not exists quick_buy_orders_status_idx       on public.quick_buy_orders (status);

drop trigger if exists quick_buy_orders_set_updated_at on public.quick_buy_orders;
create trigger quick_buy_orders_set_updated_at before update on public.quick_buy_orders
  for each row execute function public.set_updated_at();

-- RLS on, but intentionally NO policies (same posture as admin_users): there is
-- no client-facing read path for a quick-buy order (no account exists to own
-- it), so it is unreachable by anon/authenticated clients. Only the service
-- role (checkout, webhook, lookup capture, admin) touches this table.
alter table public.quick_buy_orders enable row level security;

-- ==================================== payments / filings: widen for quick-buy
-- Pure widening: every existing row (and every /apply insert, which always sets
-- application_id) is unaffected. The XOR check is what keeps the two lanes from
-- ever being ambiguous.
alter table public.payments alter column application_id drop not null;
alter table public.filings  alter column application_id drop not null;

alter table public.payments add column if not exists quick_buy_order_id uuid references public.quick_buy_orders (id) on delete cascade;
alter table public.filings  add column if not exists quick_buy_order_id uuid references public.quick_buy_orders (id) on delete cascade;

alter table public.payments drop constraint if exists payments_parent_xor;
alter table public.payments add constraint payments_parent_xor check (
  (application_id is not null and quick_buy_order_id is null) or
  (application_id is null and quick_buy_order_id is not null)
);

alter table public.filings drop constraint if exists filings_parent_xor;
alter table public.filings add constraint filings_parent_xor check (
  (application_id is not null and quick_buy_order_id is null) or
  (application_id is null and quick_buy_order_id is not null)
);

create index if not exists payments_quick_buy_order_id_idx on public.payments (quick_buy_order_id);
create index if not exists filings_quick_buy_order_id_idx  on public.filings  (quick_buy_order_id);

-- payments_select_owner / filings_select_owner (0004 / 0003) join through
-- applications.user_id = auth.uid(); they naturally return zero rows for
-- quick-buy rows since application_id is null there. No policy change needed
-- and no accidental exposure: there is still no client read path for quick-buy
-- rows either way.
