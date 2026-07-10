# Sitemap Plan: DGR Tech Rig

Cross-workspace contract: the planned post-revamp URL structure. This is the authoritative list of URLs that may exist after launch; no CTA or internal link may point outside it (standards). Pairs with `keyword-map.md` (keywords/actions) and `seo/output/migration-plan.md` (redirects). Content bucket per the persona model: 1 Money, 2 Authority, 3 Problem-aware, 4 Comparison/decision, 5 Founder-led.

Locale US/USD. Canonical host + HTTPS enforced (confirm www vs non-www in pre-launch). Action tags as in `keyword-map.md`.

## Top-level architecture
```
/                                         Home — dual positioning, funnel thesis        [REFRESH]
│
├── COMPLIANCE & SETUP (acquisition) ─────────────────────────────────────────────
│   /compliance-services/                  Compliance silo HUB             Bucket 1  [NEW]
│   /compliance-packages/                  Four-bundle selector (v2) NEW   Bucket 1  [NEW]
│   /how-to-start-a-trucking-company/      Pillar guide (TOFU)            Bucket 2  [NEW]
│   /mc-dot-registration/                  DOT+MC authority bundle         Bucket 1  [REPURPOSE]
│   /dot-registration/                     USDOT money page                Bucket 1  [REPURPOSE]
│   /mc-registration/                      MC authority money page         Bucket 1  [REPURPOSE]
│   /ucr-registration/                     UCR money page                  Bucket 1  [NEW]
│   /mcs-150-biennial-update/              Biennial Update (card label)    Bucket 1  [NEW]
│   /usdot-correction/                     USDOT Correction ($125) NEW     Bucket 1  [NEW]
│   /boc-3-filing/                         BOC-3 money page                Bucket 1  [NEW]
│   /irp-registration/                     IRP / apportioned plates page   Bucket 1  [NEW]
│   /ifta-registration/                    IFTA setup money page           Bucket 1  [NEW]
│   /ifta-quarterly-filing/                IFTA quarterly ($150+gov) NEW    Bucket 1  [NEW]
│   /motus-migration/                      FMCSA Portal→MOTUS ($125) NEW    Bucket 1  [NEW]
│   /fmcsa-clearinghouse-registration/     Clearinghouse money page        Bucket 1  [NEW]
│   /drug-and-alcohol-consortium/          D&A consortium (+ drug test)    Bucket 1  [NEW]
│   /driver-qualification-files/           DQ files money page             Bucket 1  [NEW]
│   /eld-services/                         ELD partner referral (Motive)   Bucket 1  [NEW]
│   /trucking-llc/                         Trucking LLC (Inc Authority ref)Bucket 1  [NEW]
│   /lead-generation/                      Brokers for new authority       Bucket 1  [PRESERVE]
│   (/trucking-insurance-filing/ REMOVED per client QA 2026-06-21; 301 → /compliance-services/)
│
├── DISPATCH (retention) ──────────────────────────────────────────────────────────
│   /services/                             Dispatch services HUB           Bucket 1  [REFRESH]
│   /box-truck-dispatch/                   Box truck (FRANCHISE)           Bucket 1  [PRESERVE]
│       /box-truck-dispatch/cost/          Box truck dispatch cost         Bucket 4  [PRESERVE]
│   /dry-van-trucking/                      Dry van dispatch                Bucket 1  [REFRESH]
│       /dry-van-trucking/cost/             Dry van cost                    Bucket 4  [PRESERVE]
│   /reefers-trucking/                      Reefer dispatch                 Bucket 1  [REFRESH]
│   /flatbed-dispatch/                      Flatbed dispatch                Bucket 1  [REFRESH]
│   /power-only-trucking/                   Power only dispatch             Bucket 1  [REFRESH]
│   /hot-shot-trucking/                     Hot shot dispatch               Bucket 1  [REFRESH]
│
├── BRIDGE ─────────────────────────────────────────────────────────────────────────
│   /how-to-start-a-box-truck-business/    Setup↔dispatch guide            Bucket 2  [NEW]
│
├── STATE (expansion) ───────────────────────────────────────────────────────────────
│   /tech-rig-dispatch-texas/               TX setup + dispatch             Bucket 1  [REALIGN]
│   /tech-rig-dispatch-california/          CA setup + dispatch             Bucket 1  [REALIGN]
│   /tech-rig-dispatch-new-york/            NY setup + dispatch             Bucket 1  [REALIGN]
│   /tech-rig-dispatch-florida/             FL setup + dispatch             Bucket 1  [REALIGN]
│   (future /tech-rig-dispatch-[state]/ as template)                                  [NEW]
│
├── BLOG (/blog/) ────────────────────────────────────────────────────────────────────
│   Keep & upgrade winners + compliance/dispatch education feeders          Bucket 2/3
│   Merge/prune hype-title listicles (standards violation)
│
└── UTILITY / LEGAL ──────────────────────────────────────────────────────────────────
    /about-us/  [PRESERVE+add to sitemap]   /contact-us/  [PRESERVE]
    /terms-of-service/  /privacy-policy/  /power-of-attorney/  /refund-policy/  /referral-program/  [PRESERVE]

NOT in organic sitemap (noindex): /single-payment, /get-started   [TRANSACTIONAL]
301'd away (not live): /clone-home, /home-backup, merged sub-silos, reefer compliance sub-silo  → see migration-plan.md
Subdomains (unchanged, transactional): boc-3.techrig.org, form.techrig.org
```

