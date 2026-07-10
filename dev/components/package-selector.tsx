"use client";

import { useState } from "react";
import Link from "next/link";
import { BUNDLES, getBundleBreakdown, type BundleKey } from "@/lib/services-registry";
import { cn } from "@/lib/utils";

type Authority = "existing" | "new";
type Vehicle = "non-cdl" | "cdl-heavy";

function matchBundle(authority: Authority, vehicle: Vehicle): BundleKey {
  const forExistingCarrier = authority === "existing";
  const match = Object.values(BUNDLES).find((b) => b.forExistingCarrier === forExistingCarrier && b.vehicleClass === vehicle);
  // Every (authority, vehicle) pair maps to exactly one of the four fixed bundles.
  return match!.key;
}

/**
 * The CDL/non-CDL selector (design spec §DZ3, component D, section-3 rendering):
 * two labelled segmented controls resolving to exactly one of the four bundles.
 * Progressive enhancement only: the four cards below are always server-rendered
 * and reachable, this control just highlights + links to the match.
 */
export function PackageSelector() {
  const [authority, setAuthority] = useState<Authority | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const matchedKey = authority && vehicle ? matchBundle(authority, vehicle) : null;
  const matched = matchedKey ? BUNDLES[matchedKey] : null;
  const matchedPrice = matchedKey ? getBundleBreakdown(matchedKey).finalPrice : null;

  return (
    <div className="rounded-card border border-slate/15 bg-cloud p-5">
      <SegmentedControl
        label="Your authority status"
        value={authority}
        onChange={setAuthority}
        options={[
          { value: "existing", label: "Already running" },
          { value: "new", label: "New authority" },
        ]}
      />
      <div className="mt-4">
        <SegmentedControl
          label="Your vehicle"
          value={vehicle}
          onChange={setVehicle}
          options={[
            { value: "non-cdl", label: "Non-CDL vehicle" },
            { value: "cdl-heavy", label: "CDL / heavy vehicle" },
          ]}
        />
      </div>

      <div className="mt-5 min-h-[3.5rem] border-t border-slate/15 pt-4" aria-live="polite">
        {matched && matchedPrice != null ? (
          <p className="text-sm text-ink">
            Your package:{" "}
            <Link
              href={`#package-${matched.key}`}
              className="font-semibold text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              {matched.name} — ${matchedPrice.toLocaleString("en-US")} ↓
            </Link>
          </p>
        ) : (
          <p className="text-sm text-slate">Choose both to see your matching package.</p>
        )}
      </div>
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T | null;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-slate">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={cn(
                "min-h-11 rounded-btn border-[1.5px] px-4 text-sm font-medium outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel",
                selected ? "border-steel bg-steel text-cloud" : "border-slate/30 text-ink hover:border-steel",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
