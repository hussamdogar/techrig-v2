# Brief: /services/ (Dispatch services HUB)

## Meta
- **Action:** REFRESH (rebuild the stale dispatch-only page into the dispatch HUB). **Bucket:** 1. **Intent:** commercial / BOFU.
- **Primary:** truck dispatch service (880/KD2). **Secondaries:** truck dispatcher (5,400, body/H2 only), trucking dispatch company (590/14), dispatch service for owner operators (320/8), owner operator dispatch service (320/35).
- **Word target:** 1,300 to 1,600.
- **Role:** the dispatch silo hub, symmetric with `/compliance-services/`. Links to all six trailer pages.

## Title tag (45 chars)
`Truck Dispatch Service for Carriers | Tech Rig`

## Meta description (157 chars)
`A truck dispatch service that keeps you loaded, with no long-term contracts and no forced dispatch. We book freight for owner-operators and small fleets, by load.`

## Three Kings check
Primary "truck dispatch service" in: title (yes), first paragraph (yes), H2s ("What our truck dispatch service does", "Truck dispatch service pricing").

## Heading outline + copy

### H1: Truck Dispatch Service for Owner-Operators and Fleets
**Hero lede:**
A good truck dispatch service does more than find loads. It negotiates rates, plans your routes, handles the paperwork, and keeps your wheels turning so you can drive. Tech Rig has dispatched carriers since 2021, across every major trailer type, with no long-term contracts and no forced dispatch. You own your authority and your decisions; we keep your truck loaded and your rates strong.

**Primary CTA (above fold):** button "Get dispatched" → `/contact-us/` (consultation) or dispatch onboarding. [VERIFY route.]

### H2: What our truck dispatch service does
- **Load matching** to your equipment, lanes, and rate targets.
- **Rate negotiation** with brokers so you are not leaving money on the table.
- **Route planning** to cut empty miles.
- **Billing and paperwork**, including rate confirmations and the documents factoring needs.
- **Support** when something changes on the road.
We dispatch owner-operators and small fleets. If you run a single truck or a handful, this is built for you.

### H2: Dispatch by trailer type
Card grid linking each trailer page (each is its own money page):
- [Box truck dispatch](/box-truck-dispatch/) (our most established service)
- [Reefer dispatch](/reefers-trucking/)
- [Flatbed dispatch](/flatbed-dispatch/)
- [Dry van dispatch](/dry-van-trucking/)
- [Power only dispatch](/power-only-trucking/)
- [Hot shot dispatch](/hot-shot-trucking/)

### H2: Truck dispatch service pricing
Plain, from `services.md`:
We charge a percentage of your gross by equipment, so we earn only when you do:
- Box trucks: 8% of gross monthly revenue.
- Cargo vans: 5% of gross monthly revenue.
- Flatbeds and reefer vans: 3% of gross monthly revenue.
No long-term contract, no forced dispatch, no sign-up to lock you in. [VERIFY the per-equipment percentages reflect current rate card before publishing; confirm dry van / power only / hot shot percentages, which are not separately listed in `services.md`.]

### H2: New authority? We can do both halves
Funnel cross-link. If you are not active yet, we also handle the setup: see [compliance services](/compliance-services/) or our [guide to starting a trucking company](/how-to-start-a-trucking-company/). The advantage of one team is simple. The people who get your authority active are the same ones who keep your truck loaded after, with no handoff and no gap.

### H2: Why carriers choose Tech Rig dispatch
- Dispatching since 2021, around 100 carriers served.
- Every major trailer type, with specialists per equipment.
- No long-term contracts and no forced dispatch.
- Factoring relationships with OTR Solutions and RTS Financial when you need cash flow.
(No revenue, deadhead, or time-savings percentages; those are not documented.)

### H2: Truck dispatch FAQ
FAQPage schema, Grade 8:
- "How does your dispatch pricing work?" A percentage of your gross by equipment (box 8%, cargo van 5%, flatbed and reefer 3%). We earn when you earn.
- "Do I have to sign a long contract?" No. No long-term contract and no forced dispatch.
- "What do you handle besides finding loads?" Rate negotiation, route planning, billing and paperwork, and support.
- "Do you dispatch single-truck owner-operators?" Yes. Owner-operators and small fleets are who we serve.
- "Can you set up my authority too?" Yes. See [compliance services](/compliance-services/).

### Closing CTA band
"Keep your truck loaded without chasing loads yourself. Get dispatched." Button "Get dispatched".

## Internal links out
All six trailer pages; `/compliance-services/`, `/how-to-start-a-trucking-company/` (funnel back to acquisition); `/box-truck-dispatch/` (franchise emphasis).

## Internal links in
Home (primary hub link); every trailer page links UP here; compliance pages' funnel-forward link; About; footer.

## Schema (JSON-LD)
- `Service` (serviceType "Truck dispatch service", provider {@id #org}, areaServed US; describe the % model in copy, do not encode a single price).
- `BreadcrumbList`: Home > Dispatch Services.
- `FAQPage`.

## Proof / claims discipline
- No performance metrics. Percentages are the pricing model, not outcome claims.
- Confirm trailer-specific percentages `[VERIFY]`.
- "truck dispatcher" (5,400) used in body/H2 only, never as the sole primary.

## Reviewed-by
"Reviewed by Robert Hooke, Co-Founder" (operations/systems) or omit; hub-level.

## Dev / Design notes
- Unique branded OG image ("Truck Dispatch"). Trailer cards via CSS icons. Percentages from single source.

## Uniqueness
Hub leads with "more than finding loads"; each trailer page must lead with a different equipment-specific scenario (see trailer template brief).
