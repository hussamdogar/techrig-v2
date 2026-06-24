"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Hero USDOT lookup card (M1, ADR-4/-8; revised R1).
 *
 * A lightweight client island in the homepage hero. The Search button now
 * NAVIGATES to the dedicated results page `/lookup/{usdot}/` (the result /
 * not-found / error states render there, not inline). The card only validates
 * the format client-side and routes. Built with the locked design system; the
 * homepage stays prerendered and ships no Supabase/Stripe.
 */
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
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formatError, setFormatError] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const usdot = value.trim();
    if (!/^\d{1,12}$/.test(usdot)) {
      setFormatError(true);
      inputRef.current?.focus();
      return;
    }
    setFormatError(false);
    setSubmitting(true); // brief loading state until the results route takes over
    router.push(`/lookup/${usdot}/`);
  }

  return (
    <div className="rounded-card border border-slate/15 bg-cloud p-6 shadow-card md:p-7">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">Quick lookup</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-ink">Look up a USDOT number</h2>

      <form onSubmit={onSubmit} className="mt-5" noValidate>
        <label htmlFor={inputId} className="sr-only">
          USDOT number
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            ref={inputRef}
            inputMode="numeric"
            autoComplete="off"
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
                <Spinner /> Searching
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>
        {formatError ? (
          <p id={`${inputId}-err`} className="mt-2 text-sm text-ink">
            Enter a USDOT number using digits only.
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate">
            Pull live FMCSA records: safety rating, authority status, and insurance on file.
          </p>
        )}
      </form>

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
