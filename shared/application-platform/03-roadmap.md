# Application Platform — Milestone Roadmap

Owner: orchestrator. Status: M1 ACTIVE (work orders issued); M2–M7 PLANNED.
Decompose the build so nothing is dropped. Each milestone is independently shippable, has explicit lane routing, hard dependencies, and an acceptance gate. A milestone is DONE only when its gate passes and the orchestrator flips it on this page + `../orchestration-status.md`.

**This is a Dev-led workstream (ADR-5/-8).** The platform is noindex, so SEO is not a lane; the design language is locked, so Design is not a lane. Dev owns the UI (built with the existing system), functional copy in the brand voice, and all engineering. The 🔵/🟣 bullets in M2–M7 below are folded into Dev: read "🔵" as "Dev, copy in brand voice" and "🟣" as "Dev, existing design system"; escalate to Design only for a genuinely new pattern. Each milestone still gets its own Dev work order when it activates.

Sequencing rule: a milestone does not start until its dependencies' **build-complete** state is reached (code shipped + verifiable parts of its gate passed). It does NOT wait on deploy-time checks (see policy below).

**Deploy & QA policy (owner, 2026-06-25): nothing deploys, not even a preview, until the whole site is complete and QA'd.** Consequence: each milestone is built and verified locally/in-sandbox and against the prod Supabase project, then marked BUILD-COMPLETE so the next milestone proceeds. Every deploy-time-only check (real-IP external APIs, Vercel KV, Lighthouse, prod auth redirect URLs, deliverability) accumulates in the **Consolidated pre-launch QA ledger** at the bottom of this file and runs once, together with Workstream A's launch gate, at the end. A milestone is fully DONE when build-complete; its deploy-time items are tracked separately and cleared at the consolidated QA.

Legend: 🟢 Dev (owns) · ⚙️ orchestrator/shared · (🔵 copy-in-brand-voice / 🟣 existing-design — both Dev)

---

## M0 — Foundation (Dev) · STATUS: PARTIAL (docs done; infra confirmed)
Goal: lock decisions, stand up the skeleton, no client-visible change.
- ⚙️ ADRs + these docs (DONE). Accounts CONFIRMED: reuse the live legacy infra (ADR-6). Reference-ID prefix stays `DGR-` (ADR-6).
- 🟢 Pull env from the legacy Vercel projects; add the `(app)` route group scaffold + `lib/supabase` client + env wiring (no features); obtain the QCMobile webKey (backup lookup). Decide JSONB-vs-columns for `application_data`.
Gate: skeleton builds clean; env wired from the live projects; both lookup providers reachable.

---

