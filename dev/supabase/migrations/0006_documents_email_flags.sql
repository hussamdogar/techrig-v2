-- Application Platform M6 — documents + email idempotency flags
-- Additive to the prod project (pqbynaaihauifomfhcxo). Reuses set_updated_at().

-- final-email + receipt idempotency guards (M6 §2): every send is a no-op if its
-- timestamp is already set.
alter table public.applications add column if not exists final_email_sent_at timestamptz;
alter table public.payments      add column if not exists receipt_sent_at     timestamptz;

-- CAN-SPAM suppression for promotional sends (the 72h coupon email). Transactional
-- emails (welcome/receipt/status) are exempt and ignore this flag.
alter table public.leads add column if not exists email_opt_out boolean not null default false;

-- The 72h reminder issues a Stripe coupon; store its code on the lead so checkout
-- can honor it later.
alter table public.leads add column if not exists coupon_code text;

-- ============================================================ documents
create table if not exists public.documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  filing_id      uuid references public.filings (id) on delete set null,
  kind           text not null check (kind in ('acknowledgement_pdf', 'answers_pdf', 'receipt')),
  storage_path   text not null,
  created_at     timestamptz not null default now()
);
create index if not exists documents_application_id_idx on public.documents (application_id);

alter table public.documents enable row level security;

-- Owner may READ the metadata for documents on their own applications; files
-- themselves are served via short-lived signed URLs from an ownership-checked
-- server route. Writes are service-role only.
drop policy if exists documents_select_owner on public.documents;
create policy documents_select_owner on public.documents
  for select to authenticated using (
    application_id in (select id from public.applications where user_id = auth.uid())
  );

-- Private Storage bucket for the generated PDFs (no public URLs).
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;
