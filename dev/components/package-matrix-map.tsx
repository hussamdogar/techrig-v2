import Link from "next/link";
import { BUNDLES, getBundleBreakdown } from "@/lib/services-registry";

/**
 * The hero 2x2 matrix map (design spec §DZ3, component D, hero rendering):
 * authority status x vehicle type, each cell naming its bundle and final price
 * (derived) and linking to that card. Pure server-rendered links, no JS needed.
 */
export function PackageMatrixMap() {
  const rows: { label: string; forExistingCarrier: boolean }[] = [
    { label: "Already running", forExistingCarrier: true },
    { label: "New authority", forExistingCarrier: false },
  ];
  const cols: { label: string; vehicleClass: "non-cdl" | "cdl-heavy" }[] = [
    { label: "Non-CDL vehicle", vehicleClass: "non-cdl" },
    { label: "CDL / heavy vehicle", vehicleClass: "cdl-heavy" },
  ];
  const bundles = Object.values(BUNDLES);

  return (
    <div className="rounded-card border border-slate/15 bg-cloud p-4 shadow-card">
      <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-xs">
        <div />
        {cols.map((c) => (
          <p key={c.label} className="px-2 py-1 text-center font-mono font-medium uppercase tracking-[0.06em] text-slate">
            {c.label}
          </p>
        ))}
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <p className="flex items-center px-2 font-mono font-medium uppercase tracking-[0.06em] text-slate">
              {row.label}
            </p>
            {cols.map((col) => {
              const bundle = bundles.find(
                (b) => b.forExistingCarrier === row.forExistingCarrier && b.vehicleClass === col.vehicleClass,
              );
              if (!bundle) return <div key={col.label} />;
              const price = getBundleBreakdown(bundle.key).finalPrice;
              return (
                <Link
                  key={col.label}
                  href={`#package-${bundle.key}`}
                  className="flex flex-col items-center justify-center gap-1 rounded-card border border-slate/15 p-3 text-center outline-none hover:border-steel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                >
                  <span className="font-display text-sm font-semibold leading-tight text-ink">{bundle.name}</span>
                  <span className="font-mono text-lg font-bold tabular-nums text-ink">
                    ${price.toLocaleString("en-US")}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
