# Work order to SEO (from Design)

From Design, 2026-06-21. The design system, the per-page design specs (`shared/design/`), and the full static mockups (`shared/design/mockups/`, all 24 pages) are complete. Building them surfaced a precise set of copy and data gaps that Design will not invent. This is the request back to SEO (and a few items for the client and Dev). Each gap is visible in the mockups as a dashed amber `[SEO to supply]` placeholder or an honest token.

## How this works
- Design restructured SEO's existing brief copy into the content patterns (Standfirst, Manifest, Eligibility Strip, Case File, Split-Ledger, Load Board, Milepost). Words are SEO's; structural UI labels are design chrome (see `design-system.md` section 13).
- Where a pattern needs words the brief does not contain, the mockup shows `[SEO to supply]`. Where a number is unconfirmed, it shows an honest token (`Contact for quote`, `rate on request`, `fee set by bracket`), never a guess.
- Supply the items below in the page briefs (`shared/page-briefs/`); Design and Dev slot them in. Standards still apply: no fabricated metrics, no guaranteed timelines, FMCSA wording exact, one signature term, locale US/USD.

## Copy to write

### Dispatch trailer pages (`reefers-trucking`, `flatbed-dispatch`, `dry-van-trucking`, `power-only-trucking`, `hot-shot-trucking`)
Per the trailer brief, each of the five needs, distinct per page (no repeated 8+ word sentence):
- A one-line **lane profile** (for the dispatch hub Load Board and the page itself).
- An **equipment-specific hero lede** built from the brief's per-page angle.
- A **worked scenario**. Reefer, flatbed, dry van are `[CLIENT PROOF NEEDED]` (research-led until a story exists). Power only and hot shot may reuse the real NC power-only and MD hotshot clients, but on the dispatch facet only, worded so no sentence matches the compliance pages.

### State pages (`tech-rig-dispatch-texas`, `-california`, `-new-york`, `-florida`)
Per state, all currently `[SEO to supply per state]`:
- A **state-specific lead fact** for the hero.
- **State nuances**: intrastate vs interstate, any state-specific registration, state DOT where relevant.
- A **distinct worked example** per state. No unverified market statistics (the legacy "$1.6 trillion" type claim stays out).

### Worked-example proof slots (`[CLIENT PROOF NEEDED]`)
A real, cleared client example for: `irp-registration`, and the reefer / flatbed / dry-van trailer pages. Rendered now as graceful empty proof blocks.

## Data to confirm (shown as honest tokens until then)
- **UCR** (`ucr-registration`): the fleet-bracket dollar amounts (0-2, 3-5, 6-20, 21-100, 101+) against the current schedule, and the government-fee figure. Shown now as "fee set by bracket".
- **Dispatch percentages**: dry van, power only, hot shot (box truck 8%, cargo van 5%, flatbed and reefer 3% are confirmed). Shown now as "rate on request".
- **Fees**: the DOT+MC bundle price (`mc-dot-registration`); IRP service fee and state-fee handling; ELD device/subscription cost and Tech Rig service fee; insurance-filing fee; trucking-LLC pricing (now "Contact for quote").

## For Dev (not SEO)
- `[VERIFY]` CTA routes: the intake-form destinations behind "File my UCR", "Start your compliance setup", etc. (currently `#` or `/contact-us/`).
- Client logo and social profile URLs (header/footer/schema) still pending; placeholder slot built.

## Where to see each gap
Open `shared/design/mockups/index.html` and look for the dashed amber placeholders and the token values on the pages named above. Questions on layout or pattern are Design's; copy, keywords, intent, and the URL set remain SEO's.
