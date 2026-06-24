# M4 Work Order — Dev

Milestone: M4 — Payment capture. Lane: Dev-led (ADR-5/-8). **First money-touching milestone — a `/security-review` is mandatory before it ships.**
Reads: `../00-overview.md`, `../01-architecture.md` §5 (payment), `../02-data-model.md` (`payments`), `lib/services-registry.ts`, the M3 `/apply` engine, the legacy `techrig-form` (Checkout) + `boc3-form-new` (PaymentIntent + webhook + idempotency) for porting. Writes: `dev/**` + a build note to `../03-roadmap.md` M4.

Goal: take payment for a completed application's selected services, **server-priced**, with a reliable paid state and idempotent webhook. On success the application flips to `paid` and its filings move to `queued` (ready for M5 back-office). Test-mode only until the consolidated launch (no preview, owner policy).

## 0. Dependencies + infra
- Depends on **M3** (an application with selected services + server-computed total). Prod project `pqbynaaihauifomfhcxo`; reuse the existing **Stripe** account behind the legacy apps (ADR-6) in **TEST mode** for all M4 verification.
- Standing authorization covers the additive migration `0004`. No legacy table touched.

## 1. Decide the Stripe integration shape (log it)
Pick one and use it everywhere: **PaymentIntent + embedded Elements** (boc3 pattern, in-site UX — recommended) or hosted **Checkout Session** (techrig-form pattern). Record the choice + why in the build note.

## 2. Server-side pricing only (never trust the client)
- The checkout endpoint recomputes the total from the **registry** + the application's `selected_services` (incl. the M3-R1 package logic and UCR bracket) at intent-creation time. The client never sends an amount. Re-validate against the persisted `applications.total_amount`.
- **RESOLVED (owner, 2026-06-25): SERVICE FEES ONLY.** Stripe charges Tech Rig service fees + the fixed $1,350 package only. Government/state fees (MC FMCSA $300, UCR bracket, IRP/IFTA state) are **disclosure lines** the customer pays directly to FMCSA/state — never summed into the charged total. The $1,350 package keeps its included MC + UCR-0-2 gov fees. This is what `computePricing` already implements; the earlier in-code "owner decision" comment is now genuinely ratified.

## 3. Migration `0004` — `payments`
Per `02-data-model.md`: `id`, `application_id`→applications, `stripe_payment_intent_id` / `stripe_checkout_session_id`, `amount`, `currency`, `status` ('created'|'processing'|'paid'|'failed'|'refunded'), `idempotency_key`, `coupon_code` (nullable), `paid_at`, timestamps. RLS: owner reads own; **writes are service-role/webhook only** (clients never write payment state). Indexes on `application_id`, `stripe_payment_intent_id`.

## 4. Checkout + webhook
- **Create intent/session** (`/api/checkout`): rate-limited, auth-guarded (the application must belong to the caller), server-priced, **idempotency key = hash(applicationId | sorted services | amount)** (boc3 pattern — prevents double charges on ret/refresh). Metadata carries ONLY `applicationId` + `reference_id` — **never** PII (no SSN/EIN/name beyond what Stripe needs). Persist a `payments` row `created`.
- **Webhook** (`/api/stripe-webhook`): **verify the Stripe signature**; handle `payment_intent.succeeded`/`processing`/`payment_failed` (or `checkout.session.completed`). On success, idempotently (dedup flag): set `payments.paid`, `applications.status = 'paid'`, and move that application's `filings` → `queued`. The webhook is the **source of truth** for paid state.
- **Verify-on-return:** the success page polls/verifies the intent (like the legacy thank-you page) as a fallback if the webhook is slow — never mark paid from the client redirect alone.

## 5. UI (existing design system)
- A payment step after M3's review: order summary (services + the gov-fee lines per the decision in §2), the Stripe element, pay button with a clear total.
- Success/receipt page (reference id, services, amount, what-happens-next, expected timelines from the registry) and failure states. All authed + **noindex**.
- Load Stripe only on the payment route (dynamic import) — keep it out of the marketing/other bundles.

## 6. Security (this milestone's gate is stricter)
- `/security-review` on the payment + auth paths BEFORE M4 is called build-complete (cross-cutting rule).
- No PII in logs, Stripe metadata, or the client bundle. Webhook signature verified. Checkout endpoint rate-limited + ownership-checked. Idempotent everywhere. Encrypt/avoid storing raw tax IDs.

## 7. Coupons (optional in M4)
Support a `coupon_code` on the intent for the 72h-reminder discount (the email that issues it is M6). If trivial, wire the field now; otherwise stub it and defer the issuance to M6.

## Acceptance gate
**Verifiable now (Stripe TEST mode + prod DB):**
- A completed application → create intent → **TEST card** succeeds → webhook (signature-verified) flips `payments.paid` + `applications.paid` + `filings.queued`, exactly once (idempotent on webhook replay).
- Amount provably equals the server-recomputed registry total (incl. package + UCR bracket); client-sent amounts are ignored.
- Ownership enforced (cannot pay for another user's application); RLS blocks client writes to `payments`.
- No PII in metadata/logs; Stripe not in non-payment bundles; payment routes noindex.
- `/security-review` run and clean.

**Deferred to consolidated pre-launch QA (no preview):** the live Stripe **webhook endpoint** registration on the deployed origin, **live keys**, real-card path, Lighthouse on the payment route. Log to the QA ledger.

## Commit scope
Commit only `dev/**` + the M4 roadmap note. Never `git add .`.
