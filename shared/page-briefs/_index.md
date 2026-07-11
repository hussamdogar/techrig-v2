# Page briefs index and shared conventions

One file per page. Each brief is the contract for Design and Dev: final copy plus the markup, CTA, schema, and internal-link spec. Copy here is publish-ready unless a line is marked `[CLIENT PROOF NEEDED]` (a real proof point to slot in once the client confirms the specific permission) or `[VERIFY]`.

## Conventions that apply to every brief (from `_shared/standards.md` + `brand-guidelines.md`)
- **No em dashes.** Commas, colons, periods only.
- **Brand:** public "Tech Rig"; legal "DGR Tech Rig LLC" in footer/legal/schema only.
- **Three Kings:** primary keyword appears in the title tag, the first paragraph, and at least two H2s.
- **Title tag** 60 chars or fewer incl. brand. **Meta description** 150 to 160 chars, unique, primary present.
- **One CTA / next step** per page. Primary CTA wording is specified per brief; it routes only to a real URL in `sitemap-plan.md`.
- **Internal links:** inline, 1 to 3 word contextual anchors. Never "click here", "learn more", "our services".
- **Decorative glyphs via CSS, never typed into headings or text nodes.** Headings name sections only; slogans are styled paragraphs.
- **Metrics:** only the documented ones in `experience-notes.md`. No guaranteed activation dates or timelines. Government/third-party fees shown separately from Tech Rig's service fee.
- **FMCSA wording:** "officially listed by FMCSA as a BOC-3 blanket process-agent company." Never imply Tech Rig is FMCSA or government-endorsed. BOC-3 is a one-time filing, not annual.
- **Author E-E-A-T:** money/expert pages carry a short "Reviewed by" line citing Adam Smith (law background) or Robert Hooke (systems background) per `author.md`. Organization is the publisher.
- **Reading level:** FAQ and process sections at Grade 8. Hero may be more literary but must pass a 5-second clarity test.
- **Uniqueness:** no 8+ word sentence repeats across pages; each "who this is for" leads with a different industry + worked example.

## Pricing quick-reference (USD; MASTER is `services.md`, Pricing v2 updated 2026-07-10)
**Two prices per service (standalone à-la-carte / lower in-bundle):** MC Authority + USDOT **$650 / $600** · USDOT only **$300 / $300** · BOC-3 **$100 / $100** · UCR filing **$80 / $50** (+ separate gov bracket: 0-2 $46, 3-5 $138, 6-20 $276, 21-100 $963, 101-1,000 $4,592, 1,001+ $44,836) · DQ 1-driver **$250 / $200** (standalone 2=$450, 3=$600; in-bundle 2=$350, 3=$450; >3 custom) · Clearinghouse **$125 / $100** · Consortium **$175 / $150** (annual) · pre-emp drug test **$125 / $100** · IRP setup **$225 / $175** · IFTA setup **$225 / $175** · IFTA quarterly **$150** (same) · USDOT Correction / Biennial Update / MOTUS Migration **$125 each** (not bundled) · MC reinstatement $200 + gov · USDOT reactivation/deactivation $125. **Bold in-bundle prices equal the prior registry values; only the standalone prices are new (8 increases).**
**Four bundles (DERIVED, never hardcoded):** Compliance Continuation Non-CDL **$396** (val $476, save $80, 16.8%) · Compliance Continuation CDL/Heavy **$1,096** (val $1,351, save $255, 18.9%) · Authority Launch Non-CDL **$996** (val $1,126, save $130, 11.5%) · Authority Launch CDL/Heavy **$1,696** (val $2,001, save $305, 15.2%). BOC-3 included in every card; final price = itemized in-bundle total (no rounding); picked by authority status × vehicle type. Replaces the single $1,700 package. See `/compliance-packages/`.
**Dispatch %:** box 8 / cargo van 5 / dry van 5 / power only 5 / flatbed 3 / reefer 3 / hot shot 8. **ELD:** partner referral (Motive), no price. **LLC:** partner referral (Inc Authority), contact for quote. **Insurance:** not a Tech Rig service (page removed; coordinate-only). Removed: FMCSA authority letter; flat $50 refund fee.

