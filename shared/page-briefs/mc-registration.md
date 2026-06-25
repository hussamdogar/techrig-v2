# Brief: /mc-registration/

## Meta
- **Action:** REPURPOSE (existing Google Ads landing page → organic money page). **Bucket:** 1. **Intent:** informational to BOFU.
- **Primary:** mc number (5,400/KD12). **Secondaries:** mc authority (880), how to get mc number (1,600), mc number cost (590), how long does it take to get mc number (140).
- **Word target:** 1,500+.
- **Migration note (for Dev):** keep URL `/mc-registration/`. Remove ads-only/noindex treatment, add to sitemap, expand to full content. No redirect (same URL). Preserve conversion tracking. See `migration-plan.md`.
- **Also covers (section):** insurance filing, since it gates MC activation. Cross-link to `/trucking-insurance-filing/`.

## Title tag (44 chars)
`How to Get Your MC Number | Tech Rig Filing`

## Meta description (159 chars)
`How to get an MC number and operating authority the right way. Tech Rig files your MC application, BOC-3, and insurance so your authority actually activates.`

## Three Kings check
Primary "mc number" in: title (yes), first paragraph (yes), H2s ("What an MC number is", "How to get an MC number with Tech Rig").

## Heading outline + copy

### H1: How to Get Your MC Number (Operating Authority)
**Hero lede:**
An MC number is your operating authority: the federal permission to haul regulated freight for hire across state lines. A USDOT number identifies you; an MC number lets you legally carry other people's goods for money. Getting one means more than submitting a form. Tech Rig files your MC application, your BOC-3, and lines up your insurance filing so your authority actually activates instead of stalling at the finish line.

**Primary CTA (above fold):** button "Get my MC authority" → MC intake form. Until confirmed, route to `/contact-us/`. [VERIFY route with Dev.]

### H2: What an MC number is
An MC number (motor carrier operating authority) is issued by FMCSA and is required for most for-hire carriers moving regulated commodities in interstate commerce. It is separate from your USDOT number. Many interstate for-hire carriers need both: the USDOT number for identification and safety, the MC number for the authority to haul for pay. Private carriers hauling only their own goods, and some exempt commodities, may not need an MC number. We confirm whether you do before you pay for anything.

### H2: How to get an MC number, and where it goes wrong
Numbered, Grade 8:
1. Confirm you actually need operating authority for your operation (not everyone does).
2. Choose the correct authority type. The wrong classification can mean you cannot legally do the work you intended.
3. File the MC application (OP-1 family).
4. File your [BOC-3](/boc-3-filing/) to designate a process agent in every state.
5. Get your insurance filed with FMCSA by your insurer.
6. Clear the mandatory 21-day protest period, after which the authority can activate if everything else is in place.

The trap: carriers reach the end of the 21-day window and discover their authority still will not activate, because the BOC-3 or the insurance filing was missing or wrong. Submitting the application is not the same as being ready to operate. (UCR is a separate annual obligation, not an activation requirement.)

### H2: How to get an MC number with Tech Rig
We confirm you actually need operating authority and the correct authority type, then file your MC application and BOC-3 and coordinate your insurance so nothing blocks activation. Already have an older or dismissed authority stuck in the FMCSA-to-MOTUS transition? That is a different job, our [MOTUS migration](/motus-migration/) service handles claiming an existing USDOT, reinstating after a dismissal (a dismissed MC cannot simply be reinstated, so we file a new authority application), and untangling legacy-portal problems.

What you get with us:
- Confirmation that you need authority, and the correct authority type.
- Your MC application, BOC-3, and insurance coordination handled together so nothing blocks activation.
- A realistic picture of timing, including the mandatory protest period.
- A clean path into driver compliance and dispatch once you are active.

**Mid-page CTA:** text link "Get my MC authority".

### H2: What an MC number costs
- **Tech Rig service fee:** $600, one-time, for your MC authority application. This includes your USDOT number: when you file for MC authority, the USDOT is issued with it, so you do not pay the standalone USDOT fee on top.
- **BOC-3:** $100, required to activate authority (often filed with the MC application).
- **Insurance filing:** filed by your insurer; the premium is separate. We coordinate the filing so it lands. See [insurance filing](/trucking-insurance-filing/).
- **Government fee:** any FMCSA application fee is shown separately. [VERIFY current FMCSA fee.]
- Want it all handled at once? The [full $1,700 package](/compliance-services/) bundles MC + USDOT, BOC-3, UCR, Clearinghouse, consortium, pre-employment drug test, IFTA setup, IRP setup, and one DQ file (insurance is coordinated with your own insurer, not a Tech Rig service).

### H2: MC authority FAQ
FAQPage schema, Grade 8:
- "Do I need an MC number or just a USDOT number?" Many interstate for-hire carriers need both. Private carriers and some exempt freight may need only a USDOT number. We confirm before you pay.
- "How long does it take to get an MC number?" After filing, FMCSA requires a mandatory 21-day protest period, and activation also depends on your BOC-3 and insurance being in place. We do not promise a date, but we make sure nothing on your side delays it.
- "My MC was dismissed. Can you reinstate it?" A dismissed MC generally cannot be reinstated. We file a new operating authority application (you usually keep the old MC number, but the authority age resets), often as part of our [MOTUS migration](/motus-migration/) service.
- "Why did my authority not activate after 21 days?" Almost always a missing or incorrect BOC-3 or insurance filing. We make sure both are correct so activation is not held up. (UCR is separate and is not an activation requirement.)
- "Can you fix an MC I started myself?" Yes. Correcting wrong classifications and incomplete DIY filings is a large part of our work.

### Closing CTA band
"Ready to run for hire? Get your MC authority filed so it actually activates." Button "Get my MC authority".

## Internal links out
`/dot-registration/`, `/boc-3-filing/`, `/trucking-insurance-filing/`, `/ucr-registration/`, `/compliance-services/`, `/mc-dot-registration/` (the DOT+MC bundle). Funnel link to `/services/` optional.

## Internal links in
Hub card + package; pillar; DOT page (cross "DOT vs MC"); bundle page; "how to get DOT and MC number" blog feeder.

## Schema (JSON-LD)
- `Service` (serviceType "MC operating authority registration", provider DGR Tech Rig LLC, areaServed US, offers price 600 USD).
- `BreadcrumbList`: Home > Compliance Services > MC Authority.
- `FAQPage`.

## Proof / claims discipline
- No guaranteed activation dates; the protest period and FMCSA processing are outside our control (do-not-publish list).
- Dismissed-MC example is a real past case, framed as such.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("MC Authority").
- Preserve existing ad-conversion tracking on this repurposed URL.
- Price chip from single source.

## Uniqueness
No client worked example on this page anymore: the CA dismissed-MC/Amazon story was relocated to `/motus-migration/` (S2, 2026-06-25). This page is research-led + routes reinstatement/migration intent to the MOTUS page.
