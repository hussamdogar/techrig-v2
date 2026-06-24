# M1 Work Order — Dev (the only M1 work order)

Milestone: M1 — hero USDOT lookup card + lead capture. Lane: Dev (Dev-led; no SEO/Design gating per ADR-5/-8).
Reads: `../00-overview.md`, `../01-architecture.md` (§4 dual lookup, §4a noindex, §8 infra), `../02-data-model.md` (leads + carrier_snapshots), `shared/design/design-system.md`, `dev/app/page.tsx`. Writes: `dev/**` + a build note back to `../03-roadmap.md` M1.

Goal: a carrier types a USDOT on the homepage, sees live FMCSA records, and is captured as a lead. "Don't have a USDOT? File for one now" routes onward. No auth, no payment in M1.

## 0. Reuse the live infra (ADR-6) — no provisioning
Point at the existing, active projects behind `techrig-form` / `boc3-form-new`: same Supabase project (add new tables), same Vercel KV (reference counter), same Resend domain. Pull env values from those repos' Vercel settings. The only new credential is the **QCMobile webKey** for the backup lookup.

## 1. Dual-provider lookup with failover (ADR-7) — start here, it's the core
Build `lib/lookup` exposing `lookupCarrier(usdot) → { status: 'success'|'not_found'|'manual_required', carrier?: CarrierData, provider }`.
- **Primary — MOTUS:** port `boc3-form-new`'s `shared/motus.ts` (`normalizeMotusMatrixResponse`) and the `api/lookup-usdot.ts` fetch flow (`motus.dot.gov/api/carriers/{usdot}` → `/api/public-registration-matrix/{entityId}`). It is known-working in the live boc3 app.
- **Backup — FMCSA QCMobile:** `mobile.fmcsa.dot.gov/qc/services/carriers/{usdot}?webKey=…`; normalize into the SAME `CarrierData` shape so the UI is provider-agnostic.
- **Failover:** try primary with a tight timeout (~2.5s); on error/timeout/rate-limit/empty → try backup; if backup also fails → `manual_required`. Isolate each call so one provider being down never breaks the card.
- Record which provider answered in `carrier_snapshots.source` (`motus|qcmobile|manual`) and log provider + latency so we can watch the failover rate.

## 2. Data (live Supabase project)
SQL migration for **only** `leads` and `carrier_snapshots` per `02-data-model.md`. RLS: anon insert allowed; select/update gated by the signed lookup token; service role for admin. Indexes: usdot, reference_id, created_at. Reference ID via the existing KV daily counter → keep the `DGR-YYYYMMDD-NNNN` format (ADR-6).

## 3. API — `/api/lookup-usdot`
- Validate `^\d{1,12}$` server-side; reject otherwise.
- Rate limit (KV primary, in-memory fallback), 20/15min/IP.
- Flow: generate `reference_id` + signed lookup token → `lib/lookup.lookupCarrier()` → insert `leads` (`usdot_number`, `source:'hero_lookup'`, `lookup_status`, reference, token hash) + immutable `carrier_snapshots.data_json` (with `source`) → return `{ carrier, referenceId, token, status }` or `{ status:'not_found'|'manual_required' }`.
- No PII beyond USDOT in M1. Never log raw tokens or PII.

## 4. Hero card — build with the EXISTING design system (ADR-8)
Use the locked tokens/components (`design-system.md`: paper/cloud/ink/slate/steel/signal; existing button/container). No new design language. In `dev/app/page.tsx`, place the card in the hero right column; the current `AuthorityStatusTracker` visual is decorative — replace it with the card (it is reserved for reuse as the real dashboard progress tracker in M5). Keep the H1/subhead/CTAs as-is.

