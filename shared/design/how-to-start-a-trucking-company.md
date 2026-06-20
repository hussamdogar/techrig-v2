# Page design spec: /how-to-start-a-trucking-company/ (Pillar guide)

Design-only spec. Consumes `shared/page-briefs/how-to-start-a-trucking-company.md`. SEO owns copy, headings, CTA wording and destinations, and the step sequence and its links; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
The authority pillar and the main TOFU internal-link distributor: an educational guide that walks the whole path and routes down to the filing money pages and the compliance hub. One job: a researching new carrier trusts the guidance, grasps the order of operations, and clicks through to the exact filing when ready. This page is heavier on guidance and lighter on hard CTA than the money pages: the primary CTA is a soft route, not a hard sell. The Authority Status Tracker and a step roadmap belong here, since the whole page is about sequence and where you stand in it. Long-form, scannable, E-E-A-T forward.

## Section order and layout

1. Header (global): shared sticky header and matching mega-footer. The persistent header CTA stays, but on this page the in-body CTAs are soft routes (see CRO).

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left (dominant): H1 "How to Start a Trucking Company" (Archivo). The brief's hero lede (the "order matters" framing, including "written from the filings we run every week") as a styled Plex Sans Body L paragraph, never an H-tag. A "By Adam Smith, Co-Founder" author line (mono label + name) sits under the lede, since this is an authored Article (E-E-A-T); design it as a byline, not a reviewed-by chip.
   - Right (the signature visual, used honestly): the Authority Status Tracker (Application filed -> 21-day protest period -> Authority active). On the pillar it sets the mental model for the whole guide: filing is a sequence with a fixed federal protest step. Honesty rules apply: a fixed "21-day federal protest period" step, no guaranteed date, no countdown.
   - No hard primary button in the hero. A single quiet inline route "compliance services" -> `/compliance-services/` may sit in the lede area as the soft CTA; the guide, not a button, is the hero.

3. On-page table of contents (the long-form aid the brief requires): a compact anchor-link list to the 9 steps and the major H2s, set in the system's mono label treatment for a "document index" feel. Sticky on desktop (a left rail or a pinned compact bar) so the reader keeps their place through a 2,000+ word page; collapses to an inline "On this page" disclosure on mobile. Anchor links are Steel, current-section indicated by weight or a Steel marker (not color alone). This is structure, not decoration.

4. H2 "Before you file: decisions that shape everything": a short typographic section, three styled decision lead-ins (styled paragraphs, not H-tags) plus the brief's copy. The freight-forwarder mistake renders as the system's quiet example callout (left 1.5px Steel rule, Slate text), the same callout style the compliance hub uses, tying the pillar visually to the money pages. Cloud surface.

5. H2 "How to start a trucking company in 9 steps": the centerpiece, a step roadmap rendered as the system's connected stepper/line diagram extended to nine nodes. 01 to 09 numbering is correct here because it is a genuine sequence (the system bans numbering only when content is not a sequence). Layout: a vertical connected roadmap on desktop (a left spine with numbered nodes, each step a row), stacking naturally on mobile; this suits nine steps better than a cramped horizontal row and reinforces "the order matters." Each step = mono step number + Archivo step title + Grade 8 Plex Sans explanation + the brief's inline 1 to 3 word money-page link (LLC, USDOT, MC, BOC-3, insurance filing, UCR, DQ files, Clearinghouse, consortium, IRP, IFTA, ELD) as a Steel anchor. Step 9 (protest period and first safety audit) visually echoes the hero tracker's "21-day protest" node so the roadmap and the tracker read as the same story at two scales. Paper surface so the roadmap nodes (Cloud or outlined) lift. This is the page's main internal-link distributor; every money-page link must be present and Steel.

6. H2 "How much it costs to start a trucking company": honest cost framing. The $1,650 full-package figure renders as the mono flat price chip (single source); government, third-party, and insurance costs render as separate Slate lines beneath, never blended into the service fee. A short styled note carries the brief's "we do not publish a single it-costs-$X number" stance as a trust signal. Government fee figures marked `[VERIFY]` per the brief stay out of a hardcoded number. Cloud surface.

7. H2 "The mistakes that stall new carriers": a proof-rich scannable list, the pillar's E-E-A-T payload. Render as a clean line-icon list of the six generalized lessons (content-bearing rows, not the decorative icon-triplet), each = a single-line icon (a caution/clock/document from the system set) + the brief's lesson. No client names here (names live on the money pages); these are generalized real lessons, so no invented metric, no fabricated story. Paper surface.

