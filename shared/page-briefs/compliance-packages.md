# Brief: /compliance-packages/ (the four compliance bundles)

## Meta
- **Action:** NEW (Pricing v2, client 2026-07-10). **Bucket:** 1 (money). **Intent:** commercial / BOFU.
- **Primary:** trucking compliance packages (verify vol). **Secondaries:** trucking compliance bundle, mc authority package, new authority package, compliance continuation.
- **Word target:** 1,200 to 1,500 (comparison-led money page).
- **Role:** the four-bundle selector. Replaces the single-package offer. Every price/saving/discount is DERIVED from `services.md` (never hardcoded); the Dev registry computes them.
- **Parity:** all figures must equal `services.md` and the registry. Do not restate a number that could drift; where possible reference "the price shown."

## Title tag (48 chars)
`Trucking Compliance Packages and Bundles | Tech Rig`

## Meta description (156 chars)
`Four trucking compliance packages, from $400. Pick by authority status and vehicle type, get BOC-3, UCR, and driver compliance bundled at a lower price.`

## Three Kings check
Primary "trucking compliance packages" in: title (yes), first paragraph (yes), H2s ("Choose the package that matches your authority status and vehicle type", "What every package includes").

## URL / canonical
`https://techrig.org/compliance-packages/` (self-canonical). Add to sitemap + keyword-map.

## Heading outline + copy

### H1: Trucking Compliance Packages
**Hero lede:**
Buying your filings one by one adds up. Our compliance packages bundle the services a carrier needs at a lower price than à la carte, with BOC-3 included in every one. Pick the package that matches where you are (new authority or already running) and what you drive (a CDL/heavy vehicle or not).

**Primary CTA (above fold):** button "Choose your package" → `/apply` (bundle selection; the CDL/non-CDL selector lives in the flow). Each card also has a "Get this package" button → `/apply` with that bundle pre-selected.

### H2: Choose the package that matches your authority status and vehicle type
(This is the exact §5 section heading.)
Supporting text (verbatim §5): "Every package includes BOC-3 filing or verification, UCR for the 0-2 vehicle bracket, and initial compliance for one driver. Packages for heavy interstate vehicles also include CDL-driver compliance, IRP setup, and IFTA setup. IRP and IFTA government and jurisdiction fees are separate."

### H2: Choose by the vehicle, not just the driver's license
(§6 CDL/non-CDL selector explanatory block.)
Verbatim: "Choose based on the vehicle you will operate, not only whether the driver already holds a CDL. A driver may have a CDL but operate a vehicle that does not require one. In that case, the non-CDL vehicle package may apply."
For the heavy/CDL packages: "These packages are designed for interstate property carriers operating qualifying heavy vehicles or combinations that require CDL compliance, IRP, and IFTA. Passenger and hazardous-material operations may require custom review."

### H2: The four packages
Four cards (Design: DZ3 card component). Each card shows: name, final price, who-it-is-for, a **"BOC-3 Included"** badge, the included-services list, the itemized in-bundle total + the `+$N` rounding line + final price, and the public display (standalone value, package price, customer savings, discount %). All figures DERIVED from `services.md`.

**Card 1 — Compliance Continuation — Non-CDL — $400**
Who: carriers that already have USDOT + MC and operate a non-CDL vehicle.
Includes: BOC-3 (or verification), UCR filing, UCR government fee (0-2), one Driver Qualification file.
Itemized in-bundle $396 · rounding +$4 · **$400**. Standalone value $476 · savings $76 · 16.0%.
Wording: "Already have your authority and operate a non-CDL vehicle? Complete your BOC-3, UCR, and first Driver Qualification file in one package."

**Card 2 — Compliance Continuation — CDL/Heavy — $1,100**
Who: carriers that already have USDOT + MC and operate a qualifying heavy interstate vehicle that requires CDL compliance, IRP, and IFTA.
Includes: BOC-3, UCR filing, UCR gov (0-2), Clearinghouse, Consortium, pre-employment drug test, one DQ file, IRP setup, IFTA setup.
Itemized $1,096 · +$4 · **$1,100**. Value $1,351 · savings $251 · 18.6%.
Wording: "Already have your authority but still need CDL-driver compliance, IRP, and IFTA? Complete the remaining setup for one driver in one package."
Fee note: "IRP and IFTA government, state, plate, credential, and jurisdiction fees are billed separately."

**Card 3 — Authority Launch — Non-CDL — $1,000**
Who: new carriers that need USDOT + MC and will operate a non-CDL vehicle.
Includes: MC Authority + USDOT, BOC-3, UCR filing, UCR gov (0-2), one DQ file.
Itemized $996 · +$4 · **$1,000**. Value $1,126 · savings $126 · 11.2%.
Wording: "Starting a new authority with a non-CDL vehicle? Get your authority filings, BOC-3, UCR, and first Driver Qualification file without paying for CDL-only services."

**Card 4 — Authority Launch — CDL/Heavy — $1,700**
Who: new interstate property carriers operating a qualifying heavy vehicle or combination that requires CDL compliance, IRP, and IFTA.
Includes: MC Authority + USDOT, BOC-3, UCR filing, UCR gov (0-2), Clearinghouse, Consortium, pre-employment drug test, one DQ file, IRP setup, IFTA setup.
Itemized $1,696 · +$4 · **$1,700**. Value $2,001 · savings $301 · 15.0%.
Wording: "Starting a new heavy interstate operation? Get authority registration, BOC-3, UCR, CDL-driver compliance, IRP setup, and IFTA setup in one package."
Fee note: same IRP/IFTA-fees-separate note.

