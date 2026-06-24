# Application Platform — Architecture

Owner: orchestrator, for Dev. Status: PLANNING. Implements the ADRs in `00-overview.md`.
This is the system design reference. Dev refines specifics per milestone; nothing here is built yet.

## 1. High-level shape
One Next.js 16 App Router app on techrig.org, two concerns under one roof:
- **Marketing layer** (exists): prerendered SEO pages. Unchanged except the hero gains the lookup card.
- **Application layer** (new): dynamic, DB-backed, authenticated. Route handlers + server actions + Supabase.

```
techrig.org (Next.js 16, App Router, Vercel)
├── (marketing)        existing SEO pages — static/prerendered
├── lookup/            USDOT lookup landing (also embedded as the hero card)
├── apply/             unified application engine (service-driven steps)
├── dashboard/         authenticated client home (applications, filings, progress, docs)
├── account/           profile, auth callbacks
├── (admin)/           back-office: advance filing statuses, review MOTUS diffs
└── api/
    ├── lookup-usdot/      MOTUS fetch + normalize + lead insert (rate-limited)
    ├── leads/             lead capture / claim-to-account
    ├── application/*      step persistence, autosave, service selection
    ├── checkout/          Stripe session/intent creation (server-priced)
    ├── stripe-webhook/    payment status + receipt emails (signature-verified)
    ├── filings/*          status transitions (admin + client read)
    └── cron/reminders/    lifecycle email scheduler (Vercel cron)
```

Rendering discipline: keep the marketing routes static; the lookup card is a small client island so the homepage stays prerendered and fast (protects Core Web Vitals and rankings — the migration prime directive). The application/dashboard/admin routes are dynamic and behind auth where appropriate.

## 2. Integration with the marketing site (ADR-1)
- The **hero card** is a client component embedded in `app/page.tsx`, calling `/api/lookup-usdot`. It must not block prerender or shift layout (reserve space; no CLS).
- The existing `components/authority-status-tracker.tsx` is the hero's current right-column visual and is a progress-tracker by metaphor. Design decides whether the lookup card replaces it, sits beside it, or whether the tracker is repurposed as the dashboard's real progress component. SEO owns the hero composition decision (it changes home layout/signals).
- **Subdomain migration:** `form.techrig.org` → `/apply/`, `boc-3.techrig.org` → `/apply/?service=boc-3` (or a `/lookup/` entry). 301/308, one hop. Add to the migration crawl-union (orchestration L1). Decide whether any in-flight legacy records must be migrated or simply drained before cutover (default: drain — let open legacy sessions finish on the old apps, then cut DNS).

## 3. Auth (ADR-2)
- Supabase Auth, email magic-link primary (password optional). `profiles` table 1:1 with `auth.users`.
- **Anonymous-first:** a lookup or started application creates a `lead`/`application` with no user. At sign-up/login the client **claims** their lead via the signed lookup token, linking it to their `user_id`.
- RLS everywhere: clients read/write only their own `applications`/`filings`/`payments`; admins use the service role behind the `(admin)` routes (never expose the service key to the browser).
- Keep the legacy **signed-token** pattern (HMAC, short TTL) ONLY for the pre-account window (resume-by-link from a lifecycle email before the client has made an account). After account creation, auth session governs access.

## 4. USDOT lookup + FMCSA data
- Source: **MOTUS** (`motus.dot.gov/api/carriers/{usdot}` then `/api/public-registration-matrix/{entityId}`), as used by `boc3-form-new`. Port the `normalizeMotusMatrixResponse()` shape into a shared `lib/motus` module.
- **M1 spike (Dev):** verify MOTUS endpoints are still reachable from Vercel, whether they need auth/keys/allow-listing, rate/usage limits, and latency. If MOTUS is unavailable or gated, fall back to the FMCSA QCMobile / SAFER web service (requires a free webKey). Record the chosen source + keys in the env table. Do not block the card UI on a single provider — design `lib/motus` behind an interface.
- Store the raw normalized pull as an immutable **carrier snapshot**; user edits are diffed against it (the boc3 `motus_user_diff` / `needs_mcs150_update` pattern) so the back-office knows when an MCS-150 update is implied.
- Display fields on the card result: legal name, USDOT/MC, entity type, operating authority status, safety rating, insurance-on-file, power units. Never invent a field MOTUS did not return; show "not on file" rather than a fabricated value (standards.md).

