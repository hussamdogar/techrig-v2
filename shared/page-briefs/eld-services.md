# Brief: /eld-services/

## Meta
- **Action:** NEW. **Bucket:** 1. **Intent:** commercial / BOFU (CPC ~$23).
- **Primary:** eld for owner operators (210). **Secondaries:** eld compliance (320/KD35), best eld for owner operators.
- **Word target:** 700 to 1,000 (tight; this is a referral/guidance page, not a service Tech Rig performs).
- **CLIENT RULE (2026-06-21): Tech Rig does NOT handle ELD directly.** It refers clients to an ELD partner company (Motive). The page must read as "we connect you with our ELD partner," never as "we set up / install / configure your ELD." No Tech Rig fee, no price chip. Motive is the partner, never called "exclusive."

## Title tag (43 chars)
`ELD for Owner Operators | Tech Rig`

## Meta description (155 chars)
`ELD for owner operators, made simple. Tech Rig connects you with our trusted ELD partner for a compliant device, so your hours of service stay clean and audit-ready.`

## Three Kings check
Primary "eld for owner operators" in: title (yes), first paragraph (yes), H2s ("What an ELD is and who needs one", "How ELD works with Tech Rig").

## Heading outline + copy

### H1: ELD for Owner Operators and Fleets
**Hero lede:**
An electronic logging device (ELD) records your hours of service automatically, and most carriers are required to run one. We do not sell or set up ELDs ourselves. Instead, Tech Rig connects you with our trusted ELD partner, so owner-operators and small fleets get a compliant device from a provider we know, without shopping the market blind.

**Primary CTA (above fold):** button "Get connected with our ELD partner" → referral/contact route. [Dev to wire the referral link; until then route to `/contact-us/`.]

### H2: What an ELD is and who needs one
An ELD connects to your vehicle's engine and automatically records driving time, replacing paper logs for hours-of-service compliance. Most commercial drivers subject to hours-of-service rules are required to use one, with some exceptions for certain short-haul and older-vehicle operations. Running without a required ELD, or running one set up wrong, leads to violations at inspection and hurts your safety record. We confirm whether you are required to run one.

### H2: How ELD works with Tech Rig
- We do not provide or install ELDs. We refer you to our ELD partner, who supplies the device and handles the setup.
- You buy the device and subscription directly from the partner. There is no charge from Tech Rig for the referral.
- We make sure ELD is on your radar at the right point in your compliance, alongside your [IRP](/irp-registration/) and [IFTA](/ifta-registration/), so nothing is missed when you start hauling.

**Price line:** No Tech Rig fee. Device and subscription costs are the partner's, paid to the partner. Do not show a Tech Rig price chip on this page.

### H2: ELD and the rest of your compliance
An ELD is part of running interstate cleanly, alongside your [IRP](/irp-registration/) and [IFTA](/ifta-registration/). New carriers usually sort out ELD around the time they start hauling. If you are still standing up the company, see the [full setup](/compliance-services/).

### H2: ELD FAQ
FAQPage schema, Grade 8:
- "Do owner-operators need an ELD?" Most drivers subject to hours-of-service rules need one, with limited exceptions. We confirm whether you are required to run one.
- "Does Tech Rig set up my ELD?" No. We refer you to our ELD partner, who provides the device and the setup. We make the introduction and keep ELD in your compliance plan.
- "What does the referral cost?" Nothing from Tech Rig. You pay the partner directly for the device and subscription.
- "Which ELD will I get?" Our partner's compliant device, suited to your truck and operation. They handle the configuration.

### Closing CTA band
"Need a compliant ELD without the guesswork? We will connect you with our ELD partner." Button "Get connected with our ELD partner".

## Internal links out
`/irp-registration/`, `/ifta-registration/`, `/compliance-services/`. Funnel link to `/services/` optional.

## Internal links in
Hub card; pillar (step 8); IRP/IFTA pages (interstate cluster); "what is an ELD" blog feeder if present.

## Schema (JSON-LD)
- `Service` (serviceType "ELD partner referral", provider {@id #org}, areaServed US). OMIT `offers`/price (no Tech Rig fee; the device/subscription is the partner's). Do not encode the partner's price. Do not describe Tech Rig as the ELD provider.
- `BreadcrumbList`: Home > Compliance Services > ELD Services.
- `FAQPage`.

## Proof / claims discipline
- **Tech Rig does not provide, sell, install, or configure ELDs.** Frame strictly as a referral to the ELD partner. Never say "we set up / we install / we configure your ELD."
- Partner (Motive) named, never "exclusive." Disclose the referral relationship honestly (Tech Rig may earn a referral commission from the partner; no charge to the client).
- No Tech Rig price on this page.

## Reviewed-by
"Reviewed by Robert Hooke, Co-Founder" (systems/technology fit).

## Dev / Design notes
- Unique branded OG image ("ELD"). No price chip.
- Wire the CTA to the ELD partner referral link when supplied.

## Uniqueness
Lead = "we connect you with our ELD partner" (referral angle); distinct from all other pages.