## M1 — Hero USDOT lookup card + lead capture · STATUS: BUILD-COMPLETE (deploy-checks → QA ledger)
> R1+R2 landed (`f0424b4`), DB gate passed against prod (`7a7c885`). The 3 deploy-time checks (QCMobile backup on a real IP, Vercel KV counter, Lighthouse) are in the Consolidated pre-launch QA ledger.
> **R3 LANDED (`5be85a5`, 2026-06-25):** the lookup is now the full 3-step chain (carriers keeps its body + extracts OA ids → matrix → `getOAPublicView` per OA id, in parallel, each isolated). Four new docket sections (Registration & filing dates, Operating authority, Insurance on file, BOC-3). MC docket now from the OA view (`MC1004652`), superseding the matrix `mxDocketNumber`; filings filtered to current/active with honest status (canceled shown as canceled, not hidden); no-authority carriers skip step 3 → "Not on file". Primary timeout raised to 8s for the multi-call chain. Verified live (matches the orchestrator's independent ground-truth pull). M1 is fully build-complete; flips to DONE when the QA ledger clears at launch.
Goal (ADR-4): a carrier enters a USDOT on the homepage, sees live FMCSA records (via the dual-provider lookup), and is captured as a lead; "no USDOT" routes to the file-now path. No auth, no payment yet.
- 🟢 Dev — `work-orders/M1-dev.md` (the only M1 work order): `lib/lookup` (MOTUS primary + QCMobile backup, failover), `/api/lookup-usdot` (rate-limited), `leads` + `carrier_snapshots` tables + RLS in the live Supabase project, the hero card client island built with the existing design system, result render with all states, reference-ID generation (`DGR-`), the "file now" route, noindex on app routes. Functional copy is specified inline in the work order (brand voice; no SEO dependency). Optional welcome email if Resend is trivial to wire.
Dependencies: M0 env from the live projects + the QCMobile webKey. No SEO/Design gating.
Gate: enter a real USDOT → correct live FMCSA data renders (primary, and still works when the primary is forced to fail → backup answers); a `leads` + `carrier_snapshots` row is written; not-found/error handled gracefully; rate-limited; homepage Lighthouse not regressed (no CLS, card lazy); app routes noindex + absent from sitemap.

### Build note (Dev, 2026-06-24) — CODE-COMPLETE; live gate partially passed, remainder blocked on credentials
**Shipped (`dev/**`):**
- `lib/lookup/` — dual-provider lookup with failover. MOTUS primary ported from `boc3-form-new` (`normalizeMotusMatrixResponse` + two-step carriers→matrix fetch); QCMobile backup normalized to the same `CarrierData`; `lookupCarrier()` runs primary (~2.5s timeout) → backup → `manual_required`, isolates each call, logs provider + latency, and distinguishes a clean `not_found` from provider-unavailable.
- `lib/server/` — HMAC lead token (+ at-rest hash), KV rate limit (in-memory fallback), `DGR-YYYYMMDD-NNN` KV reference counter, Supabase service/anon clients (`server-only`). `.env.example` documents every key.
- `supabase/migrations/0001_leads_carrier_snapshots.sql` — `leads` + `carrier_snapshots` (additive), RLS (anon insert; owner-only reads; write-once snapshots), indexes. **Not yet applied** to the live project.
- `app/api/lookup-usdot/route.ts` — validate `^\d{1,12}$`, rate-limit 20/15min, reference+token, lookup, best-effort lead+snapshot insert (degrades gracefully without DB), `X-Robots-Tag: noindex`.
- `components/usdot-lookup-card.tsx` + `app/page.tsx` — hero card client island (verbatim copy; idle/loading/result/not-found/error/reset states; status chip; "Not on file" for null fields; a11y). Replaces the decorative `AuthorityStatusTracker` (kept for M5). Deps added: `@supabase/supabase-js`, `@supabase/ssr`, `@vercel/kv`, `zod`.

**Verified in sandbox (live):** real USDOT 3214567 → correct live MOTUS data (`source: motus`, authority Active, 6 power units); absurd USDOT → `not_found` (status logic correct); invalid input → 400; `X-Robots-Tag: noindex` present; home stays prerendered (`○ /`) with the card server-rendered (no CLS) and no Supabase/Stripe in the client bundle; KV reference falls back cleanly when KV is absent. Confirmed against a live matrix response: MC = `mxDocketNumber`; safety-rating and insurance-on-file are NOT in the MOTUS matrix (they come from QCMobile), so MOTUS leaves them null honestly.

**Gate items still OPEN (need credentials/infra Dev cannot self-provision):**
1. **QCMobile webKey (`FMCSA_WEBKEY`)** — the one new credential. Without it the backup is unavailable, so the "force primary to fail → backup answers" gate check is untested live (code path is in place).
2. **Live Supabase + KV env** (pull from the legacy Vercel projects) — needed to actually write `leads`/`carrier_snapshots`, exercise the real KV counter/rate-limit, and **apply migration `0001`** to the live project. Applying to the shared production DB is held for explicit go-ahead.
3. **Preview verification** — Lighthouse (perf/CLS) and RLS (anon cannot read others' rows) on a Vercel preview with the env wired.

**Recommendation:** keep M1 status ACTIVE. Wire the env + webKey, apply `0001`, deploy a preview, run items 1–3; then the orchestrator flips M1 → DONE.

**Revisions (owner, 2026-06-25) — land BEFORE the gate (see work order §M1 REVISIONS):** (R1) Search navigates to a dedicated noindex results page `/lookup/[usdot]/` instead of expanding the card inline; the card becomes an entry form, result/not-found/error move to the page; extract a shared `performLookup()` so the page and the POST route reuse one path. (R2) The results page renders the COMPLETE matrix docket (identity, authority, operation classification, fleet/equipment, drivers, officer contact, addresses), not the card's 8-field summary. The two-step carriers→entityId→matrix fetch is already correct (`lib/lookup/motus.ts`); the gap was display scope. Nulls show "Not on file"; safety-rating/insurance come only from the QCMobile backup.

**R1+R2 LANDED (Dev, 2026-06-25):** Shared `performLookup()` extracted to `lib/server/lookup-capture.ts` and reused by both the new page and the `/api/lookup-usdot` POST route (no logic duplication). New `app/lookup/[usdot]/page.tsx` is a server component, noindex (meta + `X-Robots-Tag` header via `next.config.ts`, absent from `sitemap.xml`); it renders the full docket in six grouped sections (Identity, Authority & status, Operation classification, Fleet & equipment, Drivers & contact, Address) with "Not on file" for nulls and safety/insurance labelled by source. The hero card is now a validate-and-navigate entry form. Verified live in-sandbox: `/lookup/3214567/` renders the full ELMI TRANSPORTATION docket end-to-end (MOTUS); not-found and error states render on the page; home stays prerendered; `/lookup` excluded from sitemap. Gate runbook next.

**GATE RUNBOOK (Dev, 2026-06-25) — DB gate PASSED; two checks deferred to deploy.** Ran with the owner's `SUPABASE_ACCESS_TOKEN`.
- **Pre-flight (read-only):** clear — `leads`/`carrier_snapshots` absent, no pre-existing `set_updated_at`. Token confirmed to own the target `pqbynaaihauifomfhcxo` ("BOC-3 Test Project", us-east-2); did not touch any other project.
- **Migration `0001` APPLIED** to `pqbynaaihauifomfhcxo` via the Supabase Management API. Verified: both tables exist, **RLS enabled**, 4 policies (anon-insert, owner select/update, snapshot owner-select), 9 indexes, the `leads_set_updated_at` trigger.
- **Live write PASS:** a real USDOT lookup wrote one `leads` row (status `success`, `DGR-` reference) + one immutable `carrier_snapshots` row (`source: motus`).
- **RLS PASS:** anon REST sees 0 rows on both tables; service-role sees them. Anonymous cannot read others' rows.
- **noindex PASS:** `/lookup` emits `<meta robots noindex>` + `X-Robots-Tag` header, absent from `sitemap.xml`.
- **Deferred to the real deployment (sandbox-limited, owner agreed):** (1) **QCMobile backup** — `mobile.fmcsa.dot.gov` returns 403 to the sandbox IP (likely a WAF; MOTUS works), so the force-primary-fail→backup check needs a real-IP preview; (2) **KV counter** — the Upstash REST endpoint is unreachable from the sandbox so the `DGR-` counter used its fallback (works on Vercel's network); (3) **Lighthouse** on `/` — to run post-deploy.
- **Net:** the database half of the gate is complete and verified against the live project; the remaining checks are environmental and run at deploy time. Suggest M1 stays ACTIVE until the preview confirms (1)–(3), then orchestrator → DONE.

**R3 LANDED (Dev, 2026-06-25):** the MOTUS lookup is now the full 3-step chain. `fetchMotusCarrier` keeps the step-1 carriers body (USDOT status, MCS-150 date/mileage, biennial-due) and extracts the operating-authority ids from `entityRegistrations`, then calls `getOAPublicView` per OA id (parallel, isolated — a step-3 failure degrades only that section). `CarrierData` extended with the date fields + `operatingAuthorities[]` (docket, type, status, protest, current insurance + BOC-3 filing). MC docket now comes from the OA view (`docketNumber`, e.g. `MC1004652`), superseding the matrix `mxDocketNumber`. The `/lookup/[usdot]/` page gained four sections: Registration & filing dates, Operating authority, Insurance on file, BOC-3 / process agent. Filings show the current one (Active preferred, else most recent) WITH its true status; canceled/historical is never relabeled active; empty → "Not on file". Primary timeout raised to 8s for the multi-call chain. **Supersedes** the earlier build-note claim that insurance is "not in MOTUS": insurance IS available via the OA view (step 3); QCMobile remains the backup only for when MOTUS is unreachable. **Verified live in-sandbox** (USDOT 3214567): MC `MC1004652`, OA Active, BOC-3 "Trucker's Nationwide, Inc." (Active), insurance GEICO / BMC-91X / $750,000 (status shown verbatim), USDOT Active + MCS-150 + biennial dates; a no-authority USDOT renders those sections "Not on file" with no error; noindex preserved; build clean.

---

## M2 — Accounts + dashboard shell · STATUS: BUILD-COMPLETE (`ed88a8f`)
> Shipped + verified against prod (throwaway user/lead, deleted): Supabase Auth magic-link via `@supabase/ssr`; `proxy.ts` (Next 16's renamed middleware) guards `/dashboard` + `/account`; `/login`, `/auth/callback`, sign-out. Migration `0002` applied to prod (pre-flight clear): `profiles` 1:1 + RLS + `handle_new_user` trigger. Lead→account claim via httpOnly cookie (HMAC + stored-hash verify, claim-only-if-unclaimed). `/dashboard` + `/account` in the existing design system; all authed routes noindex + sitemap-excluded. Gate checks all green (signup→profile, RLS, claim no-reassign, logged-out 307, noindex, no service-key in bundle). Deploy-time items → QA ledger. Fully DONE when the ledger clears at launch.
Goal (ADR-2): clients can sign up/log in and land on a dashboard; an anonymous lead claims into the account.
- 🔵 SEO: dashboard/account copy, empty states, transactional email subject/copy (magic link), any noindex rules for authed routes.
- 🟣 Design: dashboard IA + nav, logged-out vs logged-in home, empty/populated states, account/profile screens.
- 🟢 Dev: Supabase Auth (magic-link), `profiles`, RLS, dashboard pages, lead→account claim flow, route protection, authed-route noindex.
Dependencies: M1 (leads exist to claim). Gate: a user signs up, lands on the dashboard, sees their claimed lookup; RLS verified (cannot read another user's rows); authed routes noindexed.

### Build note (Dev, 2026-06-25) — BUILD-COMPLETE
**Shipped (`dev/**`):**
- Supabase Auth (magic-link): `@supabase/ssr` server + browser clients, `proxy.ts` (Next 16 middleware) that refreshes the session and guards `/dashboard`, `/account`. `/login` (magic-link request form), `/auth/callback` (code exchange → claim → redirect), sign-out server action.
- **Migration `0002`** applied to prod `pqbynaaihauifomfhcxo` (pre-flight clear): `profiles` 1:1 with `auth.users`, RLS owner-only, `handle_new_user` trigger auto-creates the profile on signup.
- **Lead → account claim:** the `/lookup/[usdot]/` page gained a "Create an account to save & track" CTA that stashes the signed lead token in an httpOnly cookie (not the URL); after auth a server action verifies the token (HMAC + stored-hash match) and sets `leads.user_id` only if unclaimed (idempotent, no reassign).
- **Dashboard shell** (`/dashboard`): saved-lookups list (carrier, authority status, date, link to the docket) + empty Applications state with an interim CTA. **`/account`**: edit name/phone, email read-only, sign out. Built with the existing design system (in-content authed sub-nav; marketing chrome untouched).
- All authed routes noindex (meta + `X-Robots-Tag` via `next.config.ts`) and absent from `sitemap.xml`.

**Verified (local + against prod DB):** signup trigger creates the profile (with metadata name); profiles RLS (owner reads own row, anon reads none); claim is secure (token-hash match, claimed by the user, second account cannot reassign) — all run against prod with a throwaway user/lead that was then deleted. Logged-out `/dashboard` + `/account` → 307 to `/login?next=…`; `/login` renders; noindex headers present; sitemap excludes authed routes; home stays prerendered; no service-role key in the client bundle. Build clean.

**Deferred to the Consolidated QA ledger (deploy-time only):** prod auth redirect-URL allowlist in Supabase Auth + the real magic-link email round-trip (deliverability + clicking the link), and Lighthouse on the authed routes. The auth mechanics (signInWithOtp wiring, callback code-exchange, trigger, RLS, claim) are verified; only the real email click needs a deployed origin in the allowlist.

---

## M3 — Unified application engine · STATUS: BUILD-COMPLETE (`16eab3f`) — 1 open item: full-package bundle
> Shipped + verified (real code + prod DB): service registry (`lib/services-registry.ts`, prices match `services.md` exactly — orchestrator-verified line by line), migration `0003` applied to prod (pre-flight clear: `applications`+`filings`, owner-only RLS, filing-status writes back-office-reserved, `carrier_snapshots.application_id` FK), dynamic stepper (union of `requiredSteps` + passenger/hazmat conditionals, zod server-side), carrier diff + `needs_mcs150_update` + OA-aware hints from the R3 snapshot, `/apply` engine (authed, noindex; create from lookup/dashboard/cold; autosave+resume; review with server-computed pricing; one `filings` row per billable service). Homepage card link flipped to `/apply/?service=usdot`. Gate checks green: 6-service cart = $1,575 exact; ELD/insurance excluded; UCR 150 units → manual review; step conditionals correct; RLS isolation both ways; client filing-status write blocked; noindex/sitemap/logged-out→login/home-prerendered. Deploy-time items (Lighthouse `/apply/*`, full browser click-through with a real signed-in session) → QA ledger.
> **FOLLOW-UP M3-R1 — full-package bundle (owner-decided 2026-06-25): engine sells it.** Work order `work-orders/M3-R1-full-package.md`. Confirmed contents of the `$1,350` fixed package: MC (incl. USDOT) + BOC-3 + UCR (0-2, gov fee included) + Clearinghouse + Consortium + pre-employment drug test, with the MC FMCSA fee included (~$146 below à la carte). Higher UCR brackets add the gov-fee difference separately. Adds a `package` priceKind to the registry; de-dups vs individual selection; one filing per included service. Does not block M4 (M4 prices whatever the registry produces).
Goal (ADR-3): the service-driven multi-step application — lookup pre-fills, client selects services, only relevant steps render, autosave + resume tied to the account. Replaces BOTH legacy flows (techrig-form 9-step + boc3 lookup→checkout) with one engine. Build order in the work order: service registry → migration `0003` → state machine → carrier diff → steps → autosave → selection/review/pricing/filings.
- 🔵 SEO: service definitions/labels/legal copy, the service registry content, per-step microcopy, the process-agent acknowledgement wording, honoring the ELD/insurance reframe.
- 🟣 Design: the stepper, per-step layouts, service-selection screen, review screen, validation/error patterns, save/resume affordances.
- 🟢 Dev: `applications` + `filings` tables, the service registry (`lib/services-registry`), dynamic step machine, autosave, server+client validation, carrier-data diff tracking, resume.
Dependencies: M2 (accounts). Gate: a logged-in client completes a multi-service application end-to-end (no payment), data persists + resumes, only required steps show, diffs flagged, no fabricated/contradictory pricing surfaced.

### Build note (Dev, 2026-06-25) — BUILD-COMPLETE
**Shipped (`dev/**`):**
- **`lib/services-registry.ts`** — the typed catalog driving pricing/steps/timelines. Prices ONLY from `services.md`; UCR is service-fee $100 + a separate government bracket (0-2 $46 … 21-100 $963), >100 = manual review; DQ is per-driver; MC includes USDOT (USDOT line = $0 when both selected); `eld`/`insurance` are `informationalOnly` (never billed, no filing). `computePricing()` returns lines + subtotal/total with government fees disclosed per line, never summed in.
- **Migration `0003`** applied to prod `pqbynaaihauifomfhcxo` (pre-flight clear, no orphan `application_id`): `applications` + `filings` (owner-only RLS; filing-status writes are back-office, no client write policy), plus the `carrier_snapshots.application_id` FK.
- **Dynamic stepper** (`lib/apply/steps.ts`): active steps = union of selected services' `requiredSteps` in canonical order, with `passenger`/`hazmat` conditional on the operations flags. `zod` schemas per step (`lib/apply/schemas.ts`), re-validated server-side.
- **Carrier diff** (`lib/apply/diff.ts`, ported from boc3 `motus-diff`): identity edits set `carrier_data_changed` + `carrier_user_diff_json` + `needs_mcs150_update`; an MCS-150 prompt offers one-click add. OA-aware hints from the R3 snapshot (e.g. "BOC-3 already active"). New-entrant path has no snapshot/diff.
- **Engine** (`/apply` + `/apply/[applicationId]`, authed + noindex): create (cold, or from a lookup lead/token, or the dashboard), service selection, dynamic per-step forms with server-action autosave + `current_step` resume, review with server-computed pricing, and one `filings` row per billable service on submit (status `not_started`, or `manual_review` for quote/UCR-101+). Entry points wired: homepage card → `/apply/?service=usdot`, lookup docket "Start an application" (carries the lead token), dashboard per-lookup + applications list.

**Verified (real code + prod DB):** pricing for a 6-service cart = **$1,575** exactly (MC $600 + USDOT $0 included + BOC-3 $100 + UCR $100 [6-20, gov $276] + DQ $600 [3×$200] + IFTA $175); ELD/insurance excluded from priced lines; UCR 150 units → manual review; step conditionals correct (BOC-3 shows only its steps; MC+hazmat includes operations+hazmat not passenger; DQ shows drivers). Prod DB: owner inserts/reads own application + filings; **RLS isolation confirmed** (a second user and anon read 0 of both); client cannot write filing status (0 rows). `/apply` noindex + sitemap-excluded; logged-out → `/login`; home prerendered + bundle unaffected; build clean. Test users/applications created against prod were deleted.

**Deferred to the consolidated QA ledger (deploy-time only):** Lighthouse on `/apply/*`; the full browser click-through of the multi-step flow with a real signed-in session (needs the auth redirect-URL allowlist from the M2 deferral — the engine's pricing/steps/RLS are verified by the real code + prod DB above).

### M3-R1 LANDED (Dev, 2026-06-25) — full-package bundle
Added the advertised `$1,350` full compliance package to the registry (`priceKind: "package"`, `includes` MC, BOC-3, UCR, Clearinghouse, consortium, drug test; `govFeesIncluded` covers the MC FMCSA fee + UCR 0-2 gov fee). `computePricing` now de-dups constituents (selecting the package never double-charges them), prices the bundle at a flat $1,350, discloses the **UCR government-fee difference** separately when the carrier is above the 0-2 bracket (never absorbed/overcharged; 101+ → manual on the UCR portion), and emits one filing per constituent (price 0, package-covered) so M5 still tracks each. A non-blocking OA-aware hint suggests à la carte when the carrier already holds an active authority/BOC-3. Verified against the real code: package selection quotes exactly $1,350 and produces the 6 constituent filings; prices trace to `services.md`; ELD/insurance still excluded.

---

## M4 — Payment capture · STATUS: BUILD-COMPLETE (Dev-led) — work order `work-orders/M4-dev.md`
> First money-touching milestone: `/security-review` mandatory before build-complete. Stripe (TEST mode) server-priced from the registry, idempotent webhook → `payments.paid` + `applications.paid` + `filings.queued`, migration `0004`. **OPEN DECISION (confirm with owner before charge totals): does Tech Rig collect government fees or only service fees?** (`services.md` shows gov fees separately; the $1,350 package includes MC + UCR-0-2 gov — so those ARE collected.) Can run alongside M3-R1.
Goal: take payment for selected services, server-priced, with a reliable paid state.
- 🔵 SEO: confirm every price/label against `seo/context/services.md`; refund/terms copy; receipt copy.
- 🟣 Design: payment screen, order summary, success/receipt, failure states.
- 🟢 Dev: Stripe (intent/checkout — pick one), server-side pricing engine (UCR tiers, add-ons, 101+ manual review), webhook (signature-verified, idempotent), `payments` table, verify-on-return, coupon support.
Dependencies: M3 (services selected to price). Gate: a real test-mode payment succeeds → `payments.paid` + application `paid`; webhook idempotent; amount provably from `services.md`; no PII in metadata/logs; `/security-review` passed on the payment path.

### Build note (Dev, 2026-06-25) — BUILD-COMPLETE
**Owner decision (2026-06-25):** charge **service fees only** for à-la-carte; government/state fees are shown as separate disclosed lines and paid by the customer directly. The $1,350 package keeps its included MC + UCR-0-2 gov fees (collected as the fixed price). The charge total = `computePricing.total`.
- **Stripe shape:** PaymentIntent + embedded `PaymentElement` (in-site UX, boc3 pattern) — chosen for a cohesive flow; Stripe loads only on the payment route (isolated from every other bundle).
- **Migration `0004`** applied to prod (pre-flight clear): `payments` (owner-**read** RLS only; all writes service-role/webhook — clients never write payment state). Stripe deps added.
- **`/api/checkout`** — auth + ownership (owner-scoped load), rate-limited, **server-priced** from the registry (client never sends an amount), idempotency key = `hash(applicationId | sorted services | amount)`, metadata = `applicationId` + `reference_id` only (no PII). Persists a `payments` row.
- **`/api/stripe-webhook`** — signature-verified (raw body), idempotent source of truth: on `payment_intent.succeeded` → `payments.paid` + `applications.paid` + that app's `filings` → `queued` (skipped if already paid). Keys off the persisted `payments` row's `application_id`, not the metadata.
- **UI:** payment step after review (order summary + Stripe Element + total), verify-on-return success/receipt page (retrieves the intent), failure retry. All authed + noindex. Submit routes to `/pay` when there's a chargeable total.

**Verified (Stripe TEST mode + prod DB + live webhook):** TEST card → intent `succeeded` → signed webhook → `payments.paid` + `applications.paid` + `filings.queued`; **replay is idempotent** (one paid, same `paid_at`); **bad signature → 400**; checkout without a session → 401; a client JWT cannot write `payments` (403); payment routes carry `X-Robots-Tag: noindex`; **Stripe is absent from the home bundle** (isolated to the pay-route chunk). Test users/apps/payments created on prod were deleted; TEST-mode Stripe only.
**`/security-review` run — CLEAN** (no high-confidence findings on the payment/auth paths: webhook authenticity, server pricing, ownership/RLS, no-PII metadata, payments write-locked all verified).

**Deferred to the consolidated QA ledger (deploy-time only):** registering the live Stripe **webhook endpoint** on the deployed origin, **live keys**, the real-card path, and Lighthouse on the payment route.

---

## M5 — Progress tracking + filing lifecycle + back-office · STATUS: PLANNED
Goal: clients see each filing's real status; the team advances it.
- 🔵 SEO: status labels + the client-visible status descriptions (plain, Grade-8), what each stage means.
- 🟣 Design: the progress tracker (repurpose `AuthorityStatusTracker`?), per-filing status chips/timeline, the admin status board.
- 🟢 Dev: `filing_events`, status transition API (admin-guarded), the `(admin)` board, client read views, MOTUS-diff/`needs_mcs150` surfacing, status-change triggers.
Dependencies: M3 (filings exist), M2 (auth for admin). Gate: an admin advances a filing → the client dashboard reflects it + a timeline entry; RLS prevents client writes; admin actions audited.

---

## M6 — Email lifecycle + documents · STATUS: PLANNED
Goal: the full lifecycle email engine + PDF documents.
- 🔵 SEO/brand: all email copy (welcome, reminders, coupon, final per-service variants, status updates), PDF legal text.
- 🟣 Design: email layout/branding, document/receipt visual.
- 🟢 Dev: Resend integration, cron (`vercel.json`), `*_sent_at` idempotency guards, per-service final email selection, `pdf-lib` acknowledgement + answers PDFs, Supabase Storage `documents`, coupon issuance at 72h.
Dependencies: M4 (paid events), M5 (status events). Gate: each trigger fires exactly once, guarded; PDFs generate + attach; reminders never sent to paid leads; deliverability tested.

---

## M7 — Migration, redirects, launch hardening · STATUS: PLANNED
Goal: cut over from the legacy subdomains and harden.
- 🔵 SEO: fold the new routes + subdomain redirects into the crawl-union (orchestration L1); confirm no ranking URL regresses; same-domain GA4 events.
- 🟣 Design: final QA of every state on real devices.
- 🟢 Dev: 301/308 `form.techrig.org`→`/apply/`, `boc-3.techrig.org`→`/apply/?service=boc-3`; legacy data drain-or-ETL (decision); load/rate-limit test; full `/security-review`; Sentry on.
Dependencies: M1–M6 gates. Gate: 0 unexpected 404s across the unioned URL set; one-hop redirects; security review clean; legacy apps drained; analytics verified.

---

## Cross-cutting (every milestone)
- **Standards:** no fabricated FMCSA/metric data (show "not on file"); no em dashes; pricing only from `services.md`; honor the ELD/insurance reframe.
- **Performance:** never regress the marketing homepage; load Stripe/PDF/signature only where needed.
- **Security:** RLS + rate limits + signature verification from the first DB write; `/security-review` before M4 and M7 ship.
- **DB migration policy (owner, 2026-06-25): standing authorization for ADDITIVE migrations.** The dev session may apply additive migrations (new tables/columns/indexes/policies only) to the prod project `pqbynaaihauifomfhcxo` after the read-only pre-flight existence check, with no per-migration approval. Any `DROP`/`ALTER` touching an existing table, or anything affecting the legacy `registrations`/`boc-3-new` data, requires explicit owner sign-off (stop and escalate). Every migration still: runs pre-flight first, is reversible/idempotent where possible, and is logged in its milestone build note.
- **Docs discipline:** each milestone updates its work order with "what shipped" + opens the next; the orchestrator keeps this page and `../orchestration-status.md` in sync. No silent scope changes.

## Status ledger
| M | Title | Status | Build-complete | Deploy-checks cleared |
| --- | --- | --- | --- | --- |
| M0 | Foundation | infra confirmed | partial | n/a |
| M1 | Hero lookup + lead capture | BUILD-COMPLETE (R1-R3 landed) | yes | no (→ QA ledger) |
| M2 | Accounts + dashboard shell | BUILD-COMPLETE | yes | no (→ QA ledger) |
| M3 | Unified application engine | BUILD-COMPLETE (+ R1 bundle work order issued) | yes | no (→ QA ledger) |
| M3-R1 | Full-package bundle | ACTIVE | no | no |
| M4 | Payment capture | BUILD-COMPLETE | yes | no (→ QA ledger) |
| M5 | Progress tracking + back-office | PLANNED | no | no |
| M6 | Email lifecycle + documents | PLANNED | no | no |
| M7 | Migration + hardening | PLANNED | no | no |

## Consolidated pre-launch QA ledger
Per the deploy policy, deploy-time-only checks accumulate here and run once at the end (together with Workstream A's launch gate — `../orchestration-status.md` L1/L4). Nothing here blocks milestone progress.
- **M1:** QCMobile backup failover on a real IP (sandbox 403 from `mobile.fmcsa.dot.gov`; confirm webKey activated), Vercel KV reference counter + rate-limit on real Upstash, Lighthouse perf/CLS on `/` and `/lookup/[usdot]/`.
- **M2:** prod auth redirect-URL allowlist in Supabase Auth (add the launch domain's `/auth/callback`); real magic-link email deliverability + the full sign-in click-through on the deployed origin; Lighthouse on the authed routes (`/login`, `/dashboard`, `/account`).
- **M3:** Lighthouse on `/apply/*`; the full multi-step click-through with a real signed-in session (depends on the M2 auth redirect-URL allowlist).
- **M4:** register the live Stripe webhook endpoint on the deployed origin; live Stripe keys; real-card path; Lighthouse on `/apply/[id]/pay`.
- (M5+ deploy-time items appended as each milestone reaches build-complete.)
