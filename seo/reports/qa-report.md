# QA Report: techrig.org revamp (Phase 10 pre-launch gate)

Run 2026-06-20 against the `shared/` contract (sitemap-plan, keyword-map, schema-specs, page-briefs) and `seo/` context. Scope: the SEO deliverables (briefs, copy, structure, schema spec). On-page code correctness, Core Web Vitals, and live-URL behaviour are Dev's to verify at build (flagged in §C).

## Verdict
**PASS with documented follow-ups.** No standards violation blocks handoff. Open items are client inputs (`[VERIFY]`/proof) and Dev build tasks, all listed below. Design and Dev are unblocked.

---

## A. Mandatory QA pass (standards.md)

### 1. No page violates a stated standard — PASS
- Em dashes in published copy: **0** (scanned `shared/page-briefs/`). Stray em dashes in internal labels were removed.
- Banned AI-tell words: **0** in copy (scanned).
- Title tags: all ≤ 60 chars incl. brand (counts annotated per brief; spot-verified home 48, hub 46, BOC-3 51, pillar 42).
- Meta descriptions: one per page, 150-160 chars, unique, primary present.
- Headings name sections; slogans/taglines specified as styled paragraphs, not H-tags (noted in home + hub briefs).

### 2. Metrics carry unit + timeframe; no vanity metrics — PASS
- Legacy homepage metrics (15% revenue, 20% deadhead, $10k-$20k, 15 hrs/wk, "5-star") are REMOVED everywhere and explicitly blocked (home brief, brand-guidelines, services). Grep confirms remaining mentions are guardrail instructions, not published claims.
- Published proof is documented and carries units/timeframes: "since 2021", "~100 carriers dispatched", "40+ clients across 42 engagements since 2025", "more than 10 states". Pricing carries currency + cadence (one-time/annual/% of gross).
- No vanity metric sits on a page that disavows them.

### 3. Self-claims must be true of delivered code — DEFERRED to Dev (see §C)
- Copy avoids site-performance claims (no "fastest site" etc.). Service-speed wording ("we file today", "fast setup") is tied to what Tech Rig does, not to FMCSA approval; the no-guaranteed-timeline rule is honoured in every FAQ. Dev/writer must keep "today/fast" attached to "we file", never to activation.

### 4. Duplicate-string scan — DESIGNED-FOR; build-time scan REQUIRED
- Each money page leads with a distinct angle and a distinct real worked example (Art, Marcus, Felix, Eduardo, Gustavo, Tanisha mapped 1:1; IRP/reefer/flatbed/dry-van flagged `[CLIENT PROOF NEEDED]`). No example reused as-is.
- **Required exception:** the regulated FMCSA phrase "officially listed by FMCSA as a BOC-3 blanket process-agent company" is intentionally repeated verbatim (compliance wording) and is exempt from the 8-word rule.
- **Known shared lines to vary at write-time** (so no non-exempt 8+ word sentence repeats): the no-contract/no-forced-dispatch positioning (dispatch hub + box truck + trailers), the funnel cross-link ("same team that gets you road-legal..."), and the protest-period explanation. Writer/Dev must phrase these differently per page.
- **Highest risk = state pages.** Run the duplicate-string scan specifically across `/tech-rig-dispatch-[state]/` before launch; each intro, "starting in [state]" section, and FAQ must be independently written.

### 5. Every CTA / internal link resolves to a planned URL — PASS
- All 24 unique internal link targets in the briefs resolve to URLs in `sitemap-plan.md` (verified). Transactional CTA endpoints (`/get-started`, `boc-3.techrig.org`, `form.techrig.org`) exist and are bucketed.
- **Open:** the exact CTA *route* per page (intake form vs `/get-started` vs `/contact-us/`) is marked `[VERIFY]` for Dev; the targets all exist, only the choice is pending.

### 6. One primary + 2-3 secondaries + labelled intent + single CTA per page — PASS (one minor cleanup)
- Every brief has a Meta block (primary w/ vol+KD, secondaries, intent, bucket) and one primary CTA.
- **Minor:** `/mc-registration/` lists 4 secondaries (standard says 2-3). Recommend dropping "how long does it take to get mc number" to a body/FAQ mention, keeping 3 (mc authority, how to get mc number, mc number cost). Non-blocking.

---

## B. Per-page coverage snapshot
All briefs carry: title, meta, Three Kings check, full copy, single CTA, internal links (contextual anchors), per-page Service + BreadcrumbList + FAQPage schema, "Reviewed by" alias, distinct worked example, Dev/Design notes.

- Compliance: hub, pillar, bundle, dot, mc, ucr, mcs-150, boc-3, irp, ifta, dq-files, consortium (+ drug-test section), clearinghouse, eld, trucking-llc, insurance-filing. **All 13 packet items covered.**
- Dispatch: services hub + box-truck (full); reefer/flatbed/dry-van/power-only/hot-shot (template, per-page targets + distinct-angle requirement).
- Site: home (redo), about-us (alias founder bios + Person schema), state pages (template), lead-generation, blog feeders (triage + interlink rules).

---

