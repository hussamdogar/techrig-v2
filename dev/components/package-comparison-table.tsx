import { BUNDLES, getBundleBreakdown, type BundleKey, type ServiceKey } from "@/lib/services-registry";
import { CheckSealIcon } from "@/components/icons";

// The §4 comparison-table row order and labels, verbatim from
// shared/page-briefs/compliance-packages.md. Inclusion (✓/—) per row is
// DERIVED from each bundle's `includes` list, never hardcoded per cell.
const ROWS: { key: ServiceKey | "ucr-gov-fee"; label: string }[] = [
  { key: "mc-authority", label: "MC Authority + USDOT" },
  { key: "boc-3", label: "BOC-3 filing or verification" },
  { key: "ucr", label: "UCR filing service" },
  { key: "ucr-gov-fee", label: "UCR government fee (0-2)" },
  { key: "dq-files", label: "Driver Qualification file" },
  { key: "clearinghouse", label: "Clearinghouse setup" },
  { key: "consortium", label: "Consortium enrollment" },
  { key: "drug-test", label: "Pre-employment drug test" },
  { key: "irp", label: "IRP setup" },
  { key: "ifta", label: "IFTA setup" },
];

const BUNDLE_ORDER: BundleKey[] = [
  "compliance-continuation-non-cdl",
  "compliance-continuation-cdl-heavy",
  "authority-launch-non-cdl",
  "authority-launch-cdl-heavy",
];

/**
 * The side-by-side package comparison (design spec §DZ3, component E, brief §4).
 * Sticky first column + its own horizontal scroll container so the page body
 * never scrolls sideways. Every figure derived from `getBundleBreakdown`.
 */
export function PackageComparisonTable() {
  const bundles = BUNDLE_ORDER.map((k) => ({ def: BUNDLES[k], breakdown: getBundleBreakdown(k) }));

  return (
    <div className="overflow-x-auto rounded-card border border-slate/15">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate/15 bg-cloud">
            <th className="sticky left-0 z-10 bg-cloud px-4 py-3 text-left font-display text-sm font-semibold text-ink">
              Included service
            </th>
            {bundles.map(({ def }) => (
              <th key={def.key} className="px-4 py-3 text-left font-display text-sm font-semibold text-ink">
                {def.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="border-b border-slate/10">
              <td className="sticky left-0 z-10 bg-paper px-4 py-3 text-ink">{row.label}</td>
              {bundles.map(({ def, breakdown }) => {
                const included = breakdown.lines.some((l) => l.key === row.key);
                return (
                  <td key={def.key} className="px-4 py-3">
                    {included ? (
                      <span className="inline-flex items-center gap-1.5 text-status-active">
                        <CheckSealIcon size={16} />
                        <span className="sr-only">Included</span>
                      </span>
                    ) : (
                      <span aria-hidden className="text-slate">
                        —<span className="sr-only">Not included</span>
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="border-b border-slate/10">
            <td className="sticky left-0 z-10 bg-paper px-4 py-3 font-medium text-ink">Standalone value</td>
            {bundles.map(({ def, breakdown }) => (
              <td key={def.key} className="px-4 py-3 font-mono tabular-nums text-ink">
                ${breakdown.standaloneValue.toLocaleString("en-US")}
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate/10">
            <td className="sticky left-0 z-10 bg-paper px-4 py-3 font-semibold text-ink">Final package price</td>
            {bundles.map(({ def, breakdown }) => (
              <td key={def.key} className="px-4 py-3 font-mono text-base font-bold tabular-nums text-ink">
                ${breakdown.finalPrice.toLocaleString("en-US")}
              </td>
            ))}
          </tr>
          <tr>
            <td className="sticky left-0 z-10 bg-paper px-4 py-3 font-medium text-ink">Customer savings</td>
            {bundles.map(({ def, breakdown }) => (
              <td key={def.key} className="px-4 py-3 font-mono tabular-nums text-ink">
                ${breakdown.savings.toLocaleString("en-US")}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