**Copy (final, brand voice, em-dash-free — use verbatim):**
- Eyebrow: `QUICK LOOKUP`
- Heading: `Look up a USDOT number`
- Input placeholder: `e.g. 3214567`
- Button: `Search`
- Helper line: `Pull live FMCSA records: safety rating, authority status, and insurance on file.`
- Primary link: `Don't have a USDOT number? File for one now` → **interim** `/dot-registration/` (the apply engine isn't built yet); **final** `/apply/?service=usdot` (switch in M3).
- Secondary link: `Questions? Contact us` → `/contact-us/`
- Result-panel labels: `Legal name`, `USDOT #`, `MC #`, `Entity type`, `Authority status`, `Safety rating`, `Insurance on file`, `Power units`.
- Missing field value: `Not on file` (muted) — never fabricate (standards.md).
- Not found: `We couldn't find a carrier with that USDOT number. Check the number, or file for a new USDOT.`
- Error/unavailable: `Lookup is temporarily unavailable. Try again in a moment, or contact us.`

**States:** idle, focused, invalid-format, loading (button spinner; lookup hits a live gov API, design for 1–3s), result, not-found, error, and a "look up another" reset from the result.
**Authority status** renders as a status chip (active = signal/positive token; not-authorized/out-of-service = warning) per the existing system.

## 5. Performance + indexing (hard requirements)
- The homepage stays prerendered and fast. Make the card a client island; dynamic-import any heavy bits; do NOT pull Supabase/Stripe into the marketing bundle. Reserve the card height to avoid CLS. Verify `/` Lighthouse is not regressed vs. current.
- **noindex (ADR-5):** the `/lookup`, `/apply`, `/dashboard`, `/account` routes set `robots: { index:false, follow:false }` and are excluded from `sitemap.xml`. (The homepage itself stays indexable; the embedded card has no own URL.)
- a11y: labeled input, steel focus ring, button disabled while loading, results in `aria-live`, error announced, sensible focus after lookup.

## 6. Optional
Welcome email on lead creation only if Resend wires in trivially (domain is live); otherwise defer to M6. Do not block M1 on email.

## Acceptance gate (all must pass before M1 = DONE)
- Real USDOT → correct live FMCSA data renders. Force the primary to fail → backup answers and the card still works. Both → `manual_required` shown gracefully.
- `leads` + immutable `carrier_snapshots` row written per lookup; `DGR-` reference generated; `source` records the answering provider.
- USDOT validated; endpoint rate-limited; no PII/tokens in logs; RLS verified (anon cannot read others' rows).
- Homepage Lighthouse (perf/CLS) not regressed; card lazy, no layout shift.
- App routes noindex + absent from `sitemap.xml`.
- Copy matches §4 verbatim; UI uses only existing design-system tokens/components.
- Build note appended to `03-roadmap.md` M1 (providers confirmed, env wired, what shipped); orchestrator flips the row to DONE.

## Commit scope
Commit only `dev/**` and this milestone's roadmap note. Never `git add .`. The hero edit touches `dev/app/page.tsx` — keep it to the card insertion.

---

## M1 REVISIONS (orchestrator, 2026-06-25) — client corrections; land these BEFORE the gate
Two changes from the owner after reviewing the live build. Both must ship before the gate runbook runs.

### R1 — Search navigates to a dedicated results PAGE (not an inline expand)
Today the hero card POSTs and expands the result inline. Change it: the **Search button navigates to a dedicated results page** that displays the carrier info.
- Route: `/lookup/[usdot]/` (path param; shareable within the session). It is a **noindex** app route (ADR-5; `robots: {index:false, follow:false}`, absent from `sitemap.xml`).
- The **hero card** becomes a lightweight entry form: validate `^\d{1,12}$` client-side, then route to `/lookup/{usdot}/`. The result / not-found / error states move OFF the card and onto the results page. Keep the idle/focused/invalid + a brief submit/loading state on the card.
- **Results page** performs the lookup, captures the lead, and renders. Recommended: a **server component** that calls a shared `performLookup(usdot, request)` helper (extract the lookup + rate-limit + lead/snapshot-capture logic currently inside `app/api/lookup-usdot/route.ts` into `lib/server` so BOTH the page and the existing POST route reuse it — no logic duplication). SSR keeps Supabase/Stripe out of the client bundle and the page fast. Preserve: rate-limit, lead + snapshot capture, `X-Robots-Tag: noindex`, reference + token.
- States on the page: success (full docket, see R2), `not_found` (with a "File for a USDOT" CTA → interim `/dot-registration/`), `manual_required`, and error. Keep "Search another" → back to the card/home. The `/api/lookup-usdot` POST route stays (it will back programmatic/`/apply` use); the card simply no longer renders results itself.

### R2 — Display the COMPLETE docket (the two-step data is already fetched)
The two-step fetch is correct and present (`lib/lookup/motus.ts` `fetchMotusCarrier`: `/carriers/{usdot}` → `getEntityId` → `/public-registration-matrix/{entityId}`; the full matrix is normalized and also kept on `CarrierData.raw`). The data was "incomplete" only because the **card surfaced ~8 fields**. The new results page must render the **full docket**:
- Identity: legal name, DBA, USDOT, MC/docket (`mxDocketNumber`), entity/business type, operation/registration type.
- Status: operating authority status, allowed-to-operate / out-of-service, new-entrant, protest period, insurance-required, BOC-3 designation eligibility.
- Operation classification: interstate/intrastate, for-hire/private.
- Fleet: power units, equipment summary (truck tractors / straight trucks / trailers), reported powered vehicles.
- People: drivers total + CDL, primary officer/contact (name, phone, email) — but treat officer PII carefully (display, do not persist beyond the snapshot; never log).
- Addresses: physical/principal.
- Every null shows "Not on file" — never fabricate (standards.md). Safety rating + insurance-on-file are genuinely absent from the MOTUS matrix; they populate only when the **QCMobile** backup answers (`source: qcmobile`), so label them honestly by source.
- **Verify** against the test USDOT (3214567) that the matrix docket is fully populated end-to-end. If a field the owner expects is still missing, trace which layer drops it: (i) not in the matrix response, (ii) dropped by `normalizeMotusMatrixResponse`, or (iii) simply not displayed — and fix at the right layer. Do not add a third MOTUS call unless the matrix genuinely lacks the field.
- Group the docket into readable sections using the existing design system; this is the page that proves Tech Rig's competence, so it should read cleanly, not as a raw dump.

Acceptance for R1+R2 folds into the gate below (the "real USDOT → live data" check now means: Search → `/lookup/{usdot}/` renders the full docket; not-found/error render on the page; card no longer expands inline).

---

## GATE-COMPLETION RUNBOOK (orchestrator, 2026-06-24; revised 2026-06-25) — finish the gate AFTER R1+R2 land
Authorized by the owner: pre-flight, then apply `0001` to the shared production Supabase DB (it serves the live legacy forms; the migration is additive + idempotent). Env is now in `dev/.env.local`. The dev session executes this; the orchestrator verifies the evidence and flips M1 → DONE. Run in order:

1. **Pre-flight (read-only) — do NOT skip.** Against the live DB, run:
   ```sql
   select
     to_regclass('public.leads')             as leads_exists,
     to_regclass('public.carrier_snapshots') as carrier_snapshots_exists,
     exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
             where n.nspname = 'public' and p.proname = 'set_updated_at') as set_updated_at_exists;
   ```
   - If `leads_exists` or `carrier_snapshots_exists` is non-null → **STOP** (name collision with a legacy table); report to the orchestrator before applying.
   - If `set_updated_at_exists` is true → inspect its definition; only let `create or replace` proceed if the body is the trivial `new.updated_at = now()` (else report).
   - All clear → proceed.
2. **Apply `0001`** to the live project. Confirm both tables, RLS enabled, policies, indexes, and the trigger exist afterward. Capture the output.
3. **Preview deploy** with `.env.local` wired (Supabase + KV + `FMCSA_WEBKEY`). 
4. **Run the gate checks** and capture evidence for each:
   - a real USDOT → live data written: a `leads` row + immutable `carrier_snapshots` row, `DGR-` reference from the real KV counter, rate-limit exercised.
   - **backup provider**: with `FMCSA_WEBKEY` set, force the primary to fail (or use a USDOT MOTUS lacks) → QCMobile answers, `source: qcmobile`; both unavailable → `manual_required`.
   - **RLS**: an anon client cannot `select` any `leads`/`carrier_snapshots` row; an owner sees only their own.
   - **Lighthouse** on `/`: perf/CLS not regressed vs. pre-card baseline; card lazy, no layout shift.
   - **noindex**: `X-Robots-Tag`/metadata on the app routes; routes absent from `sitemap.xml`.
5. **Report** the evidence back (append results here or to the roadmap M1 note). The orchestrator confirms and flips M1 → DONE, then opens M2.

Safety: applying is the only production-touching step and is authorized for the additive migration ONLY. Any DROP/ALTER on a legacy table is out of scope — stop and escalate. Do not print secrets from `.env.local` in logs or commits.
