# Application Platform — Overview & Decisions

Owner: orchestrator. Status: PLANNING (no code yet). Created 2026-06-24.
This folder is the single source of truth for the Tech Rig application platform: the USDOT lookup, the full-service compliance application, payment, lead capture, client accounts, dashboard, and progress tracking. It spans all three lanes (SEO, Design, Dev), so it lives in `shared/`.

Read order: this file → `01-architecture.md` → `02-data-model.md` → `03-roadmap.md` → `work-orders/`.

## 1. What we are building
A client-facing application platform grafted onto the new marketing site, replacing the two legacy form apps and adding the layer they never had (real accounts + a dashboard). In one sentence: **a carrier enters their USDOT number on the homepage, sees live FMCSA records, picks the compliance services they need, pays, and tracks every filing to completion from a logged-in dashboard.**

Surfaces:
1. **Hero lookup card** on the homepage: "Look up a USDOT number" with a search field, then a "Don't have a USDOT number? File for one now" link. Pulls live FMCSA records (carrier name, authority status, safety rating, insurance on file).
2. **Full-service application**: USDOT lookup pre-fills, the client selects services, only the relevant steps show, autosave + resume.
3. **Payment capture**: Stripe, per-service pricing from the single source (`seo/context/services.md`).
4. **Lead capture**: every lookup and every started application is a lead, chased by lifecycle email.
5. **Client dashboard**: logged-in home showing applications, per-filing progress, documents, receipts.
6. **Progress tracking**: each service filing has a status lifecycle the client can see and the back-office can advance.

## 2. Provenance — we are unifying two proven apps, not starting blank
Full extraction in `01-architecture.md` §Appendix. Summary of what already exists and is being ported:

| Capability | Legacy source | Disposition |
| --- | --- | --- |
| USDOT lookup → live FMCSA data (MOTUS API) | `boc3-form-new` | PORT the MOTUS fetch + normalizer + diff logic |
| 9-step onboarding application | `techrig-form` | GENERALIZE into the service-driven engine |
| Supabase data model (`registrations` ~100 cols; `boc-3-new` w/ data separation) | both | REDESIGN into the unified model (`02-data-model.md`) |
| Stripe payment (Checkout + PaymentIntent) + webhook + idempotency | both | PORT, standardize on one pattern |
| Resend email automation (welcome / 24h / 72h+coupon / final + PDF) | `techrig-form` | PORT templates + cron, brand owns copy |
| PDF generation (acknowledgement + answers) | `techrig-form` | PORT |
| Reference IDs (`TR-YYYY-XXXXXX`, `DGR-YYYYMMDD-NNN`) | both | UNIFY one scheme |
| Token-resume access | both | REPLACE with Supabase Auth accounts |
| **Client dashboard + progress tracking** | neither | **NET-NEW** — the core upgrade |

## 3. Architecture Decision Record (locked 2026-06-24)
Confirmed with the client/owner. These are fixed unless explicitly revisited here.

- **ADR-1 — Integration model: INTEGRATED.** Build lookup/application/dashboard as routes on the existing techrig.org Next.js app, sharing the design system, Supabase DB, and auth. The legacy subdomains `form.techrig.org` and `boc-3.techrig.org` 301 to the new in-site routes. Rationale: one codebase, one domain, cohesive UX, same-domain analytics, no third app to maintain.
- **ADR-2 — Auth: REAL ACCOUNTS via Supabase Auth.** Email magic-link (and/or password). Required for a true dashboard, cross-device progress, and multi-filing history. Anonymous leads are captured first and claimed into an account at sign-up.
- **ADR-3 — Application structure: ONE UNIFIED, SERVICE-DRIVEN ENGINE.** A single flow where USDOT lookup pre-fills, the client selects services, and only the steps required by those services render. BOC-3 is one selectable service, not a separate app. Rationale: one payment/email/data path, one dashboard, no duplication.
- **ADR-4 — First milestone: HERO LOOKUP CARD + LEAD CAPTURE.** Ship the visible, lead-generating front door first; build the deeper application, payment, and dashboard behind it in later milestones.

## 4. Scope guardrails
- **In scope:** everything in §1, ported legacy logic, the new accounts+dashboard layer, migration of the two subdomains, lifecycle email, back-office status advancement.
- **Out of scope (for now):** dispatch operations tooling (separate business line), a public carrier-data product beyond the lookup, native mobile apps, any auto-filing to FMCSA (filings are completed by the Tech Rig team; the platform tracks them).
- **Hard rules inherited:** standards.md (no fabricated metrics, no em dashes, pricing only from `services.md`), the compliance reframe already shipped (ELD = partner referral, insurance = coordinate-only — the application must not re-introduce "we file your insurance" / "we set up your ELD"), and lane discipline (SEO specs copy/intent/schema, Design specs UI, Dev implements).

## 5. The lanes, on this workstream
- **SEO** owns: where the card sits in the hero vs. the existing `AuthorityStatusTracker`, all user-facing copy and microcopy, the "no USDOT" link target and intent, service definitions/labels, pricing source-of-truth, any schema (e.g. is the lookup a `WebApplication`/`Service`?), and not regressing the home page's ranking signals.
- **Design** owns: the card and result-panel UI within the locked design system (navy-forward, illustration-led), every state (empty/loading/result/not-found/error), the application stepper, dashboard IA, and the progress-tracker visual (note: the existing `AuthorityStatusTracker` component is already a progress visual and is a strong candidate to become the real tracker).
- **Dev** owns: MOTUS integration, API routes, Supabase schema + RLS + Auth, Stripe, Resend + cron, PDF, rate limiting, security, performance, and the migration redirects.

## 6. Glossary
- **Lead** — a captured intent (a USDOT lookup or a started application) before payment, possibly anonymous.
- **Application** — one engagement a client opens; holds selected services and step data.
- **Filing** — one service within an application (BOC-3, MC, USDOT, UCR, …) with its own status lifecycle.
- **MOTUS** — the FMCSA registration system the legacy lookup queried (`motus.dot.gov`); replaced SAFER. Source of the live carrier data.
- **Carrier snapshot** — the immutable MOTUS pull stored at lookup time; user edits are diffed against it.