### H2: BOC-3 Included in every package
(§7) Every card shows the **"BOC-3 Included"** badge. For existing-carrier packages (Cards 1 and 2) use the longer line: "Includes BOC-3 filing when required or verification that the carrier's existing BOC-3 is correctly on file." Do NOT promote BOC-3 as a separate main package in this section.

### H2: Compare the packages
(§4 side-by-side comparison table. Design: DZ3 comparison component. Rows = services; columns = the four packages; ✓ / —; then Standalone value, Final package price, Customer savings.)

| Included service | Continuation Non-CDL | Continuation CDL/Heavy | Launch Non-CDL | Launch CDL/Heavy |
|---|---|---|---|---|
| MC Authority + USDOT | — | — | ✓ | ✓ |
| BOC-3 filing or verification | ✓ | ✓ | ✓ | ✓ |
| UCR filing service | ✓ | ✓ | ✓ | ✓ |
| UCR government fee (0-2) | ✓ | ✓ | ✓ | ✓ |
| Driver Qualification file | ✓ | ✓ | ✓ | ✓ |
| Clearinghouse setup | — | ✓ | — | ✓ |
| Consortium enrollment | — | ✓ | — | ✓ |
| Pre-employment drug test | — | ✓ | — | ✓ |
| IRP setup | — | ✓ | — | ✓ |
| IFTA setup | — | ✓ | — | ✓ |
| Standalone value | $476 | $1,351 | $1,126 | $2,001 |
| Final package price | $400 | $1,100 | $1,000 | $1,700 |
| Customer savings | $76 | $251 | $126 | $301 |

### H2: Additional drivers
Every package includes one driver. Additional drivers are priced by total count, and bundle pricing is always lower than standalone. In-bundle DQ: 2 drivers $350 total (+$150), 3 drivers $450 total (+$100), more than 3 = custom quote. Additional CDL drivers may also need extra pre-employment drug tests, Clearinghouse work, and consortium/compliance work. See [driver qualification files](/driver-qualification-files/).

### H2: Renewals and recurring billing
(§9 public wording, verbatim) "Package pricing covers the initial filing and first service period. UCR, consortium enrollment, Driver Qualification files, and IRP require renewal. IFTA returns are filed quarterly. We send reminders and invoices before services become due. Automatic billing is only used when the customer expressly authorizes it."

### H2: Packages FAQ
FAQPage schema, Grade 8:
- "How do I pick a package?" By your authority status (already running vs new) and your vehicle (CDL/heavy vs not). Choose by the vehicle you operate, not only whether the driver holds a CDL.
- "Is BOC-3 included?" Yes, in every package. For existing carriers it is a BOC-3 filing when required, or verification your BOC-3 is correctly on file.
- "What is not included?" IRP and IFTA government, state, plate, credential, and jurisdiction fees are billed separately. Additional drivers beyond the first are priced by count.
- "Can I buy a service on its own instead?" Yes. Every service is available à la carte at its standalone price; the packages are a lower-priced bundle.

### Closing CTA band
"Not sure which one? Answer two questions and we will match you. Choose your package." Button → `/apply`.

## Internal links out
`/compliance-services/` (hub), and each included service page (`/mc-registration/`, `/boc-3-filing/`, `/ucr-registration/`, `/driver-qualification-files/`, `/fmcsa-clearinghouse-registration/`, `/drug-and-alcohol-consortium/`, `/irp-registration/`, `/ifta-registration/`).

## Internal links in
Compliance hub (package-selector section), home, pillar, every service page ("or get it in a package").

## Schema (JSON-LD)
- `OfferCatalog` on the page listing the four bundles as `Offer`s, each `price` = the final bundle price (400/1100/1000/1700), `priceCurrency` USD, `itemOffered` a `Service`. Prices read from the single source (registry), never hardcoded twice.
- `BreadcrumbList`: Home > Compliance Services > Packages.
- `FAQPage`.

## Proof / claims discipline
- Every displayed number (itemized, rounding, savings, discount %) is DERIVED from the in-bundle prices in `services.md`; if a price moves, the displays recompute. Never hardcode.
- No "convenience fee"; no package-level discount beyond the in-bundle discounts + rounding. Savings framing is fine here (real: standalone value − package price), unlike the old single package.
- IRP/IFTA government fees always shown as separate/excluded. BOC-3 "Included" exactly as worded.
- **Naming exception:** the four package names contain an em dash ("Compliance Continuation — Non-CDL", etc.). These are the client's exact official product names (work order: "use these exact package names"), so they are the one sanctioned exception to the no-em-dash house rule. Keep them verbatim; do not convert the dash.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Design DZ3: four package cards, the side-by-side comparison table, the CDL/non-CDL selector + "choose by vehicle not driver" block, the "BOC-3 Included" badge, and the per-bundle itemized + rounding + savings display. Reuse the locked design system.
- Unique branded OG image ("Compliance Packages").
- Every figure from the registry's derived fields; the `/apply` bundle flow pre-selects a bundle from a card CTA.

## Uniqueness
Lead = the four-bundle selector ("authority status × vehicle type"); distinct from the hub and the individual service pages.
