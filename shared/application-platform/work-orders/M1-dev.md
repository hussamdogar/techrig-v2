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
