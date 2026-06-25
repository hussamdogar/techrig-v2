# Client Questions — Tech Rig (RESOLVED 2026-06-25)

Owner: orchestrator. Created 2026-06-25; client answered 2026-06-25.
Verbatim answers: `client-answers-2026-06-25.md`. Routed build/content deltas: `work-order-client-answers.md`.

**All items answered (one credential still pending: Q5.3 QCMobile webKey).** Each item below records the answer and where it routes. "Delta" = it changes the build; "consistent" = already matches the code; "config" = a provisioning value.

**Status:** 🟢 ANSWERED · 🟡 PENDING (credential)

---

## 1. Factual claims before publishing
- **Q1.1 — C/TPA registration:** 🟢 YES, DGR Tech Rig LLC is a registered C/TPA; written confirmation usable. → **Publish-cleared** (SEO S6); the clearinghouse claim is no longer on hold.
- **Q1.2 — Partner links:** 🟢 Both final and match the code exactly (Motive `partners.gomotive.com/DGR-TECH-RIG`, Inc Authority `goto.incauthority.com/QY2keP`). → Publish-cleared (SEO S6). Consistent.
- **Q1.3 — Government fees:** 🟢 Publish UCR **government brackets** ($46/$138/$276/$963/$4,592/$44,836) + a **separate $50** Tech Rig fee on the UCR page; no full table in the form; **no separate MC gov-fee figure**. → **Delta** (Dev D6 UCR presentation, D7 remove MC placeholder). The /apply form already hides the table — consistent.
- **Q1.4 — USDOT PINs:** 🟢 FMCSA still mailing PINs. → Publish-cleared (SEO S6); QA-rev already removed the "stopped mailing" wording. Consistent.

## 2. Billing model
- **Q2.1 — Recurring billing:** 🟢 **Manual re-invoice + reminders** before each due date (UCR/Consortium/DQ annual, IFTA quarterly); auto-charge only with express consent. NOT subscriptions. → **Delta** (Dev D10, fast-follow — first renewals are a quarter/year out; no subscription build).
- **Q2.2 — $1,700 package contents:** 🟢 Now **9 items** (adds IFTA setup, IRP setup, one DQ file). DQ pricing tiered ($200/$350/$450/custom). → **Delta** (Dev D1 package, D2 DQ tiers). **Supersedes qa-rev §G.1** (was frozen at 6). Framing locked: all-in bundle, no "discount" claim (service-fee sum $1,650 < $1,700; discount only holds once unpublished gov fees are counted).
- **Q2.3 — IRP/IFTA at checkout:** 🟢 Service fee only at checkout; gov/state calculated and billed separately later. → Consistent (already the built model; verify /apply disclosure).

## 3. New services & pages
- **Q3.1 — USDOT Correction + IFTA Quarterly:** 🟢 YES, **dedicated pages** ($125 / $150 + gov). → **Delta** (registry entries exist; pages do not — Dev D3/D4, SEO S1, Design DZ1).
- **Q3.2 — MOTUS Migration page:** 🟢 New **FMCSA Portal to MOTUS Migration** page + **$125** service; move the CA legacy story there (turnaround ~1-2 weeks). → **Delta** (new service Dev D5, page SEO S1/Design DZ1). Note: CA story is on the **MC pages**, not `/dot-registration/` (SEO S2).

## 4. Trust content
- **Q4.1 — Testimonials:** 🟢 First name + company for Felix/Marcus/Freddie; genuine wording only; grammar cleanup OK; nothing invented. → SEO S7, **post-launch** (L8).
- **Q4.2 — State market stats:** 🟢 Remove unsupported numbers (TX "$1.6T"); generalize. → SEO S5 (state pages).

## 5. Deployment / provisioning
- **Q5.1 — Stripe:** 🟢/⚠️ Existing account; key on the BOC-3 form is `mk_1TQSnGBUKzFDGSEhTE8lrbVQ` — **not a standard Stripe key prefix**; dev to verify and request live `sk_`/`pk_`/`whsec_`. Receipt: DGR TECH RIG LLC / info@techrig.org / 30 N Gould St, Sheridan WY / no sales tax. → Dev D12 + provisioning.
- **Q5.2 — Resend:** 🟢 `mail.techrig.org`, from + reply-to `info@techrig.org`, DNS access for SPF/DKIM; dev may adjust. → Config (Phase 0).
- **Q5.3 — QCMobile webKey:** 🟡 **PENDING** — Hussam provides at deploy. MOTUS primary works, so not build-blocking. → Phase 0 (the one still-open item).
- **Q5.4 — Domain/DNS/Sentry/auth:** 🟢 `techrig.org`, DNS available, Supabase auth redirect for techrig.org + callbacks, add Sentry. → Config (Phase 0).

## 6. Back-office & cutover
- **Q6.1 — Admin access:** 🟢 `info@techrig.org` only initially; team later. → M5 `admin_users` seed (config).
- **Q6.2 — Turnaround times:** 🟢 Specific per-service times given; team ownership TBD. → **Delta** (Dev D8 `expectedTimeline` updates — several materially off). Team ownership still open.
- **Q6.3 — Refund policy:** 🟢 Full new policy, no flat $50 fee, 3-day no-work full refund, deduct only actual processing fee, up to 75% partial, dated June 25 2026. → **Delta** (Dev D9 page + PDF; SEO S3 copy). Page is currently a stub; the PDF "non-refundable regardless of outcome" line now conflicts.
- **Q6.4 — Cutover & legacy:** 🟢 `form.` not in use; `boc-3.` live (keep until tested, then 301 on dev timing); **import historical records where practical + keep editable**, else preserve-as-historical; never delay launch. → **Delta** (Dev D11 — modifies the M7 "DRAIN not ETL" decision).

---

## Tracking
All answers recorded and routed to `work-order-client-answers.md` (Dev D1-D12, SEO S1-S8, Design DZ1) and reflected in `orchestration-status.md`. Build deltas D1-D9 land before the joint launch; D10/D11 are fast-follow. **Open after this pass:** Q5.3 QCMobile webKey, Q6.2 team filing ownership, Q5.1 live Stripe credential, and the package-framing copy direction (resolved to all-in bundle, executed in D1).
