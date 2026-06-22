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

## Pricing quick-reference (confirmed, USD; see `services.md`)
USDOT $300 (standalone only) · MC $600 (**includes USDOT**, no extra $300) · BOC-3 $100 (one-time) · BOC-3+UCR (0-2 bracket) $200 · UCR service from $100 (2026 gov fee by bracket: 0-2 $46, 3-5 $138, 6-20 $276, 21-100 $963, 101-1,000 $4,592, 1,001+ $44,836, shown separately) · Clearinghouse $100 · Consortium $150 · DQ file $200/driver · pre-employment drug test $100 · IRP setup $175 (+ state fees by mileage/state) · IFTA setup $175 (+ state fees) · MC reinstatement $200 + gov fee · USDOT reactivation/deactivation $125 · address change $125 · MCS-150 update $125 · **full package $1,350** (was $1,650; corrected for the USDOT-in-MC overlap; includes MC + UCR 0-2 gov fees, not IRP/IFTA gov fees). **Dispatch % (confirmed):** box 8 / cargo van 5 / dry van 5 / power only 5 / flatbed 3 / reefer 3 / hot shot 8. **ELD:** free from Tech Rig (Motive referral; client buys device/subscription from Motive). Contact-for-quote: LLC/consultancy, insurance-filing coordination. Removed: FMCSA authority letter.

## Batch status
**Batch 1 (done):** compliance-services-hub, ucr-registration, mcs-150-biennial-update, dot-registration, mc-registration, boc-3-filing.
**Batch 2 (done):** how-to-start-a-trucking-company (pillar), mc-dot-registration (bundle), irp-registration, ifta-registration, driver-qualification-files, drug-and-alcohol-consortium, fmcsa-clearinghouse-registration, eld-services, trucking-llc, trucking-insurance-filing.
**Batch 3 (done):** home (homepage redo), services-dispatch-hub, about-us (founder bios), box-truck-dispatch (franchise), dispatch-trailer-pages (template: reefer/flatbed/dry-van/power-only/hot-shot), state-pages (template: TX/CA/NY/FL + future), lead-generation, blog-feeders (triage + interlink rules).

**Global components:** `global-footer.md` (site-wide mega-footer: the full service list lives here, not in the homepage body).

ALL Phase 9 page briefs COMPLETE. Compliance silo (13 packet items + hub + pillar + bundle), dispatch silo (hub + 6 trailers), home, about, states, lead-gen, blog. The bridge guide `/how-to-start-a-box-truck-business/` is the one remaining standalone brief if a full spec is wanted (currently specced inline in box-truck-dispatch + pillar links); flag if you want it as its own file.

## Cross-cutting open items (most RESOLVED 2026-06-21 from the client follow-up)
- **[DEV]** CTA **routes** for transactional intents (form vs /get-started vs /contact-us/): confirm per page. (Still open.)
- **[DEV]** Logo asset (team delivers to the Dev staging repo) + run the redirect/blog work (`redirect-map.md`, `blog-disposition.md`).
- **[CLIENT, pending]** Testimonial permissions (Felix/Marcus/Freddie) to publish direct quotes.
- **RESOLVED:** all dispatch percentages; ELD (free, Motive referral); insurance (coordinate-only, contact-for-quote); LLC (contact-for-quote); FMCSA authority letter (removed); IRP/IFTA $175; UCR brackets; full package $1,350; social profile URLs.
- **RESOLVED proof:** reefer has a real anonymous story; IRP, flatbed, dry van, TX/NY/FL confirmed to stay neutral (no clients yet); CA retained.
- **[CLIENT]** Remaining government figures: USDOT gov fee, IRP/IFTA state fees (mileage/state dependent, quoted per carrier). State market stats (e.g. TX "$1.6T") must be sourced or removed.
