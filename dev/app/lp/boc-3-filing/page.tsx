import { SERVICES } from "@/lib/services-registry";
import { Boc3LandingPage, getBoc3Metadata } from "../_shared/boc3-landing";

/*
 * Main BOC-3 Google Ads landing page. All content, layout, and design live in
 * the shared template (dev/app/lp/_shared/boc3-landing.tsx) — this file only
 * supplies the price, the checkout link, and the service key that /buy/ uses
 * to price the order. The price is read from the registry (the same number
 * /buy/ charges), never typed here, so the page and checkout can't drift.
 *
 * Owner decision (2026-10-05): BOC-3 went back to $100 site-wide, but the
 * landing pages stay at $30, so this page sells through the `boc-3-b`
 * landing-page lane (shared with /lp/filing-boc3/) instead of `boc-3`.
 * See the shared template's header comment for the full rationale.
 */

const amount = SERVICES["boc-3-b"].standalonePrice!;

export const metadata = getBoc3Metadata(amount);

export default function Page() {
  return <Boc3LandingPage amount={amount} applyHref="/buy/boc-3-b/" serviceKey="boc-3-b" />;
}
