"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { computeQuickBuyPricing, type QuickBuyServiceKey } from "@/lib/services-registry";
import { pricing } from "@/lib/services";

/**
 * Hero "start your order" card (M1, ADR-4/-8; revised R2 for the ask-first
 * flow, owner-approved mockup 2026-08).
 *
 * Two steps, both client-side (no lookup happens here, so no Supabase/Stripe
 * ships with the homepage bundle):
 *  1. Pick what you need. Five of the seven options are quick-buy services
 *     (`QUICK_BUY_SERVICE_KEYS`), so picking one and confirming a USDOT routes
 *     straight into that service's fast, no-account checkout
 *     (`/buy/<service>/<usdot>/`) instead of a generic record page.
 *  2. Confirm a USDOT/MC number for that pick.
 *
 * MOTUS migration and "Something else" have no fast-checkout path yet (they
 * only exist through the account-gated /apply flow), so they fall back to the
 * existing full-record page (`/lookup/{usdot}/`), which already offers
 * "Start an application" from there. Same fallback the single-step card used
 * for every service before this change, so it is not a regression for them,
 * just no longer the default for the five that DO have a fast path.
 */
type Tile = {
  label: string;
  /** Present only for the five services with a real quick-buy fast path. */
  quickBuyKey: QuickBuyServiceKey | null;
  /** Shown on the same line as the label. */
  price: string;
  /** Short line under the label and price. */
  note: string;
};

/** A flat service fee from `pricing` (lib/services.ts), the same source as
 *  each service page's PriceChip, so a tile can't drift from its page. */
function flatPrice(slug: string): string {
  return `$${pricing[slug]?.amount ?? ""}`;
}

/** UCR is shown as the all-in total a 0-2 truck carrier pays (Tech Rig fee +
 *  that bracket's government fee), computed by the same function checkout
 *  charges with, so the tile always equals the real price. */
const UCR_SMALL_FLEET_TOTAL = computeQuickBuyPricing(["ucr"], { powerUnits: 0, driverCount: null }).total;

