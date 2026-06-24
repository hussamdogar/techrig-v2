# M2 Work Order — Dev

Milestone: M2 — Accounts + dashboard shell. Lane: Dev-led (ADR-5/-8: noindex, existing design system).
Reads: `../00-overview.md`, `../01-architecture.md` (§3 auth, §4a noindex, §8 DB of record), `../02-data-model.md` (`profiles`, `leads`), `shared/design/design-system.md`. Writes: `dev/**` + a build note to `../03-roadmap.md` M2.

Goal (ADR-2): a client can create an account and log in (magic-link), lands on a dashboard, and their anonymous M1 lookup is **claimed** into the account. No application engine yet (M3), no payment (M4). The dashboard shell shows claimed lookups and an empty "applications" state.

## 0. Target infra (no new provisioning)
Production Supabase project `pqbynaaihauifomfhcxo` ("BOC-3 Test Project" — owner-confirmed prod, ADR-6). `@supabase/ssr` + `@supabase/supabase-js` are already deps from M1. Build auth on Supabase Auth. **No preview deploy** (owner policy: nothing deploys until the whole site is complete + QA'd) — verify M2 locally against the prod project; deploy-time-only items go to the consolidated QA ledger.

## 1. Supabase Auth (magic-link primary)
- Email magic-link as the primary method (password optional, your call; magic-link satisfies ADR-2). Configure allowed redirect URLs in Supabase Auth (localhost for dev now; the prod domain is added at the QA/launch step).
- App Router session handling via `@supabase/ssr`: server client (cookies), browser client, and **middleware** that refreshes the session and guards authed routes. Never expose the service role to the browser.
- Routes: `/login` (request magic link), an auth **callback** route (`/auth/callback`) that exchanges the code for a session, and sign-out. All noindex.

## 2. `profiles` table (migration `0002`)
- Per `02-data-model.md`: `profiles` 1:1 with `auth.users` (`id` PK = `auth.users.id`, `email`, `full_name`, `phone`, timestamps).
- Create the row automatically on signup: a Postgres trigger on `auth.users` insert → insert into `public.profiles` (handle conflicts idempotently). RLS: owner read/write own row; service role all.
- Additive migration only; do not touch legacy tables or the M1 tables beyond what's needed. Same pre-flight discipline as `0001` (read-only existence check before apply); apply is authorized for the prod project, additive only.

## 3. Lead → account claim (the M1 → M2 bridge)
The M1 lookup created an anonymous `leads` row with `access_token_hash` and returned a signed `token` to the client. Claim it on auth:
- The M1 results page (`/lookup/[usdot]/`) gains a "Create an account to save & track this lookup" CTA that carries the signed lead token into the auth flow (e.g. as a `next`/state param, not the raw token in a way that logs it).
- After successful auth, a server action verifies the lead token (HMAC, unexpired), finds the matching `leads` row, and sets `user_id = auth.uid()` (only if currently null — never reassign a claimed lead). Idempotent.
- If no token is present (user just signed up cold), skip claiming; the dashboard simply shows no lookups yet.
- Verify: an anon lookup, then signup, results in that lead owned by the new user and visible on their dashboard; a second account cannot claim an already-claimed lead.

## 4. Dashboard shell (`/dashboard`, authed, noindex)
- Layout + nav built with the existing design system (paper/cloud/ink/slate/steel/signal tokens; existing container/button). Logged-out → redirect to `/login`.
- Content for M2: a list of the user's **claimed lookups** (USDOT, carrier name, authority status, looked-up date, link back to the full `/lookup/[usdot]/` docket), and an **empty "Applications" state** with a "Start an application" CTA. Interim CTA target `/dot-registration/` (or `/apply/` placeholder) until M3 lights up the engine; do not promise functionality that isn't there.
- `/account` page: view/edit profile (name, phone; email read-only), sign out.
- Empty states for a brand-new account (no lookups, no applications) must read cleanly per the design system.

## 5. Indexing + protection (ADR-5)
- Every authed route (`/dashboard`, `/account`, `/login`, `/auth/*`) sets `robots: { index:false, follow:false }` and is excluded from `sitemap.xml`. The middleware enforces auth on `/dashboard` and `/account`.
- No PII in logs. Tokens never logged. Service role server-only.

## 6. Design
Reuse the locked system (ADR-8). A dashboard is new surface area but uses existing tokens/components; only escalate to Design if a genuinely new pattern is unavoidable, and flag it to the orchestrator rather than inventing a new language.

## Acceptance gate
**Verifiable now (local + against the prod Supabase project) — required before M2 build-complete:**
- Magic-link signup/login works end-to-end locally; session persists; sign-out works.
- `0002` applied to prod (pre-flight first); `profiles` row auto-created on signup; RLS verified (a user reads only their own profile; anon reads none).
- Claim flow: anon M1 lookup → signup → lead owned by the user, shown on the dashboard; double-claim prevented.
- Dashboard + `/account` render with the existing design system; empty states clean; authed routes redirect when logged out.
- Authed routes noindex + absent from `sitemap.xml`.
- Home + marketing unaffected; no Supabase service key or PII in the client bundle.

**Deferred to the consolidated pre-launch QA (no preview yet, owner policy):** production redirect-URL allowlist in Supabase Auth, real-domain magic-link deliverability, and Lighthouse on the authed routes. Log these to the QA ledger in `../03-roadmap.md`; do not block M3 on them.

## Commit scope
Commit only `dev/**` and the M2 roadmap note. Never `git add .`.
