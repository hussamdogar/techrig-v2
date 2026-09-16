import { Boc3LandingPage, getBoc3Metadata } from "../_shared/boc3-landing";

/*
 * $70 price-test variant of /lp/boc-3-filing/ (owner-directed pricing
 * experiment, 2026-09-14). All content, layout, and design live in the
 * shared template (dev/app/lp/_shared/boc3-landing.tsx) — this file only
 * supplies the price, the checkout link, and the service key (`boc-3-b`,
 * see lib/services-registry.ts) that /buy/ uses to price the order and keep
 * this variant's orders, upsell eligibility, and GA4 events separate from
 * the $100 original. See the shared template's header comment for the full
 * rationale.
 */

export const metadata = getBoc3Metadata(70);

export default function Page() {
  return <Boc3LandingPage amount={70} applyHref="/buy/boc-3-b/" serviceKey="boc-3-b" />;
}
