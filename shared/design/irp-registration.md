# Page design spec: /irp-registration/ (IRP registration and apportioned plates)

Design-only spec. Consumes `shared/page-briefs/irp-registration.md`. SEO owns copy, headings, CTA wording and destinations, and the price; this defines look, layout, hierarchy, components, imagery, motion, and the conversion path. Built on `design-system.md`. No em dashes.

## Page role
A transactional money page for interstate carriers who need apportioned plates through the International Registration Plan. One job: confirm IRP applies to a multi-state operation, explain apportionment plainly, separate Tech Rig's service fee from the state registration fees clearly, and move the carrier to "start my IRP registration." It is operationally paired with `/ifta-registration/` and must cross-link to it cleanly, since carriers conflate the two. BOFU, proof-honest, and currently carrying a `[CLIENT PROOF NEEDED]` slot that must degrade gracefully.

## Section order and layout

1. Header (global, per `global-footer.md`). Persistent primary CTA "Start my IRP registration". Breadcrumb Home > Compliance Services > IRP Registration below the header in the mono label treatment.

2. Hero (Paper, asymmetric two-column; copy-first stack on mobile)
   - Left: H1 "IRP Registration and Apportioned Plates" (Archivo). Styled hero lede (Plex Sans Body L), never an H-tag. Primary button "Start my IRP registration" (Signal amber, Ink text) -> IRP intake, route to `/contact-us/` until confirmed [VERIFY route]. Small "Reviewed by Robert Hooke, Co-Founder" credibility line under the lede (mono label + name).
   - Right (signature visual): the Authority Status Tracker, scoped to where this filing sits. IRP is an interstate-operations step for an already-active carrier, so the tracker shows "Authority active" with IRP/apportioned plates as the interstate-readiness action, not a new-authority application. It honestly frames IRP as enabling lawful interstate running, not activating authority. No guaranteed dates.

3. What it is: H2 "What IRP registration is". A plain Cloud text block, Grade 8, with one small line icon. The apportionment idea (register once, fees split by miles per state) is the concept most readers come to understand, so support it with a single small line diagram: a base-state node with apportioned shares fanning to a few travel states, in the line system. Keep it explanatory, not decorative.

4. IRP vs IFTA: H2 "IRP vs IFTA: what is the difference". A clean two-item comparison in the line system (IRP = registration and plates; IFTA = fuel taxes), deliberately not two identical mirrored cards (avoid the matched-card reflex). Both inline references to `/ifta-registration/` are preserved exactly as Steel contextual links. This is a disambiguation block, kept tight.

5. Applicability, stated honestly: H2 "When you need apportioned plates". The qualifying-operation list (interstate vehicle by weight or axle threshold; crossing state lines for hire or own freight; adding interstate trucks) as a clean list with small line icons. The honest "if you only ever run inside one state, IRP may not apply, we confirm before you pay" line sits as an emphasized Slate note, reinforcing the not-everyone-needs-it discipline. This section also holds the `[CLIENT PROOF NEEDED]` slot: render the design-system graceful proof block that reads fine while empty (no fabricated story, no empty-looking hole), ready to take a real multi-state IRP setup story when the client supplies one.

6. Pricing: the brief places the price inside the service-includes section, so render it there (section 7). Use the mono price chip in its state-appropriate form: a service-fee chip once the fee is confirmed, or the "Contact for quote" state until then, since the IRP service fee is `[VERIFY]`. The state registration fees are separated explicitly: a Slate "+ state fees (vary by jurisdiction, mileage, weight)" line paired with but distinct from the service-fee chip. Never encode state fees as the price; never blend the two.

7. What you get when Tech Rig files it: H2 "What our IRP registration service includes". The four service points as a checklist (confirm base jurisdiction and applicability; prepare and submit the application; help estimate fees so there are no surprises; coordinate with IFTA). Check marks status-active with icon. The IFTA coordination line preserves its `/ifta-registration/` link. The price chip (section 6) and the fee-separation line anchor the bottom of this block, followed by the mid-page text-link CTA "Start my IRP registration" (Steel inline, subordinate).

8. The fee-estimate clarity is itself the trust device here (mileage drives the fee), so the "help you estimate" point and the up-front fee-split promise should read as a deliberate transparency moment, not buried bullet text.

