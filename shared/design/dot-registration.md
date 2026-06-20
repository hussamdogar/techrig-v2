# Page design spec: /dot-registration/ (How to Get a DOT Number)

Design-only spec. Consumes `shared/page-briefs/dot-registration.md`. SEO owns copy, headings, CTA wording and destinations, and the pricing facts; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A compliance money page, informational to BOFU, repurposed from a thin Google Ads landing page into a full organic money page on the same URL. One job: a new (or restarting) carrier learns how to get a USDOT number, sees that the DIY path stalls on classification and the MOTUS system, and hands the work to Tech Rig for a flat $300. The page must teach honestly (the step-by-step is real and doable yourself) while making the FMCSA-portal and MOTUS friction the reason to convert. Follows the compliance money-page template; visually consistent with the hub and the other filing pages, distinguished by the MOTUS-migration angle and the California box-truck legacy-USDOT worked example. Reviewer is Robert Hooke (systems background), which fits the portal/MOTUS theme.

## Section order and layout

1. Header (global): per `global-footer.md`. Page primary action is "Get my USDOT number"; the global header keeps its standard CTA.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "How to Get a DOT Number" (Archivo). The brief's hero lede as a styled paragraph in Plex Sans Body L (never an H-tag). Primary button "Get my USDOT number" (Signal amber, Ink text) routing to the USDOT intake form (`[VERIFY]` route; `/contact-us/` until Dev confirms). Small "Reviewed by Robert Hooke, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): the Authority Status Tracker, scoped to show the USDOT number as the first step in the activation sequence. The USDOT number identifies the carrier and comes before operating authority, so highlight the first node (USDOT registered) as the entry point, with the protest period and activation shown as later steps that apply when authority is also needed. Honesty rules apply: no guaranteed dates. This sets the "USDOT first, MC after" mental model the page reinforces.

3. H2 "What a USDOT number is and who needs one" (Cloud surface): the what-it-is block, with honest applicability built in. Plain copy at the standard measure. The USDOT-vs-MC distinction ("not the same as operating authority; some need only USDOT, others need both") set as a quiet two-item comparison in the line system (USDOT = identification/safety; MC = authority to haul for hire), so the difference reads at a glance. This same distinction recurs on the MC page; keep the visual treatment consistent between the two for a coherent cross-link.

4. H2 "How to get a DOT number, step by step" (Paper surface): the educational core, rendered as a clean numbered stepper in the line system (numbered 01 to 05 is correct, it is a genuine sequence). Horizontal connected steps on desktop, vertical on mobile, Grade 8 copy. Step 5 carries the inline contextual links MC application (`/mc-registration/`) and BOC-3 (`/boc-3-filing/`), Steel inline links exactly as written. The honest closing line "This is doable yourself. It is also where new carriers most often stall..." set as a Slate emphasis line beneath the stepper; this candour is what earns the conversion that follows.

5. H2 "What a USDOT number costs" (Cloud surface): pricing, fees separated, the compliance template's pricing block. Use the price chip from the single source: a flat chip "$300" labelled "USDOT registration, one time" (mono, tabular). The government-fee treatment is honest and `[VERIFY]`: a separate Slate line stating the USDOT number is issued by FMCSA and any government fee is shown separately, with no figure until verified. The inline links MC authority (`/mc-registration/`) and full setup (`/compliance-services/`) are Steel inline links. No second amber button here.

6. H2 "Let us handle how to get a DOT number for you" (Paper surface): this page's unique worked example plus the value list.
   - The California box-truck legacy-USDOT-to-MOTUS worked example as a quiet example callout: left Steel rule, Slate text, set apart from the running copy. The record-linkage/MOTUS-migration story demonstrates systems depth (fits the Robert Hooke review), real past case framed as such, no guaranteed timeline.
   - "What you get with us" as a four-item content-bearing list, each with a single-line icon (correct classification, FMCSA portal and MOTUS set up, USDOT registered and confirmed, clean handoff to MC/BOC-3). Typographic, not glossy cards.
   - Mid-page CTA: text link "Get my USDOT number" (Steel), same route as hero. Not a second amber button.

