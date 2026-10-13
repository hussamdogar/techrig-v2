# Component spec: Service card (whole-card link)

Design-only spec for Dev. Supersedes the anatomy line in `design-system.md` §8 "Service card". Implements in `dev/components/service-card.tsx`; the homepage grid change is in `dev/app/page.tsx` section 2. Copy, titles, descriptions, prices and hrefs are untouched: they keep coming from `lib/services.ts` and the PriceChip. No new colours, fonts or tokens. No em dashes.

Preview: `shared/design/mockups/service-card.html` (light section, dark section, 5-card homepage grid, no-href card).

## Why
1. Today only the title text is a link, so most of the card (icon, description, price) is a dead tap zone. On mobile that is the bigger problem: people tap the price.
2. The card gives no signal that it goes anywhere. A directional cue plus a hover response fixes that.
3. On the homepage the 3 + 2 grid leaves an empty cell at desktop width.

## Anatomy

```
+--------------------------------------------------+  rounded-card (8px), 1px slate/15, bg-cloud
| [icon]  BOC-3 filing                              |  header row: 24px Steel line icon + h3 title
|                                                   |  (title holds the ONLY link; its ::after
|  Blanket process-agent designation, required      |   stretches over the whole card)
|  to activate authority.                           |  description: text-sm Slate
|                                                   |
|  (flexible space, mt-auto pushes footer down)     |
| ------------------------------------------------- |  hairline: border-t slate/10
|  $45                                         ->   |  footer: PriceChip (left) + arrow (right)
|  + gov fee by fleet size                          |  gov-fee / note lines stay inside the chip
+--------------------------------------------------+
```

Changes from today:
- Icon moves inline, left of the title (was stacked above it). Saves a row of height, reads as a list of real services rather than an "icon on top" feature triplet (design-prompt AI-fingerprint list).
- New footer row separated by a hairline: price left, arrow right. The price is the second thing the eye lands on, always at the bottom edge.
- New arrow (`ArrowRightIcon`, already in `components/icons`) as the clickability cue, only when `href` exists. This replaces the "subordinate details link" from the old §8 wording.
- Whole card is the click target via the stretched-link pattern.

## Markup and classes (Tailwind v4)

Root (keep a `div`; add an optional `className` prop merged with `cn`, needed for the homepage grid spans):

```
group relative flex h-full flex-col rounded-card border border-slate/15 bg-cloud p-5 sm:p-6
```

Root, added only when `href` is set (interactive card):

```
transition-[border-color,box-shadow,transform,background-color] duration-150 ease-out
hover:border-steel hover:shadow-card motion-safe:hover:-translate-y-0.5
has-[a:focus-visible]:border-steel
active:bg-paper active:shadow-none motion-safe:active:translate-y-0
```

Header row: `<div class="flex items-start gap-3">`
- Icon: `size={24}`, `aria-hidden="true"`, `className="mt-0.5 shrink-0 text-steel"`.
- `<h3 class="font-display text-lg font-semibold leading-snug text-ink">`

Title link (inside the h3, `href` set):

```
text-ink outline-none transition-colors duration-150 group-hover:text-steel
after:absolute after:inset-0 after:rounded-card
focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-steel
```

Tailwind v4 adds `content: ''` automatically for `after:` utilities; if the build does not, add `after:content-['']`.

Title without `href`: `<span class="text-ink">` (as today).

Description: `<p class="mt-2 text-sm text-slate">` (drop today's `flex-1`; the footer's `mt-auto` now does the push).

Footer (render when `price` or `href` exists):

```
<div class="mt-auto pt-5">
  <div class="flex items-start justify-between gap-4 border-t border-slate/10 pt-4">
    <PriceChip ... className="border-0 bg-transparent px-0 py-0" />   (unchanged props)
    <ArrowRightIcon size={20} aria-hidden="true"
      className="ml-auto mt-1 shrink-0 text-steel transition-transform duration-150 ease-out motion-safe:group-hover:translate-x-1" />
  </div>
</div>
```

- Arrow only when `href` is set. `ml-auto` keeps it right-aligned when there is no price.
- `mt-1` aligns the 20px arrow with the first line of the `text-xl` mono price.
- Gov-fee and note lines stay inside the PriceChip below the number; do not change PriceChip.

## Semantics and accessibility
- Exactly one interactive element per card: the title `<a>`. Its `::after` covers the card, so a click or tap anywhere lands on the link. Nothing else in the card is focusable, and nothing is nested inside the link.
- Accessible name = the service title only (description and price are outside the link, read in normal document order). The arrow is `aria-hidden`.
- Keyboard: one Tab stop per card. Focus shows a 2px Steel ring drawn just inside the card edge (negative offset) plus the border turning Steel (`has-[a:focus-visible]`), so the ring reads as a 3px frame.
- Why an inset ring: the card switches tokens back to light values inside dark sections, so an outside ring would be dark Steel `#225E8A` on Ink, about 2.4:1, which fails the 3:1 non-text rule. Inset, it sits on white at 6.9:1 in every context.
- Trade-off accepted: description text cannot be mouse-selected (covered by the overlay). Acceptable for a navigation card.
- Hit target: whole card, well above 44 x 44px at every breakpoint.

## States

| State | Interactive card (href) | Static card (no href) |
| --- | --- | --- |
| Default | 1px slate/15 border, no shadow, Ink title, Steel arrow | Same, no arrow |
| Hover (pointer devices only; Tailwind v4 `hover:` is already gated to `(hover: hover)`) | Border Steel, `shadow-card`, lift 2px, title Steel, arrow slides 4px right | No change, no pointer cursor |
| Focus-visible | Border Steel + 2px inset Steel ring. No lift (keyboard users get a static frame) | Not focusable |
| Active (press, incl. touch) | Background Paper, shadow off, lift released. Gives touch users feedback since hover does not fire | n/a |
| Reduced motion | No lift, no arrow slide (`motion-safe:` gates transforms). Border, shadow, colour changes still apply, instantly (globals.css already zeroes transition durations) | n/a |

