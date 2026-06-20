# Page design spec: /ifta-registration/ (IFTA registration and filing)

Design-only spec. Consumes `shared/page-briefs/ifta-registration.md`. SEO owns copy, headings, CTA wording and destinations, and the price; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A tight transactional money page for interstate carriers setting up fuel-tax reporting under the International Fuel Tax Agreement. The intent is navigational and does not need a long page, so this is the most compact of the compliance specs: explain IFTA and the quarterly return plainly, disambiguate it from IRP, separate Tech Rig's service fee from state fees, and move the carrier to "set up my IFTA." Operationally paired with `/irp-registration/`; the two cross-link and are usually set up together. BOFU, honest, no padding.

## Section order and layout

1. Header (global, per `global-footer.md`). Persistent primary CTA "Set up my IFTA". Breadcrumb Home > Compliance Services > IFTA Registration below the header in the mono label treatment.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "IFTA Registration and Filing" (Archivo). Styled hero lede (Plex Sans Body L), never an H-tag. Primary button "Set up my IFTA" (Signal amber, Ink text) -> IFTA intake, route to `/contact-us/` until confirmed [VERIFY route]. Small "Reviewed by Robert Hooke, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): the Authority Status Tracker, scoped to where this filing sits. IFTA is an interstate-operations setup step for an already-active carrier, so the tracker shows "Authority active" with IFTA setup as the interstate-readiness action, not a new-authority application. This keeps the signature consistent across the silo while honestly framing IFTA as fuel-tax setup, not authority activation. No guaranteed dates. On a page this short, keep the tracker visually lighter so it does not overwhelm the compact body.

3. What it is: H2 "What IFTA registration is". A plain Cloud text block, Grade 8, with one small line icon (a fuel/decal icon). Explains the license, the decals (stickers), and the single quarterly return reconciling fuel bought against miles run. Kept to the brief's copy, no diagram needed at this length unless a small quarterly-cycle line motif helps; if used, keep it minimal.

4. IFTA vs IRP: H2 "IFTA vs IRP". A clean two-item comparison in the line system (IFTA = fuel tax; IRP = plates and registration), deliberately not two mirrored identical cards. The inline `/irp-registration/` reference is preserved exactly as a Steel contextual link. Tight disambiguation block, the mirror of the IRP page's version with distinct wording per the brief.

5. Applicability, stated honestly: the brief folds applicability into the lede and the FAQ rather than a dedicated section, so do not invent one. The "what if I run in only one state" honesty lives in the FAQ as written; the "applies to qualifying interstate vehicles" framing stays in the "what it is" block. Keep the page lean.

6. Pricing: the brief places the price inside the service-includes section, so render it there (section 7). Use the mono price chip in its state-appropriate form: a service-fee chip once the fee is confirmed, or the "Contact for quote" state until then, since the IFTA service fee is `[VERIFY]`. State fees are separated explicitly: a Slate "+ state fees (vary)" line paired with but distinct from the service-fee chip. Never encode state fees as the price.

7. What you get when Tech Rig files it: H2 "What our IFTA registration service includes". The four service points as a checklist (confirm applicability and base jurisdiction; complete registration so you receive license and decals; explain the quarterly schedule and the mileage/fuel records to keep; coordinate with IRP). Check marks status-active with icon. The IRP coordination line preserves its `/irp-registration/` link. The price chip (section 6) and the fee-separation line anchor the bottom of this block. No mid-page CTA is specified in the brief for this short page; the hero and closing CTAs carry it, keeping the page uncluttered.

8. FAQ: H2 "IFTA registration FAQ", the system FAQ accordion (FAQPage schema). The "what is an IFTA sticker" answer pairs naturally with the decal icon; the "do I need IFTA and IRP" answer keeps its `/irp-registration/` link; the "what if I run in only one state" answer carries the honest applicability. Questions are accordion controls, not headings.

9. Funnel cross-link forward to dispatch: the brief marks it optional. Include a quiet single-line styled handoff to `/services/` before the close on a 1 to 3 word anchor, Steel, consistent with the compliance-page pattern. Keep it light on this compact page.

10. Closing CTA band: one line + the single dominant button "Set up my IFTA" -> intake / `/contact-us/` until confirmed [VERIFY route]. Supporting line is a styled paragraph.

11. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the tracker (interstate-readiness framing, kept light) -> what IFTA is -> IFTA vs IRP disambiguation -> what we do + price/fee separation -> FAQ -> dispatch handoff -> single closing CTA. Signal amber is rationed to the primary action (hero, close, header CTA); the IRP cross-links and the handoff are Steel and subordinate. One primary action per view. Because the page is short, the rhythm stays tight: fewer, denser sections, no filler bands.

## Imagery and illustration
No photography. Hero: the Authority Status Tracker scoped to interstate readiness, visually lighter than on longer pages. "What IFTA is" uses one small fuel/decal line icon, with an optional minimal quarterly-cycle motif only if it earns its place. IFTA vs IRP uses two distinct line icons (a fuel icon and a plate icon), not mirrored cards. All single-line SVG, lightweight for CWV (this page should be especially fast given its tight scope).

## Motion
Minimal. Hero tracker staggered reveal (<=200ms steps), kept subtle. Accordion chevron rotates. Price chip static. Sticky mobile CTA appears after the hero. No per-section scroll-fade. `prefers-reduced-motion` gives final static states.

## CRO treatment
- One dominant action ("Set up my IFTA"), Signal amber, at hero and close. The page is short enough that two well-placed CTAs suffice; no mid-page button is added, keeping it clean.
- Fee transparency is the trust asset: service fee in mono, state fees separated and shown up front. Hidden pricing reads as risk to this buyer.
- The IFTA vs IRP block reduces confusion and routes the both-programs carrier to IRP, where they usually set both up together.
- Honest applicability (the one-state FAQ answer) filters non-qualifying traffic without losing it.
- The compact length is itself a conversion choice: navigational intent wants the answer and the action fast, not a long read.
- Mobile: sticky bottom bar with the primary CTA plus a tel: Call button; copy-first hero; comparison and lists stack.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "IFTA Registration", category tag "Compliance" in Plex Mono, one relevant line icon (fuel/decal), Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, and every internal link and destination exactly, including both `/irp-registration/` cross-links. The hero lede is a styled paragraph, never an H-tag.
- The price chip from the single source (`services.md`): the "Contact for quote" state until the IFTA service fee is confirmed, then the service-fee chip with a separate state-fee line. No price hardcoded; state fees never encoded as the price or blended into the service fee.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Honest framing only: no guaranteed setup date, no invented fee figures, no invented worked example or testimonial (none exists for this page), no metrics or ratings.
- The tight scope: do not pad the page with sections the brief does not specify.
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
