# M3 Work Order — Dev

Milestone: M3 — Unified application engine. Lane: Dev-led (ADR-5/-8: noindex, existing design system).
Reads: `../00-overview.md`, `../01-architecture.md`, `../02-data-model.md` (`applications`, `filings`, service registry), `seo/context/services.md` (the ONLY pricing source), the M1/M2 build notes, and the legacy `techrig-form` (9-step form) + `boc3-form-new` (`shared/pricing.ts`, `shared/motus-diff.ts`, `shared/service-timeline.ts`) for porting. Writes: `dev/**` + a build note to `../03-roadmap.md` M3.

Goal (ADR-3): one service-driven multi-step application. The client (logged in, from M2) starts an application, optionally pre-filled by a USDOT lookup, **selects the services they need**, and only the steps those services require render. Autosave + resume tied to the account. No payment yet (M4) — but pricing is computed and shown. The end state is a complete, reviewable application with one `filings` row per selected service, ready for M4 to charge.

This replaces BOTH legacy flows with a single engine: the `techrig-form` 9-step onboarding and the `boc3-form-new` lookup→checkout become services + steps inside this one machine. Do not port either as a standalone flow.

## 0. Dependencies + infra
- Depends on **M2** (accounts: `applications.user_id` ties to `auth.users`; the engine is behind auth) and **M1** (`carrier_snapshots` pre-fill, `leads`). Prod project `pqbynaaihauifomfhcxo`.
- Standing authorization covers the additive parts of migration `0003`. It also adds a FK on `carrier_snapshots.application_id` → `applications` — that is an `ALTER` on our own M1 table (not legacy); permitted, but pre-flight that no orphan `application_id` values exist first. No legacy table is touched.
- No preview deploy (owner policy). Verify locally + against the prod DB; deploy-time items → the QA ledger.

## 1. Service registry — build this FIRST (`lib/services-registry.ts`)
The typed catalog that drives pricing, steps, and timelines. One entry per `service_key`:
`{ key, name, blurb, price | priceFn(ctx), ucrTiered?, requiredSteps: StepKey[], expectedTimeline, govFeeNote?, isNewRegistration? }`.
- **Services to include** (compliance catalog; confirm the live set + every price/tier against `seo/context/services.md` — do NOT hardcode a price that contradicts it, do NOT fabricate one): `usdot`, `mc-authority`, `boc-3`, `ucr` (tiered by power units), `mcs-150`, `clearinghouse`, `consortium`, `dq-files`, `drug-test`, `irp`, `ifta`, `trucking-llc`. Some are flat price, some are "contact for quote" (e.g. LLC, per services.md), one is a bundle ("full package"). UCR uses power-unit brackets from the official schedule (already reflected in `ucr-registration.md`); 101+ units = manual review, never an auto price.
- **Compliance reframe (HARD RULE):** `eld` and `insurance` are NOT billable Tech Rig filings. ELD = partner referral; insurance = coordinate-only. The registry may surface them as informational/coordination add-ons with no Tech Rig price, never as a priced `filing`. Re-read `../../shared/work-order-eld-insurance.md`; do not reintroduce "we file your insurance" / "we set up your ELD".
- Port the UCR tier logic and the service-timeline map from `boc3-form-new` (`shared/pricing.ts`, `shared/service-timeline.ts`); keep prices sourced from `services.md`.
- `requiredSteps` is what makes the stepper dynamic (§4) — map each service to the data it needs.

