# M3 Follow-up R1 — Full compliance package bundle

Milestone: M3 (engine), follow-up. Lane: Dev-led. Owner-confirmed 2026-06-25.
Reads: `lib/services-registry.ts`, `seo/context/services.md`, the M3 `/apply` engine. Writes: `dev/**` + a note to `../03-roadmap.md` M3.

Why: `services.md` advertises a discounted **$1,350 full initial compliance package**. The M3 engine sells à la carte only, so picking those services individually quotes MORE than $1,350 — a standards contradiction (advertised price vs engine quote). Add the bundle so the engine honors the advertised price.

## Confirmed contents (owner, 2026-06-25)
The `$1,350` package includes, at a **fixed price**:
- **MC authority** (includes USDOT) + its **FMCSA government application fee** (included, not shown on top)
- **BOC-3**
- **UCR** at the **0-2 vehicle bracket**, with the **UCR government fee for 0-2 ($46) included**
- **Clearinghouse** registration
- **Drug & Alcohol Consortium** enrollment
- **Pre-employment drug-test** coordination

À la carte these total ~$1,496 (incl. the two gov fees), so $1,350 is a ~$146 bundle discount. Source of truth stays `services.md`; do not hardcode a price that contradicts it.

## Build
1. **Registry:** add a `full-package` entry — `priceKind: "package"`, fixed `price: 1350`, `includes: ["mc-authority","boc-3","ucr","clearinghouse","consortium","drug-test"]`, and a `govFeesIncluded` note ("MC FMCSA fee and UCR 0-2 government fee included; no separate add"). Keep it driven by `services.md`.
2. **Selection:** the package is one selectable item in the service-selection step. Selecting it **includes** its constituents (de-dup: a customer cannot also be charged for the same services individually on top). `requiredSteps` = the union of the constituents' steps.
3. **Pricing:** when the package is selected, the application total is **$1,350** (not the à-la-carte sum). Constituent service fees and the included MC + UCR-0-2 gov fees are NOT added on top.
4. **UCR bracket > 0-2:** the package includes the UCR gov fee only at the 0-2 bracket. If the carrier's power units put them in a higher bracket, show the **government-fee difference** separately (per `services.md`: brackets 3-5 $138, 6-20 $276, …) — never silently absorb it, never silently overcharge. 101+ units → manual review on the UCR portion as usual.
5. **Filings:** still create one `filings` row per included service (so M5 progress tracking shows each filing), tagged as part of the package; the application's `total_amount` is $1,350. Dev chooses the representation (e.g. a package marker + per-filing `price_amount` of 0 or an allocated split) but the customer-facing total is $1,350 and each filing is independently trackable.
6. **OA-aware hint (from the R3 snapshot):** if the carrier already holds some constituents (e.g. an active BOC-3 blanket filing, active MC), surface a non-blocking note that à la carte may suit them better — do not auto-charge for something they demonstrably already have. Informational only; the owner can refine later.

## Acceptance (verifiable now, local + prod DB)
- Selecting the package quotes exactly **$1,350** (0-2 bracket), and creates the 6 constituent filings; selecting the same services individually still sums à la carte (no double-charge path when the package is chosen).
- A carrier in a higher UCR bracket sees the gov-fee difference added separately and labeled.
- Prices still trace to `services.md`; ELD/insurance remain excluded.
- noindex preserved; RLS unchanged.

## Commit scope
Commit only `dev/**` + the roadmap note. Never `git add .`.