## Content bucket per silo
- **Compliance money pages (Bucket 1):** each = what it is, who needs it, exactly what Tech Rig files, fixed price, timeline, FAQ, single CTA into the relevant form. Out-specific the .gov page; pair with the funnel ("authority active → we dispatch you").
- **Pillar + bridge guides (Bucket 2):** educational, route to money pages; demonstrate E-E-A-T.
- **Dispatch money pages (Bucket 1):** trailer-specific value, process, no-contract/no-forced-dispatch, pricing-model, FAQ, CTA to consultation.
- **Cost pages (Bucket 4):** decision content; keep the ranking ones.
- **Blog (Bucket 2/3):** TOFU feeders, interlink up.

## Internal-linking plan (hub-and-spoke + funnel cross-links)
1. **Home** links to both hubs: the compliance hub (`/compliance-services/`) and the dispatch hub (`/services/`), plus the pillar.
2. **Compliance silo:** hub `/compliance-services/` links to every filing money page (DOT, MC, UCR, MCS-150, BOC-3, IRP, IFTA, clearinghouse, D&A consortium, DQ files, ELD, insurance filing, LLC) + the bundle `/mc-dot-registration/`. The pillar `/how-to-start-a-trucking-company/` (educational) also links down to each filing page. Each filing page links back up to the hub + pillar and laterally to `/mc-dot-registration/`. `/irp-registration/` ↔ `/ifta-registration/` cross-link; `/driver-qualification-files/` ↔ `/drug-and-alcohol-consortium/` ↔ `/fmcsa-clearinghouse-registration/` form the driver-compliance cluster.
3. **Dispatch silo:** `/services/` hub links to all six trailer pages; each trailer page links back to the hub and to its `/cost/` page.
4. **Funnel cross-links (the differentiator):** every compliance money page ends with a forward link to dispatch ("authority active? keep your truck loaded" → `/services/` or `/box-truck-dispatch/`). Every dispatch page links to compliance upkeep (`/mcs-150-biennial-update/`, `/ucr-registration/`). `/how-to-start-a-box-truck-business/` links to BOTH the compliance pillar and `/box-truck-dispatch/`.
5. **Blog feeders:** each education post links up to its matching money page on a 1-3 word contextual anchor (e.g. load-to-truck-ratio → dispatch hub; how-to-get-dot-and-mc-number → `/dot-registration/` + `/mc-registration/`).
6. **State pages:** link to the national pillar + `/services/`.
7. **lead-generation** links to the authority pages (its audience is brand-new carriers).

Anchor rule (standards): inline, 1-3 word contextual anchors; never "click here"/"learn more"/"our services".

## Page count
~29 indexable money/hub/guide URLs + state pages + retained blog + utility/legal. The compliance silo now covers all 13 packet items (11 dedicated pages; insurance filing as a low-priority page; pre-employment drug test as a section). Still a deliberate reduction from ~215 thin URLs to a tight, intent-mapped set — addressing the 0.22% sitewide CTR found in Phase 3.

## Build order for Phase 9 (priority from keyword data)
1. `/ucr-registration/` (12,100/KD5) · `/mcs-150-biennial-update/` (6,600/KD7) · `/dot-registration/` (6,600/KD10) · `/mc-registration/` (5,400/KD12) · `/boc-3-filing/` (3,600/KD10)
2. `/irp-registration/` (3,600/KD28 + apportioned plates 2,400) · `/compliance-services/` hub · `/how-to-start-a-trucking-company/` pillar (1,300/KD2) · `/mc-dot-registration/` bundle
3. `/driver-qualification-files/` (880/KD4) · `/services/` dispatch hub + `/box-truck-dispatch/` refresh (franchise)
4. `/trucking-llc/` · `/drug-and-alcohol-consortium/` · `/ifta-registration/` · `/fmcsa-clearinghouse-registration/` · `/eld-services/`
5. `/trucking-insurance-filing/` (low-pri), remaining trailer refreshes, `/how-to-start-a-box-truck-business/`, state realigns, blog feeders.