## Batch status
**Batch 1 (done):** compliance-services-hub, ucr-registration, mcs-150-biennial-update, dot-registration, mc-registration, boc-3-filing.
**Batch 2 (done):** how-to-start-a-trucking-company (pillar), mc-dot-registration (bundle), irp-registration, ifta-registration, driver-qualification-files, drug-and-alcohol-consortium, fmcsa-clearinghouse-registration, eld-services, trucking-llc, trucking-insurance-filing.
**Batch 3 (done):** home (homepage redo), services-dispatch-hub, about-us (founder bios), box-truck-dispatch (franchise), dispatch-trailer-pages (template: reefer/flatbed/dry-van/power-only/hot-shot), state-pages (template: TX/CA/NY/FL + future), lead-generation, blog-feeders (triage + interlink rules).

**Batch 4 (2026-06-25 client answers, S1-S6):** usdot-correction (NEW, $125), ifta-quarterly-filing (NEW, $150+gov), motus-migration (NEW, $125; holds the relocated CA legacy story), refund-policy (copy for Dev D9). Updated: services.md master ($1,700/9-item, DQ tiers, MOTUS, turnaround times), ucr (gov brackets + separate $50 line), mc-registration + mc-dot-registration (CA story removed, UCR-not-activation), dot-registration (TX clean example, FMCSA Portal→MOTUS), trucking-llc (Inc Authority referral), fmcsa-clearinghouse (C/TPA), state-pages (TX stat removed), footer (new pages + insurance link removed). trucking-insurance-filing brief DELETED.

**Global components:** `global-footer.md` (site-wide mega-footer: the full service list lives here, not in the homepage body).

ALL Phase 9 page briefs COMPLETE. Compliance silo (13 packet items + hub + pillar + bundle), dispatch silo (hub + 6 trailers), home, about, states, lead-gen, blog. The bridge guide `/how-to-start-a-box-truck-business/` is the one remaining standalone brief if a full spec is wanted (currently specced inline in box-truck-dispatch + pillar links); flag if you want it as its own file.

## Cross-cutting open items (most RESOLVED 2026-06-21 from the client follow-up)
- **CTA routes RESOLVED 2026-06-25 (S9/D14):** the 11 compliance money pages now specify `/apply/?service=<key>` (ucr→ucr, dot→usdot, mc→mc-authority, mc-dot→mc-authority, clearinghouse→clearinghouse, consortium→consortium, dq→dq-files, irp→irp, ifta→ifta, mcs-150→mcs-150, boc-3→boc-3; the 3 newest already on /apply). BOC-3 active CTA moved off the legacy `boc-3.techrig.org` (now drain-only). Dispatch briefs keep `/contact-us/` (retainer, not /apply). **Flag for orchestrator:** the D14 mapping line "services (hub) → /apply generic" is ambiguous — `/services/` is the dispatch hub (left on /contact-us/); did it mean the compliance hub? Left unchanged pending confirmation.
- **[DEV]** Logo asset (team delivers to the Dev staging repo) + run the redirect/blog work (`redirect-map.md`, `blog-disposition.md`).
- **[CLIENT, pending]** Testimonial permissions (Felix/Marcus/Freddie) to publish direct quotes.
- **SUPERSEDED by Pricing v2 (2026-07-10):** the single $1,700 9-item package and the à-la-carte prices from 2026-06-25 are replaced by the two-price model + four bundles (see the quick-reference above and `/compliance-packages/`). Still current from that pass: MOTUS Migration / USDOT Correction / IFTA Quarterly dedicated pages; C/TPA, partner links (Motive/Inc Authority), PIN copy; TX "$1.6T" removed; CA legacy story on /motus-migration/.
- **[CLIENT/owner, still open]** QCMobile webKey (deploy), final team filing ownership, live Stripe credential — all deployment items, not SEO.
- **[CLIENT, post-launch]** Testimonials (Felix/Marcus/Freddie) — S7, deferred.
- **Parity:** `services.md` is the master the Dev registry + /apply + receipt + marketing pages must equal; re-run the parity gate after the Dev D1-D8 deltas.
