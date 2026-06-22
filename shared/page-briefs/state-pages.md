# Brief: state pages (REALIGN): TX, CA, NY, FL + future template

One brief for the four existing state pages and the repeatable template. These pages already have traffic, so we keep the URLs and REALIGN them: lead with state-level setup/authority (the real client origin) while keeping a dispatch section. They were originally dispatch-oriented; the realign reflects the compliance pivot without losing dispatch relevance.

## Shared rules
- **Action:** REALIGN existing page; KEEP the URL (they carry traffic); shift intent toward setup + authority, retain a dispatch block.
- **Bucket 1**, mixed intent (MOFU to BOFU).
- **Primary pattern:** `how to start a trucking company in [state]`. **Secondaries:** `[state] trucking authority`, `[state] dot number`, `[state] truck dispatch`.
- **Structure:** H1 with state primary; hero lede (state-specific); "Starting a trucking company in [state]" (state nuances: intrastate vs interstate, any state-specific registration, state DOT where relevant); "What we file for [state] carriers" linking the national money pages; "Truck dispatch in [state]" (retain dispatch relevance, link `/services/`); FAQ; CTA.
- **Reuse the national money pages**, do not duplicate their content. The state page routes to `/dot-registration/`, `/mc-registration/`, `/compliance-services/`, etc. State page adds only the state-specific layer.
- **Uniqueness:** each state page MUST lead with a different state-specific fact and a different worked example or local detail. No shared 8+ word sentences across states (these are the highest duplication risk on the site, so write each state's intro and nuances independently).
- **Title** ≤60; **meta** 150-160 with the state primary.
- **Claims:** no fabricated state market statistics (e.g. the old Texas "$1.6 trillion freight/yr" must be sourced or removed). No guaranteed timelines.

## Per-page table

| URL | Primary | Title tag | State-specific lead (must differ) |
|---|---|---|---|
| `/tech-rig-dispatch-texas/` | how to start a trucking company in texas (50) | `Start a Trucking Company in Texas \| Tech Rig` | Texas intrastate vs interstate authority nuance; large in-state freight base. Remove/￼source the old "$1.6 trillion" stat. [VERIFY any stat.] |
| `/tech-rig-dispatch-california/` | how to start a trucking company in california (20) | `Start a Trucking Company in California \| Tech Rig` | California-specific registration/regulatory environment (e.g. CARB context) at a high, accurate level. [VERIFY any regulatory claim.] Real CA box-truck client context can anchor it (distinct wording). |
| `/tech-rig-dispatch-new-york/` | how to start a trucking company in new york | `Start a Trucking Company in New York \| Tech Rig` | NY/Northeast operating context; HUT (highway use tax) mention if accurate. [VERIFY.] |
| `/tech-rig-dispatch-florida/` | how to start a trucking company in florida | `Start a Trucking Company in Florida \| Tech Rig` | Florida operating context; port/import freight angle if accurate. [VERIFY.] |
| Future `/tech-rig-dispatch-[state]/` | start a trucking company in [state] | `Start a Trucking Company in [State] \| Tech Rig` | Add one per state as compliance clients arrive there (the documented client-origin play). Template only; do not mass-generate empty state pages. |

## Schema (per state page)
- `Service` or `WebPage` with `areaServed` = the state; `provider` {@id #org}.
- `BreadcrumbList`: Home > [appropriate parent] > [State].
- `FAQPage` if a real state FAQ exists.

## Dev / Design notes
- Unique branded OG image per state.
- Keep URLs; 301 only if a slug must change (log in `migration-plan.md`).
- Do not generate future state pages programmatically with thin content; each must have a real state-specific layer (this is what caused the original thin-page CTR problem).

## Uniqueness
State pages are the top duplication risk. Each intro, "starting in [state]" section, and FAQ must be written independently. Run the duplicate-string scan across all state pages specifically before launch.

---

## FULL PER-PAGE COPY (supplied for the Design work order, 2026-06-21)
State-specific lead fact, state nuances, and a worked example per state. State regulatory specifics are well established but can change, so each nuance set is marked `[VERIFY current state schedule]` for the writer/Dev to confirm against the state agency before publishing. No market statistics. Federal setup (USDOT, MC, BOC-3, UCR, etc.) is reused from the national money pages; the state page adds only the state layer and routes to those pages.

### /tech-rig-dispatch-texas/
- **Lead fact:** Texas carries one of the largest in-state freight bases in the country, so a lot of Texas operators run intrastate only, and intrastate operation has its own state registration on top of (or instead of) federal authority.
- **State nuances** `[VERIFY current TxDMV schedule]`: interstate for-hire carriers still need federal USDOT and MC (see [USDOT](/dot-registration/) and [MC authority](/mc-registration/)); intrastate-only Texas carriers register with the Texas Department of Motor Vehicles (TxDMV) for intrastate operating authority and may not need an MC number. We confirm which path fits your operation.
- **Worked example:** none (confirmed 2026-06-21: no Texas story). Keep the neutral layout; do not fabricate. The verified California case studies are retained site-wide for launch.

### /tech-rig-dispatch-california/
- **Lead fact:** California layers state rules on top of the federal ones, so getting set up here means clearing requirements most other states do not have.
- **State nuances** `[VERIFY current CARB and CA DMV/CHP schedule]`: interstate carriers need federal USDOT and MC; intrastate California carriers generally need a California Motor Carrier Permit (MCP) and a CA Number, and most diesel vehicles must meet CARB Clean Truck Check requirements. We map the state and federal pieces together so nothing is missed.
- **Worked example (real, CA, distinct wording):** A California box-truck operator came to us after his records would not link in the FMCSA MOTUS system, which stalled his setup. We bridged the old data into MOTUS and got him moving. California is where these system and state-layer snags show up most, and handling them is daily work for us. (Sourced from `experience-notes.md`; worded so no sentence matches the `/dot-registration/` telling.)

### /tech-rig-dispatch-new-york/
- **Lead fact:** New York adds a state highway-use obligation on top of federal authority, which catches carriers who set up only the federal side.
- **State nuances** `[VERIFY current NY HUT schedule]`: carriers operating qualifying vehicles in New York generally need a Highway Use Tax (HUT) certificate and decal, in addition to federal USDOT and MC for interstate operation; New York City can carry further local considerations. We handle the federal setup and flag the state HUT step.
- **Worked example:** none (confirmed 2026-06-21: no New York story). Keep neutral; do not fabricate.

### /tech-rig-dispatch-florida/
- **Lead fact:** Florida is a major port and import-freight state, and for most interstate carriers the setup here is largely federal, with the interstate operating filings run through the state motor-vehicle agency.
- **State nuances** `[VERIFY current FLHSMV schedule]`: interstate carriers need federal USDOT and MC; IRP apportioned plates and IFTA are handled through the Florida Department of Highway Safety and Motor Vehicles (FLHSMV). See [IRP](/irp-registration/) and [IFTA](/ifta-registration/). We confirm what your Florida operation needs.
- **Worked example:** none (confirmed 2026-06-21: no Florida story). Keep neutral; do not fabricate.
