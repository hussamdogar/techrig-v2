# Brief: /mcs-150-biennial-update/

## Meta
- **Action:** NEW. **Bucket:** 1 (money). **Intent:** informational to BOFU.
- **Primary:** mcs-150 update (6,600/KD7). **Secondaries:** biennial update fmcsa (2,400/KD35), mcs-150 form, update usdot number.
- **Word target:** 1,500+.

## Title tag (45 chars)
`MCS-150 Update and Biennial Filing | Tech Rig`

## Meta description (158 chars)
`Need an MCS-150 update? We file your biennial update and any address, fleet, or status change with FMCSA, fast, so your USDOT stays active and your record is right.`

## Three Kings check
Primary "mcs-150 update" in: title (yes), first paragraph (yes), H2s ("When you need an MCS-150 update", "What our MCS-150 update service includes").

## Heading outline + copy

### H1: MCS-150 Update and Biennial Filing
**Hero lede:**
Your USDOT record is not set-and-forget. FMCSA requires an MCS-150 update every two years, and again any time your address, fleet size, company name, or operation changes. Let it lapse and FMCSA can deactivate your USDOT number, which stops you from operating legally. Tech Rig files your MCS-150 update for you, so your record stays current and your number stays active.

**Primary CTA (above fold):** button "Update my MCS-150" → UCR/MCS-150 intake form. Until confirmed, route to `/contact-us/`. [VERIFY route with Dev.]

### H2: What the MCS-150 is
The MCS-150 is the form that creates and maintains your USDOT number record with FMCSA. It carries your company details, your operation type, your number of power units and drivers, and your mileage. FMCSA uses it to keep your safety profile accurate. There are two reasons you file one: the regular biennial update, and an out-of-cycle update when something changes.

### H2: When you need an MCS-150 update
Plain list, Grade 8:
- **Every two years (the biennial update).** This is required even if nothing changed. The deadline is tied to your USDOT number, based on the last two digits and whether the number is odd or even.
- **You moved.** A new business or mailing address has to be reflected, and an out-of-date address causes real problems (see the example below).
- **Your fleet changed.** More or fewer trucks or drivers.
- **Your operation changed.** New cargo, a new authority type, going from intrastate to interstate.
- **You are reactivating.** Bringing a dormant USDOT back often starts with an MCS-150.

Why the biennial update matters: if you skip it, FMCSA can mark your USDOT inactive. An inactive number can stall insurance, new authority, and load access until it is fixed.

### H2: Why a wrong record is more than paperwork
Real worked example (publishable, distinct to this page): a New Jersey power-only carrier had left the apartment number off his address when he first registered. His insurer warned that the policy could be cancelled unless the FMCSA record was corrected. We filed the MCS-150 correction, and the right address appeared on his record within 24 hours, which resolved the insurance issue. Small record errors create big operational problems, and they are usually quick for us to fix.

### H2: What our MCS-150 update service includes
- We confirm what triggered the update (biennial, address, fleet, status) and what FMCSA needs.
- We complete and submit the MCS-150 for you.
- If you are locked out of MOTUS or missing a USDOT PIN, we work the issue, including the FMCSA callback process when records will not update online.
- We confirm the change is reflected on your record.

**Price line:** Our MCS-150 update or correction service is a flat $125. If FMCSA processing requires anything beyond the standard filing, we tell you before any extra step.

**Mid-page CTA:** text link "Update my MCS-150".

### H2: MOTUS, PINs, and why updates get stuck
Short, demonstrates expertise. FMCSA's move to the MOTUS system has made some updates harder than they used to be. To claim or change an existing USDOT online you may need a USDOT PIN, and FMCSA no longer emails PINs the way it once did, which can leave carriers waiting on a mailed letter. When the online path is blocked, we know the workarounds, including paper filings and triggering an official FMCSA callback so a live agent can verify your identity and unlock the record. This is daily work for us.

### H2: MCS-150 update FAQ
FAQPage schema, Grade 8:
- "How often do I have to file an MCS-150?" At least every two years for the biennial update, plus any time your information changes. The biennial schedule is based on your USDOT number.
- "What happens if I miss my biennial update?" FMCSA can deactivate your USDOT number. Operating on an inactive number is a compliance problem and can block insurance and loads.
- "Can you update my address only?" Yes. Address, fleet size, company name, and operation changes are all MCS-150 updates.
- "I do not have my USDOT PIN. Can you still help?" Yes. We handle PIN and MOTUS lockouts, including the FMCSA callback process, so we can move your update forward.
- "How long does it take?" Standard filings are quick on our side. Government processing time is outside our control, so we do not promise a date, but we make sure nothing on your end holds it up.

### Closing CTA band
"Due for your biennial update, or need a correction? We will file it and confirm it landed." Button "Update my MCS-150".

## Internal links out
`/dot-registration/` ("USDOT number"), `/ucr-registration/` ("annual UCR"), `/compliance-services/` ("full setup"). Funnel link to `/services/` optional.

## Internal links in
Hub card + package; UCR page ("annual upkeep" cluster); DOT page ("keep it active"); dispatch pages' compliance-upkeep link; "what is MCS-150" blog feeder if present.

## Schema (JSON-LD)
- `Service` (serviceType "MCS-150 update", provider DGR Tech Rig LLC, areaServed US, offers price 125 USD).
- `BreadcrumbList`: Home > Compliance Services > MCS-150 Update.
- `FAQPage`.

## Proof / claims discipline
- No guaranteed timelines (only the documented "within 24 hours" past result, framed as past).
- Biennial schedule described generally; do not invent a specific date for the reader.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("MCS-150 Update").
- Price chip from single source.

## Uniqueness
Worked example = NJ power-only address correction with insurance angle. Distinct from all other pages.
