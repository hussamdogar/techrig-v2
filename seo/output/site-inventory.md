# Site Inventory: techrig.org (live crawl)

Crawled 2026-06-19 from `https://techrig.org/sitemap_index.xml`. Source of URLs: page-sitemap.xml (last mod 2026-05-13), post-sitemap.xml (last mod 2025-04-30), author-sitemap.xml. Counts: ~155 page URLs, 60 blog posts. On-page basics below are from direct crawls of the highest-value pages; silo sub-pages are characterized by pattern, not individually crawled.

## Business and offer (extracted)
- **Entity:** DGR Tech Rig. NAP: 30 N Gould St, Ste R, Sheridan, Wyoming 82801 | +1 (917) 909-2257 | info@techrig.org. (Wyoming registered-agent address; operations serve all 50 states.)
- **Positioning (homepage, revamped):** "Full-Service Trucking Compliance & Dispatch Services." Lead identity = FMCSA-registered **process agent** helping carriers/brokers/freight-forwarders complete required filings without delays. Dispatch presented as the follow-on retention service.
- **Two service lines:**
  1. **Compliance / setup (acquisition):** BOC-3, USDOT authority, MC number, UCR, Clearinghouse registration, Biennial updates, USDOT PIN, Drug & Alcohol consortium, LLC registration.
  2. **Dispatch (retention, recurring retainer):** by trailer type — box truck, flatbed, hot shot, reefer, dry van, power only. Plus load matching, rate negotiation, 24/7 support, billing/paperwork, route planning, factoring, document management.
- **Published pricing (compliance, on subdomain form):** BOC-3 $100; BOC-3 + UCR bundle $200; MC# address change $45; FMCSA authority letter $40; MCS-150 update $125; 2026 UCR tiers $130 (broker / 0-2 trucks) up to $1,550 (21-100 trucks). Dispatch pricing not published as a fixed number.
- **Homepage proof metrics (UNVERIFIED — marketing claims, must validate before reuse, see standards):** "15% average revenue increase," "20% reduction in deadhead miles," "$10,000-$20,000 extra annual earnings potential," "15 hours saved weekly on admin." Treat as null until the business confirms.

## CRITICAL STRUCTURAL FINDING — the pivot has no organic real estate
- The homepage and a few blog posts gesture at compliance/setup, but **there are no indexable compliance or setup service pages on the main domain** (none in the sitemap).
- The compliance funnel lives on **subdomains**: `boc-3.techrig.org` (a single-page filing form with pricing) and `form.techrig.org` (intake/onboarding form). Both are transactional forms, not SEO content.
- Footer "Compliance" nav (BOC-3, USDOT Authority, MC Number, UCR, Clearinghouse, Biennial Updates, USDOT PIN, Drug & Alcohol, LLC Registration) points to the subdomain/forms, not to content pages.
- **Implication:** the growth pivot (the stated priority) is greenfield for SEO. Net-new money pages on the main domain are the core of this build, not a refresh of existing assets.

