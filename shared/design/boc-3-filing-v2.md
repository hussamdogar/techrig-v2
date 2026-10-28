# /boc-3-filing/ design pass v2

Status: proposal for owner review, 2026-10-27. Scope: the SEO page `dev/app/boc-3-filing/page.tsx` (not `/lp/`).
Mockup: `shared/design/mockups/boc-3-filing-v2.html` (phone 375 and laptop 1280, with a switcher for the three FMCSA-line treatments).
Kept as the owner set them: the shared `Boc3OrderCard` in the hero as the one hero action, no separate hero button, the hero order (phone: H1, card, intro; laptop: H1 and intro left, card right), the dark/light band alternation, the site header and footer.
Copy rule: every H2 and all body copy stay word for word (SEO owns copy). Changes here are layout, grouping, styling and visual chrome. Copy ideas are in section 9, not applied.
Tokens and components: `dev/app/globals.css`, `shared/design/design-system.md`.

---

## 1. Summary of changes

1. **FMCSA line (owner request):** a short, plain sentence directly under the H1, with a line stamp icon and a "See our listing" link to FMCSA's own page. It is not a badge or seal. The disclaimer under the card stays. Alternatives B and C are in the mockup switcher.
2. **Hero:** the phone H1 drops from about 40px to 32px, so the H1, the FMCSA line and the card's button all sit on the first screen (button bottom at 569px of 812).
3. **"Who needs a BOC-3":** icons now carry meaning (check = needs one, minus = generally does not, clock = one-time timing) instead of four identical amber file icons. This removes four Signal marks from one viewport.
4. **"How our BOC-3 filing works":** a real numbered stepper, and the price chip, price sentence and "File my BOC-3" link grouped into one price panel with a tappable 48px secondary button.
5. **Light sections on laptop:** H2 on the left, content on the right (4/8 split), for an editorial rhythm against the single-column dark bands.
6. **Case study:** the same text, split into two paragraphs at a sentence boundary, larger on laptop.
7. **Closing CTA:** reuses the order card (USDOT field in place) instead of a button to a second page. One fewer page hop at the bottom of a long page.
8. **Sticky phone bar (proposal):** "File your BOC-3, $45 one time, all 50 states" with a "Start" button that scrolls back to the hero USDOT field. It shows only between the hero card and the closing card.

---

## 2. FMCSA line: treatments

Rules applied:
- It is a sentence, never a badge, seal, shield or ribbon (design-system section 8, Trust band).
- The private-company disclaimer under the card stays, unchanged (Google Ads government-documents policy).
- No Signal amber on it: Signal is rationed, and the H1 span and the card button already use it.

