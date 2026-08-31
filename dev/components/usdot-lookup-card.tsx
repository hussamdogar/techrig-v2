"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type QuickBuyServiceKey } from "@/lib/services-registry";

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
};

const TILES: Tile[] = [
  { label: "BOC-3 filing", quickBuyKey: "boc-3" },
  { label: "UCR registration", quickBuyKey: "ucr" },
  { label: "Clearinghouse registration", quickBuyKey: "clearinghouse" },
  { label: "Drug & alcohol consortium", quickBuyKey: "consortium" },
  { label: "Driver qualification files", quickBuyKey: "dq-files" },
  { label: "Biennial Update", quickBuyKey: null },
  { label: "USDOT Correction", quickBuyKey: null },
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
    <div className="rounded-card border border-slate/15 bg-cloud p-6 shadow-card md:p-7">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">Start your order</p>

      {!selected ? (
        <>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink">What do you need?</h2>
          <p className="mt-2 text-sm text-slate">
            Pick a service and we&apos;ll confirm your USDOT or MC number next.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {TILES.map((tile, i) => (
              <button
                key={tile.label}
                type="button"
                onClick={() => setSelected(tile)}
                className={cn(
                  "rounded-btn border-[1.5px] border-slate/25 bg-paper px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:border-steel hover:bg-steel/[0.06] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel",
                  // Odd tile count: span the trailing, otherwise-lonely tile full
                  // width instead of leaving an empty cell beside it.
                  i === TILES.length - 1 && TILES.length % 2 === 1 && "col-span-2",
                )}
              >
                {tile.label}
              </button>
            ))}
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
