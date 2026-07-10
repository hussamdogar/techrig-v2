# Brief: /compliance-services/ (Compliance silo HUB)

## Meta
- **Action:** NEW (HUB). **Bucket:** 1 (money). **Intent:** commercial / BOFU.
- **Primary:** dot compliance services (880/KD~0). **Secondaries:** trucking compliance services (320), trucking compliance (320/11), trucking compliance company (70/3), trucking authority (880).
- **Word target:** 900 to 1,200 (category hub, not a deep filing page).
- **Role:** the front door to the compliance silo. Links to every filing page + the bundle. Presents the full $1,700 package as the hero offer.

## Title tag (52 chars)
`DOT Compliance Services for Trucking | Tech Rig`

## Meta description (160 chars)
`DOT compliance services for new and growing carriers: USDOT, MC authority, BOC-3, UCR, consortium, Clearinghouse and driver files, done right. Get started today.`

## URL / canonical
`https://techrig.org/compliance-services/` (self-canonical).

## Three Kings check
Primary "dot compliance services" in: title (yes), first paragraph (yes), H2s ("What our DOT compliance services cover", "Why carriers choose our trucking compliance services").

## Heading outline + copy

### H1: DOT and Trucking Compliance Services
**Hero paragraph (styled lede, not a heading):**
Getting a truck on the road is not one filing. It is a sequence, and any missed step can stall your authority at the worst time. Tech Rig handles the whole sequence. Our DOT compliance services take a new or returning carrier from company formation through active operating authority, then keep you compliant once you are hauling. DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket process-agent company, and we have run filings for owner-operators, fleets, and brokers in more than 10 states.

**Primary CTA (above the fold):** button "Start your compliance setup" → `/apply` (choose à la carte or a package). Secondary text link: "or compare our packages" → `/compliance-packages/`.

### H2: Compliance packages (choose by authority status + vehicle)
Package-selector block. Most carriers save by bundling: **BOC-3 is included in every package**, and bundle prices are lower than à la carte. Full detail + the side-by-side comparison live on the [packages page](/compliance-packages/).
- **Compliance Continuation — Non-CDL — $400** (already have authority, non-CDL vehicle)
- **Compliance Continuation — CDL/Heavy — $1,100** (already have authority, CDL/heavy vehicle)
- **Authority Launch — Non-CDL — $1,000** (new authority, non-CDL vehicle)
- **Authority Launch — CDL/Heavy — $1,700** (new authority, CDL/heavy vehicle)

Choose by your authority status and the vehicle you operate, not only whether the driver holds a CDL. You can also buy any service on its own at its standalone price. Link: "See all packages and compare" → [`/compliance-packages/`](/compliance-packages/).
Note: IRP and IFTA government/jurisdiction fees are billed separately. Every package figure is DERIVED from `services.md` (Dev); do not hardcode prices here.

### H2: What our DOT compliance services cover
Short intro, then a card grid (Dev: 3-column responsive). Each card = service name (link), one plain-language line, and the **standalone** price where public (à-la-carte prices; the lower in-bundle prices are shown on the packages page). Prices from `services.md`. For UCR show "$80 filing fee + government fee by bracket". For trucking LLC show "Contact for quote" (partner referral). Cards:
- USDOT only ($300), MC Authority + USDOT ($650), BOC-3 filing ($100), UCR ($80 + gov), IRP setup ($225), IFTA setup ($225), IFTA quarterly ($150 + gov), Clearinghouse ($125), drug & alcohol consortium ($175), DQ files ($250 first driver), pre-employment drug test ($125), Biennial Update ($125), USDOT Correction ($125), MOTUS Migration ($125), trucking LLC (partner referral), ELD (partner referral, not a Tech Rig service). (Insurance is coordinated with the carrier's own insurer, not a Tech Rig service; do not present it as a fixed-price card.)

### H2: Why carriers choose our trucking compliance services
Three short value blocks (no hype, proof-led):
1. **We catch what blocks activation.** Plenty of applications clear the 21-day protest period and still cannot operate because the BOC-3, insurance, or UCR was wrong. We sequence the filings so that does not happen. (Worked example, real: one carrier had registered as a freight forwarder instead of a motor carrier, which did not permit hauling freight in his own truck. We refiled under the correct classification with BOC-3 and UCR inside 24 hours, and the authority activated after the protest period.)
2. **We know the new MOTUS system.** FMCSA's move off the legacy portal has created PIN, data-linkage, and Pay.gov problems. We work these daily, including triggering FMCSA callbacks when records will not link.
3. **We do not disappear after the filing.** An active authority is just the start. We keep your MCS-150, UCR, Clearinghouse, and driver files current, and when you are ready to keep the truck loaded we [dispatch you](/services/) too.

### H2: How it works
Numbered, Grade 8:
1. Tell us your equipment, state, and where you are starting from.
2. We map the exact filings you need and what they cost, with government fees called out separately.
3. We file and track each step, and tell you when your authority is active.
4. We keep you compliant and, when you want it, dispatch your truck.

### H2: Compliance services FAQ
FAQPage schema. Real Q&A only:
- "Do I need all of these services?" No. Requirements depend on your operation, vehicles, drivers, authority type, and whether you run interstate. We tell you which apply to you.
- "How long until my authority is active?" After the application, FMCSA requires a mandatory 21-day protest period, and timing depends on FMCSA processing and correct insurance and BOC-3 filings. We cannot guarantee a date, but we make sure nothing on your side holds it up.
- "Is Tech Rig part of FMCSA?" No. DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket process-agent company. We are a private filing service.
- "Can you fix an authority I started myself?" Yes. A lot of our work is correcting DIY filings, including wrong classifications and MOTUS lockouts.
- "Do non-CDL drivers need compliance files?" Yes. Many non-CDL commercial drivers still require a Driver Qualification file when the vehicle and operation fall under applicable federal rules. Clearinghouse and DOT drug-and-alcohol testing requirements generally apply to drivers operating vehicles that require a CDL. We review the vehicle and operation before recommending services.

### Closing CTA band
One line + button. "Ready to get road-legal without the guesswork? Start your compliance setup." Button → `/mc-dot-registration/`.

## Internal links out (all in `sitemap-plan.md`)
Every package/card item (listed above); `/services/` (funnel cross-link); `/how-to-start-a-trucking-company/` on a "new carrier" anchor in the hero or FAQ.

## Internal links in (Dev to wire)
Home (primary hub link), pillar, every filing page links UP here, about-us, footer.

## Schema (JSON-LD)
- `ProfessionalService` (the business; name "DGR Tech Rig LLC", brand "Tech Rig", areaServed US, telephone, address, sameAs pending) with `hasOfferCatalog` listing the services.
- `BreadcrumbList`: Home > Compliance Services.
- `FAQPage` for the FAQ block.
- Do NOT add Service schema here (each Service lives on its own page); hub uses OfferCatalog references.

## Proof to include
Track record line (documented): "Serving the trucking industry since 2021, with a compliance practice that has helped 40+ carriers, owner-operators, and brokers across more than 10 states." The freight-forwarder worked example (real, publishable). No metrics beyond these.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder" (compliance lead). Person schema per `author.md`.

## Dev / Design notes
- Unique OG image (branded, "Compliance Services"). No placeholder.
- Card glyphs/icons via CSS/inline SVG assets, never typed glyphs in headings.
- Price chips pull from one source so they cannot drift from `services.md`.
- 5-second clarity test on hero: a new carrier must understand "they do all my setup filings" instantly.

## Uniqueness
Worked example here = freight-forwarder misclassification (CA box truck). Do not reuse this example on another page; each filing page uses a different one.
