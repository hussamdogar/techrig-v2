import type { BundleBreakdown } from "@/lib/services-registry";
import { cn } from "@/lib/utils";

/**
 * The bundle receipt (design spec §DZ3, component C: Split-Ledger Fee Receipt /
 * Pre-Filing Manifest pattern). Fully derived from `getBundleBreakdown` — no
 * number here is typed twice. Chain: in-bundle itemized total -> rounding
 * adjustment (sign never assumed) -> package price -> standalone value ->
 * net saving + discount %, so the two "discounts" (in-bundle vs net) reconcile
 * visibly instead of reading as a contradiction.
 */
export function BundleReceipt({ breakdown, className }: { breakdown: BundleBreakdown; className?: string }) {
  const sign = breakdown.roundingAdjustment >= 0 ? "+" : "−";
  const roundingAbs = Math.abs(breakdown.roundingAdjustment);
  return (
    <div className={cn("rounded-card border border-slate/15 bg-cloud p-4 font-mono text-sm tabular-nums", className)}>
      <Row label="In-bundle services" value={money(breakdown.itemizedTotal)} />
      <Row label="Rounding adjustment" value={`${sign}$${roundingAbs}`} />
      <div className="my-2.5 border-t border-slate/20" />
      <Row label="Package price" value={money(breakdown.finalPrice)} emphasize />
      <div className="mt-3.5" />
      <Row label="Standalone value" value={money(breakdown.standaloneValue)} />
      <Row
        label="You save"
        value={`${money(breakdown.savings)} (${breakdown.discountPercent.toFixed(1)}%)`}
        emphasize
      />
    </div>
  );
}

function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

function Row({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-0.5">
      <span className="text-xs text-slate">{label}</span>
      <span className={cn("text-right", emphasize ? "font-semibold text-ink" : "text-ink")}>{value}</span>
    </div>
  );
}
