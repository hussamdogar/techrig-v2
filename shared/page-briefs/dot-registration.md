# Brief: /dot-registration/

## Meta
- **Action:** REPURPOSE (existing Google Ads landing page → organic money page). **Bucket:** 1. **Intent:** informational to BOFU.
- **Primary:** how to get a dot number (6,600/KD10). **Secondaries:** usdot number (8,100), dot number cost (1,000), dot number (9,900, use as H2/body only, never the sole primary).
- **Word target:** 1,500+.
- **Migration note (for Dev):** keep the URL `/dot-registration/`. Remove any `noindex`/ads-only treatment, add to the sitemap, expand from the thin ad page to the full content below. No redirect needed (same URL). Preserve any existing conversion tracking. See `migration-plan.md`.

## Title tag (47 chars)
`How to Get a DOT Number for Trucking | Tech Rig`

## Meta description (157 chars)
`How to get a DOT number without the headaches. Tech Rig sets up your USDOT registration, handles the FMCSA portal, and gets your number right the first time.`

## Three Kings check
Primary "how to get a dot number" in: title (yes), first paragraph (yes), H2s ("How to get a DOT number, step by step", "Let us handle how to get a DOT number for you").

## Heading outline + copy

### H1: How to Get a DOT Number
**Hero lede:**
A USDOT number is how the federal government identifies and tracks your trucking operation. If you run a commercial vehicle over a certain weight, carry enough passengers, or haul interstate, you need one before you operate. Figuring out how to get a DOT number on your own means navigating the MOTUS system, the right operation classifications, and FMCSA's requirements. Tech Rig does it for you and gets it right the first time.

**Primary CTA (above fold):** button "Get my USDOT number" → USDOT intake form. Until confirmed, route to `/contact-us/`. [VERIFY route with Dev.]

### H2: What a USDOT number is and who needs one
A USDOT number is your unique federal ID as a motor carrier. FMCSA uses it for safety records, inspections, audits, and crash data. You generally need one if you operate a vehicle that meets the federal weight, passenger, or hazardous-materials thresholds in interstate commerce, and many states require it for intrastate operation too. A USDOT number is not the same as operating authority (your MC number). Some carriers need only a USDOT number; others need both. We tell you which applies to your operation.

### H2: How to get a DOT number, step by step
Numbered, Grade 8, honest about the work:
1. Decide your operation type and classification (carrier, interstate or intrastate, cargo type). Getting this wrong causes problems later.
2. Set up your MOTUS account.
3. Complete the MCS-150 application, which creates your USDOT record.
4. Submit and receive your USDOT number.
5. If you also need operating authority, file your [MC application](/mc-registration/) and [BOC-3](/boc-3-filing/) next.

This is doable yourself. It is also where new carriers most often stall, because of classification mistakes and MOTUS account issues.

### H2: What a USDOT number costs
- **Tech Rig service fee:** $300, one-time, to register your USDOT number and set up your FMCSA portal correctly. This standalone price is for carriers who need a USDOT number only. If you also need operating authority, your [MC filing](/mc-registration/) includes the USDOT, so you would not pay this separately.
- **Government fee:** the USDOT number itself is issued by FMCSA. Any government fee is shown separately from our service fee. [VERIFY current FMCSA fee treatment before publishing a figure.]
- Need authority too? See the [MC authority](/mc-registration/) page, or get the [full setup](/compliance-services/) as one package.

### H2: Let us handle how to get a DOT number for you
Worked example (new-carrier, straightforward): a Texas operator starting a new box-truck company came to us to get road-legal. We confirmed the correct operation classification and entity details, set up the MOTUS account, and filed the application with the right vehicle and driver counts and cargo type, and a new USDOT number was issued. A clean new registration is quick when the classification and details are right the first time, which is where DIY filings usually go wrong. (Migrating an OLDER account into MOTUS is a different job, see our [MOTUS migration](/motus-migration/) service.)

What you get with us:
- Correct operation classification from the start.
- Your MOTUS account set up properly.
- Your USDOT number registered and confirmed.
- A clean handoff into MC authority, BOC-3, and the rest if you need them.

**Mid-page CTA:** text link "Get my USDOT number".

### H2: USDOT number FAQ
FAQPage schema, Grade 8:
- "Do I need a USDOT number, an MC number, or both?" It depends on your operation. Interstate for-hire carriers usually need both. Some carriers need only a USDOT number. We confirm which applies to you.
- "How long does it take to get a USDOT number?" The registration itself is quick once the application is correct. Government processing and MOTUS issues can add time, so we do not promise a date, but we keep your side moving.
- "What is MOTUS and why does it matter?" MOTUS is FMCSA's newer system. Existing records sometimes have to be claimed or linked before you can register or update, and that is where carriers get stuck. We handle it.
- "Can you reactivate an old USDOT number?" Yes. Reactivation often starts with an MCS-150 and may involve a MOTUS linkage; if your older account will not come over, that is our [MOTUS migration](/motus-migration/) service.
- "Is the USDOT number a one-time thing?" The number is yours, but you must keep it current with [MCS-150 updates](/mcs-150-biennial-update/), including the biennial update.

### Closing CTA band
"Starting a trucking operation? Get your USDOT number set up right, the first time." Button "Get my USDOT number".

## Internal links out
`/mc-registration/`, `/boc-3-filing/`, `/compliance-services/`, `/mcs-150-biennial-update/`. Funnel link to `/services/` optional in closing.

## Internal links in
Hub card + package; pillar; MC page (cross "DOT vs MC"); the "how to get DOT and MC number" blog feeder (existing, REFRESH) links here; bundle page.

## Schema (JSON-LD)
- `Service` (serviceType "USDOT registration", provider DGR Tech Rig LLC, areaServed US, offers price 300 USD).
- `BreadcrumbList`: Home > Compliance Services > USDOT Registration.
- `FAQPage`.

## Proof / claims discipline
- No guaranteed timelines. Worked example is now a clean new-carrier (TX) registration; the CA legacy-migration story was relocated to `/motus-migration/` (S2). For new registrations use "MOTUS," not "FMCSA Portal."
- Do not state a specific government USDOT fee until verified.

## Reviewed-by
"Reviewed by Robert Hooke, Co-Founder" (systems background fits the MOTUS/portal angle).

## Dev / Design notes
- Unique branded OG image ("USDOT Number").
- Confirm the intake/payment route and preserve existing ad-conversion tracking on this repurposed URL.
- Price chip from single source.

## Uniqueness
Worked example = TX new-carrier clean registration (kept migration-free per S2). "DOT number" (9,900) used only in body/H2, never as the sole primary (gov-owned SERP).
