-- Pricing v2 (D15) — the /apply bundle-selection UX needs to persist which of
-- the four fixed bundles (if any) a carrier chose, alongside the existing
-- selected_services (still used for a la carte add-ons layered on top of a
-- bundle, e.g. USDOT Correction). Additive, nullable: a la carte applications
-- (selected_bundle is null) are unaffected. Not yet applied to the live
-- project in this session (no Supabase credentials available); apply before
-- the bundle-selection UX goes live.

alter table public.applications
  add column if not exists selected_bundle text;
