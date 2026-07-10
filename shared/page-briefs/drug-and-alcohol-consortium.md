# Brief: /drug-and-alcohol-consortium/

## Meta
- **Action:** NEW. **Bucket:** 1. **Intent:** BOFU (high commercial value, CPC ~$21.61).
- **Primary:** drug and alcohol consortium (320/KD19). **Secondaries:** consortium enrollment, dot drug and alcohol program, owner operator drug consortium.
- **Covers as a section:** pre-employment drug test (standalone term 5,400 but broad/KD38; not its own page).
- **Word target:** 1,300 to 1,500.

## Title tag (52 chars)
`Drug and Alcohol Consortium for Trucking | Tech Rig`

## Meta description (158 chars)
`Join a DOT drug and alcohol consortium the easy way. We enroll your drivers, set up random testing and pre-employment tests, and keep your program compliant.`

## Three Kings check
Primary "drug and alcohol consortium" in: title (yes), first paragraph (yes), H2s ("What a drug and alcohol consortium is", "What our drug and alcohol consortium enrollment includes").

## Heading outline + copy

### H1: Drug and Alcohol Consortium Enrollment
**Hero lede:**
If you hold a CDL and operate under FMCSA, you are required to be in a DOT drug and alcohol testing program, and for owner-operators that means joining a consortium. A consortium pools drivers for random testing and manages the program for you. Skip it and you are not legal to drive a CDL vehicle, and it is one of the first things an audit checks. Tech Rig enrolls you in a drug and alcohol consortium and keeps your testing program compliant.

**Primary CTA (above fold):** button "Enroll in a consortium" → `/apply/?service=consortium` (the in-app application flow). Mid-page and closing CTAs use the same route.

### H2: What a drug and alcohol consortium is
A consortium/third-party administrator (C/TPA) is an organization that manages DOT drug and alcohol testing for carriers, including the random testing pool. FMCSA requires CDL drivers to be part of a testing program, and an owner-operator cannot run their own random pool of one, so they join a consortium. The program covers pre-employment, random, post-accident, and other required testing, and ties into the [FMCSA Clearinghouse](/fmcsa-clearinghouse-registration/).

### H2: Who needs to be in a consortium
- Owner-operators with a CDL operating under FMCSA.
- Carriers with CDL drivers (the carrier runs the program, the consortium administers it).
Note: not every operation is subject to CDL drug-and-alcohol rules. Whether this applies depends on your vehicles, drivers, and operation. We confirm before you enroll.

### H2: What our drug and alcohol consortium enrollment includes
- We enroll you or your drivers in a compliant consortium and random testing pool.
- We set up the required testing, including pre-employment (see below).
- We connect your program to your [Clearinghouse](/fmcsa-clearinghouse-registration/) registration and [driver qualification files](/driver-qualification-files/).
- We keep your enrollment active so your program stays compliant.

**Price line:** Consortium enrollment is **$175 standalone** ($150 inside a [compliance package](/compliance-packages/)), with annual renewal. A pre-employment drug test is **$125 standalone** ($100 in a package). [Clearinghouse](/fmcsa-clearinghouse-registration/) setup is $125 standalone, listed separately.

### H2: Pre-employment drug test
(Section, covering the packet item; not a separate page.)
Before a driver can perform safety-sensitive work, they generally need a negative pre-employment drug test on file. A previous pre-employment drug test may be used in place of a new one only if the driver has actively participated in a qualifying DOT drug testing program within the preceding 30 days and meets FMCSA's other conditions for waiving a new test. Tech Rig will verify eligibility through TrueTest before waiving any test. Worked example (publishable): for a New Jersey power-only carrier, an earlier test did not meet the waiver conditions, so a new pre-employment test had to be arranged before the driver could start. We coordinate pre-employment testing (standalone $125, or $100 in a package) so the timing is right and the result is documented in the [driver's qualification file](/driver-qualification-files/).

### H2: Consortium and the Clearinghouse
The [FMCSA Clearinghouse](/fmcsa-clearinghouse-registration/) is the federal database of drug and alcohol violations. Your consortium program and Clearinghouse registration work together: queries and reporting flow between them. New carriers usually need both set up before hauling, which is why we handle them as a driver-compliance set with your [DQ files](/driver-qualification-files/).

### H2: Drug and alcohol consortium FAQ
FAQPage schema, Grade 8:
- "Do owner-operators need a consortium?" If you hold a CDL and operate under FMCSA, yes. You cannot run a random pool of one, so you join a consortium.
- "What testing does the program cover?" Pre-employment, random, post-accident, and other DOT-required testing.
- "Does every carrier need this?" It depends on your vehicles, drivers, and operation. We confirm whether CDL drug-and-alcohol rules apply to you before you enroll.
- "How much does it cost?" Consortium enrollment is $175 standalone (renewed annually), or $150 inside a package; a pre-employment drug test is $125 standalone ($100 in a package).
- "Is this connected to the Clearinghouse?" Yes. Your consortium program and [Clearinghouse](/fmcsa-clearinghouse-registration/) registration work together. We can set up both.

### Closing CTA band
"Driving a CDL vehicle? Get into a compliant testing program before you haul." Button "Enroll in a consortium".

## Internal links out
`/fmcsa-clearinghouse-registration/`, `/driver-qualification-files/`, `/compliance-services/`. Funnel link to `/services/` optional.

## Internal links in
Hub card + package; pillar (step 7); DQ + Clearinghouse pages (driver-compliance cluster).

## Schema (JSON-LD)
- `Service` (serviceType "Drug and alcohol consortium enrollment", provider {@id #org}, areaServed US, offers price 175 USD standalone; $150 in-bundle).
- `BreadcrumbList`: Home > Compliance Services > Drug and Alcohol Consortium.
- `FAQPage`.

## Proof / claims discipline
- Do not claim every carrier needs a consortium (applicability varies; do-not-publish list).
- Felix facet (30-day test) worded differently from the DQ and MCS-150 pages.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("Drug & Alcohol Consortium"). Price chips from single source.

## Uniqueness
Lead = "you cannot run a random pool of one" angle; pre-employment section uses the Felix 30-day facet, worded distinctly.