## C. Claims-vs-code: Dev verification list (must confirm at build)
1. **Per-page unique OG image** generated for every page (branded, no placeholder) — standards requirement.
2. **llms.txt** at site root (schema-specs §8).
3. **JSON-LD** matches `schema-specs.md`: one Organization node (#org), two alias Person nodes (#adam-smith, #robert-hooke), per-page Service with service-fee-only price, FAQPage parity with visible Q&A, BreadcrumbList. No aggregateRating/review stars. No real names in markup.
4. **Repurposed ad pages** (`/dot-registration/`, `/mc-registration/`, `/mc-dot-registration/`) flipped from noindex to indexable, canonical-to-self, added to sitemap; existing ad-conversion tracking preserved.
5. **CTA routes** live and correct; `boc-3.techrig.org` and `form.techrig.org` forms working; cross-domain GA4 measurement (migration-plan §8).
6. **Price chips** pull from a single source so they cannot drift from `services.md`.
7. **Decorative glyphs via CSS**, not typed into headings/text nodes.
8. **Reading level**: FAQ/process sections at Grade 8 (briefs written to this; verify on render).
9. **Core Web Vitals**: address the Phase 3 performance findings; do not publish a speed/accessibility claim the build does not meet.

---

## D. Migration safety check
Anchored to `migration-plan.md` (updated this phase) and the Phase 3 baseline.

- **PRESERVE register intact:** franchise `/box-truck-dispatch/` (+ `/cost/`), `/lead-generation/`, `/dry-van-trucking/` (+ `/cost/`), other trailer hubs, `/about-us/` (add to sitemap), `/contact-us/`, homepage brand, blog winners. Briefs say "preserve signals, deepen don't strip."
- **Repurpose (no redirect, same URL):** the three ad pages above.
- **Resolved gap:** `/start-compliance/` now **301 → `/compliance-services/`** (the hub was built as a new URL, not from this slug). Recorded in migration-plan §4.
- **Consolidations:** reefer compliance sub-silo (~30) and per-silo thin sub-pages → 301 to silo hub or matching compliance page; keep `/cost/` children. Clones (`/clone-home`, `/home-backup`) → 301 to `/`.
- **Net-new URLs** (14, listed in migration-plan §4) added to sitemap at launch.
- **Redirect mechanics:** all 301, one hop, no chains; update internal links to final URLs; single host + HTTPS; regenerate XML sitemap to final 200s.
- **Post-Dev-build findings (2026-06-21):** the Dev build covers every planned page, but two old-site items are not yet handled and would cause launch regressions:
  - **Blog posts not built.** Only a `/blog/` hub exists; the 60 old posts (incl. the 14.4k-impression `how-to-get-dot-and-mc-number...` and pos-8.9 `what-is-load-to-truck-ratio`) would 404. Disposition (KEEP-and-rebuild vs 301) is in `../../shared/blog-disposition.md`.
  - **301 redirects not implemented.** `next.config.ts` has no `redirects()`. The retired thin sub-silos (~150 URLs), the reefer compliance tree, and `/start-compliance/` would 404. Full map in `../../shared/redirect-map.md`.
- **Pre-launch blocker not yet done (Dev/SEO):** the full live-URL crawl union (Screaming Frog + GSC indexed export + GA4 landing pages) that assigns every real URL a bucket. This is migration-plan step 0 and must run before redirects are finalized. The sitemap is not the true live set, though the maps above are built from it plus the known off-sitemap pages.
- **Confirm high-value GSC URLs before removing anything** (prime directive): box-truck-dispatch + cost, lead-generation, homepage, dry-van. Any >20% click drop post-launch = regression to fix same-week.

---

## E. Consolidated open items (owner of each in brackets)
- **Pricing fully RESOLVED 2026-06-21 (client follow-up):** all dispatch percentages (box 8 / van 5 / dry van 5 / power only 5 / flatbed 3 / reefer 3 / hot shot 8); ELD free via Motive referral; insurance = coordinate-only, contact-for-quote (Tech Rig does not file BMC-91/MCS-90, no insurer partnerships); LLC contact-for-quote; FMCSA authority letter removed; IRP/IFTA $175; full package $1,350.
- **[CLIENT]** Government fees: USDOT gov fee, IRP/IFTA state fees, state market stats (e.g. TX "$1.6T") — source or remove. (UCR bracket amounts RESOLVED 2026-06-21 from the official UCR schedule; in `ucr-registration.md`.)
- **RESOLVED:** social profile URLs supplied (FB, IG, LinkedIn, TikTok, Google Business); logo asset delivered to the Dev staging repo by the team.
- **Proof RESOLVED:** reefer has one cleared anonymous historical story ($5/mi lane, 3-4x/week); IRP, flatbed, dry van, and TX/NY/FL confirmed to stay neutral (no clients yet); CA retained. **Still pending:** testimonial permissions (Felix/Marcus/Freddie, client outreach in progress).
- **[DEV]** All of §C, plus CTA route selection per page.
- **[SEO/DEV]** Pre-launch full-crawl URL union + final 301 map; duplicate-string scan across state pages.
- **[SEO, post-launch]** Operations Track picks up the 4 client-requested blog posts and the per-page proof once client supplies it.

## Files validated
`shared/`: sitemap-plan.md, keyword-map.md, schema-specs.md, page-briefs/* (24 briefs + index). `seo/output/`: strategy.md, migration-plan.md (updated), keywords.md. `seo/context/`: services, brand-guidelines, experience-notes, author, site-config.