8. H2 "After activation: keep your truck loaded": the funnel bridge to the dispatch silo, designed as a deliberate styled handoff (the pillar's forward route into retention), not an afterthought. A full-bleed Ink band (the system's bridge treatment) with the two-node Get road-legal -> Keep loaded diagram and the brief's copy. Inline links "truck dispatch" -> `/services/` and "box truck dispatch" -> `/box-truck-dispatch/` on 1 to 3 word anchors. Soft, inline, no hard button.

9. H2 "How to start a trucking company FAQ": the system FAQ accordion (FAQPage schema), chevron rotates (reduced motion respected). The "how long does it take" answer is the honest-expectations moment, paired in tone with the hero tracker: no promised date. Cloud surface.

10. Closing CTA band: the soft pillar CTA, one styled lead line plus a single button "See compliance services" -> `/compliance-services/`. Lighter visual weight than a money-page close (this is guidance routing to the hub, not a hard conversion), but still the one clear next step. Signal amber is allowed here as the single Signal element of the close.

11. Mega-footer (global).

## Hierarchy and the visual path
Eye path on first view: H1 -> the hero tracker (sets the sequence model) -> the table of contents (the reader chooses where to go) -> the 9-step roadmap (the core, and the link distributor) -> cost -> mistakes -> the dispatch funnel bridge -> FAQ -> the soft closing route. Unlike the money pages, no single amber button dominates the hero; the page leads with guidance and the tracker. Signal amber is rationed to the one closing CTA (plus the persistent header CTA); every step link, TOC anchor, and funnel link is Steel and subordinate. The current TOC section is marked by weight or a Steel marker, never color alone.

## Imagery and illustration
No photography. Hero: the Authority Status Tracker (honest states, no dates). The 9-step roadmap is the primary illustrative asset, a single connected line diagram using the status/line system, doing real explanatory work. Decision section and mistakes list: small single-line icons. Funnel band: the two-node Get road-legal -> Keep loaded diagram. All single-line SVG, 2px stroke, lightweight to protect the weak CWV baseline on a long page.

## Motion
Minimal. Hero tracker reveals its three steps with a calm staggered fade (<=200ms each) on load, matching the home and compliance-hub tracker. The 9-step roadmap does NOT animate per-section on scroll (the system bans scroll-fade-on-everything); it renders statically, with at most the active TOC marker updating as the reader scrolls. Accordion chevron rotates. Sticky mobile CTA appears after the hero. `prefers-reduced-motion` gives final static states (tracker complete, no transitions).

## CRO treatment
- Soft conversion, by design: the pillar earns trust and distributes internal links, then routes to `/compliance-services/` as a soft close. No hard sell, no competing buttons mid-page; the in-body routes are inline anchors.
- The 9-step roadmap is the conversion engine indirectly: it sends ready-to-act readers to the exact filing money page, where the hard CTAs live.
- Honest expectations up front: the tracker and the "how long does it take" FAQ both refuse a promised date, which builds the credibility the guide trades on.
- Cost transparency as a trust asset: the $1,650 service fee shown in mono, government and insurance costs separated, and the explicit "no single number" stance.
- The dispatch bridge converts the funnel forward (acquisition guide -> retention) as a styled Ink handoff.
- Honest proof only: generalized real lessons, the documented track record on the hub it links to; no client named here, no invented metric, no fabricated cost figure.
- Mobile: TOC collapses to an "On this page" disclosure; the roadmap stacks vertically; sticky bottom bar carries the soft "See compliance services" route plus a tel: Call button; copy-first hero stack.

## OG image
Unique branded pillar OG from the system template: Ink or Paper field, mono wordmark, title "How to Start a Trucking Company", category tag in Plex Mono (e.g. "Guide"), one relevant line icon (a route node or roadmap mark), a Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, the 9-step sequence and every step's money-page link and destination exactly. The hero lede, the author byline, and all decision lead-ins are styled paragraphs, never H-tags (the byline is an Article author credit, not a heading).
- The $1,650 figure rendered from the single source in mono, with government, third-party, and insurance costs on separate Slate lines; no cost number hardcoded and government fees marked `[VERIFY]` stay un-numbered until confirmed.
- The Authority Status Tracker shows a fixed "21-day federal protest period" and honest states only: no guaranteed activation date and no countdown.
- 01 to 09 numbering is a genuine sequence and is correct here; keep the roadmap and the hero tracker visually consistent.
- The pillar CTA stays soft (a route to `/compliance-services/`), not a hard money-page sell; one Signal action at the close.
- Amber-never-white-text; AA contrast; visible keyboard focus; reduced-motion behavior (no scroll-fade on the roadmap); hit targets >=44px; the active-TOC indicator never relies on color alone.
- Documented and generalized proof only: no client named on the pillar, no invented metrics, no fabricated cost or timeline. CSS or inline SVG glyphs only, never typed into headings.
