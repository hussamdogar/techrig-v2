# Client Questions — Tech Rig (open clarifications)

Owner: orchestrator. Created 2026-06-25. The consolidated list of things we need from the client to finish accurately and launch. Send this over; the client answers inline under each item. We track status here and apply answers to the tagged page/work order.

**How to read each item:** the question, a one-line why, **Unblocks** (the page/work order/launch step it gates), **Priority**, **Status**, and an **Answer** line for the client.

**Status:** 🔴 OPEN · 🟡 PARTIAL · 🟢 ANSWERED
**Priority:** `[BUILD]` could change what we build · `[PUBLISH]` gates publishing an accurate claim · `[DEPLOY]` needed to go live · `[POLISH]` content/trust, not blocking

---

## 1. Factual claims we must verify before publishing
We will not publish a claim about your business on faith (no fabricated statements).

**Q1.1 — Is Tech Rig a registered C/TPA with the FMCSA Drug & Alcohol Clearinghouse?** If yes, share the proof/registration detail. The brief asks us to state this; if it's not accurate we won't publish it.
- Unblocks: `/fmcsa-clearinghouse-registration/` (work-order-qa-revision §C, clearinghouse) · Priority: `[PUBLISH]` · Status: 🔴 OPEN
- Answer: _____

**Q1.2 — Confirm the two partner referral links are final and live:** ELD → `partners.gomotive.com/DGR-TECH-RIG`; LLC → `goto.incauthority.com/QY2keP`.
- Unblocks: `/eld-services/`, `/trucking-llc/` (work-order §C / §12) · Priority: `[PUBLISH]` · Status: 🔴 OPEN
- Answer: _____

**Q1.3 — Confirm the government-fee figures are current (2026):** MC FMCSA application fee, and the UCR brackets ($46 / $138 / $276 / $963 / $4,592 / $44,836).
- Unblocks: `services.md` + registry + UCR/MC pricing copy · Priority: `[PUBLISH]` · Status: 🔴 OPEN
- Answer: _____

**Q1.4 — Confirm FMCSA is still mailing USDOT PINs.** The brief says so; we're rewording the PIN copy around it.
- Unblocks: `/dot-registration/`, `/mcs-150-biennial-update/`, `/boc-3-filing/` (work-order §C, PINs) · Priority: `[PUBLISH]` · Status: 🔴 OPEN
- Answer: _____

---

## 2. Billing model (the biggest open question — may require additional build)

**Q2.1 — How should recurring services be billed?** UCR (annual), Consortium (annual), DQ files (annual/driver), and IFTA Quarterly are renewable, but the platform currently takes a **one-time** payment. Do you want **auto-renewing subscriptions**, or a **manual re-invoice** each cycle?
- Unblocks: M4 payment + the renewable services in the registry (subscriptions are not built yet — this answer may add build work) · Priority: `[BUILD]` · Status: 🔴 OPEN
- Answer: _____

**Q2.2 — Confirm the $1,700 Full Initial Package contents.** We've built it as: MC Authority + USDOT, BOC-3, UCR (0-2 bracket), Clearinghouse, Consortium, pre-employment drug test. The brief set the price but didn't list contents.
- Unblocks: registry `full-package` + `services.md` · Priority: `[BUILD]` · Status: 🟡 PARTIAL (assumed; confirm)
- Answer: _____

**Q2.3 — How should IRP/IFTA state/jurisdiction fees be presented at checkout?** They're separate and vary by mileage/states. A disclosure note, an estimate, or collected later?
- Unblocks: `/irp-registration/`, `/ifta-registration/` + the `/apply` checkout disclosure · Priority: `[BUILD]` · Status: 🔴 OPEN
- Answer: _____

---

## 3. New services & pages scope

**Q3.1 — Do USDOT Correction ($125) and IFTA Quarterly ($150) need dedicated landing pages,** or are cards on the compliance hub enough? Dedicated pages help SEO and direct linking.
- Unblocks: compliance-hub cards vs. new routes (build-report.md §8) · Priority: `[POLISH]` · Status: 🔴 OPEN
- Answer: _____

**Q3.2 — Is there a reinstatement / legacy-to-MOTUS migration page,** or should we build one? The brief wants the California legacy-migration story moved off the new-USDOT page to there.
- Unblocks: `/dot-registration/` (CA example relocation, work-order §D) · Priority: `[POLISH]` · Status: 🔴 OPEN
- Answer: _____

---

## 4. Trust content

**Q4.1 — Final permission + exact attribution wording for the testimonials** (Felix / Marcus / Freddie). Outreach was in progress.
- Unblocks: `/about-us/` + money-page proof (qa-report §E) · Priority: `[POLISH]` · Status: 🟡 PARTIAL (outreach in progress)
- Answer: _____

**Q4.2 — Provide a source for the state market stats (e.g., Texas "$1.6T"), or we remove them.**
- Unblocks: state pages (qa-report §E) · Priority: `[POLISH]` · Status: 🔴 OPEN
- Answer: _____

---

## 5. To deploy (provisioning — needed for the launch)
These map to Launch Plan Phase 0 (`launch-plan.md`).

**Q5.1 — Stripe:** live keys + which Stripe account receives funds; tax/receipt details.
- Unblocks: launch Phase 0 → M4 payment go-live · Priority: `[DEPLOY]` · Status: 🔴 OPEN
- Answer: _____

**Q5.2 — Resend (email):** sending domain + DKIM/SPF access, and the `from` + reply-to addresses.
- Unblocks: launch Phase 0 → M6 email deliverability · Priority: `[DEPLOY]` · Status: 🔴 OPEN
- Answer: _____

**Q5.3 — FMCSA QCMobile webKey** (the backup lookup provider).
- Unblocks: launch Phase 0 → M1 lookup failover · Priority: `[DEPLOY]` · Status: 🔴 OPEN
- Answer: _____

**Q5.4 — Confirm the production domain (techrig.org) + DNS access,** the Supabase auth redirect domain, and a Sentry DSN (or confirm we skip error tracking).
- Unblocks: launch Phase 0 → auth redirects, subdomain 301s, monitoring · Priority: `[DEPLOY]` · Status: 🔴 OPEN
- Answer: _____

---

## 6. Back-office & cutover

**Q6.1 — Which team accounts (emails) should have back-office / filing-management (admin) access?** We seed these manually.
- Unblocks: M5 `admin_users` seed · Priority: `[DEPLOY]` · Status: 🔴 OPEN
- Answer: _____

**Q6.2 — Confirm the per-service turnaround times we show clients,** and who on the team advances each filing.
- Unblocks: M5 progress timeline (`expectedTimeline` in the registry) · Priority: `[POLISH]` · Status: 🔴 OPEN
- Answer: _____

**Q6.3 — Does the existing refund policy cover application payments,** or do you want different terms for paid filings?
- Unblocks: `/refund-policy/` · Priority: `[PUBLISH]` · Status: 🔴 OPEN
- Answer: _____

**Q6.4 — Cutover: when to drain the legacy forms and flip DNS,** is anyone mid-application on `form.`/`boc-3.techrig.org` right now, and confirm we do NOT need to migrate legacy form data (we keep it as historical record).
- Unblocks: launch Phase 3 / M7 drain + subdomain 301s · Priority: `[DEPLOY]` · Status: 🔴 OPEN
- Answer: _____

---

## Tracking
As answers arrive: flip the item's Status to 🟢, record the Answer, and the orchestrator routes it to the tagged page/work order (and updates `orchestration-status.md`). The two highest-impact: **Q2.1 (recurring billing — may add build)** and **Q1.1–Q1.2 (claims/links we cannot publish unverified)**.
