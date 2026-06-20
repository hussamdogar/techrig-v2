# Brief: /eld-services/

## Meta
- **Action:** NEW. **Bucket:** 1. **Intent:** commercial / BOFU (CPC ~$23).
- **Primary:** eld for owner operators (210). **Secondaries:** eld compliance (320/KD35), best eld for owner operators, eld setup.
- **Word target:** 900 to 1,200 (tight).
- **Partner note:** Motive is Tech Rig's ELD partner. Do NOT call it an exclusive partner (do-not-publish list).

## Title tag (45 chars)
`ELD for Owner Operators and Fleets | Tech Rig`

## Meta description (155 chars)
`ELD for owner operators set up and supported. We help you choose, install, and run a compliant electronic logging device so your hours of service are clean.`

## Three Kings check
Primary "eld for owner operators" in: title (yes), first paragraph (yes), H2s ("What an ELD is and who needs one", "ELD for owner operators: how we help").

## Heading outline + copy

### H1: ELD Setup for Owner Operators and Fleets
**Hero lede:**
An electronic logging device (ELD) records your hours of service automatically, and most carriers are required to run one. The hard part is not the rule, it is choosing a device that fits your operation and setting it up so your logs are clean for inspections and audits. Tech Rig helps you get the right ELD in place. We work with Motive as our ELD partner, so owner-operators and small fleets get a setup that just works.

**Primary CTA (above fold):** button "Set up my ELD" → intake form. Until confirmed, route to `/contact-us/`. [VERIFY route.]

### H2: What an ELD is and who needs one
An ELD connects to your vehicle's engine and automatically records driving time, replacing paper logs for hours-of-service compliance. Most commercial drivers subject to hours-of-service rules are required to use one, with some exceptions for certain short-haul and older-vehicle operations. Running without a required ELD, or running one set up wrong, leads to violations at inspection and hurts your safety record.

### H2: ELD for owner operators: how we help
- We help you choose an ELD that fits your truck and operation, working with Motive.
- We help get it installed and your account configured so your hours of service log correctly.
- We connect ELD into the rest of your compliance so your records line up for inspections and audits.
- We point you to support when you need it, so a device problem does not become a compliance problem.

**Price line:** [VERIFY ELD setup service fee and any device/subscription cost with the client before publishing. Device and subscription costs are third-party (Motive) and must be shown separately from any Tech Rig service fee.]

### H2: ELD and the rest of your compliance
An ELD is part of running interstate cleanly, alongside your [IRP](/irp-registration/) and [IFTA](/ifta-registration/) setup. New carriers usually handle ELD around the time they start hauling. If you are still standing up the company, see the [full setup](/compliance-services/).

### H2: ELD FAQ
FAQPage schema, Grade 8:
- "Do owner-operators need an ELD?" Most drivers subject to hours-of-service rules need one, with limited exceptions. We confirm whether you are required to run one.
- "Which ELD should I use?" We work with Motive and help you pick a setup that fits your truck and operation.
- "Is the device cost included?" Device and subscription costs come from the provider and are separate from any Tech Rig service fee. We show you both.
- "Can you help if my ELD is logging wrong?" Yes. A misconfigured ELD causes inspection violations, so we make sure it is set up correctly and point you to support.

### Closing CTA band
"Need an ELD that keeps your logs clean? Get set up with the right device." Button "Set up my ELD".

## Internal links out
`/irp-registration/`, `/ifta-registration/`, `/compliance-services/`. Funnel link to `/services/` optional.

## Internal links in
Hub card + package; pillar (step 8); IRP/IFTA pages (interstate cluster); "what is an ELD" blog feeder if present.

## Schema (JSON-LD)
- `Service` (serviceType "ELD setup", provider {@id #org}, areaServed US, offers price [VERIFY] USD; omit price if unset).
- `BreadcrumbList`: Home > Compliance Services > ELD Services.
- `FAQPage`.

## Proof / claims discipline
- Motive named as a partner, never "exclusive."
- Device/subscription costs separated from service fee; price `[VERIFY]`.

## Reviewed-by
"Reviewed by Robert Hooke, Co-Founder" (systems/technology fit).

## Dev / Design notes
- Unique branded OG image ("ELD Setup"). Price chip only once confirmed.

## Uniqueness
Lead = "choosing and configuring the device" angle; distinct from all other pages.
