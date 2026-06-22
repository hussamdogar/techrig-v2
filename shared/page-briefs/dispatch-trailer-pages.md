# Brief: dispatch trailer pages (REFRESH): reefer, flatbed, dry van, power only, hot shot

One brief for the five remaining trailer spokes. Same structure as `/box-truck-dispatch/`, but each page MUST lead with a different equipment-specific angle and a different worked scenario so no 8+ word sentence and no section lead repeats (uniqueness rule). `/box-truck-dispatch/` has its own full brief (the franchise).

## Shared rules for all five
- **Action:** REFRESH existing page; preserve URL and any ranking signals; deepen content. Keep each page's `/cost/` child if it ranks (dry van has one).
- **Bucket 1**, commercial/BOFU.
- **Structure (same as box truck):** H1 with primary; hero lede (equipment-specific); "What our [trailer] dispatch covers"; an equipment-specific differentiator H2; pricing H2; "need authority first?" funnel H2 → `/compliance-services/`; FAQ (FAQPage schema); closing CTA.
- **Pricing (all confirmed 2026-06-21):** box truck 8%, cargo van 5%, dry van 5%, power only 5%, flatbed 3%, reefer 3%, hot shot 8% of gross monthly revenue.
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

---

## FULL PER-PAGE COPY (supplied for the Design work order, 2026-06-21)
Lane profile (one line for the dispatch-hub Load Board + the page), equipment-specific hero lede, and worked scenario per page. Distinct wording per page (no shared 8+ word sentence). No fabricated metrics. Pricing: reefer and flatbed are the confirmed 3%; dry van / power only / hot shot stay "rate on request" until the client confirms the percentage (`[VERIFY]`).

### /reefers-trucking/
- **Lane profile:** Temperature-controlled freight on tight appointment windows: produce, protein, frozen, and pharma that cannot miss a slot.
- **Hero lede:** Reefer freight pays well because it is unforgiving. Narrow delivery windows, temperature accountability, and seasonal swings in produce and protein mean a missed appointment or a soft lane costs real money. Our reefer dispatch service keeps your trailer on lanes that respect your hours and your rate, and stays on top of the appointment scheduling reefer brokers demand.
- **Pricing:** 3% of gross monthly revenue (confirmed).
- **Worked scenario (REAL, cleared 2026-06-21; anonymous historical baseline):** A client running a 26-foot refrigerated box truck wanted steady, high-paying volume through a shifting market. Using our historical dispatching network, we sourced, negotiated, and locked a dedicated reefer lane that paid $5.00 per mile and ran 3 to 4 times a week. Publish as a past, anonymized example with a plain "results vary; not a guarantee of future rates or volume" line (do-not-publish rule on guaranteed earnings still applies to forward-looking claims).

### /flatbed-dispatch/
- **Lane profile:** Open-deck freight: steel, lumber, machinery, and building materials, with securing, tarping, and permits part of the job.
- **Hero lede:** Flatbed pays for skill. Loads must be secured and often tarped, oversize runs need permits, and the best steel, lumber, and machinery lanes go to carriers brokers trust. Our flatbed dispatch service finds those lanes, negotiates for the work your truck is rated for, and keeps the permit and paperwork conversations moving so you stay loaded and legal.
- **Pricing:** 3% of gross monthly revenue (confirmed).
- **Worked scenario:** `[CLIENT PROOF NEEDED]`. Research-led framing: a flatbed owner-operator wants steady building-materials lanes within a regional radius rather than chasing one-off oversize runs; dispatch builds the repeatable broker relationships that supply that work.

### /dry-van-trucking/
- **Lane profile:** The volume workhorse: general palletized freight, broad load availability, real rate pressure.
- **Hero lede:** Dry van has the most freight and the most competition, which is exactly why the rate is where dispatch earns its keep. Loads are everywhere; the gap between a strong week and a flat one is negotiation and lane choice. Our dry van dispatch service works the boards and the broker relationships to protect your rate per mile, not just keep the wheels turning.
- **Pricing:** 5% of gross monthly revenue (confirmed).
- **Keep** `/dry-van-trucking/cost/` live.
- **Worked scenario:** none yet (client confirms no current dispatch clients; focus is compliance). Keep the neutral empty-state layout, no fabricated story. Research-led framing only: a dry van carrier in a soft market wants to defend rate per mile, so dispatch is selective about lanes.

### /power-only-trucking/
- **Lane profile:** Pulling trailers others supply: drop-and-hook efficiency for carriers and 3PLs that provide the equipment.
- **Hero lede:** Power only is about utilization. When you pull trailers that shippers and 3PLs provide, drop-and-hook keeps you rolling instead of waiting to load, but only when the work is sequenced well. Our power only dispatch service lines up drop-and-hook freight and the carrier and 3PL relationships that supply trailers, so your hours go to driving, not sitting.
- **Pricing:** 5% of gross monthly revenue (confirmed).
- **Worked scenario:** none yet (no current dispatch clients). Keep neutral empty-state. Research-led framing only: a power-only operator wants back-to-back drop-and-hook moves so the truck rolls from one preloaded trailer to the next.

### /hot-shot-trucking/
- **Lane profile:** Expedited, smaller loads on a dually and gooseneck: speed-sensitive freight, often for newer CDL operators.
- **Hero lede:** Hot shot runs on speed and flexibility. Smaller, time-sensitive loads on a dually and gooseneck can pay strong when you move fast, but the expedite lanes and the brokers who post them take knowing where to look. Our hot shot dispatch service keeps your truck on quick-turn freight that fits its size and your hours, so the speed becomes revenue.
- **Pricing:** 8% of gross monthly revenue (confirmed).
- **Worked scenario:** none yet (no current dispatch clients). Keep neutral empty-state. Research-led framing only: a hotshot operator wants consistent expedited runs sized to a 3500-class dually rather than waiting on the occasional premium load.
