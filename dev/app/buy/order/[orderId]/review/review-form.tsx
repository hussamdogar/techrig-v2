"use client";

import { useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SERVICES, QUICK_BUY_SERVICE_KEYS, computeQuickBuyPricing, type ServiceKey } from "@/lib/services-registry";

/**
 * Upsell checklist + live price preview + signature, for the quick-buy review
 * screen. computeQuickBuyPricing() is a pure function (no server-only import),
 * so it's safe to reuse here for a live preview — the server still recomputes
 * authoritatively on submit (reviewAndSignQuickBuyOrder) and again at charge
 * time (/api/quick-buy-checkout), same "never trust the client for the
 * amount" rule as the rest of this app.
 *
 * UCR's power-unit count is NOT collected here: it's auto-detected from the
 * FMCSA/MOTUS lookup at the confirm step (or defaults to the 0-2 bracket when
 * a carrier has none on file), so UCR pricing needs no visitor input at all,
 * whether it's the primary service or an upsell added here.
 */
export function ReviewForm({
  action,
  primaryKey,
  powerUnits,
  initialAdditional,
  initialDriverCount,
}: {
  action: (formData: FormData) => void;
  primaryKey: ServiceKey;
  powerUnits: number | null;
  initialAdditional: ServiceKey[];
  initialDriverCount: number | null;
}) {
  const upsellKeys = QUICK_BUY_SERVICE_KEYS.filter((k) => k !== primaryKey);
  const [selected, setSelected] = useState<Set<ServiceKey>>(new Set(initialAdditional));
  const [driverCount, setDriverCount] = useState(initialDriverCount != null ? String(initialDriverCount) : "1");

  const allSelected = useMemo(() => [primaryKey, ...Array.from(selected)], [primaryKey, selected]);
  const needsDriverCount = allSelected.includes("dq-files");

  const pricing = useMemo(
    () =>
      computeQuickBuyPricing(allSelected, {
        powerUnits,
        driverCount: needsDriverCount ? Number(driverCount) || null : null,
      }),
    [allSelected, powerUnits, needsDriverCount, driverCount],
  );

  function toggle(key: ServiceKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <form action={action} className="mt-6 space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">Add another filing?</h2>
        <p className="mt-1 text-sm text-slate">
          Bundle more of your compliance filings into this order: one payment, one confirmation.
        </p>
        <ul className="mt-3 divide-y divide-slate/10 rounded-card border border-slate/15 bg-cloud">
          {upsellKeys.map((key) => {
            const def = SERVICES[key];
            const priceLabel =
              key === "ucr" ? "priced by fleet size" : key === "dq-files" ? `from $${def.standalonePrice}` : `$${def.standalonePrice}`;
            return (
              <li key={key} className="flex items-center justify-between gap-4 px-4 py-3">
                <label className="flex items-center gap-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    name="service"
                    value={key}
                    checked={selected.has(key)}
                    onChange={() => toggle(key)}
                    className="h-4 w-4 rounded border-slate/40"
                  />
                  {def.name}
                </label>
                <span className="font-mono text-sm text-ink">{priceLabel}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {needsDriverCount ? (
        <div>
          <label htmlFor="driver_count" className="text-sm font-medium text-ink">
            Number of drivers
          </label>
          <input
            id="driver_count"
            name="driver_count"
            type="number"
            min={1}
            inputMode="numeric"
            value={driverCount}
            onChange={(e) => setDriverCount(e.target.value)}
            required
            className="mt-1 w-full max-w-xs rounded-card border border-slate/25 bg-paper px-4 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          />
          <p className="mt-1 text-xs text-slate">
            Sets your DQ files price. We&apos;ll follow up to collect each driver&apos;s documentation after purchase.
          </p>
        </div>
      ) : null}

      <div className="rounded-card border border-slate/15 bg-cloud p-5">
        <ul className="divide-y divide-slate/10">
          {pricing.lines.map((l) => (
            <li key={l.key + l.name} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span className="text-ink">
                {l.name}
                {l.note ? <span className="block text-xs text-slate">{l.note}</span> : null}
              </span>
              <span className="font-mono font-medium text-ink">
                {l.amount == null ? (l.manualReview ? "Quote" : "—") : `$${l.amount.toLocaleString("en-US")}`}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-slate/15 pt-3">
          <span className="font-display font-bold text-ink">Total due now</span>
          <span className="font-mono text-lg font-bold text-ink">${pricing.total.toLocaleString("en-US")}</span>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-ink">Sign to confirm</h2>
        <label htmlFor="signature_name" className="mt-3 block text-sm font-medium text-ink">
          Type your full legal name to sign
        </label>
        <input
          id="signature_name"
          name="signature_name"
          type="text"
          required
          placeholder="Full legal name"
          className="mt-1 w-full rounded-card border border-slate/25 bg-paper px-4 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
        />
        <label className="mt-3 flex items-start gap-2 text-sm text-ink">
          <input type="checkbox" name="terms_accepted" required className="mt-0.5 h-4 w-4 rounded border-slate/40" />
          <span>
            I agree to the{" "}
            <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-steel underline-offset-4 hover:underline">
              terms of service
            </a>{" "}
            and authorize this filing.
          </span>
        </label>
      </div>

      <button type="submit" className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full sm:w-auto")}>
        Continue to payment
      </button>
    </form>
  );
}