const TILES: Tile[] = [
  { label: "BOC-3 filing", quickBuyKey: "boc-3", price: flatPrice("/boc-3-filing/"), note: "One-time fee, no annual renewals" },
  { label: "UCR registration", quickBuyKey: "ucr", price: `$${UCR_SMALL_FLEET_TOTAL}`, note: "UCR 2026 (0-2 trucks)" },
  {
    label: "Clearinghouse registration",
    quickBuyKey: "clearinghouse",
    price: flatPrice("/fmcsa-clearinghouse-registration/"),
    note: "FMCSA drug & alcohol records setup",
  },
  {
    label: "Drug & alcohol consortium",
    quickBuyKey: "consortium",
    price: flatPrice("/drug-and-alcohol-consortium/"),
    note: "Enrollment and random testing",
  },
  {
    label: "Driver qualification files",
    quickBuyKey: "dq-files",
    price: flatPrice("/driver-qualification-files/"),
    note: "Per driver, kept audit-ready",
  },
  { label: "Biennial Update", quickBuyKey: null, price: flatPrice("/mcs-150-biennial-update/"), note: "MCS-150 filing, keeps USDOT active" },
  { label: "USDOT Correction", quickBuyKey: null, price: flatPrice("/usdot-correction/"), note: "Fix the details on your USDOT record" },
];

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function UsdotLookupCard() {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Tile | null>(null);
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formatError, setFormatError] = useState(false);
  // Phones only: the services without a quick-buy checkout stay behind a
  // "N more services" row, so the card is not a full screen tall.
  const [showAllOnPhone, setShowAllOnPhone] = useState(false);
  const hiddenOnPhone = TILES.filter((t) => !t.quickBuyKey).length;

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const usdot = value.trim();
    if (!/^\d{1,12}$/.test(usdot)) {
      setFormatError(true);
      inputRef.current?.focus();
      return;
    }
    setFormatError(false);
    setSubmitting(true); // brief loading state until the next route takes over
    router.push(selected.quickBuyKey ? `/buy/${selected.quickBuyKey}/${usdot}/` : `/lookup/${usdot}/`);
  }

  return (
    <div className="rounded-card border border-slate/15 bg-cloud p-5 shadow-card sm:p-6 md:p-7">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">Start your order</p>

      {!selected ? (
        <>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">What do you need?</h2>
          <p className="mt-2 text-sm text-slate">
            Pick a service and we&apos;ll confirm your USDOT or MC number next.
          </p>
          {/* Phones: one compact list (thin dividers, name and price only, the
              notes hidden) showing the quick-buy services, with the rest behind
              a "more services" row. From sm: the two-column tiles with notes
              and every service. Same buttons, restyled per breakpoint. */}
          <div className="mt-4 divide-y divide-slate/15 overflow-hidden rounded-btn border-[1.5px] border-slate/25 bg-paper sm:mt-5 sm:grid sm:grid-cols-2 sm:gap-2 sm:divide-y-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent">
            {TILES.map((tile, i) => (
              <button
                key={tile.label}
                type="button"
                onClick={() => setSelected(tile)}
                className={cn(
                  "block w-full px-3 py-3 text-left text-sm font-medium text-ink transition-colors hover:bg-steel/[0.06] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steel sm:rounded-btn sm:border-[1.5px] sm:border-slate/25 sm:bg-paper sm:py-2.5 sm:hover:border-steel sm:focus-visible:outline-offset-2",
                  !tile.quickBuyKey && !showAllOnPhone && "hidden sm:block",
                  // Odd tile count: in the two-column layout, span the trailing,
                  // otherwise-lonely tile full width instead of leaving an
                  // empty cell beside it.
                  i === TILES.length - 1 && TILES.length % 2 === 1 && "sm:col-span-2",
                )}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span>{tile.label}</span>
                  <span className="shrink-0 font-mono tabular-nums text-ink">{tile.price}</span>
                </span>
                <span className="mt-0.5 hidden text-xs font-normal text-slate sm:block">{tile.note}</span>
              </button>
            ))}
            {/* Last row of the phone list (so the dividers stay clean). */}
            <button
              type="button"
              onClick={() => setShowAllOnPhone((v) => !v)}
              aria-expanded={showAllOnPhone}
              className="block min-h-11 w-full px-3 py-2.5 text-left text-sm font-medium text-steel outline-none hover:bg-steel/[0.06] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steel sm:hidden"
            >
              {showAllOnPhone ? "Show fewer services" : `${hiddenOnPhone} more services`}
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setFormatError(false);
            }}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-steel outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            &larr; Change service
          </button>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">Confirm your carrier</h2>
          <span className="mt-2 inline-flex items-center rounded-chip bg-steel/10 px-2.5 py-1 text-sm font-semibold text-steel">
            {selected.label}
          </span>

          <form onSubmit={onSubmit} className="mt-4" noValidate>
            <label htmlFor={inputId} className="text-sm font-medium text-ink">
              USDOT or MC number
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id={inputId}
                ref={inputRef}
                inputMode="numeric"
                autoComplete="off"
                autoFocus
                placeholder="e.g. 3214567"
                value={value}
                disabled={submitting}
                aria-invalid={formatError}
                aria-describedby={formatError ? `${inputId}-err` : undefined}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (formatError) setFormatError(false);
                }}
                className="w-full rounded-btn border border-slate/25 bg-paper px-3 py-2.5 text-ink outline-none placeholder:text-slate/60 focus-visible:border-steel focus-visible:ring-2 focus-visible:ring-steel/40"
              />
              <button
                type="submit"
                disabled={submitting}
                className={cn(buttonVariants({ variant: "primary", size: "md" }), "shrink-0 disabled:opacity-70")}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Continuing
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
            {formatError ? (
              <p id={`${inputId}-err`} className="mt-2 text-sm text-ink">
                Enter a USDOT or MC number using digits only.
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate">
                We&apos;ll pull your record and take you straight to the next step for {selected.label}.
              </p>
            )}
          </form>
        </>
      )}

      <div className="mt-5 space-y-1.5 border-t border-slate/10 pt-4 text-sm">
        <p>
          <Link
            href="/apply/?service=usdot"
            className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            Don&apos;t have a USDOT number? File for one now
          </Link>
        </p>
        <p className="text-slate">
          Questions?{" "}
          <Link
            href="/contact-us/"
            className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
