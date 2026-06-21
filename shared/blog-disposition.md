# Blog disposition (60 posts) for Dev + Operations

The old site has 60 blog posts (post-sitemap.xml, retrieved 2026-06-20). The new build has only a `/blog/` hub, no post routes, so every post URL below currently 404s on launch. Each post is either KEEP (Dev rebuilds it at the same URL; preserve ranking content, bring titles/body to `standards.md`) or 301 (redirect to a target; implement in `next.config.ts` per `redirect-map.md`). No post URL may simply disappear.

All URLs are under `https://techrig.org/` with a trailing slash.

## Priority KEEP (rebuild first; these rank or feed money pages)
Preserve the URL and the on-page intent; refresh content; add the interlink up to the matching money page (1-3 word anchor).
| Post | Why | Interlink up to |
|---|---|---|
| `how-to-get-dot-and-mc-number-a-step-by-step-guide-for-trucking-businesses/` | ~14.4k impressions, biggest latent demand | `/dot-registration/` + `/mc-registration/` |
| `what-is-load-to-truck-ratio/` | Best blog ranking (pos 8.9) | `/services/` |
| `freight-broker-vs-dispatcher/` | Ranking ops feeder | `/services/` |
| `how-to-find-a-dispatcher-for-a-box-truck/` | Ranking, franchise feeder | `/box-truck-dispatch/` |
| `navigating-the-road-10-common-challenges-in-trucking-dispatch/` | Named winner (migration-plan); retitle to drop "navigating" on refresh | `/services/` |

## KEEP, pivot-aligned compliance education (rebuild + interlink up)
| Post | Interlink up to |
|---|---|
| `what-is-ifta-in-trucking/` | `/ifta-registration/` |
| `what-is-eld-in-trucking/` | `/eld-services/` |
| `what-is-csa-in-trucking/` | `/fmcsa-clearinghouse-registration/` |
| `what-is-a-dac-report/` | `/driver-qualification-files/` |
| `what-is-factoring-in-trucking/` | `/services/` (factoring partners) |
| `do-you-need-a-cdl-for-a-box-truck/` | `/how-to-start-a-box-truck-business/` + `/box-truck-dispatch/` |
| `what-happens-when-you-get-a-dot-violation/` | `/compliance-services/` |
| `what-are-the-new-dot-hours-of-service-rules/` | `/eld-services/` |
| `what-is-a-34-hour-reset-for-truck-drivers/` | `/eld-services/` |
| `what-is-personal-conveyance-in-trucking/` | `/eld-services/` |

## KEEP, dispatch/ops + insurance + evergreen (rebuild at same URL, refresh to standards)
Interlink to the nearest hub where natural.
`how-to-make-money-with-a-box-truck/` (→ box-truck) · `how-to-get-loads-for-box-truck/` (→ box-truck) · `how-much-is-commercial-insurance-for-a-box-truck/` (→ box-truck) · `how-much-is-commercial-insurance-for-hot-shot-trucking/` (→ hot-shot) · `step-by-step-guide-to-outsourcing-your-dispatch/` (→ services) · `dispatching-power-only-carriers-should-you-accept-power-only-clients/` (→ power-only) · `reefer-trucking-a-guide-to-refrigerated-transportation/` (→ reefers) · `what-does-otr-mean-in-trucking/` · `what-is-less-than-truckload-ltl-shipping/` · `average-fuel-mileage-for-semi-trucks/` · `truck-driver-safety-tips/` · `what-is-the-best-gps-app-for-commercial-truck-drivers/` · `what-is-fleet-optimization-a-complete-guide/` · `how-to-manage-a-fleet-of-trucks/` · `how-to-improve-delivery-efficiency/` · `what-is-the-last-mile-problem/` · `how-automation-transforms-the-trucking-industry/` · `how-tech-boosts-road-safety/` · `eta-etd-what-is-the-difference-between-two/` · `what-does-out-for-delivery-mean-how-long-does-it-take/` · `digitization-in-the-transportation-industry/` · `decarbonizing-long-haul-trucking-what-it-means-for-dispatchers-and-drivers/` · `overcoming-bad-dispatch-experiences-how-were-different/` (→ services).

## KEEP but DATED (rebuild; refresh the year or let age gracefully)
`trucking-industry-forecast-what-to-expect-in-2025/` · `the-state-of-the-trucking-industry-in-2025-challenges-opportunities-and-the-role-of-tech-rig-dispatch/` (→ services) · `dry-van-report-headwinds-persist-for-truckload-carriers/` (→ dry-van) · `reefer-report-mats-the-worlds-largest-and-longest-running-heavy-duty-trucking-show/` (→ reefers).

## 301 / PRUNE (hype-title listicles, violate standards.md banned words)
Do not rebuild. Salvage any genuinely useful content into the target page, then 301 the URL.
| Post | 301 target |
|---|---|
| `mastering-truck-maintenance-and-dispatch-the-ultimate-guide-for-fleet-success/` | `/services/` |
| `mastering-customer-service-in-dispatching-a-truck-owners-guide-to-success/` | `/services/` |
| `mastering-the-paper-trail-a-truckers-guide-to-administrative-excellence/` | `/services/` |
| `mastering-the-art-of-load-scouting-12-techniques-to-dominate-the-trucking-game/` | `/services/` |
| `master-the-art-of-freight-rate-negotiation-12-insider-strategies-for-truckers/` | `/services/` |
| `revolutionize-your-trucking-business-the-power-of-route-planning/` | `/services/` |
| `revolutionize-your-trucking-business-7-game-changing-benefits-of-dispatch-services/` | `/services/` |
| `revolutionizing-dispatch-how-technology-is-transforming-the-industry/` | `/services/` |
| `the-ultimate-guide-to-truck-dispatch-services-boosting-efficiency-on-the-road/` | `/services/` |
| `navigating-the-dispatch-maze-your-guide-to-choosing-the-perfect-service/` | `/services/` |
| `unleashing-profit-potential-the-ultimate-guide-to-maximizing-earnings-with-dispatch-services/` | `/services/` |
| `dispatchers-vs-brokers-navigating-the-trucking-industrys-key-players/` | `/freight-broker-vs-dispatcher/` |
| `navigating-the-compliance-maze-a-truck-owners-survival-guide/` | `/compliance-services/` |
| `revolutionize-your-trucking-business-with-flatbed-dispatch-services/` | `/flatbed-dispatch/` |
| `revolutionize-your-box-truck-business-with-expert-dispatch-services/` | `/box-truck-dispatch/` |
| `power-only-dispatch-revolutionizing-trucking-efficiency/` | `/power-only-trucking/` |
| `maximizing-profits-the-ultimate-guide-to-dry-van-dispatch-services/` | `/dry-van-trucking/` |
| `mastering-the-cold-chain-the-ultimate-guide-to-reefer-dispatch-services/` | `/reefers-trucking/` |

## Counts
KEEP and rebuild: ~42 posts (5 priority + 10 compliance + ~23 evergreen/ops + 4 dated). 301/prune: 18 posts.

## Notes for Dev
- "Rebuild" means the post URL must resolve to a real page (a `/blog/[slug]/` dynamic route or per-post pages). Content can be the migrated/refreshed existing copy; the Operations Track (`content-writer`) polishes to standards post-launch, but the URLs must exist at launch so the ~42 KEEP posts do not 404 and lose impressions.
- The 5 priority KEEP posts must retain their existing ranking content (title token, H1 intent, body depth), per the PRESERVE rules in `migration-plan.md`.
- The 18 PRUNE redirects go in `next.config.ts` alongside the page redirects in `redirect-map.md`.
