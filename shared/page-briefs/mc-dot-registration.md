# Brief: /mc-dot-registration/ (DOT+MC bundle)

## Meta
- **Action:** REPURPOSE (existing Ads landing page → organic bundle page). **Bucket:** 1. **Intent:** commercial / BOFU.
- **Primary:** trucking authority package (210/KD1). **Secondaries:** how to get mc and dot number (140), trucking authority service (20), operating authority trucking (30).
- **Word target:** 1,200 to 1,500.
- **Role:** the "get my authority done together" offer. Sits under the hub; the conversion target for the full package. Differentiated from `/dot-registration/` (USDOT only) and `/mc-registration/` (MC only) by being the combined bundle.
- **Migration note:** keep URL; remove ads-only/noindex; add to sitemap; expand. Preserve conversion tracking.

## Title tag (50 chars)
`Get Your MC and DOT Number Together | Tech Rig`

## Meta description (157 chars)
`Get your MC and DOT number as one package. Tech Rig files your USDOT, MC authority, BOC-3, and UCR together so your trucking authority activates without gaps.`

## Three Kings check
Primary "trucking authority package" in: title (as the concept "MC and DOT together"; include exact phrase in first paragraph and a H2), first paragraph (yes), H2s ("What the trucking authority package includes", "Why a trucking authority package beats filing piecemeal").

## Heading outline + copy

### H1: Get Your MC and DOT Number Together
**Hero lede:**
Most new for-hire carriers do not need one filing, they need the set, in the right order. Our trucking authority package files your USDOT number, your MC operating authority, your BOC-3, and your UCR together, and coordinates your insurance filing, so the pieces line up and your authority actually activates. One process, one point of contact, no gaps for something to fall through.

**Primary CTA (above fold):** button "Get my authority package" → `/apply/?service=mc-authority` (the in-app application flow; the bundle starts from the MC authority service). Mid-page and closing CTAs use the same route.

### H2: What the trucking authority package includes
- [USDOT number](/dot-registration/) registration and FMCSA portal setup.
- [MC operating authority](/mc-registration/) application.
- [BOC-3](/boc-3-filing/) blanket process-agent filing (we are FMCSA-listed).
- [UCR registration](/ucr-registration/) for the current year.
- Insurance filing coordination so it lands before activation.
Need driver compliance and interstate filings too (DQ files, Clearinghouse, consortium, IRP, IFTA, ELD)? Step up to the [full compliance package](/compliance-services/) at $1,350.

### H2: What it costs
- The MC authority filing is $600 and **includes your USDOT number** (you do not pay the standalone $300 USDOT on top). Add the [BOC-3](/boc-3-filing/) at $100 and [UCR](/ucr-registration/) from $100 to complete the core authority.
- Government fees and your insurance premium are separate and shown up front.
- The complete setup with driver and interstate compliance is the [$1,350 full package](/compliance-services/), which already includes the MC and UCR (0-2 bracket) government fees.

### H2: Why a trucking authority package beats filing piecemeal
Filing the pieces separately, in the wrong order, is exactly how carriers reach day 21 with an authority that still will not activate, because the BOC-3 or insurance filing was missing. The package exists so nothing is missed and nothing waits on a step you did not know you needed. (The dismissed-authority and legacy-account scenarios are handled separately by our [MOTUS migration](/motus-migration/) service.)

### H2: Trucking authority package FAQ
FAQPage schema:
- "What is the difference between a USDOT and an MC number?" The USDOT number identifies your operation; the MC number is your authority to haul regulated freight for hire. Many interstate carriers need both. See [USDOT](/dot-registration/) and [MC authority](/mc-registration/).
- "Do I need the package, or can I buy one filing?" You can buy any filing on its own. The package is for new carriers who want the whole authority handled together so the pieces line up.
- "How long until I am active?" After filing, FMCSA requires a mandatory 21-day protest period, and activation depends on your insurance and BOC-3 being in. We do not promise a date; we make sure nothing on your side delays it.
- "Can you fix a dismissed or stalled authority?" Yes, that is our [MOTUS migration](/motus-migration/) service: we file new authority applications and untangle stalled or legacy-portal accounts regularly.

### Closing CTA band
"Get the whole authority handled, in the right order. Start your package." Button "Get my authority package".

## Internal links out
`/dot-registration/`, `/mc-registration/`, `/boc-3-filing/`, `/ucr-registration/`, `/trucking-insurance-filing/`, `/compliance-services/`. Funnel link to `/services/` in closing.

## Internal links in
Hub (prominent), pillar, DOT/MC pages (lateral "get them together"), home.

## Schema (JSON-LD)
- `Service` (serviceType "Trucking operating authority package", provider {@id #org}, areaServed US, offers "from" price [VERIFY]).
- `BreadcrumbList`: Home > Compliance Services > MC and DOT Authority.
- `FAQPage`.

## Proof / claims discipline
- No guaranteed timelines. The dismissed-MC worked example was removed from this page (relocated to `/motus-migration/`, S2 2026-06-25); this page is research-led and routes migration intent to the MOTUS page.
- Do not invent a bundle price; mark `[VERIFY]`.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("MC + DOT Authority Package").
- Preserve ad-conversion tracking on this repurposed URL.

## Uniqueness
Lead = the "filed in the right order" sequencing angle; no client worked example here (the CA dismissed-MC story moved to `/motus-migration/`).
