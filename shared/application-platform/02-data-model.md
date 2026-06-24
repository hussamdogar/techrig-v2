# Application Platform — Unified Data Model

Owner: orchestrator, for Dev. Status: PLANNING (schema proposal, not migrated).
Generalizes the legacy `registrations` (techrig-form) and `boc-3-new` (boc3-form-new) tables into a normalized, account-aware model that supports the dashboard and progress tracking. Dev finalizes column types and writes the SQL migrations per milestone; this is the target shape and the rationale.

Design principles: (1) one client can have many applications; one application has many filings. (2) Capture leads anonymously, claim into an account later. (3) Keep the immutable carrier snapshot separate from user-entered data (boc3 data-separation pattern). (4) Pricing is server-derived, never stored from the client. (5) RLS on every client-readable table.

## Entities (relational map)
```
auth.users 1───1 profiles
profiles   1───* applications        (a profile may be null until claimed)
applications 1───* filings           (one row per selected service)
applications 1───1 carrier_snapshot  (the MOTUS pull at lookup time)
applications 1───* payments          (usually one, but allow many for retries/add-ons)
leads        *───1 applications       (a lead may convert into an application)
filings      1───* filing_events     (status history → the progress timeline)
```

## Tables

### profiles
1:1 with `auth.users`. Created on first login.
- `id` uuid PK = `auth.users.id`
- `email`, `full_name`, `phone`
- `created_at`, `updated_at`
- RLS: owner read/write own row; admin all.

### leads
The front-door capture (M1). Anonymous-allowed.
- `id` uuid PK
- `user_id` uuid FK→profiles, NULL until claimed
- `usdot_number` text (validated `^\d{1,12}$`, nullable for "no USDOT" path)
- `source` text ('hero_lookup' | 'no_usdot_file_now' | 'apply_direct')
- `lookup_status` text ('started' | 'success' | 'not_found' | 'manual_required')
- `email`, `phone`, `full_name` text (captured progressively)
- `reference_id` text (unified scheme, see below)
- `access_token_hash` text (HMAC token for pre-account resume; store hash, not token)
- `welcome_email_sent_at`, `reminder_24h_sent_at`, `reminder_72h_sent_at` timestamptz
- `created_at`, `updated_at`
- RLS: insert allowed anon; select/update via valid token (pre-account) or owner (post-claim); admin all.

### carrier_snapshots
Immutable MOTUS/FMCSA pull (boc3 `motus_data_json`).
- `id` uuid PK
- `lead_id` / `application_id` FK
- `usdot_number` text
- `data_json` jsonb (normalized CarrierData: legal name, DBA, address, entity type, authority status, safety rating, insurance on file, power units, officers)
- `source` text ('motus' | 'qcmobile' | 'manual')
- `fetched_at` timestamptz
- Write-once; never updated. RLS read: owner/admin.

### applications
One engagement. Generalizes `registrations`.
- `id` uuid PK
- `user_id` uuid FK→profiles (NULL until claimed)
- `lead_id` uuid FK→leads (origin)
- `reference_id` text unique
- `status` text ('draft' | 'in_progress' | 'awaiting_payment' | 'paid' | 'in_fulfilment' | 'completed' | 'cancelled')
- `current_step` text / int (for resume)
- `selected_services` jsonb (array of service keys — drives which steps render and pricing)
- **carrier identity** (editable, pre-filled from snapshot): `company_legal_name`, `dba`, `usdot_number`, `mc_number`, `entity_type`, `power_units`
- **diff tracking** (boc3 pattern): `carrier_data_changed` bool, `carrier_user_diff_json` jsonb, `needs_mcs150_update` bool
- **business/contact/address/tax** blocks: store as structured `application_data jsonb` keyed by step rather than 100 flat columns — cleaner than the legacy flat table, and the step set is now dynamic. (Sensitive tax IDs: encrypt at rest or tokenize; never in logs.)
- `signature_name`, `terms_accepted_at`
- pricing: `subtotal`, `total_amount` (server-computed, recorded at checkout time for audit)
- lifecycle: `started_at`, `submitted_at`, `completed_at`, `created_at`, `updated_at`
- RLS: owner read/write; pre-account via token; admin all.

