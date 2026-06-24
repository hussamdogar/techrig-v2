-- Application Platform M2 — profiles + signup trigger
-- Additive to the live project (pqbynaaihauifomfhcxo). 1:1 with auth.users, a
-- profile auto-created on signup, RLS owner-only. Reuses public.set_updated_at()
-- from migration 0001. Per 02-data-model.md / M2 work order. Idempotent.

-- ============================================================ profiles
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Owner-only access. Anon has no policy, so cannot read any profile.
drop policy if exists profiles_select_owner on public.profiles;
create policy profiles_select_owner on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists profiles_update_owner on public.profiles;
create policy profiles_update_owner on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- The signup trigger (security definer) creates the row; this self-insert policy
-- is a fallback if a profile is ever created in the user's own session.
drop policy if exists profiles_insert_owner on public.profiles;
create policy profiles_insert_owner on public.profiles
  for insert to authenticated with check (id = auth.uid());

-- ============================================== auto-create on signup
-- SECURITY DEFINER so the trigger can write public.profiles from the auth schema
-- insert. search_path pinned to public to avoid hijacking.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
