# Brief: / (Homepage redo)

## Meta
- **Action:** REFRESH (full content redo, confirmed with client). **Bucket:** 1. **Intent:** navigational + dual positioning.
- **Primary:** brand + dual positioning (Tech Rig as compliance + dispatch). Not a single keyword target; the homepage ranks for brand and supports the two hubs.
- **Secondaries (body/anchors, not forced):** truck dispatch service, trucking compliance services.
- **Word target:** 700 to 1,100 (a routing page, not a long read).
- **Key change:** remove ALL legacy performance metrics (15% revenue, 20% deadhead, $10k-$20k, 15 hrs, "5-star"). Replace with the documented track record and real proof.

## Title tag (48 chars)
`Tech Rig: Truck Dispatch and Compliance Services`

## Meta description (155 chars)
`Tech Rig gets new carriers road-legal and keeps trucks loaded: trucking compliance and authority setup, plus truck dispatch for owner-operators and fleets.`

## Three Kings check
Homepage targets brand; ensure "truck dispatch" and "trucking compliance" both appear in the first viewport and in H2s. No keyword stuffing.

## Heading outline + copy

### H1: Get road-legal, then keep your truck loaded
(H1 names the value; it is the funnel thesis stated plainly. If SEO prefers the brand in H1, use "Tech Rig: trucking compliance and dispatch" as H1 and make the line above the styled hero subhead. Either works; do not put the slogan in an H-tag if it reads as a tagline. Recommended H1: **Trucking Compliance and Truck Dispatch, Under One Roof**.)

**Hero subhead (styled paragraph, not a heading):**
Tech Rig does the two things a trucking business needs most: we get you legally set up to operate, and we keep your truck earning once you are. New carriers come to us to get their authority and compliance done right. Owner-operators stay with us to find and book loads. One team for the whole journey.

**Primary CTA (two buttons, one funnel):**
- Primary: "Start your compliance setup" → `/compliance-services/`
- Secondary: "Get your truck dispatched" → `/services/`

### H2: Trucking compliance and company setup
Short block. Lead:
Starting out, or fixing a setup that stalled? We handle USDOT and MC authority, BOC-3, UCR, insurance filing, driver compliance, IRP, IFTA, and ELD, individually or as one package. We are officially listed by FMCSA as a BOC-3 blanket process-agent company, and we know the new MOTUS system inside out.
Link: "See compliance services" → `/compliance-services/`. Sub-links to the top filings ([USDOT](/dot-registration/), [MC authority](/mc-registration/), [BOC-3](/boc-3-filing/), [UCR](/ucr-registration/)).
Note: keep the homepage body curated (top filings + "see all"). The COMPLETE service list lives in the global mega-footer, not here, see `global-footer.md`.

### H2: Truck dispatch that keeps you loaded
Short block. Lead:
Once your authority is active, we keep the freight coming. We dispatch owner-operators and small fleets across box truck, reefer, flatbed, dry van, power only, and hot shot, with no long-term contracts and no forced dispatch. You keep your authority; we keep it busy.
Pricing model line: we charge a percentage of your gross by equipment, so we only win when you do.
Link: "See dispatch services" → `/services/`. Franchise sub-link: "box truck dispatch" → `/box-truck-dispatch/`.

### H2: Why carriers trust Tech Rig
Proof, documented only:
- Serving the trucking industry since 2021, with around 100 carriers dispatched.
- A dedicated compliance practice that has helped 40+ carriers, owner-operators, and brokers across more than 10 states since 2025.
- Officially listed by FMCSA as a BOC-3 blanket process-agent company.
- We work with Motive for ELD and with OTR Solutions and RTS Financial for factoring.
(No performance percentages, earnings claims, or star ratings. Those are not documented and are not used.)

### H2: The whole journey, one team
Funnel statement. Most providers do compliance or dispatch. We do both, which means the company that gets your authority active is the same one that keeps your truck loaded after. New here? Start with our [guide to starting a trucking company](/how-to-start-a-trucking-company/).

### Closing CTA band
"Whether you are starting out or already rolling, we have the next step. Talk to us." Button "Get started" → `/contact-us/` (or `/compliance-services/` if a single primary is preferred; pick one next step).

## Internal links out
`/compliance-services/`, `/services/`, `/how-to-start-a-trucking-company/`, `/box-truck-dispatch/`, top filing pages, `/about-us/`, `/contact-us/`.

## Schema (JSON-LD)
- `Organization`/`ProfessionalService` node {@id #org} with logo, NAP, areaServed US, sameAs (pending). This is the canonical org node referenced site-wide.
- `WebSite` with `potentialAction` SearchAction only if on-site search exists.
- `BreadcrumbList` not needed on home.

## Proof / claims discipline
- Remove every legacy metric (do-not-publish list). Only the documented track record above.
- FMCSA wording exact; no government-affiliation implication.

## Reviewed-by
Homepage is brand-level; no per-page reviewer needed. Organization is publisher.

## Dev / Design notes
- Unique branded OG image (home).
- 5-second clarity test: a visitor must grasp "compliance + dispatch, for truckers" instantly.
- Decorative glyphs/icons via CSS; slogan lines are styled paragraphs, never H-tags.
- Single source for any price/percentage shown.

## Uniqueness
Funnel thesis ("road-legal, then loaded") is the homepage's own framing; do not reuse the hub/pillar sentences verbatim.
