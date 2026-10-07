import { SERVICES } from "@/lib/services-registry";
import { Boc3LandingPage, getBoc3Metadata } from "../_shared/boc3-landing";

/*
 * Main BOC-3 Google Ads landing page. All content, layout, and design live in
 * the shared template (dev/app/lp/_shared/boc3-landing.tsx) — this file only
 * supplies the price and the service key that /buy/ uses to price the
 * order. The price is read from the registry (the same number
 * /buy/ charges), never typed here, so the page and checkout can't drift.
 *
 * Sells through the `boc-3-b` landing-page lane (shared with
 * /lp/filing-boc3/) instead of `boc-3`, so the ad pages can be priced on
 * their own. Since 2026-10-07 both lanes are $45 (owner decision).
 * See the shared template's header comment for the full rationale.
 */

const amount = SERVICES["boc-3-b"].standalonePrice!;

export const metadata = getBoc3Metadata(amount);

export default function Page() {
  return <Boc3LandingPage amount={amount} serviceKey="boc-3-b" />;
}
