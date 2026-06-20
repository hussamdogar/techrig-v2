# Brief: dispatch trailer pages (REFRESH): reefer, flatbed, dry van, power only, hot shot

One brief for the five remaining trailer spokes. Same structure as `/box-truck-dispatch/`, but each page MUST lead with a different equipment-specific angle and a different worked scenario so no 8+ word sentence and no section lead repeats (uniqueness rule). `/box-truck-dispatch/` has its own full brief (the franchise).

## Shared rules for all five
- **Action:** REFRESH existing page; preserve URL and any ranking signals; deepen content. Keep each page's `/cost/` child if it ranks (dry van has one).
- **Bucket 1**, commercial/BOFU.
- **Structure (same as box truck):** H1 with primary; hero lede (equipment-specific); "What our [trailer] dispatch covers"; an equipment-specific differentiator H2; pricing H2; "need authority first?" funnel H2 → `/compliance-services/`; FAQ (FAQPage schema); closing CTA.
- **Pricing:** flatbed and reefer 3% of gross. Dry van, power only, hot shot percentages are NOT in `services.md`. [VERIFY each percentage with the client before publishing; do not guess.]
- **Internal links:** up to `/services/`, lateral to 1-2 sibling trailers where relevant, funnel to `/compliance-services/`.
- **Schema:** `Service` (serviceType per trailer), `BreadcrumbList` Home > Dispatch Services > [Trailer], `FAQPage`.
- **Claims:** no performance metrics; percentage is price, not outcome. No forced dispatch / no long-term contract messaging consistent with the hub.
- **Title** ≤60 incl. brand; **meta** 150-160 with primary.

## Per-page table

| URL | Primary (vol/KD) | Secondaries | Title tag | Required distinct lead angle | Worked scenario (uniqueness) |
|---|---|---|---|---|---|
| `/reefers-trucking/` | reefer dispatch (30) | reefer dispatch service (50) | `Reefer Dispatch Service \| Tech Rig` | Temperature-controlled freight: tighter appointment windows, produce/protein seasonality, reefer breakdown risk. | A reefer carrier needing consistent lanes through a seasonal market shift. [CLIENT PROOF NEEDED] |
| `/flatbed-dispatch/` | flatbed dispatch service (90/7) | flatbed dispatch (50) | `Flatbed Dispatch Service \| Tech Rig` | Open-deck freight: securematment/tarping, permits for oversize, steel/lumber/machinery lanes. | A flatbed owner-operator targeting steady building-materials lanes. [CLIENT PROOF NEEDED] |
| `/dry-van-trucking/` | dry van dispatch service (50) | dry van dispatch (20) | `Dry Van Dispatch Service \| Tech Rig` | The volume workhorse: high load availability but rate compression, so negotiation matters most. Keep `/dry-van-trucking/cost/` live. | A dry van carrier focused on protecting rate per mile in a soft market. [CLIENT PROOF NEEDED] |
| `/power-only-trucking/` | power only dispatch (20) | power only dispatch service | `Power Only Dispatch Service \| Tech Rig` | Pulling someone else's trailers: drop-and-hook efficiency, working with carriers/3PLs that supply trailers. | A power-only operator (real: NC power-only client context) wanting drop-and-hook utilization. Distinct wording from the NC compliance telling. |
| `/hot-shot-trucking/` | hot shot dispatch service (90) | hotshot dispatch (210) | `Hot Shot Dispatch Service \| Tech Rig` | Expedited/smaller loads on a dually + gooseneck: speed, MDT/expedite lanes, often new-authority CDL operators. | A Maryland CDL hotshot on a Ram 3500 dually (real: Marcus context) building steady expedited runs. Distinct wording from the UCR telling. |

## Notes on the two "real" scenarios
- Power only and hot shot can reference the real NC power-only and MD hotshot clients, but ONLY on a different facet (dispatch utilization, not the compliance filing), and worded so no sentence matches the compliance pages that already use those clients. Reefer, flatbed, dry van have no client story yet, so use `[CLIENT PROOF NEEDED]` placeholders and keep copy research-led.

## Dev / Design notes
- Unique branded OG image per trailer page.
- Preserve existing URLs and ranking headings; deepen, do not strip.
- All percentages from a single source; mark unconfirmed ones `[VERIFY]`.
