# Brief: /irp-registration/

## Meta
- **Action:** NEW. **Bucket:** 1. **Intent:** transactional / BOFU.
- **Primary:** irp registration (3,600/KD28). **Secondaries:** apportioned plates (2,400/KD~2), apportioned registration, irp plates.
- **Word target:** 1,500+.
- **Pairs with** `/ifta-registration/` (operationally linked, separate pages).

## Title tag (50 chars)
`IRP Registration and Apportioned Plates | Tech Rig`

## Meta description (156 chars)
`IRP registration and apportioned plates handled for you. We file your IRP so you can run interstate legally and pay registration fees across your travel states.`

## Three Kings check
Primary "irp registration" in: title (yes), first paragraph (yes), H2s ("What IRP registration is", "What our IRP registration service includes").

## Heading outline + copy

### H1: IRP Registration and Apportioned Plates
**Hero lede:**
If you run a qualifying commercial vehicle across state lines, you need apportioned plates through the International Registration Plan. IRP registration lets you operate in multiple states on one set of plates, with your registration fees split among the states you travel based on the miles you run in each. Tech Rig handles your IRP registration so you can run interstate legally, without learning a new state portal.

**Primary CTA (above fold):** button "Start my IRP registration" → `/apply/?service=irp` (the in-app application flow). Mid-page and closing CTAs use the same route.

### H2: What IRP registration is
The International Registration Plan is an agreement among the U.S. states and Canadian provinces that lets interstate carriers register in their base state and operate across member jurisdictions on apportioned plates. Instead of registering your truck separately in every state you drive through, you register once and your fees are apportioned, split among states in proportion to the miles you run in each. The plates you receive are called apportioned plates. IRP generally applies to vehicles over a certain weight, or with three or more axles, used interstate.

### H2: IRP vs IFTA: what is the difference
Short, because people confuse them. IRP is about registration and plates. [IFTA](/ifta-registration/) is about fuel taxes. Most interstate carriers need both, and we usually set them up together, but they are separate programs with separate filings. This page covers IRP; the [IFTA page](/ifta-registration/) covers fuel tax.

### H2: What our IRP registration service includes
- We confirm your base jurisdiction and whether IRP applies to your operation.
- We prepare and submit your IRP application with your fleet and travel information.
- We help you estimate the fees, which depend on your states, mileage, and vehicle weight, so there are no surprises.
- We coordinate IRP with your [IFTA](/ifta-registration/) setup if you need both.

**Price line:** Our IRP setup fee is $175. The state registration fees themselves are set by the jurisdictions and your mileage, and are paid separately. We show you which is our fee and which is the government fee before you pay.

**Mid-page CTA:** text link "Start my IRP registration".

### H2: When you need apportioned plates
- You operate a qualifying interstate vehicle (weight or axle thresholds).
- You cross state lines for hire or for your own freight in interstate commerce.
- You are adding trucks to a fleet that already runs interstate.
If you only ever run inside one state, IRP may not apply to you. We confirm before you pay. (No client case study: confirmed 2026-06-21 that Tech Rig has not filed IRP for a client yet, so this page runs a neutral "Contact us for IRP services" layout with no worked example. Do not fabricate one.)

### H2: IRP registration FAQ
FAQPage schema, Grade 8:
- "What are apportioned plates?" Plates issued under the International Registration Plan that let you run interstate, with your registration fees split among the states you travel based on mileage.
- "Do I need IRP and IFTA?" Most interstate carriers need both. IRP is registration and plates; [IFTA](/ifta-registration/) is fuel tax. They are separate filings.
- "How are IRP fees calculated?" By your registered weight and the share of miles you run in each member state. Because mileage drives the fee, estimates depend on your routes.
- "Do I pay the state fees to Tech Rig?" No. Government registration fees are separate and go to the jurisdictions. Our service fee is for handling the filing. You see both up front.
- "What if I only run in one state?" IRP is for interstate operation. If you run purely intrastate, it may not apply. We will tell you.

### Closing CTA band
"Running interstate? Get your apportioned plates handled the right way." Button "Start my IRP registration".

## Internal links out
`/ifta-registration/` (paired), `/compliance-services/`, `/mc-registration/` (authority context). Funnel link to `/services/` optional.

## Internal links in
Hub card + package; pillar (step 8); IFTA page (cross-link); ELD page (interstate cluster).

## Schema (JSON-LD)
- `Service` (serviceType "IRP registration", provider {@id #org}, areaServed US, offers price 175 USD; state fees not encoded as price).
- `BreadcrumbList`: Home > Compliance Services > IRP Registration.
- `FAQPage`.

## Proof / claims discipline
- IRP setup fee confirmed $175; never encode state fees as the price (they depend on mileage and states).
- No fee figures invented.

## Reviewed-by
"Reviewed by Robert Hooke, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("IRP Registration").
- Price chip from single source once the fee is confirmed.

## Uniqueness
Lead = interstate apportioned-plate framing; distinct from all other pages. No client named yet (flagged).