## 5. Payment
- Stripe. Standardize on **PaymentIntent + embedded Elements** (boc3 pattern) for in-site UX, or Checkout Session (techrig-form pattern) if a hosted page is preferred — Dev picks one and uses it everywhere. Decision logged in the M4 work order.
- **Server-side pricing only.** The client never sends the amount; the server computes it from selected services + the pricing source. Pricing values come exclusively from `seo/context/services.md` (single source — qa-report §C6). UCR is tier-based (power-unit brackets); 101+ units = manual review, not an auto price.
- Idempotency key = hash of (applicationId | services | amount). Webhook verifies signature, updates `payments` + `filings`, sends receipt once (dedup flag), and is the source of truth for paid state (never trust the client redirect alone — poll/verify like the legacy thank-you page).

## 6. Email lifecycle (Resend)
- Triggers: welcome (lead created), payment confirmation (webhook), 24h + 72h reminders (cron, only if unpaid; 72h carries a coupon), final per-service email with PDF attachments (application completed), and **status-change notifications** (new — filing advanced in the dashboard).
- Cron via `vercel.json` (legacy ran daily 22:00 UTC). Idempotent: every send guarded by a `*_sent_at` timestamp; never send if already paid/sent. Rate-limited per recipient.
- Copy is brand/SEO-owned; Dev owns the send mechanics and the timestamp guards. PDFs (acknowledgement + answers) ported from `lib/pdfGenerator`.

## 7. Security & abuse
- Rate limit every public endpoint (lookup, lead, checkout) — Vercel KV primary, in-memory fallback (legacy pattern). Lookup was 20/15min/IP.
- Webhook signature verification (Stripe). Input validation server-side on every route (USDOT `^\d{1,12}$`, email regex, etc.). No PII (SSN/EIN) in logs, Stripe metadata, or client bundles. Encrypt tax IDs at rest if stored.
- A security review (the `/security-review` pass) is mandatory before the payment + auth milestones ship.

## 8. Environment / third-party (provision before M2–M4)
| Var | Service | Needed by |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase (DB + Auth) | M1 (DB), M2 (Auth) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | M4 |
| `RESEND_API_KEY` | Resend | M6 (and welcome email in M1 if desired) |
| `MOTUS_*` / `FMCSA_WEBKEY` | FMCSA data source (TBD by M1 spike) | M1 |
| `KV_*` | Vercel KV (rate limit + reference counter) | M1 |
| `CRON_SECRET` | Vercel cron auth | M6 |
| `SENTRY_*` | Sentry (optional, error tracking) | any |

Reuse the existing Supabase/Vercel projects if the team already has them from the legacy apps; otherwise provision new. Confirm with the client which Stripe account receives payments.

## 9. New runtime dependencies (added to dev/package.json over the milestones)
`@supabase/supabase-js`, `@supabase/ssr` (auth in App Router), `stripe` + `@stripe/stripe-js` + `@stripe/react-stripe-js`, `resend`, `pdf-lib`, `@vercel/kv`, a signature-capture lib, optionally `zod` for validation and `@sentry/nextjs`. Keep the marketing bundle lean — load Stripe/signature/PDF only on the routes that need them (dynamic import), so the homepage stays fast.

## Appendix — legacy extraction (condensed)
Full extraction was performed against both repos on 2026-06-24.
- **techrig-form** (Next.js 15 + Supabase + Stripe Checkout + Resend + Sentry + pdf-lib): single `registrations` table (~100 cols, `step1..9_completed`), 9-step conditional form (passenger/hazmat branches), access-token resume, email automation (welcome / 24h / 72h+$100 coupon / 6 final variants w/ PDFs), reference `TR-YYYY-XXXXXX`, API `save-step1..9`, `create-checkout-session`, `stripe-webhook`, `verify-payment`, `get-registration`, `cron/email-reminders`.
- **boc3-form-new** (Vite/React + Supabase + Stripe PaymentIntent + Resend): `boc-3-new` table with the **data-separation pattern** (`motus_data_json` immutable, `user_submission_json`, `motus_user_diff_json`, `motus_data_changed`, `needs_mcs150_update`), USDOT→MOTUS lookup, UCR tier pricing + add-ons, HMAC signed tokens (7d TTL), reference `DGR-YYYYMMDD-NNN` via KV counter, idempotent Stripe, admin+customer receipt emails, a `test/` suite for pricing/tokens/diffs/normalization.
- Cloned to a temp dir for analysis; not committed. Re-clone from `github.com/hussamdogar/techrig-form` and `.../boc3-form-new` when porting specific modules.