9. FAQ: H2 "IRP registration FAQ", the system FAQ accordion (FAQPage schema). The "do I pay the state fees to Tech Rig" answer reinforces the fee separation; the "what if I only run in one state" answer reinforces honest applicability. The "do I need IRP and IFTA" answer keeps its `/ifta-registration/` link. Questions are accordion controls, not headings.

10. Funnel cross-link forward to dispatch: the brief marks it optional. Include a quiet single-line styled handoff to `/services/` before the close on a 1 to 3 word anchor, Steel, consistent with the compliance-page pattern. The `/mc-registration/` authority-context link from the brief is placed as a subordinate inline link within the body where it reads naturally (authority context), not as a competing CTA.

11. Closing CTA band: one line + the single dominant button "Start my IRP registration" -> intake / `/contact-us/` until confirmed [VERIFY route]. Supporting line is a styled paragraph.

12. Mega-footer (global).

## Hierarchy and the visual path
Eye path: H1 -> primary amber CTA -> the tracker (interstate-readiness framing) -> what IRP is (with the apportionment diagram) -> IRP vs IFTA disambiguation -> when you need plates (applicability + graceful proof slot) -> what we do + price/fee separation -> FAQ -> dispatch handoff -> single closing CTA. Signal amber is rationed to the primary action (hero, close, header CTA). The mid-page CTA, the IFTA cross-links, the MC link, and the handoff are Steel and subordinate. One primary action per view.

## Imagery and illustration
No photography. Hero: the Authority Status Tracker scoped to interstate readiness. "What IRP is" carries a small apportionment line diagram (base state -> proportional shares to travel states). "When you need plates" uses small line icons per qualifying condition. IRP vs IFTA uses two distinct line icons (a plate/registration icon and a fuel icon), not mirrored cards. All single-line SVG, lightweight for CWV.

## Motion
Minimal. Hero tracker staggered reveal (<=200ms steps). Optional one-time draw on the apportionment diagram when it enters view, no looping and not on every section. Accordion chevron rotates. Price chip static. Sticky mobile CTA appears after the hero. `prefers-reduced-motion` gives final static states.

## CRO treatment
- One dominant action ("Start my IRP registration"), Signal amber, repeated at hero and close, plus a subordinate Steel mid-page text link.
- Fee transparency is the central trust asset for this fee-anxious filing: service fee in mono, state fees separated and described as varying by jurisdiction, mileage, and weight, with the up-front "you see both before you pay" promise made visible.
- The IRP vs IFTA block reduces the confusion that causes bounce or wrong-page conversions, and routes the both-programs carrier to IFTA cleanly.
- Honest applicability (the one-state caveat, "we confirm before you pay") builds trust and filters non-qualifying traffic without losing it.
- The graceful proof slot holds the page's credibility shape until a real IRP story lands; it must never render as a broken or empty block, and never as an invented testimonial.
- Mobile: sticky bottom bar with the primary CTA plus a tel: Call button; copy-first hero; diagrams and lists stack.

## OG image
Unique branded OG from the system template: Ink or Paper field, mono wordmark, title "IRP Registration", category tag "Compliance" in Plex Mono, one relevant line icon (apportioned plate), Signal rule. Never a placeholder.

## What Dev must preserve
- SEO copy, the heading structure, and every internal link and destination exactly, including both `/ifta-registration/` cross-links and the `/mc-registration/` link. The hero lede and the applicability note are styled paragraphs, never H-tags.
- The price chip from the single source (`services.md`): the "Contact for quote" state until the IRP service fee is confirmed, then the service-fee chip with a separate state-fee line. No price hardcoded; state fees never encoded as the price or blended into the service fee.
- The `[CLIENT PROOF NEEDED]` slot rendered with the design-system graceful empty state; no fabricated story.
- Amber-never-white-text; one Signal action per view; AA contrast; visible keyboard focus; reduced-motion behavior; hit targets >=44px.
- Honest framing only: no guaranteed plate-issuance date, no invented fee figures, no metrics or ratings.
- Decorative glyphs and check marks via CSS or inline SVG, never typed into headings.
