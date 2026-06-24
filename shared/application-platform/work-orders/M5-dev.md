# M5 Work Order — Dev

Milestone: M5 — Progress tracking + filing lifecycle + back-office. Lane: Dev-led (ADR-5/-8).
Reads: `../00-overview.md`, `../02-data-model.md` (`filings`, `filing_events`), the M3 engine + M4 payment (filings move to `queued` on paid), `components/authority-status-tracker.tsx` (reserved in M1 for exactly this). Writes: `dev/**` + a build note to `../03-roadmap.md` M5.

Goal: every filing a carrier buys gets a visible status lifecycle. Clients see real progress on their dashboard; the Tech Rig team advances each filing from a back-office board. This is what makes the platform a tracked service, not just a checkout.

## 0. Dependencies + infra
- Depends on **M4** (paid applications whose `filings` are `queued`) and **M2** (auth). Prod project `pqbynaaihauifomfhcxo`. Standing authorization covers additive migration `0005`.
- No preview deploy (owner policy): verify locally + against the prod DB; deploy-time items → QA ledger.

## 1. Admin/role model — decide + build first (the security-sensitive part)
**RESOLVED (dev, 2026-06-25): a separate `admin_users` table, NOT `profiles.role`.** Rationale (correct, overrides this work order's first suggestion): the M2 `profiles` UPDATE policy lets a client edit their own profile row, so a `role` column there would be a **self-escalation path** to admin. `admin_users` has RLS enabled with **zero policies** — unreachable by anon/authenticated; only the service role (after a server-side `isAdmin()` check) touches it. First admin seeded manually via SQL in `0005`. This is the pattern to keep. (Original guidance kept below for context.)

The back-office needs an authorization model. Add a `role` to `profiles` (`'client' | 'staff' | 'admin'`, default `'client'`) — or an `admin_users` table if you prefer; pick one and justify. The first admin is seeded manually via SQL by the team (document the seed step; do not build a self-serve admin signup). Every admin/back-office route + the status-transition API checks this server-side (never trust a client claim). **This is a privilege boundary — treat it like the M4 money path:** server-side checks only, no role in client-editable state, and note it for the M7 security review (a focused review of the admin authz now is encouraged).

## 2. Migration `0005` — `filing_events`
Per `02-data-model.md`: `id`, `filing_id`→filings, `from_status`, `to_status`, `note` (admin-visible), `actor` (`'system' | 'admin:{uuid}' | 'webhook'`), `created_at`. Additive.
- RLS: the owning application's user may **read** a curated client-visible subset; admins read all; **writes are admin/service-role only** (clients never write events or filing status). Index on `filing_id`, `created_at`.
- Also: confirm `filings` status writes are locked to admin/service-role at the DB level (M3 reserved this) — clients can read their filings, never change status.

## 3. Status lifecycle + transition API
- Lifecycle (from the data model): `not_started → queued → filed → active → completed`, with `awaiting_info`, `manual_review`, `cancelled` as side states. Define the **allowed transitions** explicitly (a small state machine) and reject anything else (422).
- `/api/filings/[id]/transition` (or a server action), **admin-guarded**, rate-limited: validates the transition, updates `filings.status` + the lifecycle timestamps (`filed_at`, `completed_at`), and writes a `filing_events` row with `actor = admin:{uuid}` + optional `note`. Idempotent on a no-op transition. All writes via the service-role path after the admin check (never client-writable).

## 4. Back-office board (`(admin)` route group, noindex)
- Admin-only list of applications + their filings, filterable by status; advance a filing through the lifecycle; add a note per transition; see the application's `carrier_user_diff` / `needs_mcs150_update` flags (from the R3 snapshot) so the team knows when an MCS-150 update is implied.
- Show the reference id, carrier, services, and payment state. Read mostly from existing tables; the only new write path is the transition API.
- Guard with the role check + middleware; noindex; never expose the service key to the browser.

## 5. Client-facing progress
- On the dashboard / an application-detail view, show each filing's **current status** (plain-language label + a short description, Grade 8 — write these in brand voice) and a **timeline** of the client-visible `filing_events`.
- **Reuse `AuthorityStatusTracker`** as the progress visual (it was kept in M1 for this). Map the filing lifecycle onto its stages. Keep it honest: show the real status, "awaiting your info" when `awaiting_info`, etc.
- Surface `needs_mcs150_update` to the client as a gentle prompt if relevant (ties to offering the MCS-150 service).

## 6. Status copy (functional, brand voice)
Provide the client-facing label + one-line meaning for each status: e.g. `queued` = "In our queue, starting soon"; `filed` = "Filed with FMCSA, awaiting processing"; `active` = "Active / approved"; `awaiting_info` = "We need something from you"; `manual_review` = "Under review". No fabricated timelines; use the registry's `expectedTimeline` as guidance, not a guarantee.

## Acceptance gate
**Verifiable now (local + prod DB):**
- An admin advances a filing `queued → filed → active → completed`; each writes a `filing_events` row with the admin actor; the client dashboard reflects the new status + timeline.
- Disallowed transitions rejected (422); no-op idempotent.
- **Authz proven both ways:** a non-admin (client) calling the transition API or the admin board is rejected; a client cannot write `filings.status` or `filing_events` (RLS, 0 rows); a client sees only their own filings/events.
- `needs_mcs150_update` / diff visible in the back-office.
- All admin + authed routes noindex + sitemap-excluded; marketing unaffected.
- The first-admin seed step is documented.

**Deferred to consolidated pre-launch QA (no preview):** Lighthouse on the admin + dashboard routes; full signed-in click-through. Log to the QA ledger.

## Commit scope
Commit only `dev/**` + the M5 roadmap note. Never `git add .`.