## 2. Migration `0003` — `applications` + `filings`
Per `02-data-model.md`. Additive (+ the one FK noted in §0).
- **`applications`**: `id`, `user_id`→auth.users, `lead_id`→leads (nullable), `reference_id` unique (carry the lead's `DGR-` ref if started from a lookup, else mint a new one), `status` ('draft'|'in_progress'|'awaiting_payment'|'paid'|'in_fulfilment'|'completed'|'cancelled'), `current_step`, `selected_services jsonb`, carrier identity columns (`company_legal_name`, `dba`, `usdot_number`, `mc_number`, `entity_type`, `power_units`), diff columns (`carrier_data_changed bool`, `carrier_user_diff_json jsonb`, `needs_mcs150_update bool`), `application_data jsonb` (per-step payload — see §3), `signature_name`, `terms_accepted_at`, `subtotal`, `total_amount`, lifecycle timestamps. `updated_at` trigger.
- **`filings`**: `id`, `application_id`→applications, `service_key`, `service_name`, `price_amount`, `ucr_tier`, `status` ('not_started'|'awaiting_info'|'queued'|'filed'|'active'|'completed'|'manual_review'|'cancelled') default 'not_started', `expected_timeline`, `filed_at`, `completed_at`, timestamps.
- **RLS:** owner (`user_id = auth.uid()`) read/write their own applications; filings readable by the owning application's user; writes to filing **status** are back-office only (M5) — for M3, filings are created/priced by the server (service role) when services are selected, and the client does not mutate status. Indexes on `user_id`, `application_id`, `reference_id`, `status`.

## 3. Application data shape (resolve the M0 open question)
Use **`application_data jsonb` keyed by step**, each step's payload validated by a `zod` schema (zod is already a dep). Promote only high-value/queryable fields to real columns (already done above: usdot, status, totals, selected_services, carrier identity). Rationale: the step set is dynamic per service, so a fixed 100-column table (the legacy `registrations` shape) is the wrong fit. Keep PII (EIN/SSN) encrypted at rest or tokenized; never log it; never put it in client bundles or Stripe metadata (M4).

## 4. Dynamic stepper / state machine
- The rendered steps = the **union of `requiredSteps`** across `selected_services`, in a fixed canonical order, plus conditional steps:
  - **Passenger operations** step shows only if the operations step flags passenger vehicles.
  - **Hazmat** step shows only if operations flags hazmat.
  (Port the conditional show/hide + skip-forward/skip-back logic from `techrig-form`.)
- Canonical step order (render only those required): `services` (selection) → `carrier-identity` → `business-details` → `operations` → `passenger` (cond) → `hazmat` (cond) → `vehicles` → `drivers` → `ucr-details` (if UCR) → `service-specifics` (e.g. BOC-3 process-agent acknowledgement, MCS-150 update reason) → `review` → (M4 payment).
- Progress indicator reflects only the active step set. Forward/back preserve data. `current_step` persisted for resume.

## 5. Per-step forms + validation
Rebuild the field sets in the existing design system (do not lift legacy markup). Source the field lists from the `techrig-form` FormStep components and the `boc3` payment page; map each to a step:
- **carrier-identity:** legal name, DBA, USDOT, MC, physical/mailing address, power units — pre-filled from the snapshot (§6).
- **business-details:** legal entity type, formation state, ownership, EIN/SSN (country-aware), DOT/MC as applicable.
- **operations:** interstate/intrastate, for-hire/private, vehicle types, hazmat flag, passenger flag.
- **passenger** (cond) / **hazmat** (cond): port the passenger fields and the 9×4 hazmat grid.
- **vehicles:** equipment counts (owned/leased), cargo types.
- **drivers:** driver counts by region, CDL totals.
- **ucr-details:** power-unit count → tier (drives UCR price).
- **service-specifics:** BOC-3 process-agent acknowledgement wording (regulated text — keep the exact FMCSA phrasing already used on-site), MCS-150 update trigger.
- **review:** read-only summary of services, data, and computed pricing; `signature_name` + terms acceptance.
Validation: `zod` schemas shared client + server; re-validate every save server-side; clear, accessible field errors per the design system.

## 6. Carrier pre-fill + diff tracking (port `boc3` `motus-diff`)
- If the application started from a lookup, pre-fill carrier-identity from the immutable `carrier_snapshots.data_json`.
- On submit of carrier-identity, diff the user's values against the snapshot (fields: companyName, usdotNumber, physicalAddress, powerUnits). Set `carrier_data_changed`, populate `carrier_user_diff_json` (`[{field,label,snapshotValue,userValue,changed}]`), and set `needs_mcs150_update = carrier_data_changed && !selected_services.includes('mcs-150')`. Surface the MCS-150 prompt (the boc3 `Mcs150Modal` behavior) so the client can add the update.
- **New-entrant / no-USDOT path:** no snapshot to diff against; carrier identity is hand-entered; USDOT/MC services are treated as new registrations (`isNewRegistration`), not updates. No diff/MCS-150 logic.

## 7. Autosave + resume
- Autosave each step (on Next, and/or debounced) to `applications` via owner-scoped writes (RLS). Update `current_step`.
- Resume: loading `/apply/[applicationId]/` (authed, noindex) rehydrates the saved state and lands the client on `current_step`. A client may have multiple applications; the M2 dashboard lists them and links here.

## 8. Entry points
- From the M1 results page `/lookup/[usdot]/`: the "Start an application" CTA creates an application linked to that lead + snapshot and routes into the engine. (If the visitor is not logged in, send them through M2 auth first, claim the lead, then start.)
- From the M2 dashboard: "Start an application" (cold, may begin with an optional USDOT lookup or the no-USDOT path).
- The homepage "Don't have a USDOT number? File for one now" link's final target flips from the interim `/dot-registration/` to `/apply/?service=usdot` now that the engine exists (update the M1 card link).

## 9. Pricing (display only in M3)
- Compute subtotal/total **server-side** from the registry + `services.md` (UCR tier resolved from power units). Show it on the review screen and a running summary. **Do not charge** — M4 wires Stripe. Persist `subtotal`/`total_amount` at review time for M4 to reuse.
- Create one `filings` row per selected service at status `not_started` with its `price_amount`, `ucr_tier`, and `expected_timeline` from the registry. These feed M5 progress tracking.

## 10. Indexing
All `/apply/*` routes noindex (`robots:{index:false,follow:false}`) and absent from `sitemap.xml`. Keep heavy form/validation code off the marketing bundle.

## 11. Design
Reuse the locked system (ADR-8): stepper, form controls, review layout from existing tokens/components. A multi-step form is new surface but uses the existing language; escalate to Design only for a genuinely new pattern, flagging the orchestrator rather than inventing one.

## Suggested build order
1. `lib/services-registry.ts` (+ port pricing/timeline). 2. Migration `0003` + RLS. 3. The state machine + step routing (no fields yet). 4. Carrier-identity + diff (§6). 5. The remaining steps + zod. 6. Autosave/resume. 7. Service-selection + review + server pricing + filings creation. 8. Entry points + flip the M1 card link.

## Acceptance gate
**Verifiable now (local + prod DB) — required for M3 build-complete:**
- A logged-in client starts an application, selects multiple services, and ONLY the required steps render (passenger/hazmat conditionals correct).
- Completes end-to-end with NO payment; data persists and **resumes** across sessions on the right step; multiple applications per user supported.
- Carrier pre-fill from the snapshot works; edits set the diff + `needs_mcs150_update` correctly; the new-entrant path works with no snapshot.
- One `filings` row per service created with registry price/tier/timeline; subtotal/total computed server-side and match `services.md` (no fabricated or contradictory prices; UCR tier correct; 101+ = manual review).
- ELD/insurance never appear as priced filings.
- RLS verified (a user cannot read/write another user's application/filings); all `/apply/*` noindex + sitemap-excluded.
- Marketing site + bundle unaffected.

**Deferred to consolidated pre-launch QA (no preview):** Lighthouse on `/apply/*`, and any real-domain/email behaviors. Log to the QA ledger.

## Commit scope
Commit only `dev/**` and the M3 roadmap note. Never `git add .`.
