# Brief: /driver-qualification-files/

## Meta
- **Action:** NEW. **Bucket:** 1. **Intent:** informational to BOFU.
- **Primary:** driver qualification files (880/KD4). **Secondaries:** dq files (140/KD7), dq file requirements, driver qualification file checklist.
- **Word target:** 1,400 to 1,600.

## Title tag (46 chars)
`Driver Qualification Files (DQ) | Tech Rig`

## Meta description (157 chars)
`Driver qualification files built and maintained for you. We assemble compliant DQ files so your drivers, including owner-operators, pass a DOT audit clean.`

## Three Kings check
Primary "driver qualification files" in: title (yes), first paragraph (yes), H2s ("What driver qualification files are", "What goes in a driver qualification file").

## Heading outline + copy

### H1: Driver Qualification Files (DQ Files)
**Hero lede:**
Driver qualification files are the records FMCSA expects you to keep proving each of your drivers is legally qualified to operate. They are one of the first things a new-carrier safety audit checks, and incomplete files are a common reason carriers get marked down. Tech Rig builds and maintains compliant driver qualification files so your drivers are covered and your audit goes smoothly. This applies even if you are the only driver in the company.

**Primary CTA (above fold):** button "Set up my DQ files" → `/apply/?service=dq-files` (the in-app application flow). Mid-page and closing CTAs use the same route.

### H2: What driver qualification files are
A driver qualification file (DQ file) is a per-driver record that documents the driver meets federal qualification requirements. FMCSA requires carriers to maintain one for each driver and to keep it current. The file is not a one-time form; parts of it have to be refreshed on a schedule, for example the annual review of the driving record. Missing or outdated DQ files show up fast in an audit.

### H2: Owner-operators are still drivers
Important, and widely misunderstood. If you are an owner-operator and the only person driving your truck, you still need a driver qualification file. Being the owner does not waive the requirement. We see new carriers skip this because they assume DQ files are only for companies with employee drivers. They are not, and a missing file on the owner-driver is exactly what a safety audit flags.

### H2: What goes in a driver qualification file
Plain checklist, Grade 8 (general; the specifics are federal):
- The driver's application for employment.
- A copy of the driver's CDL where applicable.
- The motor vehicle record and the annual review of driving record.
- A road test certificate or equivalent.
- Medical examiner's certificate and verification.
- Drug and alcohol testing records, tied to your [consortium](/drug-and-alcohol-consortium/) and [Clearinghouse](/fmcsa-clearinghouse-registration/) enrollment.
- Records that must be updated on a recurring schedule.
We assemble these into a compliant file and keep the recurring items current.

### H2: What our DQ file service includes
- We build a complete driver qualification file for each driver, including owner-operators.
- We connect it to your [drug and alcohol consortium](/drug-and-alcohol-consortium/), [Clearinghouse](/fmcsa-clearinghouse-registration/), and pre-employment drug test so the testing records are in place.
- We keep the recurring items (like the annual MVR review) on schedule so the file stays audit-ready.

**Price line (standalone, annual renewal at the same rate):** 1 driver $250 · 2 drivers $450 total · 3 drivers $600 total · more than 3 = custom quote. Inside a [compliance package](/compliance-packages/) the DQ file is lower: 1 driver $200 (included) · 2 drivers $350 total · 3 drivers $450 total. Related driver-compliance services (Clearinghouse $125, consortium $175, pre-employment drug test $125 standalone) are priced separately and listed on their pages. DQ files require annual review and renewal and are billed again at the applicable driver-count rate.

### H2: DQ files and your first safety audit
New carriers face a safety audit early in their operation, and driver qualification files are a core part of what is reviewed alongside [Clearinghouse](/fmcsa-clearinghouse-registration/) registration and consortium enrollment. Worked example (publishable): a New Jersey power-only carrier needed his DQ file, consortium enrollment, Clearinghouse setup, and a fresh pre-employment drug test before he could put his truck to work, because an earlier test was more than 30 days old. We handled the set so he was audit-ready, not just licensed.

### H2: Driver qualification file FAQ
FAQPage schema, Grade 8:
- "Do owner-operators need a DQ file?" Yes. If you drive the truck, you need a driver qualification file, even if you own the company and are the only driver.
- "What does a DQ file include?" The driver's application, license, driving record and annual review, medical certificate, testing records, and other items that must be kept current.
- "How often do DQ files need updating?" Some items are one-time; others, like the annual review of the driving record, recur. We keep the recurring items on schedule.
- "How much does a DQ file cost?" Standalone: $250 for one driver, $450 total for two, $600 total for three, custom quote beyond that, renewed annually. It is lower inside a [compliance package](/compliance-packages/) ($200 for the first driver).
- "Are DQ files checked in an audit?" Yes. They are one of the first things a new-carrier safety audit reviews.

### Closing CTA band
"Hiring a driver, or running your own truck? Get audit-ready driver files in place." Button "Set up my DQ files".

## Internal links out
`/drug-and-alcohol-consortium/`, `/fmcsa-clearinghouse-registration/`, `/compliance-services/`. Funnel link to `/services/` optional.

## Internal links in
Hub card + package; pillar (step 7); consortium + Clearinghouse pages (driver-compliance cluster); MC page (after authority).

## Schema (JSON-LD)
- `Service` (serviceType "Driver qualification file management", provider {@id #org}, areaServed US, offers price 250 USD standalone for the first driver; tiered by driver count per `services.md`).
- `BreadcrumbList`: Home > Compliance Services > Driver Qualification Files.
- `FAQPage`.

## Proof / claims discipline
- DQ file contents described generally; do not assert a specific federal item list as exhaustive (say "including").
- Felix example reused on a different facet (DQ + 30-day test); ensure sentences differ from the MCS-150 and consortium tellings.

## Reviewed-by
"Reviewed by Adam Smith, Co-Founder."

## Dev / Design notes
- Unique branded OG image ("Driver Qualification Files"). Price chip from single source.

## Uniqueness
Lead = "owner-operators are still drivers" angle; Felix facet = DQ + expired pre-employment test. Distinct from other pages.