| | Treatment | Phone placement | Laptop placement | Pros | Cons |
| --- | --- | --- | --- | --- | --- |
| **A (recommended)** | Its own line under the H1. Stamp line icon (Steel-on-dark #9CC7E8). "**Officially listed by FMCSA** as a BOC-3 blanket process-agent company." then "See our listing" with an external-link icon. | Between H1 and card (adds 64px; the card button still ends at 569px) | Left column, between H1 and intro | It is read before the action, the first thing a skeptical buyer checks. It is verifiable in one tap. It reads as a fact, not a badge, and has the same shape as the proven `/lp/` line. | The sentence also appears in the intro, so it is said twice in the hero (see copy proposal C1). |
| B | The sentence inside the intro paragraph set in white, weight 500, with a soft 2px Steel-light underline, and "See our listing" appended. | Below the card (about 870px, off the first screen) | Mid-paragraph | Zero layout change, no repetition. | On phone it is below the fold and after the action, which is exactly where it is buried today. |
| C | A line directly under the card, above the disclaimer: the same sentence plus "See our listing". | Under the card (608px) | Under the card | Claim and disclaimer sit together, which is honest and Ads-friendly. | It needs a new prop on the shared `Boc3OrderCard` (also used by `/lp/`). It sits after the button, and two small lines under a card read as fine print. |

**Recommendation: A.** It is noticeable because of where it sits (between the H1 and the action) and because it can be checked, not because of size or colour. It is a single 15px line at 80% white with the key phrase in white semibold.

### A: exact build

```tsx
<p className="flex items-start gap-2.5 text-[15px] leading-[22px] text-cloud/80 lg:col-start-1 lg:row-start-2 lg:mt-5">
  <StampIcon size={20} className="mt-px shrink-0 text-[#9CC7E8]" aria-hidden="true" />
  <span>
    <strong className="font-semibold text-cloud">Officially listed by FMCSA</strong> as a BOC-3 blanket
    process-agent company.{" "}
    <TrackedAnchor
      href={FMCSA_LISTING_URL}
      event="fmcsa_listing_click"
      data={{ location: "boc3_page_hero" }}
      target="_blank"
      rel="noopener nofollow"
      className="whitespace-nowrap text-cloud underline underline-offset-4 hover:text-signal outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
    >
      See our listing
      <span className="sr-only"> on fmcsa.dot.gov (opens in a new tab)</span>
      <ExternalLinkIcon size={14} className="ml-0.5 inline align-[-2px]" aria-hidden="true" />
    </TrackedAnchor>
  </span>
</p>
```

- Move `FMCSA_LISTING_URL` from `app/lp/_shared/boc3-landing.tsx` to `lib/site.ts` (or `lib/fmcsa.ts`) so both pages share it.
- `ExternalLinkIcon` is new in `components/icons.tsx`, same stroke system: `M14 4h6v6`, `M20 4 11 13`, `M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5`.
- `#9CC7E8` is the existing dark-surface Steel in globals.css (the dark-section remap). Use that token if exposed, otherwise add `--color-steel-on-dark: #9cc7e8`.
- Contrast: cloud/80 on Ink is about 12:1, white about 16:1. The icon at #9CC7E8 is about 9:1.

---

## 3. Hero

| | Phone (below lg) | Laptop (lg and up) |
| --- | --- | --- |
| Order | Breadcrumbs, H1, FMCSA line, order card + disclaimer, intro, Reviewed by | Left: H1, FMCSA line, intro, Reviewed by. Right: card (spans rows 1 to 4) |
| H1 | `text-[2rem] leading-[1.08]` (32px), was clamp at 36px+ | `lg:text-[clamp(2.25rem,4.5vw,3.5rem)]` (unchanged) |
| Gaps | `gap-6` between items | `lg:gap-x-16 lg:gap-y-0`; FMCSA line `lg:mt-5`, intro block `lg:mt-5` |
| Intro | `text-[17px] text-cloud/80` | `lg:text-lg` |

Grid: `grid items-start gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0`.
- H1: `lg:col-start-1 lg:row-start-1`
- FMCSA line: `lg:col-start-1 lg:row-start-2`
- Card wrapper: `lg:col-start-2 lg:row-start-1 lg:row-span-4`
- Intro block: `lg:col-start-1 lg:row-start-3`

Measured in the mockup (scroller px, 64px header included):

| | Phone | Laptop |
| --- | --- | --- |
| FMCSA line ends | 331 | 403 |
| Card button ends | 569 of 812 | 380 of 800 |

The card's fee line and rating also fit on the phone's first screen.

---

## 4. Section by section (below the hero)

Rhythm stays: Ink hero, Cloud, Ink, Cloud, Ink, Cloud, Ink closing. Section padding stays `py-14 md:py-24`.

### 4.1 What a BOC-3 is (Cloud)
- Phone: unchanged (H2, then paragraph `text-slate max-w-[68ch]`).
- Laptop: `lg:grid lg:grid-cols-[4fr_8fr] lg:gap-x-16 lg:items-start`, H2 left (`lg:sticky lg:top-24`), paragraph right with `lg:mt-0`. The paragraph is long, and a wide two-column layout keeps the line length near 68ch without a narrow centred column.

### 4.2 Who needs a BOC-3, and when (Ink)
- Container `max-w-3xl` (unchanged).
- List icons (all `size-5 mt-0.5 shrink-0`):
  - Items 1 and 2: `CheckIcon text-[#9CC7E8]`.
  - Item 3 ("generally does not need"): `MinusCircleIcon text-cloud/55`, new icon: circle r9 + `M8 12h8`.
  - Item 4 (one-time): `ClockIcon text-[#9CC7E8]`.
  - This replaces four identical amber `FilingIcon`s. Signal is rationed, and the negative item should not look like the positives.
- List spacing `mt-6 space-y-3.5`.
- "Important" callout: keep the 4px Signal left rule. Add `rounded-r-card bg-cloud/5 py-3.5 pl-4 pr-4` and set "Important:" in `font-semibold text-cloud` (same text). It reads as a note, not a quote.

### 4.3 How our BOC-3 filing works (Cloud)
- Laptop: same 4/8 split as 4.1.
- Lead line ("Because we are an FMCSA-listed...") stays `font-medium text-ink`, `text-[17px]`.
- Stepper:
  - `ol` with `li` `relative pl-12 pb-[22px] last:pb-0`.
  - Number badge `absolute left-0 top-0 grid size-8 place-items-center rounded-full border-[1.5px] border-steel bg-cloud font-mono text-[13px] font-medium text-steel` (`aria-hidden`, the `ol` carries the order).
  - Connector `before:absolute before:left-[15px] before:top-[34px] before:bottom-1 before:w-0.5 before:bg-slate/15`, none on the last item.
  - Text `pt-1 text-ink`.
- Price panel (replaces the loose PriceChip + sentence + text link): `mt-8 grid gap-3.5 rounded-card border border-slate/20 bg-paper p-4 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6 lg:px-6 lg:py-5`.
  - Left: the PriceChip content without its own border (`$45` `font-mono text-[28px] font-medium`, label "BOC-3 filing, one time" `text-sm text-slate`).
  - Middle: "$45, one time, with no annual renewal fee." `text-slate`.
  - Right: "File my BOC-3" as a secondary button (`buttonVariants({ variant: "secondary" })`, solid Ink on light, min-h-12, full width on phone, auto on laptop). The text link was a 20px-tall target on phone; this makes the mid-page action easy to tap while staying subordinate to the amber card button.
  - Same href `/buy/boc-3/`.

### 4.4 BOC-3 as part of getting road-legal (Ink)
- Keep the Signal left rule and the text. Split into two `<p>` at "...waiting on a mailed letter." / "We moved her forward...". This is text unchanged, only a paragraph break. On phone the block was a 15-line wall.
- `text-cloud/80`, `lg:text-lg`, `max-w-[62ch]`, `mt-4` between paragraphs.

### 4.5 BOC-3 filing FAQ (Cloud)
- Laptop: same 4/8 split (H2 left and sticky, accordion right). Phone unchanged.
- `FaqAccordion` unchanged. Summary rows are at least 56px tall on phone (they already are via `py-4`).

### 4.6 Closing CTA (Ink)
- Replace the `ClosingCta` button with the order card. Layout: `grid gap-6 lg:grid-cols-[1fr_440px] lg:gap-x-16 lg:items-center`.
  - Left: the closing line (unchanged text, `<p>` `font-display text-2xl lg:text-3xl font-bold text-cloud`, left aligned).
  - Right: `<Boc3OrderCard serviceKey="boc-3" amount={45} location="boc3_page_closing" />`.
- Why: at the end of a 6,000px page, a visitor who is ready should type the USDOT here, not tap to a second page and then type it. The card carries its own price, one-time line, rating and disclaimer.
- The card has `id="file"` and an `id="usdot"` input. Two instances on one page would duplicate ids. Add an `idSuffix` prop (for example `"-closing"`) to `Boc3OrderCard` for the input, label and wrapper ids. The hero instance keeps `file` / `usdot`, so `/lp/` scroll targets are unaffected.

### 4.7 Sticky phone bar (proposal, below lg only)
- `fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-slate/15 bg-cloud px-4 pt-2.5 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(14,34,51,.10)] lg:hidden`.
- Left: "File your BOC-3" (`font-display font-bold text-ink`) over "$45 one time, all 50 states" (`text-[13px] text-slate`). Right: primary "Start" button (min-h-12).
- Visible only when the hero card is above the viewport and the closing card is not yet in view (two IntersectionObservers). Slides in and out over 200ms; instant under reduced motion. `aria-hidden` and `inert` while hidden.
- "Start" scrolls to the hero USDOT field (offset for the 64px header) and focuses it: reuse `app/lp/_shared/scroll-to-form.ts`, which also flashes the "Start here" hint.
- Tracking: `cta_click` with `location: "boc3_page_sticky"` (same event family as `/lp/`).
- Copy on the bar is new: see section 9, C4.

---

## 5. Accessibility

- One H1. Section H2s unchanged; no heading levels skipped. The closing line stays a `<p>`, not a heading (it is a slogan).
- The FMCSA link has an accessible name that says it leaves the site ("See our listing on fmcsa.dot.gov (opens in a new tab)"). The icon is decorative.
- The stepper numbers are `aria-hidden`; the `<ol>` provides order.
- Two order cards: unique ids per instance (4.6). Each has its own visible "USDOT number" label.
- Sticky bar: not focusable while hidden. It never covers the focused field, because it hides while the hero card is in view, and the hero field is where "Start" sends focus.
- Contrast: every new pair is above 4.5:1 for text and 3:1 for icons (values in section 2).
- Reduced motion: no slide on the sticky bar, no chevron transition (global rule).

---

## 6. Acceptance criteria

1. The FMCSA line renders as a sentence directly under the H1 (phone: before the card; laptop: left column under the H1), links to the FMCSA listing in a new tab with `rel="noopener nofollow"`, and fires `fmcsa_listing_click` with `location: "boc3_page_hero"`.
2. No badge, seal, shield graphic or amber treatment is used for the FMCSA claim. The private-company disclaimer under each order card is unchanged.
3. On a 375 x 812 phone, the H1, the FMCSA line and the hero card's "Start my BOC-3 filing" button are fully visible without scrolling.
4. No horizontal scroll at 375 or 1280.
5. Every H2 and all body copy are unchanged. The only text edits are the case-study paragraph break and the new copy explicitly approved from section 9.
6. "Who needs" icons follow 4.2; no Signal-coloured icons in that list.
7. The price panel groups price, sentence and a 48px "File my BOC-3" secondary button linking to `/buy/boc-3/`.
8. The closing section contains an order card with unique ids, and its lookup fires `quick_buy_lookup_submit` with `location: "boc3_page_closing"`.
9. If the sticky bar is approved: below lg it shows only between the two order cards, "Start" focuses the hero USDOT field, and the bar is hidden (and not focusable) at all other times.
10. No em dashes in any new copy.

---

## 7. Phone vs laptop at a glance

| Area | Phone | Laptop |
| --- | --- | --- |
| Hero | Stacked: H1, FMCSA line, card, intro | Two columns, card right |
| Light sections | Stacked | H2 left (sticky) / content right, 4:8 |
| Dark sections | Single column | Single column, max-w-3xl |
| Price panel | Stacked, full-width button | One row: price, sentence, button |
| Closing | Line, then card | Line left, card right |
| Sticky bar | Yes (proposal) | No |

---

## 8. Repetition audit (for SEO; no copy changed)

- "$45, one time, with no annual renewal fee." appears verbatim twice on the page: under the price chip and as the FAQ answer. With the card's "$45 one-time fee. No annual renewals.", the price message appears 6 times in all.
- "officially listed by FMCSA as a BOC-3 blanket process-agent company" now appears in the FMCSA line, the hero intro and the footer. "FMCSA-listed" appears 3 more times (lead line, FAQ, closing).

These are intentional SEO reinforcements in places, but two are pure duplicates (see C1, C2).

---

## 9. Copy proposals (not applied; for SEO to decide)

- **C1.** Hero intro: with treatment A, shorten the last sentence to "As a listed blanket process agent, we can file your BOC-3 across all 50 states, for $45, one time." This removes the repeat of the line directly above it.
- **C2.** Remove "$45, one time, with no annual renewal fee." under the price chip. The chip and the FAQ already say it, and it repeats an 8+ word sentence on the same page.
- **C3.** Case study: add a small mono label above it, "From our files", so it reads as a real case at a glance.
- **C4.** Sticky bar (new): "File your BOC-3" / "$45 one time, all 50 states" / "Start".
- **C5.** Closing line: consider "Ready to activate your authority? File your BOC-3 with an FMCSA-listed process agent." It is shorter on phone (4 lines down to 3) and still carries "FMCSA-listed process agent".

---

## 10. Open questions for the owner

1. Approve treatment A for the FMCSA line (or B / C)?
2. Closing CTA as a second order card instead of a button to `/buy/boc-3/`: OK? It needs the small `idSuffix` prop on the shared card.
3. Sticky phone bar: add it? It is the one structural addition beyond what was asked, and the `/lp/` pages already use the same pattern.
4. Should the FMCSA listing URL also be linked from the footer line ("DGR Tech Rig LLC is officially listed by FMCSA...") site-wide? That would make the claim verifiable on every page.
