"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CarrierData } from "@/lib/lookup/types";

/**
 * Hero USDOT lookup card (Application Platform M1, ADR-4/-8).
 *
 * A small client island embedded in the homepage hero so the page stays
 * prerendered and fast (it ships no Supabase/Stripe). It POSTs to
 * /api/lookup-usdot, which runs the dual-provider lookup and captures a lead.
 * Built with the locked design system (paper/cloud/ink/slate/steel/signal). All
 * copy is the work order's verbatim brand copy. A missing field renders
 * "Not on file" (muted), never a fabricated value (standards.md).
 */

type UiState = "idle" | "loading" | "success" | "not_found" | "error";

// The eight result-panel rows, in order, with their accessor + label.
const RESULT_ROWS: { label: string; get: (c: CarrierData) => string | number | null }[] = [
  { label: "Legal name", get: (c) => c.legalName },
  { label: "USDOT #", get: (c) => c.usdotNumber },
  { label: "MC #", get: (c) => c.mcNumber },
  { label: "Entity type", get: (c) => c.entityType },
  { label: "Authority status", get: (c) => c.authorityStatus },
  { label: "Safety rating", get: (c) => c.safetyRating },
  { label: "Insurance on file", get: (c) => c.insuranceOnFile },
  { label: "Power units", get: (c) => c.powerUnits },
];

// Authority status -> chip tone. Positive when active/authorized; warning when
// not authorized / out of service / inactive; neutral otherwise.
function statusTone(status: string | null): "positive" | "warning" | "neutral" {
  if (!status) return "neutral";
  const s = status.toLowerCase();
  if (s.includes("not ") || s.includes("out of service") || s.includes("inactive") || s.includes("revoked")) {
    return "warning";
  }
  if (s.includes("active") || s.includes("authorized")) return "positive";
  return "neutral";
}

function StatusChip({ status }: { status: string | null }) {
  if (!status) return <span className="text-slate">Not on file</span>;
  const tone = statusTone(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-chip px-2 py-0.5 text-xs font-semibold",
        tone === "positive" && "bg-status-active/12 text-status-active",
        tone === "warning" && "bg-signal/15 text-ink",
        tone === "neutral" && "bg-slate/12 text-slate",
      )}
    >
      {status}
    </span>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function UsdotLookupCard() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [state, setState] = useState<UiState>("idle");
  const [carrier, setCarrier] = useState<CarrierData | null>(null);
  const [formatError, setFormatError] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const usdot = value.trim();
    if (!/^\d{1,12}$/.test(usdot)) {
      setFormatError(true);
      inputRef.current?.focus();
      return;
    }
    setFormatError(false);
    setState("loading");
    try {
      // Trailing slash matches the app's trailingSlash:true config (avoids a 308 hop).
      const res = await fetch("/api/lookup-usdot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usdotNumber: usdot }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success" && data.carrier) {
        setCarrier(data.carrier);
        setState("success");
      } else if (data.status === "not_found") {
        setState("not_found");
      } else {
        // manual_required / error / rate-limited all surface as the error state
        // (M1 has no manual-entry form yet; that arrives with the apply engine).
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  function reset() {
    setCarrier(null);
    setState("idle");
    setValue("");
    setFormatError(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const loading = state === "loading";

  return (
    <div className="rounded-card border border-slate/15 bg-cloud p-6 shadow-card md:p-7">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
        Quick lookup
      </p>
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
            disabled={loading}
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
            disabled={loading}
            className={cn(buttonVariants({ variant: "primary", size: "md" }), "shrink-0 disabled:opacity-70")}
          >
            {loading ? (
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

      {/* Result / not-found / error region. aria-live so screen readers hear the
          outcome; min-height reserved on the card avoids layout shift (CLS). */}
      <div aria-live="polite" className="mt-5">
        {state === "success" && carrier ? (
          <div className="rounded-card border border-slate/15 bg-paper p-4">
            <dl className="divide-y divide-slate/10">
              {RESULT_ROWS.map(({ label, get }) => {
                const raw = get(carrier);
                const isAuthority = label === "Authority status";
                const empty = raw === null || raw === undefined || raw === "";
                return (
                  <div key={label} className="flex items-center justify-between gap-4 py-2">
                    <dt className="text-sm text-slate">{label}</dt>
                    <dd className="text-right text-sm font-medium text-ink">
                      {isAuthority ? (
                        <StatusChip status={carrier.authorityStatus} />
                      ) : empty ? (
                        <span className="text-slate">Not on file</span>
                      ) : (
                        raw
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <button
              type="button"
              onClick={reset}
              className="mt-4 font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Look up another
            </button>
          </div>
        ) : state === "not_found" ? (
          <p className="rounded-card border border-slate/15 bg-paper p-4 text-sm text-ink">
            We couldn&apos;t find a carrier with that USDOT number. Check the number, or file for a new USDOT.
          </p>
        ) : state === "error" ? (
          <p className="rounded-card border border-slate/15 bg-paper p-4 text-sm text-ink">
            Lookup is temporarily unavailable. Try again in a moment, or contact us.
          </p>
        ) : null}
      </div>

      <div className="mt-5 space-y-1.5 border-t border-slate/10 pt-4 text-sm">
        <p>
          <Link
            href="/dot-registration/"
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
