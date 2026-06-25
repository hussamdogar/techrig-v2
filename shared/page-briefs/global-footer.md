# Brief: global mega-footer (site-wide component)

One footer, identical on every page. Its job: make every money page reachable in one click from anywhere (internal-link equity + crawl/discovery), show the full breadth of services the niche expects, and carry NAP + trust. This is the place for the complete service list, NOT the homepage body (the body shows a curated few + "see all"). Build it once as a global component.

## Link rules
- Every footer link must resolve to a URL in `sitemap-plan.md` (standards: no link to a non-existent page).
- Footer links are navigation: use the descriptive service name as the label (e.g. "BOC-3 Filing"). The "no 'click here' / no 'our services'" rule is for inline contextual anchors, not nav labels.
- Do not link pages that are `noindex`/transactional (`/get-started`, `/single-payment`, the form subdomains) from the footer nav.

## Columns

### Column 1: Compliance Services
Header links to the hub `/compliance-services/`. Then list ALL items:
- [Compliance Services hub](/compliance-services/)
- [Authority Package (DOT + MC)](/mc-dot-registration/)
- [USDOT Registration](/dot-registration/)
- [MC Authority](/mc-registration/)
- [BOC-3 Filing](/boc-3-filing/)
- [UCR Registration](/ucr-registration/)
- [Biennial Update](/mcs-150-biennial-update/)
- [USDOT Correction](/usdot-correction/)
- [MOTUS Migration](/motus-migration/)
- [IRP Registration](/irp-registration/)
- [IFTA Registration](/ifta-registration/)
- [IFTA Quarterly Filing](/ifta-quarterly-filing/)
- [Driver Qualification Files](/driver-qualification-files/)
- [Drug & Alcohol Consortium](/drug-and-alcohol-consortium/)
- [FMCSA Clearinghouse](/fmcsa-clearinghouse-registration/)
- [ELD Services](/eld-services/)
- [Trucking LLC](/trucking-llc/)

(No "Insurance Filing" link — that page was removed. ~17 links; if the column is long, split into two sub-columns under one "Compliance Services" header. Order = build/priority order.)

### Column 2: Dispatch Services
Header links to the hub `/services/`. Then:
- [Truck Dispatch hub](/services/)
- [Box Truck Dispatch](/box-truck-dispatch/)
- [Reefer Dispatch](/reefers-trucking/)
- [Flatbed Dispatch](/flatbed-dispatch/)
- [Dry Van Dispatch](/dry-van-trucking/)
- [Power Only Dispatch](/power-only-trucking/)
- [Hot Shot Dispatch](/hot-shot-trucking/)

### Column 3: Company
- [About Tech Rig](/about-us/)
- [Contact](/contact-us/)
- [How to Start a Trucking Company](/how-to-start-a-trucking-company/) (the pillar guide)
- [New Authority Loads](/lead-generation/)
- [Blog](/blog/)

### Column 4: Legal
- [Terms of Service](/terms-of-service/)
- [Privacy Policy](/privacy-policy/)
- [Power of Attorney](/power-of-attorney/)
- [Refund Policy](/refund-policy/)
- [Referral Program](/referral-program/)

## Trust + NAP block (spans the footer, above or beside the columns)
- Brand: **Tech Rig** logo (asset delivered directly to the Dev staging repo by the team; Dev wires the path).
- One-line positioning: "Trucking compliance and dispatch, from your first filing to your next load." (Styled paragraph, not a heading.)
- NAP: 30 N Gould St, Ste R, Sheridan, WY 82801 · [+1 917-909-2257](tel:+19179092257) · [info@techrig.org](mailto:info@techrig.org). Address is the registered address; do not imply a walk-in office.
- FMCSA line (regulated wording, exact): "DGR Tech Rig LLC is officially [listed by FMCSA](https://www.fmcsa.dot.gov/registration/process-agents/pa?field_associated_boc_target_id=82976) as a BOC-3 blanket process-agent company." The anchor "listed by FMCSA" links to the official FMCSA listing (external, `target="_blank" rel="noopener nofollow"`). Because the footer is site-wide, this puts the verifiable proof on every page. Never imply FMCSA endorsement or government affiliation, and do not present the id 82976 as a license number.
- Social icons (confirmed 2026-06-21): Facebook https://www.facebook.com/Techrigllc · Instagram https://www.instagram.com/tech_rig/ · LinkedIn https://www.linkedin.com/company/tech-rig · TikTok https://www.tiktok.com/@tech_rig · Google Business https://share.google/YidOXkc3mu7ZlQqEq . (No Twitter/X.) External links: `target="_blank" rel="noopener"`.
- Legal entity line: "© [year] DGR Tech Rig LLC. All rights reserved." (Legal name in the footer per brand-guidelines; public brand "Tech Rig" everywhere else.)

## Claims / proof discipline
- No metrics, no "5-star"/ratings, no guarantees in the footer.
- No fabricated awards or trust badges. The FMCSA listing line is the only trust claim, worded exactly as above.

## Schema / Dev notes
- The footer is the canonical site-wide nav; its links reinforce the `Organization`/`ProfessionalService` internal-link graph. No separate schema needed beyond the global `Organization` node already in the head.
- Keep the footer lightweight (text links, CSS icons) to protect Core Web Vitals; do not load heavy assets in the footer.
- Identical markup on every page so the link equity is consistent.
- When the dispatch trailer percentages, fees, logo, and social URLs are confirmed, only the logo/social block changes; the link list is final.

## Why this and not the homepage body
Competitors (dotmc.com, dotfiler.com) list all services on the homepage because they are single-silo compliance filers, so their homepage is their hub. Tech Rig is dual-silo with a dedicated `/compliance-services/` hub, so the full list lives in the footer (breadth + equity, every page) while the homepage body stays curated and funnel-focused. The hub remains the exhaustive, conversion-focused list.
