# Brief: /usdot-correction/

## Meta
- **Action:** NEW (per client 2026-06-25, Q3.1 / D3). **Bucket:** 1 (money). **Intent:** BOFU.
- **Primary:** usdot correction (verify vol). **Secondaries:** update usdot information, change usdot information, usdot address change, usdot update.
- **Word target:** 800 to 1,100.
- **Distinct from `/mcs-150-biennial-update/`** (the two-year filing). This page is the ad-hoc correction service.

## Title tag (44 chars)
`USDOT Correction and Updates | Tech Rig`

## Meta description (156 chars)
`Need to fix or update your USDOT record? Tech Rig files USDOT corrections, address, name, contact, status, truck and driver changes, for a flat $125.`

## Three Kings check
Primary "usdot correction" in: title (yes), first paragraph (yes), H2s ("What a USDOT correction covers", "What our USDOT correction service costs").

## Heading outline + copy

### H1: USDOT Correction and Record Updates
**Hero lede:**
Your USDOT record has to stay accurate, and an out-of-date detail can cause real problems, from insurance issues to a flagged record. A USDOT correction updates the specific information on file with FMCSA whenever something changes, separate from the two-year Biennial Update. Tech Rig files your USDOT correction for you, for a flat $125.

**Primary CTA (above fold):** button "Correct my USDOT" → the `/apply/` flow for this service. [Dev wires route.]

### H2: What a USDOT correction covers
Plain list (the scope confirmed by the client):
- Address change
- Legal or business name change
- Email change
- Phone-number change
- Operating-authority status change
- Number of trucks change
- Number of drivers change
If you need the regular two-year filing instead, see the [Biennial Update](/mcs-150-biennial-update/).

### H2: What our USDOT correction service costs
- **$125**, flat. The fee covers filing the correction with FMCSA.
- If your MOTUS account or USDOT link needs FMCSA support to unlock first, we handle that as part of the work (see timing below).

### H2: How fast it is done
Normally same day when your MOTUS account is active and your USDOT record is linked. If FMCSA linking or support is needed, that step can take roughly 7 to 10 business days, which is FMCSA's timeline, not ours. We keep your side moving and tell you where it stands. (We do not promise an FMCSA-controlled date.)

### H2: USDOT correction FAQ
FAQPage schema, Grade 8:
- "What can you correct on my USDOT?" Address, legal/business name, email, phone, operating-authority status, number of trucks, and number of drivers.
- "Is this the same as the biennial update?" No. The [Biennial Update](/mcs-150-biennial-update/) is the required two-year filing; a correction updates specific details when they change.
- "How much is it?" $125, flat.
- "How long does it take?" Normally same day when MOTUS is active and your USDOT is linked; FMCSA linking/support can add about 7 to 10 business days.

### Closing CTA band
"Something on your USDOT out of date? We will correct it, fast." Button "Correct my USDOT".

## Internal links out
`/mcs-150-biennial-update/`, `/dot-registration/`, `/compliance-services/`, `/motus-migration/` (if the record is locked in MOTUS).

## Internal links in
Hub card; pillar; DOT page ("keep it accurate"); MOTUS migration page (related).

## Schema (JSON-LD)
- `Service` (serviceType "USDOT correction", provider {@id #org}, areaServed US, offers price 125 USD).
- `BreadcrumbList`: Home > Compliance Services > USDOT Correction.
- `FAQPage`.

## Proof / claims discipline
- No guaranteed FMCSA timeline. FMCSA still mails USDOT PINs (do not say otherwise). MOTUS for current records, not "FMCSA Portal."

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Registry entry already exists ($125). Unique branded OG image ("USDOT Correction"). Price chip from the single source.

## Uniqueness
Lead = ad-hoc record correction vs the two-year filing; distinct from the Biennial Update page.