7. H2 "USDOT number FAQ" (Cloud surface): the system FAQ accordion (FAQPage schema). The "How long does it take" answer is the honest-expectations moment (government processing and MOTUS issues can add time, no promised date); pair it in tone with the tracker. The MOTUS and reactivation answers reinforce the page's differentiator. The "Is the USDOT number a one-time thing?" answer carries the inline link MCS-150 updates (`/mcs-150-biennial-update/`). Chevron rotates, respects reduced motion.

8. Closing CTA band (full-bleed Ink, the template's closing emphasis): the brief's closing line as a styled paragraph, then the single dominant button "Get my USDOT number" (Signal amber, Ink text), same route. One action only.

9. Mega-footer (global): the complete filing list lives here.

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the tracker (USDOT first) -> what it is + USDOT-vs-MC -> the step-by-step stepper (educational, builds authority) -> pricing ($300, fees separated) -> worked example + what you get -> FAQ -> single closing CTA. Signal amber is rationed to the primary "Get my USDOT number" action (hero and close only); the mid-page CTA and every inline link, including the step-by-step cross-links, are Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography. The Authority Status Tracker (USDOT-first variant) in the hero; the USDOT-vs-MC two-item comparison diagram in the what-it-is section; the how-to step-by-step numbered stepper as a line diagram (the page's primary explanatory asset, carrying the educational load the old thin ad page never did); small single-line icons on the "what you get" list. All single-line SVG from the system, 2px stroke, lightweight for the weak CWV baseline (especially important on a page expanding from a thin ad template).

## Motion
Minimal. Hero tracker staggered reveal (<=200ms per step). Accordion chevron. No count-up on the price, no per-section scroll-fade. `prefers-reduced-motion` gives final static states (tracker resolved, no animation).

## CRO treatment
- One dominant action, "Get my USDOT number", Signal amber, repeated at hero and close; the mid-page CTA is a subordinate Steel text link to the same route.
- The conversion lever unique to this page is the MOTUS/FMCSA-portal friction: the honest step-by-step shows the work, then names exactly where carriers stall (classification, MOTUS account issues), so the $300 hand-off reads as removing real risk, not selling a form anyone can fill.
- Fee transparency: the flat $300 service fee is shown clearly and separated from any government fee, which is a trust asset for this buyer.
- Honest timing expectations (FAQ + no tracker countdown) reduce the anxiety that drives bounce.
- Mobile: sticky bottom bar with "Get my USDOT number" plus a tel: Call button; copy-first hero stack; the step-by-step stepper stacks vertically.

## OG image
Unique branded OG from the system template: Ink field, mono wordmark, title "USDOT Number", category tag "Compliance" in Plex Mono, one relevant line icon (federal ID / portal or document line icon), Signal rule. No placeholder.

## What Dev must preserve
- SEO copy, the heading structure, every internal link and destination, and the CTA wording exactly. The lede, the "doable yourself" line, and the fee note are styled paragraphs, never H-tags.
- Migration: keep the URL `/dot-registration/`; this is the same-URL repurpose. Preserve any existing ad-conversion tracking on the page when expanding it; remove the `noindex`/ads-only treatment and add to the sitemap (per `migration-plan.md`). Confirm the intake/payment route for the CTA.
- Price chip from the single source (`services.md`): the flat $300 state. No price hardcoded. Do not state a specific government USDOT fee until verified; the government-fee line stays `[VERIFY]`.
- Amber-never-white-text; one Signal action per view; AA contrast; visible focus; reduced motion.
- Documented proof only (the one real California worked example). No performance metrics, ratings, or invented testimonials. The MOTUS case is framed as a past result, and the tracker shows no guaranteed activation date.
- "DOT number" (the high-volume gov-owned term) is used in body and H2 context only, per the brief, never elevated by design into a standalone hero claim.
- Decorative glyphs and the 01 to 05 step numbers via CSS or inline SVG, never typed into headings; numbering used only because this is a real sequence.
