# Handoff to Design (from SEO)

From the SEO build, 2026-06-20. The SEO work orders are complete and committed. This note orients the Design session: what is ready, what to build, the design-relevant constraints baked into the briefs, and the sequence. SEO specifies content, structure, CTAs, and schema; Design owns the design system and per-page visual design. Stay in lane: do not change copy, keywords, intent, or the URL set without flagging back to SEO.

## What SEO has delivered (read these first)
- `shared/sitemap-plan.md` — the authoritative URL list and architecture. No page or link may exist outside it.
- `shared/keyword-map.md` — per-URL intent, primary/secondary terms, actions.
- `shared/page-briefs/` — one brief per page, each with final copy, headings, single CTA, internal links, and per-page notes. Start at `shared/page-briefs/_index.md` (conventions + batch list + open items).
- `shared/schema-specs.md` — the JSON-LD/machine-readable layer (mostly Dev, but it defines the OG-image and entity requirements Design must supply assets for).
- Context in `seo/context/`: `brand-guidelines.md` (brand name, claims discipline, do-not-publish list), `services.md` (pricing), `experience-notes.md` (real proof), `author.md` (founders).
- `seo/reports/qa-report.md` — the pre-launch QA gate and the consolidated open items.

## The core idea Design must express
Two symmetric service silos under one brand, joined by a funnel:
- **Compliance / setup** (acquisition): `/compliance-services/` hub → filing money pages + the `/mc-dot-registration/` bundle + the $1,350 full package.
- **Dispatch** (retention): `/services/` hub → six trailer pages, franchise = box truck.
- **The funnel is the differentiator:** "get road-legal, then keep your truck loaded." The same team does both. Every compliance page links forward to dispatch; dispatch pages link back to compliance upkeep. Design should make this dual-path obvious on the home page and both hubs.

## Design-relevant requirements pulled from the briefs
- **Brand:** public-facing name is **Tech Rig**. "DGR Tech Rig LLC" appears only in footer/legal/schema. Never "TechRig" or "Tech-Rig".
- **Per-page unique OG image** is mandatory (branded, drawn from the design system, never a placeholder). One per page, ~29 pages + blog. Design owns the template and the per-page variants.
- **Decorative glyphs/icons via CSS or inline SVG assets only** — never typed into headings or text nodes. Headings name sections; slogans/taglines are styled paragraphs, never H-tags.
- **Price chips** must render from a single source (one data file) so they cannot drift from `services.md`. Design the chip; Dev wires the source.
- **5-second clarity test** on hero sections (home, both hubs): a visitor must instantly grasp "compliance + dispatch for truckers". Hero may be more literary; FAQ/process blocks read at Grade 8, so keep those visually simple and scannable.
- **Card grids** are specified on the compliance hub (service cards: name + one line + price), the dispatch hub (trailer cards), and the About page (two founder cards). Design these patterns once, reuse.
- **Founder cards (About):** exactly **two** founders, Adam Smith and Robert Hooke (these are the public identities; treat as the real names for all design purposes). If photos are used they must be client-supplied/approved. Do not design for a third founder.
- **Single CTA per page.** Each brief names the primary CTA and its destination. Design one dominant CTA treatment; secondary links stay visually subordinate. CTA routes themselves are marked `[VERIFY]` (Dev confirms), so design the button, not the URL.
- **Proof, not hype:** the briefs use real client stories and a documented track record (since 2021, ~100 dispatched; compliance since 2025, 40+ clients, 10+ states). There are **no** star ratings, revenue %, or testimonials cleared for display yet. Do not design rating widgets, "5-star" badges, or testimonial carousels that imply proof we do not have. Leave a slot for reviews/testimonials to add later (client will supply).
- **FMCSA trust mark wording is regulated:** "officially listed by FMCSA as a BOC-3 blanket process-agent company." Do not design a badge that implies FMCSA endorsement or government affiliation.
- **Performance is a constraint, not a claim:** Phase 3 found a weak Core Web Vitals/CTR baseline. Design for speed (image weight, above-the-fold simplicity); do not add heavy hero media that re-creates the problem.

## Suggested build sequence (mirrors SEO priority)
1. **Design system first** (can start immediately, no per-page dependency): brand tokens, type scale, color, the OG-image template, the CTA/button system, the service-card and FAQ patterns, the price-chip component.
2. **Home + the two hubs** (`/compliance-services/`, `/services/`) — they establish the dual-silo, funnel-forward layout everything else inherits.
3. **Money-page template** — one compliance filing page (use `/ucr-registration/` as the reference, it is the highest-value), then reuse for the rest. One dispatch trailer template from `/box-truck-dispatch/`.
4. **About** (founder cards + trust block), **state-page template**, **lead-generation**, blog template.

## What Design writes back (the contract continues)
Per the project README, write to `shared/design/`: the design system and per-page design specs. Dev is blocked until both `shared/page-briefs/` (done) and `shared/design/` exist.

## Open items that may affect design
- Logo URL and social profile URLs are pending from the client (needed for header/footer + schema). Design around a placeholder logo slot.
- A few service fees and the bundle price are `[VERIFY]` (see qa-report §E) — design the price chip to handle "from $X", a flat price, and "Contact for quote" (trucking LLC) states.
- Some pages flag `[CLIENT PROOF NEEDED]` (IRP, reefer, flatbed, dry van) — design a proof/example block that degrades gracefully when no story is present yet.

Questions on intent, copy, or structure go back to SEO. Visual and CRO decisions are yours.
