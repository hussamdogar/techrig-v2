# Keyword Map: DGR Tech Rig

Cross-workspace contract. One primary keyword per URL plus secondaries, with the action and intent. Metrics from `seo/output/keywords.md` (DataForSEO/GSC, 2026-06-19). Actions: PRESERVE (keep URL+signals), REFRESH (keep URL, rewrite), REPURPOSE (keep URL, change role: old Ads page → organic money page), REALIGN (keep URL, shift intent), MERGE (301 into parent), NEW (net-new URL), TRANSACTIONAL (leave, noindex). Authoritative URL list is `sitemap-plan.md`. No internal link or CTA may point outside that list.

Rule applied throughout: **one winnable primary per URL; head terms (dot number, usdot number, fmcsa registration, trucking authority, truck dispatcher) are secondaries/H2s, never standalone primaries** (gov/marketplace-owned at techrig's AS 10).

---

## A. Compliance & setup silo (acquisition) — lead priority

| URL | Action | Primary (vol/KD) | Secondaries | Intent / Funnel | Notes |
|---|---|---|---|---|---|
| `/compliance-services/` | NEW (HUB) | dot compliance services (880/~0) | trucking compliance services (320), trucking compliance (320/11), trucking compliance company (70/3), trucking authority (880) | Commercial / BOFU | **Compliance silo HUB** (symmetric with `/services/` dispatch hub). Category page listing all filing services; links to every filing money page + the bundle. High CPC ($14-17). |
| `/compliance-packages/` | NEW (v2) | trucking compliance packages (verify) | trucking compliance bundle, mc authority package, new authority package, compliance continuation | Commercial / BOFU | **Four-bundle selector** (Pricing v2, 2026-07-10): $396 / $1,096 / $996 / $1,696, picked by authority status × vehicle type. BOC-3 included in every card. Replaces the single-package offer. All figures DERIVED from `services.md`. |
| `/how-to-start-a-trucking-company/` | NEW (pillar) | how to start a trucking company (1,300/~2) | how to start a trucking business (590), how much does it cost to start a trucking company (140), ein for trucking company | Informational / TOFU | Educational pillar. Links DOWN to every filing money page + the hub + dispatch. No transactional overlap with money pages. |
| `/mc-dot-registration/` | REPURPOSE | trucking authority package (210/1) | how to get mc and dot number (140), trucking authority service (20), operating authority trucking (30) | Commercial / BOFU | Combined DOT+MC "get your authority done" bundle. Sits UNDER the hub; differentiated from the two pages below by being the bundle/together offer. Links to each individual filing page. |
| `/dot-registration/` | REPURPOSE | how to get a dot number (6,600/10) | usdot number (8,100), dot number cost (1,000), dot number (9,900, sec/H2) | Informational→BOFU | USDOT-specific. Cannibalization vs MC page resolved by entity (USDOT only). |
| `/mc-registration/` | REPURPOSE | mc number (5,400/12) | mc authority (880), how to get mc number (1,600), mc number cost (590), how long does it take to get mc number (140) | Informational→BOFU | MC/operating-authority-specific. |
| `/ucr-registration/` | NEW | ucr registration (12,100/5) | unified carrier registration (12,100) | Navigational / BOFU | Highest-volume winnable money term on the site. |
| `/mcs-150-biennial-update/` | NEW | mcs-150 update (6,600/7) | biennial update fmcsa (2,400/35) | Informational / BOFU | **Card/menu label "Biennial Update"** (MCS-150 term ok in body). Recurring-compliance money page. |
| `/usdot-correction/` | NEW | usdot update (1,300) | change usdot information, usdot address change | BOFU | NEW per client QA. $125 flat. Scope: address, legal/business name, email, phone, operating status, # trucks, # drivers. Separate from Biennial Update. |
| `/boc-3-filing/` | NEW | boc-3 (3,600/10) | boc-3 filing (1,600/14), what is a boc-3 (480), process agent trucking | BOFU | On-domain content page; CTA into `boc-3.techrig.org` form. |
| `/irp-registration/` | NEW | irp registration (3,600/28) | apportioned plates (2,400/~2), apportioned registration | Transactional / BOFU | Strong: IRP + the low-KD "apportioned plates" win. Split from IFTA (the combined "irp ifta registration" term has only 20/mo). |
| `/ifta-registration/` | NEW | ifta registration (480/28) | ifta sticker, ifta filing | Navigational / BOFU | IFTA **setup** ($175). Cross-links to `/irp-registration/` (paired) and to the quarterly-filing service below. |
| `/ifta-quarterly-filing/` | NEW | ifta quarterly filing (verify) | file ifta, ifta return service, ifta reporting | BOFU | NEW per client 2026-06-25. Recurring per-quarter return service, $150 + gov. Distinct from IFTA setup. |
| `/motus-migration/` | NEW | fmcsa portal to motus migration (verify) | claim usdot in motus, motus account help, usdot reinstatement motus | BOFU | NEW per client 2026-06-25. $125 flat, ~1-2 wk. Legacy-portal→MOTUS: claim USDOT, Company Official, manual verification, missing MC, support tickets. **Holds the relocated CA legacy story (S2).** |
| `/fmcsa-clearinghouse-registration/` | NEW | fmcsa clearinghouse registration (480/25) | clearinghouse registration | Navigational / BOFU | State Tech Rig is a registered C/TPA (publish-cleared 2026-06-25). |
| `/drug-and-alcohol-consortium/` | NEW | drug and alcohol consortium (320/19) | consortium enrollment, pre-employment drug test (section) | BOFU (CPC $21.61) | Low volume, high commercial value. **Covers pre-employment drug test as a labeled section** (the standalone term, 5,400/KD38, is broad/informational — not its own money page). |
| `/driver-qualification-files/` | NEW | driver qualification files (880/4) | dq files (140/7), dq file requirements | Informational→BOFU (CPC $22.84) | Driver-compliance money page; strong vol + low KD. Links to consortium + clearinghouse. |
| `/eld-services/` | NEW | eld for owner operators (210) | eld compliance (320/35), best eld for owner operators | Commercial / BOFU (CPC $23) | **Partner-referral page (Motive), NOT a Tech Rig service.** No price. CTA → Motive partner link. Never "we set up your ELD". |
| `/trucking-llc/` | NEW | llc for trucking company (170/~0) | form a trucking llc, ein for trucking company | Commercial / BOFU (CPC $44) | Company-formation; CTA is a **partner referral (Inc Authority)**. "Contact for quote". |
| ~~`/trucking-insurance-filing/`~~ | **REMOVED** (client QA 2026-06-21) | — | — | — | Insurance is not a Tech Rig service. Page deleted; 301 → `/compliance-services/`; internal links removed. Neutral "your insurer files proof with FMCSA" note may remain on MC pages. |
| `/lead-generation/` | PRESERVE | brokers that work with new authority (GSC-proven) | new authority trucking (10), brokers that work with 30 day authority | Commercial / BOFU | Already ranks (70 clicks, pos 12.7). Pivot-adjacent (new carriers). Keep; interlink to authority + dispatch. |

**Full Initial Package ($1,700) — coverage map.** Each item is covered; dedicated page unless noted.
1. Registered LLC → `/trucking-llc/` (Inc Authority referral) · 2. USDOT → `/dot-registration/` · 3. MC authority → `/mc-registration/` · 4. BOC-3 → `/boc-3-filing/` · 5. UCR → `/ucr-registration/` · 6. DQ files → `/driver-qualification-files/` · 7. Clearinghouse → `/fmcsa-clearinghouse-registration/` · 8. Consortium → `/drug-and-alcohol-consortium/` · 9. Pre-employment drug test → **section** on `/drug-and-alcohol-consortium/` (+ `/driver-qualification-files/`) · 10. IRP → `/irp-registration/` · 11. IFTA → `/ifta-registration/` (+ quarterly-filing service). Referral/coordination only (NOT services, no price): **ELD** → `/eld-services/` (Motive referral); **insurance** → coordinate with the carrier's own insurer (no dedicated page). The package is the hero offer on `/compliance-services/`, assembled via `/mc-dot-registration/` (DOT+MC core).

## B. Dispatch silo (retention) — defend & deepen

| URL | Action | Primary (vol/KD) | Secondaries | Intent / Funnel | Notes |
|---|---|---|---|---|---|
| `/services/` | REFRESH | truck dispatch service (880/2) | truck dispatcher (5,400), trucking dispatch company (590/14), dispatch service for owner operators (320/8), owner operator dispatch service (320/35) | Commercial / BOFU | Rebuild stale page into the dispatch-services HUB (both-lines context up top, dispatch focus). Links to every trailer page. |
| `/box-truck-dispatch/` | PRESERVE/REFRESH | box truck dispatch (880) | box truck dispatcher (880), box truck dispatch service (320/4), box truck dispatching services (30/4) | Commercial / BOFU | **Franchise — protect signals** (82 clicks, 32.6k impr). Deepen content. |
| `/box-truck-dispatch/cost/` | PRESERVE/REFRESH | box truck dispatch cost | box truck dispatch pricing | Commercial / MOFU | Ranks pos 12 (54 clicks). Keep URL + signals. |
| `/dry-van-trucking/` | REFRESH | dry van dispatch service (50) | dry van dispatch (20) | Commercial / BOFU | Keep `/dry-van-trucking/cost/` (ranks). |
| `/reefers-trucking/` | REFRESH | reefer dispatch (30) | reefer dispatch service (50) | BOFU | Hub; absorbs the reefer compliance sub-silo's dispatch-relevant content (compliance content relocates to silo A). |
| `/flatbed-dispatch/` | REFRESH | flatbed dispatch service (90/7) | flatbed dispatch (50) | Commercial / BOFU | |
| `/power-only-trucking/` | REFRESH | power only dispatch (20) | power only dispatch service | BOFU | |
| `/hot-shot-trucking/` | REFRESH | hot shot dispatch service (90) | hotshot dispatch (210) | Commercial / BOFU | |
| Per-silo thin sub-pages (~18 each: finding-loads, load-boards, negotiating-rates, route-planning, technology, training, legal-aspects, environmental-impact, innovations, success-stories, etc.) | MERGE | n/a | n/a | n/a | 301 to silo hub. Keep `/cost/` pages and any sub-page with its own GSC clicks; merge the rest. |

## C. Bridge guide (setup ↔ dispatch)

| URL | Action | Primary (vol/KD) | Secondaries | Intent / Funnel | Notes |
|---|---|---|---|---|---|
| `/how-to-start-a-box-truck-business/` | NEW (guide) | how to start a box truck business (880/~0) | box truck business (1,600) | Informational / TOFU→MOFU | Bridges acquisition→retention: links to compliance pillar AND `/box-truck-dispatch/`. Box truck is the franchise, so this guide feeds it. |

## D. State-level compliance (expansion, realign)

| URL | Action | Primary | Secondaries | Intent / Funnel | Notes |
|---|---|---|---|---|---|
| `/tech-rig-dispatch-texas/` | REALIGN | how to start a trucking company in texas (50) | texas trucking authority, texas dispatch | Mixed / MOFU→BOFU | Keep URL (has traffic). Lead with state setup/authority (the real client origin), keep dispatch section. |
| `/tech-rig-dispatch-california/` | REALIGN | how to start a trucking company in california (20) | california trucking authority | Mixed | Same pattern. |
| `/tech-rig-dispatch-new-york/` | REALIGN | how to start a trucking company in new york | ny trucking authority | Mixed | Same pattern. |
| `/tech-rig-dispatch-florida/` | REALIGN | how to start a trucking company in florida | fl trucking authority | Mixed | Same pattern. |
| Future state pages | NEW (template) | start a trucking company in [state] | [state] dot/mc | Mixed | Repeatable acquisition play; add as compliance clients arrive per state. |

## E. Core, blog, utility

| URL | Action | Primary | Notes |
|---|---|---|---|
| `/` (homepage) | REFRESH | brand + dual positioning | Already compliance+dispatch. Ensure clear links to both hubs and the funnel thesis. |
| `/about-us/` | PRESERVE | brand/about | Live & engaged (pos 4.1) but missing from sitemap — ADD to sitemap. |
| `/contact-us/` | PRESERVE | contact tech rig | NAP + schema; pos 5.0. |
| `/how-to-get-dot-and-mc-number.../` (blog) | REFRESH | how to get mc and dot number (140/12) | 14.4k impr, pos 49. Upgrade as a TOFU feeder; link to `/dot-registration/` + `/mc-registration/`. |
| `/what-is-load-to-truck-ratio/` (blog) | PRESERVE | load to truck ratio (90) | Best blog ranking (pos 8.9). Interlink to dispatch hub. |
| `/how-to-find-a-dispatcher-for-a-box-truck/` (blog) | PRESERVE | how to find a dispatcher for a box truck (10/6) | Interlink to `/box-truck-dispatch/`. |
| `/freight-broker-vs-dispatcher/` (blog) | REFRESH | freight broker vs dispatcher (110) | Interlink to dispatch hub. |
| Compliance education blogs (what-is-csa, what-is-ifta, what-is-eld, what-is-factoring, how-to-get-dot-and-mc-number, do-you-need-a-cdl-for-a-box-truck, etc.) | REFRESH/KEEP | their term | TOFU feeders; interlink UP to the matching compliance money page. |
| Hype-title listicles (revolutionize/unleashing/mastering/ultimate-guide posts) | MERGE/PRUNE | n/a | Violate standards.md banned words. Merge salvageable content into a money page or guide and 301; prune the rest. |
| Reefer compliance sub-silo `/reefers-trucking/benefits/compliance-assistance/*` (~30) | MERGE/RELOCATE | n/a | Relocate useful compliance content into silo A money pages; 301 each old URL to the matching compliance page or the pillar. |
| `/clone-home`, `/home-backup` | MERGE | n/a | 301 to `/`. |
| `/single-payment`, `/get-started` | TRANSACTIONAL | n/a | Funnel/payment pages; keep noindex. |
| Legal: `/terms-of-service/`, `/privacy-policy/`, `/power-of-attorney/`, `/refund-policy/`, `/referral-program/` | PRESERVE | n/a | Keep. |

## Cannibalization resolutions (explicit)
1. **Compliance hub vs bundle vs individual filings:** `/compliance-services/` = the silo HUB / category page (dot compliance services, trucking compliance services) listing all services; `/mc-dot-registration/` = the DOT+MC bundle offer ("trucking authority package"); `/dot-registration/` = USDOT only; `/mc-registration/` = MC only. Distinct entity/intent per page; hub links to all, does not compete for the specific filing terms.
2. **Pillar vs money pages:** `/how-to-start-a-trucking-company/` is the TOFU educational guide (how-to, informational) and links down; the filing pages are BOFU transactional. No keyword overlap if the pillar stays educational and routes.
3. **Box truck dispatch vs box truck business guide:** `/box-truck-dispatch/` targets commercial "box truck dispatch" (BOFU); `/how-to-start-a-box-truck-business/` targets informational "how to start a box truck business" / "box truck business" (TOFU). Different intent.
4. **Dispatch hub vs trailer pages:** `/services/` owns general dispatch terms (truck dispatch service, truck dispatcher); each trailer page owns its trailer-specific term. Standard hub-spoke, no overlap.
5. **UCR / unified carrier registration:** single page targets both (synonyms) — no second page.
6. **State pages vs national pillar:** state pages carry "[state]" qualifier; pillar is national. No overlap.
7. **IRP vs IFTA:** split pages — `/irp-registration/` owns "irp registration" + "apportioned plates" (registration/plates); `/ifta-registration/` owns "ifta registration" (fuel tax). Each leads with a different worked example; combined term ("irp ifta registration", 20/mo) is too thin to target.
8. **DQ files vs consortium vs drug test:** `/driver-qualification-files/` = the DQ file (recordkeeping); `/drug-and-alcohol-consortium/` = consortium enrollment AND the pre-employment drug-test section. No standalone drug-test money page (term is broad/informational). Distinct intents.
