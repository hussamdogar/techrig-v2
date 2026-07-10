# Start here: Design workspace

> **ACTIVE WORK ORDER (orchestrator, 2026-07-10): DZ3 — Pricing v2 package UI. `git pull` first. Gated on SEO's bundles brief.**
> DZ1 + DZ2 are DONE. New milestone: pricing v2 — full spec in `../shared/work-order-pricing-v2.md` (client doc: `../shared/client-pricing-v2-2026-07-10.md`). The owner approved a four-bundle, two-price pricing model before launch.
>
> **Once SEO's packages/bundles brief exists in `../shared/page-briefs/`,** produce specs (reuse the locked design system — new **components within it**, no new foundations) for:
> 1. **The four package cards** — Compliance Continuation Non-CDL ($400) / CDL-Heavy ($1,100), Authority Launch Non-CDL ($1,000) / CDL-Heavy ($1,700). Each: price, a **"BOC-3 Included"** badge, the included-services list, and the **itemized total → "+$N rounding" → savings/discount** display (§1). Prices/figures come from the brief; never hardcode in a way that can drift.
> 2. **The side-by-side comparison table** (§4).
> 3. **The CDL/non-CDL selector** + the "choose by vehicle, not driver" explanatory block (§6). Passenger/hazmat → custom-review note.
>
> If SEO's bundles brief is not there yet, the handoff is not ready — say so and wait. Push specs to `../shared/design/`; commit only `../shared/design/`, explicit paths, never `git add .`; the orchestrator verifies + coordinates the push (as with DZ1/DZ2).

---

1. Read `prompts/design.md`.
2. Begin with the design discovery conversation. You can establish the design direction and the design system now, even before the SEO build is done.
3. Per-page design needs the SEO work orders in `../shared/page-briefs/`. If they are not there yet, do discovery and the system first, then return for the pages once they exist.
4. Push your output to `../shared/design/`: `design-system.md` plus one spec per page. This unblocks Dev.

You are an expert in CRO: every design decision exists to keep the visitor engaged and move them to convert. Match the design to the industry, immersive for experiential businesses, clear and minimal for utility and service businesses.
