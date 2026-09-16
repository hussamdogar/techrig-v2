import { Boc3LandingPage, getBoc3Metadata } from "../_shared/boc3-landing";

/*
 * Original $100 BOC-3 Google Ads landing page. All content, layout, and
 * design live in the shared template (dev/app/lp/_shared/boc3-landing.tsx) —
 * this file only supplies the price, the checkout link, and the service key
 * that /buy/ uses to price the order. See that file's header comment for the
 * full rationale.
 */

export const metadata = getBoc3Metadata(100);

export default function Page() {
  return <Boc3LandingPage amount={100} applyHref="/buy/boc-3/" serviceKey="boc-3" />;
}
