# Tech Rig Design System

Cross-workspace contract (Design → Dev). Version 1.0, 2026-06-20. Built from the approved design direction and the SEO handoff (`shared/handoff-to-design.md`, `shared/page-briefs/`, `seo/context/brand-guidelines.md`). Dev implements this exactly; flag any conflict back to Design. Visual and CRO decisions are owned here; copy, keywords, intent, and the URL set are owned by SEO.

Public brand name is **Tech Rig**. Legal entity **DGR Tech Rig LLC** appears only in footer, legal pages, and schema. Never "TechRig" or "Tech-Rig".

---

## 1. Brand foundation

### What the design must make a visitor feel
A carrier arrives in the FMCSA paperwork maze, anxious about one thing: *will my authority actually activate, or will I get rejected, fined, or stuck?* Every screen answers: **"We file it right, and you can see exactly where you stand."** Competence, official-grade trust, speed. Then one clear next step: start the filing.

### Personality
- **Official, not bureaucratic.** It should feel like a system of record that works, not a government waiting room.
- **Operational peer, not corporate vendor.** Plain, direct, built by people who have filed real authorities and dispatched real loads.
- **Calm under pressure.** The buyer is stressed; the interface is the opposite of stressed.

### Register
Clean, utility-first, trustworthy. Decoration earns its place or it is cut. This is a deliberate move away from the current site's aggressive red-on-black, stock highway photography, two-tone red-word headings, the undocumented profit metrics (removed per brand guidelines), and the red feature-card grid.

### Strategic frame baked into the system
- **Compliance-led.** Home and global hierarchy lead with setup/authority acquisition. Dispatch is the follow-on funnel ("authority active → now keep your truck loaded").
- **Dual-path still legible in 5 seconds.** The hero leads with the compliance action and dominates there, but above-the-fold makes clear both silos exist. Dispatch gets its strong moment lower on the page.
- **Performance is a design constraint.** SEO flagged a weak Core Web Vitals baseline. The system is built on lightweight SVG and type, not heavy media. No photographic hero.

---

## 2. Logo / wordmark direction

LOCKED direction (confirmed with client 2026-06-20). The logo is a wordmark, no abstract symbol. Full spec and live render: `logo.html`. Design specifies; production art (outlined, kerned) is drawn from this. Social URLs are still pending from the client.