## Positioning inconsistency to resolve
- **Homepage** = revamped, compliance-led ("Your Authority Won't Activate Without BOC-3").
- **/services/** = old dispatch-only positioning (title "Trucking Billing, Documents Management, Factoring, Fleets," H1 "What We Offer"; lists dispatching, billing, document management, rate negotiation, fleet, factoring). No compliance. Stale relative to the homepage.

## Inventory by category

### Core / money / utility pages
| URL | Purpose | On-page basics & notes |
| --- | --- | --- |
| `/` | Homepage | Title "Full-Service Trucking Compliance & Dispatch Services \| Tech Rig" (within 60 chars w/ brand). H1 "Your Authority Won't Activate Without BOC-3". Compliance-led, dispatch secondary, FAQ + testimonials. CTAs to boc-3/form subdomains + tel. Already pivot-aligned. |
| `/services/` | Services overview | Title "Trucking Billing, Documents Management, Factoring, Fleets" (no brand, no compliance). H1 "What We Offer". STALE — dispatch-only. Prime rewrite candidate to become the service hub. |
| `/lead-generation/` | "Brokers that work with new MC's" lead magnet | H1 "Brokers That Work with New MC's: Securing Loads from Day One". Broker list download, coach CTA. Pivot-adjacent (serves new carriers). |
| `/contact-us/` | Contact | Title "Contact Us - Tech Rig". H1 "Need Help With Your Trucking Authority?". Phone/email/WhatsApp, social links (FB, IG, GMB, Twitter). No form fields. |
| `/referral-program/` | Referral program | Not crawled. Utility. |
| `/introduction/`, `/step-by-step-process/` | Onboarding/explainer | Not crawled. Likely funnel support. |
| `/home-backup/` | Backup of old homepage | Likely an orphan/duplicate of a prior homepage. NOINDEX/remove candidate — flag for audit. |
| Legal: `/terms-of-service/`, `/privacy-policy/`, `/power-of-attorney/`, `/refund-policy/` | Legal/policy | Keep. `power-of-attorney` is dispatch-onboarding-relevant. |

### State / location pages (4)
`/tech-rig-dispatch-{new-york,california,texas,florida}/`
- Texas crawled: Title "Texas Trucking Dispatch Services \| Tech Rig Dispatch", H1 "Turn Texas Miles Into Texas-Sized Profits", ~2,100 words, 4-step process, FAQ. **Partially genuine** (254 counties, Houston port, Dallas DCs, I-35) but with templated sections and an unverified "$1.6 trillion freight/yr" claim. Pattern likely repeats across the 4 states.

### Dispatch silos (by trailer type) — the bulk of the site
Six silos, each repeating a near-identical ~18-page sub-structure. Hub pages are substantive (~2,000+ words, real CTAs); the deep sub-pages are programmatic and thin.

| Silo | Hub | Sub-page pattern (per silo) |
| --- | --- | --- |
| `/reefers-trucking/` | Hub: Title "Truck Load Boards for Reefers \| Reefers Trucking Dispatch", H1 "Connect To Premium Reefers Trucking Load", ~2,100-2,300 words, FAQ. | what-is-…, benefits (+ ~20 benefit sub-pages: time-saving, increased-earnings, etc.), finding-loads, load-boards, negotiating-rates, route-planning, compliance, technology, challenges, success-stories, cost, choosing-dispatcher, X-vs-other, efficiency, training, legal-aspects, insurance, environmental-impact, innovations, customer-service. |
| `/flatbed-dispatch/` | Hub (lastmod 2026-04-29) | Same ~18 sub-pages. |
| `/dry-van-trucking/` | Hub (lastmod 2026-04-30) | Same pattern. |
| `/box-truck-dispatch/` | Hub (lastmod 2026-04-30) | Same pattern. |
| `/power-only-trucking/` | Hub (lastmod 2026-05-04) | Same pattern. |
| `/hot-shot-trucking/` | Hub only (lastmod 2026-04-29) | Appears to lack the full sub-silo. |

### DEEP THIN SILO — consolidation target
`/reefers-trucking/benefits/compliance-assistance/` + ~30 child pages (regulatory-requirements, safety-standards, audits-checks, hos-regulations, driver-training, vehicle-maintenance, safety-violations, record-keeping, using-technology, environmental-compliance, accident-reporting, csa-scores, eld-mandate, health-safety-protocols, insurance-requirements, hazardous-materials, risk-management, compliance-training-programs, future-trends, dispatch-software, gps-tracking, introduction…).
- Hub crawled: Title "Ensure Compliance and Safety with Professional Dispatch Services", H1 "Safeguard Your Business with Compliance and Safety Support", ~1,200 words, moderately substantive.
- **Problem:** ~30 generic compliance encyclopedia pages buried 4 levels deep under one trailer type (reefers). This is the strongest topical match to the COMPLIANCE PIVOT but it is mislocated (should be a top-level compliance silo, not a reefer sub-folder) and likely thin/duplicative. Prime merge-and-relocate candidate.

### Blog (60 posts, /blog/ hub)
All posts last-modified 2025-04-04 (bulk migration timestamp; true freshness unknown). Topics cluster into:
- **Compliance/setup education (pivot-aligned, high value):** how-to-get-dot-and-mc-number, what-is-csa, what-is-ifta, what-is-eld, what-is-factoring, what-are-the-new-dot-hours-of-service-rules, what-is-a-34-hour-reset, what-is-personal-conveyance, what-is-a-dac-report, do-you-need-a-cdl-for-a-box-truck, how-to-get-dot-and-mc-number (crawled: ~1,400 words, H1 "How to Get DOT and MC Number?", no byline, no visible date, soft CTA to compliance services).
- **Dispatch/ops education:** freight-broker-vs-dispatcher, what-is-load-to-truck-ratio, what-does-otr-mean, how-to-find-a-dispatcher-for-a-box-truck, step-by-step-guide-to-outsourcing-your-dispatch.
- **Insurance/cost:** how-much-is-commercial-insurance-for-hot-shot / box-truck, average-fuel-mileage-for-semi-trucks.
- **"Revolutionize/Mastering/Unleashing…" listicles:** ~12 posts with AI-tell, hype-styled titles (revolutionize-your-trucking-business, unleashing-profit-potential, mastering-the-art-of-load-scouting, etc.). Likely thin/low-quality; rewrite or prune candidates.
- **Industry/news:** trucking-industry-forecast-2025, state-of-the-trucking-industry-2025, decarbonizing-long-haul, digitization-in-transportation, reefer-report-mats.

### Author sitemap
Present but author byline not surfaced on the crawled blog post. Byline/authorship needs confirmation (see gaps).

## Issues flagged for the audit (Phase 3) and migration (Phase 4)
1. Pivot money pages (compliance/setup) do not exist as indexable content — must be built.
2. `/services/` positioning is stale vs the homepage.
3. ~30-page compliance sub-silo is mislocated under reefers and likely thin — relocate + consolidate to a top-level compliance silo (URL changes → 301s).
4. Per-silo benefit sub-pages (~20 per silo) are programmatic thin content — consolidation candidates.
5. State pages contain unverified statistics (e.g. Texas "$1.6 trillion").
6. `/home-backup/` likely an orphan duplicate.
7. Many blog posts use banned AI-tell vocabulary in titles ("revolutionize," "unleashing," "supercharge"-style) — conflicts with `standards.md`.
8. Meta descriptions not detected on several key pages (homepage, services, lead-generation) — verify in audit.
9. Compliance funnel on subdomains is invisible to the main-domain's topical authority. **DECISION (2026-06-19): build compliance content on the main domain.** New top-level compliance/setup money pages will live on techrig.org; the subdomain forms remain the transactional endpoint the content pages convert into.
