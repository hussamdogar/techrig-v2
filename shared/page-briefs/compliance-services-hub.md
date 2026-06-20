# Brief: /compliance-services/ (Compliance silo HUB)

## Meta
- **Action:** NEW (HUB). **Bucket:** 1 (money). **Intent:** commercial / BOFU.
- **Primary:** dot compliance services (880/KD~0). **Secondaries:** trucking compliance services (320), trucking compliance (320/11), trucking compliance company (70/3), trucking authority (880).
- **Word target:** 900 to 1,200 (category hub, not a deep filing page).
- **Role:** the front door to the compliance silo. Links to every filing page + the bundle. Presents the full $1,650 package as the hero offer.

## Title tag (52 chars)
`DOT Compliance Services for Trucking | Tech Rig`

## Meta description (156 chars)
`DOT compliance services for new and growing carriers: USDOT, MC authority, BOC-3, UCR, IRP, ELD and driver files, filed right the first time. Get started today.`

## URL / canonical
`https://techrig.org/compliance-services/` (self-canonical).

## Three Kings check
Primary "dot compliance services" in: title (yes), first paragraph (yes), H2s ("What our DOT compliance services cover", "Why carriers choose our trucking compliance services").

## Heading outline + copy

### H1: DOT and Trucking Compliance Services
**Hero paragraph (styled lede, not a heading):**
Getting a truck on the road is not one filing. It is a sequence, and any missed step can stall your authority at the worst time. Tech Rig handles the whole sequence. Our DOT compliance services take a new or returning carrier from company formation through active operating authority, then keep you compliant once you are hauling. DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket process-agent company, and we have run filings for owner-operators, fleets, and brokers in more than 10 states.

**Primary CTA (above the fold):** button "Start your compliance setup" → `/mc-dot-registration/`. Secondary text link: "or see the full package" → anchor to the package section below.

### H2: The full compliance package
One paragraph + a list. Lead:
Most new carriers do not want to assemble this piece by piece. Our full compliance package covers every requirement to stand up a motor carrier and onboard your first driver, for a fixed $1,650. You can also buy any service on its own.

Package contents (each item links to its page on a 1 to 3 word anchor):
- [LLC formation](/trucking-llc/) and [USDOT number](/dot-registration/)
- [MC authority](/mc-registration/) and [BOC-3](/boc-3-filing/) process-agent designation
- Insurance filing coordination and [UCR registration](/ucr-registration/)
- [Driver qualification files](/driver-qualification-files/), [Clearinghouse](/fmcsa-clearinghouse-registration/), and [drug and alcohol consortium](/drug-and-alcohol-consortium/) enrollment
- Pre-employment drug test coordination
- [IRP apportioned plates](/irp-registration/) and [IFTA](/ifta-registration/)
- [ELD setup](/eld-services/)

Note under the list: Government and third-party fees (for example state IRP fees or your insurance premium) are billed separately from our service fee. We tell you which is which before you pay.

### H2: What our DOT compliance services cover
Short intro, then a card grid (Dev: 3-column responsive). Each card = service name (link), one plain-language line, and the fixed price where public. Use the pricing quick-reference. For UCR show "from $100, government fee by fleet size". For services on price hold (none here) omit. Cards:
- USDOT number, MC authority, BOC-3 filing, UCR, IRP plates, IFTA, Clearinghouse, drug & alcohol consortium, DQ files, ELD setup, MCS-150 updates, trucking LLC.

### H2: Why carriers choose our trucking compliance services
Three short value blocks (no hype, proof-led):
1. **We catch what blocks activation.** Plenty of applications clear the 21-day protest period and still cannot operate because the BOC-3, insurance, or UCR was wrong. We sequence the filings so that does not happen. (Worked example, real: one carrier had registered as a freight forwarder instead of a motor carrier, which did not permit hauling freight in his own truck. We refiled under the correct classification with BOC-3 and UCR inside 24 hours, and the authority activated after the protest period.)
2. **We know the new MOTUS system.** FMCSA's move off the legacy portal has created PIN, data-linkage, and Pay.gov problems. We work these daily, including triggering FMCSA callbacks when records will not link.
3. **We do not disappear after the filing.** Authority active is the start. We keep your MCS-150, UCR, Clearinghouse, and driver files current, and when you are ready to keep the truck loaded we [dispatch you](/services/) too.

### H2: How it works
Numbered, Grade 8:
1. Tell us your equipment, state, and where you are starting from.
2. We map the exact filings you need and what they cost, government fees called out separately.
3. We file and track each step, and tell you when your authority is active.
4. We keep you compliant and, when you want it, dispatch your truck.

### H2: Compliance services FAQ
FAQPage schema. Real Q&A only:
- "Do I need all of these services?" No. Requirements depend on your operation, vehicles, drivers, authority type, and whether you run interstate. We tell you which apply to you.
- "How long until my authority is active?" After the application, FMCSA requires a mandatory 21-day protest period, and timing depends on FMCSA processing and correct insurance and BOC-3 filings. We cannot guarantee a date, but we make sure nothing on your side holds it up.
- "Is Tech Rig part of FMCSA?" No. DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket process-agent company. We are a private filing service.
- "Can you fix an authority I started myself?" Yes. A lot of our work is correcting DIY filings, including wrong classifications and MOTUS lockouts.

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
