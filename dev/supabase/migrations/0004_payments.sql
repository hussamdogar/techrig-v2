-- Application Platform M4 — payments
-- Additive to the prod project (pqbynaaihauifomfhcxo). Owner reads their own
-- payments; ALL writes are service-role/webhook only (clients never write payment
-- state — the Stripe webhook is the source of truth). Reuses set_updated_at().

create table if not exists public.payments (
  id                          uuid primary key default gen_random_uuid(),
  application_id              uuid not null references public.applications (id) on delete cascade,
  stripe_payment_intent_id    text,
  stripe_checkout_session_id  text,
  amount                      numeric not null,
  currency                    text not null default 'usd',
  status                      text not null default 'created'
                                check (status in ('created','processing','paid','failed','refunded')),
  idempotency_key             text,
  coupon_code                 text,
  paid_at                     timestamptz,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists payments_application_id_idx on public.payments (application_id);
create index if not exists payments_pi_idx             on public.payments (stripe_payment_intent_id);

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

-- Owner may READ payments on their own applications. There is intentionally NO
-- client insert/update/delete policy: payment state is written only by the
-- service role from the checkout route and the signature-verified webhook.
drop policy if exists payments_select_owner on public.payments;
create policy payments_select_owner on public.payments
  for select to authenticated using (
    application_id in (select id from public.applications where user_id = auth.uid())
  );