Durations: 150ms ease-out, inside the §9 window (120 to 200ms). Nothing moves on load or scroll.

## Light vs dark sections
- No dark-specific classes. The card is `bg-cloud`, so the globals.css remap switches `ink/slate/steel` back to their light values inside `<Section surface="ink">`. The card renders identically on both surfaces.
- On Ink the hover shadow is invisible by nature; the hover cue there is the lift, the Steel title and the arrow slide. The inset focus ring keeps AA on Ink (see above).
- Contrast (all on the white card): Ink title 16.2:1, Steel title on hover 6.9:1, Slate description 6.7:1, Steel arrow 6.9:1, Steel border on hover vs Paper/white surroundings 6.9:1.

## Mobile (375px)
- Single column, grid `gap-4` (16px). Card padding `p-5` (20px); `sm:p-6` from 640px.
- Card width at 375px: 375 minus 2 x 16px gutter = 343px. Header row icon + title, description below, footer row price + arrow. Approx 150 to 175px tall per card, 5 cards about 850px total. No horizontal scroll, nothing hidden.
- The whole card is the tap target; `active:bg-paper` is the press feedback.

## Homepage "What we handle" (5 cards)
No homepage-only card variant. The homepage uses the canonical card; only the grid changes.

Grid (replace `grid gap-5 sm:grid-cols-2 lg:grid-cols-3`):

```
mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6
```

Per card `className` by index `i`:
- `i` 0 to 2: `lg:col-span-2` (three across the top row)
- `i` 3 to 4: `lg:col-span-3` (two wider cards fill the bottom row, no empty cell)
- `i` 4 also: `sm:col-span-2` (at the 2-column tablet width the fifth card spans the row, the same rule the hero order card tiles already use)

Result: desktop 3 + 2 full-width rows, tablet 2 + 2 + 1 (full), mobile 1 column. Rows stay equal height (grid stretch + `h-full`), price pinned to the bottom via `mt-auto`. If the card count ever changes from 5, fall back to `sm:grid-cols-2 lg:grid-cols-3` (Dev: guard with a length check, do not hard-fail).

Section surface: change homepage section 2 from `surface="cloud"` to `surface="paper"`. White cards on a white section currently rely on a 15% hairline alone; on Paper they read as raised surfaces, which is the system's intent (Cloud = cards, Paper = page). Paper is still a light surface, so the dark/light alternation is unchanged. The "See the full compliance hub" link below the grid stays exactly as is.

Other uses (no page changes needed): `/compliance-services/` (3-col, inside an Ink section) and the state dispatch pages (4-col, inside Ink) pick up the new card as-is. At the 4-col width (about 270px) the footer still fits price + arrow.

## Secondary "Order online" action: not in this version

**Superseded 2026-10-08 (owner): the homepage cards DO get two actions.** "Order now" (Ink-outline `secondary` sm button, a sibling link raised with `relative z-10`, to `/buy/<service-key>/`) and a "Read more" arrow cue (aria-hidden text, not a link: the card's stretched title link already goes to the service page). Homepage and compliance hub (catalog items with a `quickBuyKey`), via the `orderHref` prop; other cards keep the single arrow. The original recommendation is kept below for the record.
Recommendation: one destination per card, the service page.
- The hero already carries the direct-purchase path (the USDOT order card, "Start your order"), one viewport above.
- Five extra buy buttons beside it dilute the page's single primary action, and Signal is rationed to one per view.
- The service page explains fee separation (UCR gov fee by fleet size, DQ per driver) before checkout, which cuts abandonment at the price step.
- One target per card keeps the tap area simple and the card free of competing controls.

If the owner wants it anyway (Variant B, owner opt-in): add a sibling link in the footer, not inside the title link: `<Link href="/buy/<service-key>/" className="relative z-10 text-sm font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel">Order online</Link>`, placed before the arrow. `relative z-10` lifts it above the stretched `::after`, so it is clickable on its own and the rest of the card still goes to the service page. Steel text link, never a Signal button. Service keys come from `QUICK_BUY_SERVICE_KEYS` in `lib/services-registry.ts`. Homepage only, via an optional `orderHref` prop. The label is copy, so SEO confirms the wording.

## Acceptance criteria
1. Clicking or tapping anywhere on a card with `href` (icon, description, price, empty space) navigates to that href. Cards without `href` do nothing on click and show no arrow, no hover change and no pointer cursor.
2. Each card has exactly one focusable element; DOM check: no `a` or `button` nested inside another. The link's accessible name equals the title.
3. Keyboard focus shows a visible Steel frame on the whole card, on both Paper and Ink sections (AA 3:1 non-text met).
4. With `prefers-reduced-motion: reduce`, the card and arrow do not translate on hover or press.
5. In any grid row, cards share the same height and the price/arrow footer sits on the bottom edge of every card.
6. Homepage at 1280px: 3 cards in row 1, 2 wider cards filling row 2, no empty cell. At 768px: 2 + 2 + 1 full-width. At 375px: one column, no horizontal scroll.
7. Cards render identically inside `Section surface="ink"` and on light sections (token remap respected; no dark-only classes added).
8. PriceChip output (flat, from, per-driver unit, gov-fee line, note line) is unchanged in content; only its position changes.
9. Copy, titles, descriptions, prices and hrefs are unchanged; "See the full compliance hub" link still present.