- **Primary wordmark:** "TECH RIG" set in **IBM Plex Mono**, weight 600, all caps, tracking +0.05em. This is the "registration record" register: the language of DOT numbers, VINs, and official records, and the same face the system uses for prices, statuses, and filing numbers. Not Archivo (the earlier Archivo + chevron-mark idea is dropped).
- **Bespoke element (the signature):** a small **amber register tick** (a square, side 0.34em of cap height, ~1.5px radius) sits between the two words in place of a space. It reads as a filing checkbox / field separator, carries the brand accent, and becomes the icon's accent.
- **Descriptor lockup:** wordmark plus an optional mono descriptor line ("Compliance + Dispatch" shown as placeholder; final tagline wording is SEO/brand's call). Descriptor in Plex Mono 500, Slate, tracking +0.30em, dropped below ~140px width.
- **Mark / favicon:** initials "TR" in Plex Mono on an Ink tile with the amber tick at lower right; drop the tick at 16px. There is no separate abstract glyph.
- **Colour usage:** wordmark Ink on light, Cloud (white) on Ink. Tick is Signal amber. **Amber is never used as text.** Single-colour variant: the tick takes the text colour so the mark survives one-colour print and stamping.
- **Clear space:** minimum = cap height on all sides. **Minimum width** 96px desktop, 80px mobile.
- **Loader (not the logo):** the "name as a rig" device (TECH = cab, RIG = trailer, amber hitch, road scrolling beneath) is the working-state loader only. Never used as the logo, on letterhead, or as the favicon. Reduced-motion gives a static rig. See `logo.html` and the motion policy (Section 9).
- **Production files (in `shared/design/`):** `logo-wordmark.svg` (ink, for light), `logo-wordmark-white.svg` (for dark), `logo-wordmark-1color.svg` (currentColor, single-colour use), `favicon.svg` (32px and up), `favicon-16.svg` (tick dropped). All outlined paths from IBM Plex Mono SemiBold, so they are font-independent. Run SVGO at build; export PNG and ICO for legacy favicon needs.
- **Do not:** set the wordmark in any other face or in lower case; colour it amber; add a glow, gradient, outline, or container box; use the rig loader as the logo; or imply an FMCSA/government seal.

---

## 3. Colour system

Six core roles plus a small status set. All text pairings below are verified to **WCAG AA** (4.5:1 normal, 3:1 large). Ratios noted.

| Token | Hex | Role |
| --- | --- | --- |
| `--ink` | `#0E2233` | Primary dark. Body text on light, dark sections, headlines, footer. |
| `--steel` | `#225E8A` | Secondary brand blue. Links, supporting fills, icon strokes, "filed/pending" status. |
| `--signal` | `#E89A3C` | Warm accent. Primary CTAs, positive emphasis, the "in protest period" status. Used sparingly so it always means "act / attend here." |
| `--paper` | `#F7F5F1` | Default page background. Warm off-white, clean not stark. |
| `--cloud` | `#FFFFFF` | Surfaces: cards, inputs, sticky bars. |
| `--slate` | `#4F5E6B` | Muted/secondary text, captions, helper copy, dividers (at low alpha). |

### Status palette (drives the Authority Status Tracker and inline statuses)
| Token | Hex | Meaning |
| --- | --- | --- |
| `--status-active` | `#2E7D5B` | Authority active / step complete. |
| `--status-progress` | `#E89A3C` | In the 21-day protest period / in progress (= `--signal`). |
| `--status-filed` | `#225E8A` | Filed / pending (= `--steel`). |
| `--status-todo` | `#4F5E6B` | Not started (= `--slate`). |

### Verified contrast (key pairings)
- Cloud/white on `--ink`: **16.2:1** (AAA). Primary dark sections, footer.
- `--ink` text on `--paper`: **~15:1** (AAA). Default reading.
- `--steel` text on white: **6.9:1** (AA). Links and supporting text.
- `--ink` text on `--signal`: **7.0:1** (AA). **Primary CTA = Signal fill + Ink text.**
- `--slate` on white/paper: **~6.7:1** (AA). Secondary text.
- White on `--status-active`: **5.0:1** (AA). Active badges.

### Hard rules
- **Amber (`--signal`) never carries white text** (white-on-amber ≈ 2.3:1, fails). Amber surfaces always use Ink text.
- No purple/indigo, no gradient-filled text, no aurora/mesh backgrounds, no red-on-black. Backgrounds are flat Paper, Cloud, or Ink.
- Signal is rationed: roughly one Signal element per viewport (the primary action or the one status that needs attention).

---

## 4. Typography

A coherent, performant, open-source stack. Real personality (Archivo display + Plex Mono utility) without defaulting to Inter/Roboto-as-everything.

- **Display: Archivo** (variable). Headlines, hero, section titles, wordmark. Sturdy, slightly industrial, official. Use heavier weights (700/800), tight tracking, slightly expanded optical for the largest sizes.
- **Body: IBM Plex Sans** (variable). All running copy, FAQ, process steps, nav, buttons. Humanist, institutional-competent, highly readable at small sizes.
- **Utility: IBM Plex Mono** (variable). The signature credibility cue: reference numbers, filing statuses, prices, dates, fee breakdowns, category tags. Makes the site read like an official record (FMCSA/MOTUS), not a brochure.

Self-host (woff2, subset to Latin) for performance; do not block render. Supply a system fallback stack: Archivo → `system-ui, sans-serif`; Plex Sans → `system-ui, sans-serif`; Plex Mono → `ui-monospace, "SFMono-Regular", monospace`.

### Scale (fluid; Dev implements with `clamp()`)
| Role | Size (desktop) | Face / weight | Notes |
| --- | --- | --- | --- |
| Display / Hero H1 | `clamp(2.5rem, 5vw, 4rem)` | Archivo 800 | Line-height 1.05, tracking -0.02em |
| H1 (page) | 2.5rem | Archivo 700 | LH 1.1 |
| H2 | 1.875rem | Archivo 700 | Section titles |
| H3 | 1.375rem | Archivo 600 | |
| H4 | 1.125rem | Plex Sans 600 | |
| Body L | 1.125rem | Plex Sans 400 | Hero lede, intros |
| Body | 1rem | Plex Sans 400 | LH 1.6, max measure ~68ch |
| Small | 0.875rem | Plex Sans 400 | Captions, helper |
| Mono label | 0.8125rem | Plex Mono 500 | UPPERCASE, tracking 0.08em |
| Price / number | 1rem-1.5rem | Plex Mono 500 | Tabular figures on |

### Rules
- **Headings name document sections only.** Slogans/taglines are styled paragraphs, never H-tags (per SEO standards).
- **No decorative glyphs typed into text nodes.** All icons/glyphs are inline SVG or CSS (per handoff).
- Mono is for data, not paragraphs. Never set running prose in mono.
- Hero may be literary but must pass the 5-second clarity test; FAQ/process copy reads at Grade 8 and stays visually simple and scannable.

---

## 5. Spacing, grid, rhythm

- **Base unit 8px.** Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Grid:** 12 columns. Max content width 1200px. Gutters 24px desktop, 16px mobile. Generous side padding; let content breathe (calm = trust).
- **Section rhythm:** vertical padding 96px desktop / 56px mobile between major sections. Alternate `--paper` and `--cloud`; reserve full-bleed `--ink` for high-emphasis moments (hero accent band, the funnel "now keep loaded" bridge, footer) rather than every other band.
- **Radius:** restrained. 8px cards/inputs, 6px buttons, 4px chips/tags. No pill-everything; pills are reserved for status tags only.
- **Elevation:** one soft shadow token for raised surfaces (`0 1px 2px rgba(14,34,51,.06), 0 4px 16px rgba(14,34,51,.08)`). No glassmorphism, no backdrop-blur.
- **Borders:** 1px `--slate` at 16% for dividers and card outlines; structure comes from line and space, not heavy fills.

---

## 6. Iconography & illustration

The imagery system (no photography). Carries the explanatory load the old stock photos never did, and stays lightweight.

- **Icons:** single-line, 2px stroke, 24px grid, round caps/joins. Stroke in `--ink` or `--steel`; one `--signal` accent stroke allowed per icon for the active element. Subjects from the trucking + compliance world: a truck by trailer type, a filing/document, a stamp, a route node, a shield (compliance), a clock (protest period), a checkmark seal (active).
- **Spot illustrations:** same line language at larger scale, two-tone (Ink/Steel line + flat Paper/Signal fills). Use for hero, hub headers, empty/proof slots. Built as optimized inline SVG.
- **Process diagrams:** the primary illustrative asset. Visualize FMCSA filing sequences and authority states using the status palette. These do real work on money pages and the pillar.
- **Trailer icon set:** one distinct line icon per dispatch type (box truck, dry van, reefer, flatbed, power only, hot shot), used on trailer cards and dispatch nav.
- **Do not:** use 3D blobs, gradient meshes, generic stock, or icons-in-rounded-squares as a decorative triplet.

---

## 7. The signature element: Authority Status Tracker

The one thing this site is remembered by, drawn straight from the business's world and answering the buyer's exact anxiety. It is both brand signature and CRO device.

- **What it is:** a horizontal (vertical on mobile) stepper visualizing the carrier's journey:
  `Application Filed → 21-Day Protest Period → Authority Active`
  Each node carries a line icon, an Archivo step label, and a Plex Mono status tag colored by the status palette.
- **Honesty rules (non-negotiable, from brand guidelines):** never show a guaranteed activation date or countdown that implies Tech Rig controls timing. The protest period is shown as a fixed federal step ("21-day federal protest period"), not a promise. No fabricated progress.
- **Where it recurs:** the home hero accent (sets the expectation), the `/how-to-start-a-trucking-company/` pillar, every compliance money-page header (scoped to that filing's place in the sequence), and the About trust block.
- **States:** todo / filed / in-progress / active map to the status tokens. Reduced-motion users get the final state with no animated transition.
- **Why it converts:** it replaces vague reassurance with a visible, honest map; it sets correct expectations (fewer "why isn't my authority active" surprises); and it gives every compliance page a consistent, credible anchor.

---

## 8. Components

### Buttons / CTA hierarchy
- **Primary CTA:** `--signal` fill, `--ink` text, 6px radius, 600 weight, min height 48px, generous horizontal padding. One per view. Label is action-first ("File my UCR", "Start my filing"). Routes are `[VERIFY]` by Dev; design the button, not the URL.
- **Secondary:** `--ink` outline (1.5px) on transparent, Ink text; or solid Ink on light sections. Visually subordinate to primary.
- **Tertiary / inline link:** `--steel` text, underline on hover/focus, 1-3 word contextual anchor (never "click here"/"learn more").
- **Sticky mobile CTA:** persistent bottom bar carrying the page's single primary action + a tel: call button. Does not cover content (safe-area padding).
- **Focus:** every interactive element shows a visible focus ring: 2px `--steel` outline, 2px offset. Never remove outlines without a visible replacement.

### Price chip (single-source component, 3 states)
Renders from one data file (Dev wires the source) so prices never drift from `services.md`. Plex Mono, tabular figures.
- **Flat:** `$100` with a small label ("BOC-3 filing").
- **From:** `from $100` (service fee floor; the "from" set smaller, Slate).
- **Quote:** `Contact for quote` (trucking LLC, consultancy).
- **Fee separation:** where a government/third-party fee applies, the chip pairs Tech Rig's service fee with a separate "+ gov fee (varies)" line in Slate. Never blend the two into one number.

### Cards (design once, reuse: content-bearing, not decorative)
- **Service card** (compliance hub): line icon + service name (Archivo) + one-line description + price chip + subordinate "details" link. Equal-height grid, Cloud surface, 1px outline.
- **Trailer card** (dispatch hub): trailer line icon + name + one-line value + link. Six-up responsive grid.
- **Founder card** (About): exactly **two**: Adam Smith and Robert Hooke. Illustrated line-style avatar (or monospace initial monogram) since photos need client approval; name, role, one-line background, the "Reviewed by" tie-in. **Never design for a third founder.**

### Navigation
- Sticky header, Ink or Paper surface. Logo slot left; two clearly grouped menus, **Compliance** and **Dispatch**, plus About and Contact; persistent primary CTA + Call button right.
- The two service groups are visually distinguished so the dual-silo model reads instantly.
- Mobile: collapsed mark + a drawer; Call and primary CTA remain reachable.

### Hero (home + both hubs)
- Left: H1 (compliance-led), a literary-but-clear lede, primary CTA, and a one-line secondary thread signaling dispatch exists. Right: a spot illustration or the Authority Status Tracker. Passes the 5-second "compliance + dispatch for truckers" test. No photographic background, no centered headline-subhead-two-buttons cliché.

### Forms (the filing path)
- Labels above fields; inputs ≥48px tall, Cloud surface, 1px Slate outline, clear focus state.
- Inline validation with helpful text, not just red borders. Errors carry an icon + text (never color alone).
- Show fees and what happens next before the commit step; remove every field that is not needed to file.

### FAQ accordion
- One question per row (Archivo H-less button text, it is a control, not a heading unless the brief marks it so), Plex Sans answer at Grade 8. Single-open or multi-open; chevron rotates (respects reduced motion). Maps to FAQPage schema (Dev).

### Trust band (built only from what is real)
- "Officially listed by FMCSA as a BOC-3 blanket process-agent company", as a worded, linked credibility line, **not** a badge implying government endorsement.
- Documented track record: since 2021 / ~100 carriers dispatched; compliance since 2025 / 40+ clients across 10+ states.
- **No** star ratings, "5-star" badges, revenue %, or testimonial carousels. Design a **graceful review/testimonial slot** that the client populates later and that reads fine while empty.
- `[CLIENT PROOF NEEDED]` pages get a proof/example block that degrades gracefully when no story is present.

### OG image template (mandatory, per page)
- 1200×630. Ink or Paper field; stacked logo lockup; page title in Archivo; a category tag in Plex Mono ("Compliance", "Dispatch", trailer type); one relevant line icon; a Signal rule. One template, per-page variants by title + category + icon. Never a placeholder. ~29 pages + blog.

---

## 9. Motion policy

Minimal and purposeful; motion exists to clarify state, never to decorate.
- **Allowed:** Authority Status Tracker step transitions; calm fade/slide-in (≤200ms) on the hero illustration and key numbers; accordion chevron; button/hover/focus micro-feedback; sticky CTA appear/hide on scroll.
- **Banned:** scroll-triggered fade-up on every section as the only motion; parallax-heavy hero; auto-playing carousels; anything that moves while the user reads.
- **Durations:** 120-200ms, ease-out. **`prefers-reduced-motion: reduce` fully respected**. Transitions drop to instant final states.

---

## 10. Conversion system (CRO)

- **One primary action per page**, dominant in the visual path; everything else subordinate. Compliance pages drive to filing; dispatch pages drive to consultation.
- **Above-the-fold clarity:** what this is, who it is for, the price signal, the single action, visible without scrolling on mobile.
- **Pricing as a trust asset:** transparent, service-fee-vs-government-fee separated, set in mono. Hidden pricing reads as risk to this buyer.
- **The funnel cross-link** is a CRO feature: every compliance page ends with a forward path to dispatch; dispatch pages link back to compliance upkeep. Design these as deliberate, styled handoffs, not afterthought links.
- **Friction removal:** short filing forms, expectations set (the tracker), fees shown before commit, a persistent way to call.
- **Honest proof only:** real stories and the documented track record. No invented social proof.

---

## 11. Accessibility & quality floor

- WCAG **AA** contrast on all text and meaningful UI (verified set in §3).
- Visible keyboard focus on every interactive element (§8).
- Responsive from 320px up; equal care for mobile and desktop (no device bias).
- Color is never the sole carrier of meaning (status uses icon + label + color).
- Hit targets ≥44×44px. Forms fully labeled. Reduced motion honored.
- Performance: lightweight SVG over raster, subset self-hosted fonts, no render-blocking media, simple above-the-fold.

---

## 12. Design tokens (for Dev)

```css
:root {
  /* colour */
  --ink:#0E2233; --steel:#225E8A; --signal:#E89A3C;
  --paper:#F7F5F1; --cloud:#FFFFFF; --slate:#4F5E6B;
  --status-active:#2E7D5B; --status-progress:#E89A3C;
  --status-filed:#225E8A; --status-todo:#4F5E6B;

  /* type */
  --font-display:"Archivo", system-ui, sans-serif;
  --font-body:"IBM Plex Sans", system-ui, sans-serif;
  --font-mono:"IBM Plex Mono", ui-monospace, monospace;

  /* spacing (8px base) */
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:24px;
  --s-6:32px; --s-7:48px; --s-8:64px; --s-9:96px; --s-10:128px;

  /* radius */
  --r-chip:4px; --r-btn:6px; --r-card:8px;

  /* elevation */
  --shadow:0 1px 2px rgba(14,34,51,.06), 0 4px 16px rgba(14,34,51,.08);

  /* layout */
  --maxw:1200px; --gutter:24px;
}
@media (prefers-reduced-motion: reduce){ *{animation:none!important;transition:none!important;} }
```

---

## 13. Content presentation (SEO copy into digestible chunks)

SEO supplies the words; design supplies the structure. Bulky paragraphs are reshaped into scannable chunks WITHOUT rewriting them. The transformation is mechanical and auditable, every fragment traces to a sentence SEO wrote.

### The playbook (apply per paragraph)
- The lead clause becomes a **TL;DR** (Standfirst) or a **hook** line.
- Parallel clauses (the "two things", a service list, an equipment list) become a **numbered deck**, a **chip list**, or **bullets**.
- Follow-on sentences become **bullets**.
- The single sharpest line is pulled out as the **punch** (a guide-sign or callout).

Allowed: list-grammar trimming only (for example "we get you legally set up to operate" becomes "Legally set you up to operate"). Not allowed: new claims, dropping facts, reordering meaning, or reworded headings. **Headings stay verbatim at their level**, the H2s carry SEO's keywords and Three Kings placement, so never demote, merge, or reword them. When a pattern needs micro-copy that cannot be derived from existing copy (a brand-new TL;DR with no source clause), mark it `[SEO to supply]` rather than inventing it, and add it to the copy-request list back to SEO.

### The toolkit (static HTML/CSS, navy-forward, mono as accent only)
Patterns drawn from the trade's own artifacts, not decorative effects:
- **Standfirst Deck** (hero TL;DR + numbered takeaways), **Pre-Filing Manifest** (costed intake sheet with three shape-distinct states), **Two-Track Ledger** (you handle / we handle, or two service lanes), **Client Case File** (worked example as a redacted official record, turnaround labelled PAST RESULT), **Split-Ledger Fee Receipt** (service fee vs government fee, two lines never blended), **Bracket Climb** (ordinal rising bars, never proportional to dollars), **Milepost Route** (an ordered how-to as a road, pillar-scoped), **Load Board Row** (equipment + rates as a dispatch board), **Eligibility Strip** (applies / does not apply the same way), **Highway Guide-Sign Callout** (the one sentence that must land, plus the CTA).

### Where each goes
| Fact type | Pattern | Pages |
| --- | --- | --- |
| Package scope vs pass-through fees | Pre-Filing Manifest | compliance hub, home compliance block |
| One real worked example | Client Case File | each money page, compliance hub |
| Who a filing applies to (with honest edges) | Eligibility Strip | UCR, BOC-3, pillar |
| Service fee vs government fee | Split-Ledger Fee Receipt | every fee-bearing page |
| Relative magnitude of bracketed fees | Bracket Climb | UCR only |
| Long ordered how-to that doubles as a TOC | Milepost Route | pillar only |
| Equipment options + per-trailer rates | Load Board Row | dispatch hub |
| Hero summary + key takeaways | Standfirst Deck | every money page and hub hero |
| Division of labour, or one-time vs annual, or two lanes | Two-Track Ledger | compliance hub, home dual-path |
| The sentence that must land + CTA | Highway Guide-Sign Callout | one per money page |

Consistency rule: a given fact-type uses the same pattern sitewide. Static mockups in `mockups/` show the toolkit applied; `home.html` is the gold-standard reference for the refit.

### Guardrails
- Every state carried by shape plus label, never colour alone. Amber rationed to one action per viewport, never used as text (Ink text on amber only).
- No AI-cliche: no bento-everything, no rounded three-icon-card rows, no glassmorphism, no gradient blobs, no purple, no tilted 3D mockups, no scroll-fade-on-everything.
- Mono (IBM Plex Mono) is an accent only (prices, reference strips, codes, dates, statuses, field labels), never the page texture.
- Documented proof only; honest timelines (PAST RESULT, no guarantees); prices from the single source.

### Body copy vs structural labels (the fidelity line)
- **Body copy is SEO's, verbatim.** Every sentence, description, claim, price, figure, and heading comes from the brief, restructured with list-grammar trimming only. Never reword a verb or a claim, never reword or demote a heading, never invent a fee, figure, status, or a connective/handoff sentence. If a fact is missing, render an honest token (`Contact for quote`, `rate on request`, `fee set by bracket`) or a dashed `[SEO to supply]` placeholder.
- **Structural UI labels are design chrome, and are allowed.** Short labels that organize the brief's own content without adding a claim are design's to write: section eyebrows, the deck 01/02 numbers, case-file field labels ("What we did"), eligibility column headers ("Applies to you" / "May not apply"), ledger "Service fee" / "Government fee" (only where the brief states both), and a "PAST RESULT" tag on a past worked example. These are not "invented copy."

### Authority Status Tracker scope
- The tracker is used ONLY on authority-activation pages (home, the compliance hub, `dot-registration`, `mc-registration`, `boc-3-filing`, `mc-dot-registration`, the pillar), with its three standard node labels (Application filed, 21-day protest period, Authority active).
- OMIT it on every other page (fuel tax, plates, upkeep, driver-compliance, dispatch, company, blog, state), where "Authority active" would assert a status the page does not support. Dispatch pages use the loaded-loop instead. Never add status labels, a protest-period figure, or any authority-lifecycle text outside the standard tracker on a tracker page.

---

## 14. Handoff status & what's next

- **This file unblocks Dev** together with `shared/page-briefs/` (per the project README, Dev needs both).
- **Next from Design (Phase 3):** per-page specs to `shared/design/<slug>.md`, following the SEO build order: home + the two hubs first, then the compliance money-page template (reference: `ucr-registration`) and one dispatch trailer template (`box-truck-dispatch`), then About / state / lead-generation / blog.
- **Open dependencies:** client logo + social URLs (placeholder slot built); `[VERIFY]` CTA routes (Dev); `[VERIFY]` prices and `[CLIENT PROOF NEEDED]` slots handled by the graceful component states above.
- **Optional:** a static HTML/CSS styleguide page rendering this system for review.

Dev must preserve exactly: the AA contrast set, the amber-never-white-text rule, the CTA hierarchy (one primary per page), the motion policy (and reduced-motion), the regulated FMCSA wording treatment, and the no-invented-proof rule.
