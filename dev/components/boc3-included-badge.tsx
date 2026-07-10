import { StampIcon } from "@/components/icons";

/**
 * The BOC-3 Included badge (design spec §DZ3, component B). Rectangular chip,
 * distinct from the pill-shaped Authority Status Tracker tags. Not amber:
 * colour is not the sole carrier, the icon + the word "Included" are.
 */
export function Boc3IncludedBadge({ longForm }: { longForm?: boolean }) {
  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-chip border border-steel px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-steel">
        <StampIcon size={14} />
        BOC-3 Included
      </span>
      {longForm ? (
        <p className="mt-1.5 text-xs text-slate">
          Includes BOC-3 filing when required or verification that the carrier&apos;s existing BOC-3 is correctly on
          file.
        </p>
      ) : null}
    </div>
  );
}