> Note on `application_data jsonb` vs flat columns: the legacy `registrations` table had ~100 columns because it was one fixed form. With a dynamic service-driven engine, a per-step JSONB payload (validated by a schema) is the better fit. Dev confirms in the M3 work order; if reporting/queryability demands it, promote high-value fields (USDOT, status, totals) to real columns (already done above) and keep the long tail in JSONB.

### filings
One row per service in an application — the unit the dashboard tracks.
- `id` uuid PK
- `application_id` uuid FK
- `service_key` text ('boc-3' | 'mc-authority' | 'usdot' | 'ucr' | 'clearinghouse' | 'consortium' | 'dq-files' | 'drug-test' | 'mcs-150' | …)
- `service_name` text (display)
- `price_amount` numeric (server-computed; UCR tier resolved here)
- `ucr_tier` text (nullable)
- `status` text ('not_started' | 'awaiting_info' | 'queued' | 'filed' | 'active' | 'completed' | 'manual_review' | 'cancelled')
- `expected_timeline` text (e.g. BOC-3 ~24h, clearinghouse ~5d — from the service registry)
- `filed_at`, `completed_at`, `created_at`, `updated_at`
- RLS: owner read; admin read/write (status advancement is back-office).

### filing_events
Status history → renders the client-facing progress timeline (the dashboard tracker).
- `id` uuid PK
- `filing_id` uuid FK
- `from_status`, `to_status` text
- `note` text (admin-visible; client sees a curated subset)
- `actor` text ('system' | 'admin:{id}' | 'webhook')
- `created_at` timestamptz
- RLS: owner read (curated); admin all.

### payments
- `id` uuid PK
- `application_id` uuid FK
- `stripe_payment_intent_id` / `stripe_checkout_session_id` text
- `amount`, `currency`, `status` ('created' | 'processing' | 'paid' | 'failed' | 'refunded')
- `idempotency_key` text
- `paid_at`, `created_at`, `updated_at`
- `coupon_code` text (72h reminder coupon, nullable)
- RLS: owner read; webhook/admin write (service role).

### documents (M6)
- `id` uuid PK, `application_id` FK, `filing_id` FK (nullable)
- `kind` text ('acknowledgement_pdf' | 'answers_pdf' | 'receipt' | 'uploaded')
- `storage_path` text (Supabase Storage), `created_at`
- RLS: owner read; admin all.

## Reference ID scheme (unify the two legacy formats)
Adopt one: `TR-YYYYMMDD-NNNN` (Tech Rig prefix + date + daily counter via Vercel KV, like boc3's `DGR-` scheme but on the TR brand). One per lead and carried to its application. Human-readable, sortable, support-friendly. Decide the prefix with the client (TR vs DGR) in M1.

## Service registry (single source feeds pricing + steps + timelines)
A typed registry (`lib/services-registry.ts`) mapping each `service_key` →
`{ name, price | priceFn(powerUnits), requiredSteps[], expectedTimeline, govFeeNote }`.
- Prices come from `seo/context/services.md` (the only pricing source — standards.md). Do not hardcode prices that contradict it.
- `requiredSteps` drives the dynamic stepper (ADR-3). E.g. selecting `ucr` adds the power-unit/truck-count step; `mc-authority` adds business + tax steps; `boc-3` needs the process-agent acknowledgement.
- Honors the compliance reframe: no `eld`/`insurance` as billable Tech Rig filings — ELD is a partner referral, insurance is coordinate-only (see `work-order-eld-insurance.md`). The registry may list them as informational, never as a priced filing.

## Migration note
Do NOT lift the legacy tables verbatim. Re-derive this normalized model and write fresh migrations. If legacy in-flight data must be carried over (decision in M7), write a one-time ETL from `registrations`/`boc-3-new` into `applications`/`filings`/`carrier_snapshots`; default plan is to drain legacy and start clean.
