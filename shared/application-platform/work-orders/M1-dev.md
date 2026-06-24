# M1 Work Order — Dev

Milestone: M1 (hero USDOT lookup card + lead capture). Lane: Dev (implement to the SEO + Design specs).
Reads: `../00-overview.md`, `../01-architecture.md`, `../02-data-model.md`, the SEO M1 addendum, the Design M1 spec. Writes: `dev/` (routes, lib, components, migrations) + a build note back to `../03-roadmap.md` M1.

Gated on: SEO addendum + Design spec committed. The MOTUS spike (§1) can start immediately — it is the schedule risk.

## 1. MOTUS spike (do first — de-risks the milestone)
Port target: `boc3-form-new`'s `shared/motus.ts` (`normalizeMotusMatrixResponse`) and `api/lookup-usdot.ts`. Before building UI, confirm from a Vercel-like environment:
- Are `motus.dot.gov/api/carriers/{usdot}` and `/api/public-registration-matrix/{entityId}` still reachable? Any auth/allow-listing/keys? Rate/usage limits? Latency?
- If MOTUS is gated/unavailable: fall back to FMCSA **QCMobile** (`mobile.fmcsa.dot.gov/qc/services/carriers/{usdot}?webKey=…`) or SAFER. Both need a free webKey — request it.
- Build `lib/motus` behind an interface (`lookupCarrier(usdot) → CarrierData | NotFound | ManualRequired`) so the data source is swappable. Record the chosen source + env vars in `01-architecture.md` §8.

## 2. Data + infra
- Provision/confirm the Supabase project (reuse the legacy one if available). Add `@supabase/supabase-js`.
- SQL migration for `leads` and `carrier_snapshots` per `02-data-model.md` (only these two tables in M1). RLS: anon insert allowed; select/update gated by signed-token; service role for admin. Add the indexes (usdot, reference_id, created_at).
- Reference-ID generator via Vercel KV daily counter → `TR-YYYYMMDD-NNNN` (confirm prefix with the M0 decision). Add `@vercel/kv`.

## 3. API — `/api/lookup-usdot` (route handler)
- Validate USDOT `^\d{1,12}$` server-side; reject otherwise.
- Rate limit (KV primary, in-memory fallback) — 20/15min/IP (legacy value).
- Flow: generate `reference_id` + signed lookup token → call `lib/motus` → insert `leads` (`lookup_status`, `usdot_number`, `source:'hero_lookup'`, reference, token hash) + write the immutable `carrier_snapshots.data_json` → return `{ carrier: CarrierData, referenceId, token, status }` or `{ status:'not_found'|'manual_required' }`.
- No payment, no PII beyond USDOT in M1. Never log raw tokens or any PII.

## 4. Hero card component
- Build to the Design spec, all states (idle/loading/result/not-found/error/invalid). Client component.
- **Performance:** the homepage must stay prerendered and fast. Make the card a client island and dynamic-import any heavy bits; do not pull Supabase/Stripe into the marketing bundle. Reserve height per the Design no-CLS rule. Verify Lighthouse on `/` is not regressed vs. current.
- a11y exactly as Design specs (label, `aria-live` results, focus management, error announcement).
- Wire the "Don't have a USDOT number? File for one now" link to the SEO-specified target (interim `/dot-registration/` unless told otherwise); "Questions? Contact us" → `/contact-us/`.

## 5. Optional (only if Resend is already provisioned)
A welcome email on lead creation can ship in M1; otherwise it belongs to M6. Do not block M1 on email.

## Acceptance gate (must all pass before M1 is DONE)
- A real USDOT returns correct live FMCSA data in the card; not-found and error paths handled gracefully.
- A `leads` row + immutable `carrier_snapshots` row are written per lookup; reference ID generated.
- USDOT validated + endpoint rate-limited; no PII/tokens in logs; RLS verified (anon cannot read others' leads).
- Homepage Lighthouse (perf/CLS) not regressed; card lazy, no layout shift.
- Copy matches the SEO addendum exactly; UI matches the Design spec.
- A build note appended to `03-roadmap.md` M1 (data source chosen, env added, what shipped) and the row flipped to DONE by the orchestrator.

## Commit scope
Dev commits only `dev/**` and this milestone's roadmap/work-order note. Never `git add .`. The hero edit touches `dev/app/page.tsx` — keep it to the card insertion the Design spec defines.
