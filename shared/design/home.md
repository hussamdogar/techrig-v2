# Page design spec: / (Home)

Design-only spec. Consumes `shared/page-briefs/home.md`. Copy, headings, CTA wording, and CTA destinations are SEO-owned and preserved exactly; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md` (use its tokens and components). No em dashes.

## Page role
A routing page, not a long read. One job: in 5 seconds a visitor grasps "trucking compliance and dispatch, for truckers," and is moved to the dominant next step (start compliance setup), with dispatch clearly available as the second path. Compliance leads the hierarchy; the dual offering stays legible above the fold.

## Section order and layout

1. Sticky header (global): mono wordmark left; Compliance and Dispatch menu groups (visually distinguished per the system); About, Contact; persistent primary CTA "Start your compliance setup" + Call button right. See `global-footer.md` for the matching mega-footer.

2. Hero (Paper surface, asymmetric two-column; stacks on mobile with copy first)
   - Left column (dominant): H1 "Trucking Compliance and Truck Dispatch, Under One Roof" in Archivo. Styled hero subhead in Plex Sans Body L (the brief's subhead paragraph, never an H-tag). Then the CTA pair.
   - CTA pair, explicit hierarchy: primary button "Start your compliance setup" in Signal amber with Ink text (dominant) routing to `/compliance-services/`; secondary button "Get your truck dispatched" as Ink outline (subordinate) routing to `/services/`. Two buttons, one funnel: compliance wins the eye, dispatch is the clear alternate.
   - Right column (the signature visual): the Authority Status Tracker (Application filed -> 21-day protest period -> Authority active) with a final handoff chip "-> keep loaded" pointing to dispatch. This encodes the whole funnel in one image: compliance is the path, dispatch is where it leads. Honest rules from the system apply (no guaranteed dates).
   - 5-second test met by: H1 names both services, subhead names both, the tracker shows the compliance journey resolving into dispatch.

3. Two silo blocks, deliberately NOT symmetric (avoid the matched-cards look). Compliance first and slightly heavier; dispatch second.
   - H2 "Trucking compliance and company setup" (Cloud surface). Short copy block. A compact, curated cluster of the top filings as inline labeled links with small line icons: USDOT, MC authority, BOC-3, UCR (these four only, per brief), then a subordinate "See compliance services" link to `/compliance-services/`. Do NOT render the full filing grid here; the complete list lives in the mega-footer. FMCSA process-agent line set as a worded credibility note (not a badge).
   - H2 "Truck dispatch that keeps you loaded" (Paper surface, Steel accent to read as the second silo). Short copy block. A single row of the six trailer line icons (box truck, reefer, flatbed, dry van, power only, hot shot) as a quiet capability strip, not the full trailer-card grid. The percentage-by-equipment pricing model as one line in the mono "price" treatment (single source). Franchise link "box truck dispatch" -> `/box-truck-dispatch/`; "See dispatch services" -> `/services/`.
   - Visual differentiation: compliance block uses Ink/Signal accents, dispatch block uses Steel accents, so the two silos are distinguishable at a glance without two identical card rows.

4. H2 "Why carriers trust Tech Rig": the design-system trust band, documented proof only. Track-record figures in the mono "official record" treatment as a small stat set: since 2021 / around 100 carriers dispatched; 40+ compliance clients across 10+ states since 2025. FMCSA process-agent line (worded, linked, never a government seal). Partner names (Motive; OTR Solutions, RTS Financial) as plain text. A graceful, empty-friendly review slot per the system (no ratings, no star widgets, no invented testimonials).

5. H2 "The whole journey, one team": full-bleed Ink band (the high-emphasis "bridge" moment the system reserves dark sections for). A simple two-step funnel diagram in the line system (Get road-legal -> Keep loaded) reinforcing that the same team does both. Inline link "guide to starting a trucking company" -> `/how-to-start-a-trucking-company/` on a 1 to 3 word anchor.

6. Closing CTA band: one dominant next step. Recommend the single primary "Start your compliance setup" -> `/compliance-services/` to keep one clear action sitewide (brief allows `/contact-us/`; pick one, do not show two co-equal buttons here). Supporting line is a styled paragraph.

7. Mega-footer (global, see `global-footer.md`): the complete service lists live here.

## Hierarchy and the visual path
Eye path on first view: H1 -> primary amber CTA -> the tracker (which visually points forward to dispatch). The amber primary CTA is the single Signal element above the fold (Signal is rationed). Everything else (secondary CTA, links) is Ink or Steel and subordinate. Down the page, each section has one clear action; the page resolves to the single closing CTA.

## Imagery and illustration
No photography. Hero: the Authority Status Tracker plus the funnel handoff chip. Compliance block: small filing line icons (document, shield, stamp). Dispatch block: the six trailer line icons. Funnel band: a two-node line diagram. All from the system's single-line SVG language, lightweight to protect the weak CWV baseline the SEO build flagged.

## Motion
Minimal. Hero tracker reveals its steps with a calm staggered fade (<=200ms each) on load; the funnel handoff chip draws last. No scroll-fade on every section. Sticky CTA appears after the hero scrolls past. `prefers-reduced-motion` gives the final static states.

## CRO treatment
- One dominant action (compliance setup), Signal amber, repeated at hero and close; dispatch is the consistent secondary.
- Trust built only from documented proof; the FMCSA line and the since-2021 / 40+ figures do the persuading, not metrics or ratings.
- Friction removed: the hero tells a new carrier exactly where to start; the tracker sets honest expectations up front (reduces "why isn't my authority active" anxiety).
- Mobile: sticky bottom bar with the primary compliance CTA plus a tel: Call button; copy-first hero stack; trailer icons wrap.

## OG image
Unique branded home OG from the system template: Ink field, mono wordmark, title "Trucking compliance and dispatch", category tag, one line icon, Signal rule.

## What Dev must preserve
- SEO copy, the heading structure, and both CTA destinations exactly. Slogan/subhead lines are styled paragraphs, never H-tags.
- The amber-never-white-text rule and one primary (Signal) action per view.
- AA contrast, visible focus, reduced-motion behavior.
- Documented proof only: no performance percentages, earnings claims, or star ratings anywhere.
- Price/percentage rendered from the single source; decorative glyphs via CSS or inline SVG.
