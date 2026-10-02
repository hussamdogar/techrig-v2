import { SERVICES } from "@/lib/services-registry";
import { Boc3LandingPage, getBoc3Metadata } from "../_shared/boc3-landing";

/*
 * $70 price-test variant of /lp/boc-3-filing/ (owner-directed pricing
 * experiment, 2026-09-14; no longer used for Google Ads as of 2026-09-28,
 * when the main page moved to $30). All content, layout, and design live in
 * the shared template (dev/app/lp/_shared/boc3-landing.tsx) — this file only
 * supplies the price (read from the registry, the same number /buy/ charges)
 * and the service key (`boc-3-b`, see
 * lib/services-registry.ts) that /buy/ uses to price the order and keep this
 * variant's orders, upsell eligibility, and GA4 events separate from the
 * main page. See the shared template's header comment for the full rationale.
 */

const amount = SERVICES["boc-3-b"].standalonePrice!;

export const metadata = getBoc3Metadata(amount);

export default function Page() {
  return <Boc3LandingPage amount={amount} serviceKey="boc-3-b" />;
}
