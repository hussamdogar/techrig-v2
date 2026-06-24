# M1 Work Order — Design

Milestone: M1 (hero USDOT lookup card + lead capture). Lane: Design (specify UI; do not implement).
Reads: `../00-overview.md`, `../01-architecture.md` §2, the SEO M1 addendum (copy + composition), `shared/design/design-system.md`, `shared/design/home.md`, `dev/app/page.tsx`. Writes: a spec in `shared/design/` (e.g. `usdot-lookup-card.md`) + any mockup HTML in `shared/design/mockups/`.

Gated on: the SEO M1 addendum (you need the final copy + the hero-composition decision). You may start the component exploration in parallel and finalize once copy lands.

## 1. The card, in the locked system
Design the lookup card in the Tech Rig design system (navy-forward, illustration-led, mono wordmark; tokens in `design-system.md` — paper/cloud/ink/slate/steel/signal). Do not copy the competitor's look; match ours. The reference screenshot is for *function and layout intent only*: eyebrow label, bold heading, full-width input + primary button, a helper line, then two arrow links stacked below a divider.

## 2. Every state (no oversight)
Spec the visual for each:
- **Idle** (default), **focused** (input), **typing/valid vs invalid** USDOT.
- **Loading** (button → spinner; the lookup hits a live gov API and may be slow — design for ~1–3s).
- **Result** — the FMCSA record panel: how the labeled fields render (legal name, USDOT/MC, entity type, authority status, safety rating, insurance on file, power units). Treat **authority status** as a status chip (active = positive token, not-authorized/out-of-service = warning token). Missing fields show the "Not on file" copy in a muted treatment — never empty or faked.
- **Not found** (valid format, no carrier).
- **Error** (network/outage/rate-limited) with the SEO error copy.
- **Reset / look up another** affordance from the result state.

## 3. Placement + no layout shift
- Implement the hero-composition decision from SEO (card in the right column replacing/absorbing `AuthorityStatusTracker`, unless SEO specified otherwise). Coordinate with the fate of that component (it may move to M5 as the dashboard tracker).
- Reserve the card's height so the result expansion does not cause CLS; the homepage must stay fast and stable (ranking + CWV). Specify min-heights / skeleton.
- Responsive: how it stacks on mobile (likely full-width, below the H1/CTAs), tap targets, the result panel on a narrow viewport.

## 4. Accessibility
- Labeled input, visible focus ring (the system's steel focus style), button disabled state during loading.
- Results announced via `aria-live`; error announced; focus moves sensibly after a lookup. Specify these so Dev wires them.

## 5. Trust treatment
This panel shows official FMCSA data; it should read as credible and clean (this is the brand's competence on display). Specify the visual hierarchy that makes the authority status and insurance-on-file the hero facts, with secondary fields quieter.

## Acceptance (what Dev needs from you)
A `shared/design/` spec covering all states, the result-panel layout, placement + no-CLS rules, responsive behavior, and a11y notes — plus a mockup if it clarifies. Tokens and component names from the existing system; no new design language.
