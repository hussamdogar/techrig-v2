# M1 Work Order — SEO

Milestone: M1 (hero USDOT lookup card + lead capture). Lane: SEO (specify; do not implement).
Reads: `../00-overview.md`, `../03-roadmap.md`, `seo/context/services.md`, `shared/page-briefs/home.md`, `shared/page-briefs/dot-registration.md`. Writes: a brief addendum in `shared/page-briefs/` + (optional) a new `/lookup/` brief.

You own everything the user reads and where it sits. Dev and Design wait on this.

## 1. Hero composition (your call — it changes the ranking homepage)
The current hero (`dev/app/page.tsx`): left column = H1 + styled subhead + two CTAs; right column = `AuthorityStatusTracker` visual. The lookup card needs a home. Specify exactly where it goes and what happens to the tracker, preserving:
- the H1 and the first-paragraph primary keyword (Three Kings),
- the dual-offering legibility (compliance + dispatch),
- no downgrade of the home page's existing signals (migration prime directive).
Recommendation to accept or override: place the card in the right column (it is functional and on-message — looking up authority status is the compliance front door), and either retire the decorative tracker or hand it to Design to become the dashboard progress tracker in M5. Confirm.

## 2. Card copy (every string, to standards)
Provide final copy for: eyebrow label, heading, field placeholder, button label, the helper line, and the two links. The competitor reference reads "Pull live FMCSA records — safety rating, authority status, insurance on file." Keep the substance, but **no em dash** (standards.md): use a period or colon. No banned AI-tell words. Specify:
- Eyebrow (e.g. "QUICK LOOKUP"), heading (e.g. "Look up a USDOT number"), placeholder (e.g. "e.g. 3214567"), button (e.g. "Search").
- Helper line, em-dash-free.
- Primary link: "Don't have a USDOT number? File for one now" — and its target (see §4).
- Secondary link: "Questions? Contact us" → `/contact-us/`.

## 3. Result-panel labels + empty/error copy
- Label set for the live FMCSA fields Design will lay out: legal name, USDOT #, MC #, entity type, operating authority status, safety rating, insurance on file, power units. Grade-8, plain.
- **Missing-field rule:** when MOTUS returns nothing for a field, the copy is "Not on file" (or similar) — never a fabricated value (standards.md). Provide the exact phrasing.
- Not-found copy ("We couldn't find a carrier with that USDOT number…") and a graceful error line for rate-limit/outage.

## 4. "File for one now" target (interim + final)
- **Final** (once M3 ships): `/apply/?service=usdot`.
- **Interim** (M1, no apply engine yet): route to the existing money page `/dot-registration/` (indexable, captures the intent, has its own CTA) OR `/contact-us/`. Pick one and state it. Recommendation: `/dot-registration/`.

## 5. Lead-capture stance
Decide: ungated lookup (show results without asking for email) vs. gated. Recommendation: **ungated** — better UX, better SEO, and the USDOT entry is already a captured lead; capture email at an action ("file now", "email me these results"). Confirm, and specify any email-capture microcopy if you want a save/email action in M1.

## 6. SEO opportunity — a dedicated `/lookup/` page (optional, your judgment)
"usdot number lookup", "check usdot number", "fmcsa carrier lookup" are real informational/navigational queries. The card can also back a standalone indexable `/lookup/` tool page that ranks for them and funnels to compliance services. If worthwhile, write a `/lookup/` page brief (primary + secondaries from DataForSEO, intent, schema, single CTA) — that becomes its own mini money/tool page. If not now, log it as a backlog idea. Either way, state the decision.

## 7. Schema
Specify any JSON-LD for the card/lookup page (e.g. `WebApplication` or `Service` for a `/lookup/` page; the card embedded in home needs none of its own). Keep within `schema-specs.md` conventions.

## Acceptance (what Dev/Design need from you to start)
A short addendum committed to `shared/page-briefs/` containing: the composition decision, all final copy strings, the result labels + missing/not-found/error copy, the "file now" target, the lead-capture stance, and the schema note. No code, no design — just the spec.
