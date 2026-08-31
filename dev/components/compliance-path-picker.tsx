"use client";

import { useState } from "react";
import Link from "next/link";
import { getBundleBreakdown } from "@/lib/services-registry";

/**
 * Homepage "which describes you" fork (replaces the single beginner-only
 * order-of-operations block, owner-directed 2026-08). Three paths instead of
 * one generic sequence, because not every visitor is starting from zero:
 *
 * 1. Total beginner: no USDOT yet. A required 4-step SEQUENCE (each step gates
 *    the next), plus a CDL-only checklist below it for drivers that need it.
 * 2. Already has USDOT + MC, non-CDL vehicle: an unordered CHECKLIST of what's
 *    typically still missing, not a sequence.
 * 3. Already has USDOT + MC, CDL/heavy vehicle: the longer version of #2.
 *
 * Paths 2 and 3 map almost exactly to the two existing "Compliance
 * Continuation" bundles (services-registry.ts BUNDLES), so each ends with a
 * real, derived bundle price as a callout, alongside links straight to each
 * item's own quick-buy entry for a visitor who only needs one thing.
 *
 * Several services (BOC-3, UCR, driver qualification files, Clearinghouse,
 * consortium) appear in more than one path, so their one-line "what this is"
 * descriptions live once in SERVICE_BLURBS and are reused everywhere, rather
 * than retyped per path (single source, can't drift between paths).
 */
type PathKey = "beginner" | "non-cdl" | "cdl";

const TABS: { key: PathKey; label: string }[] = [
  { key: "beginner", label: "Just starting out" },
  { key: "non-cdl", label: "Already have USDOT & MC — non-CDL" },
  { key: "cdl", label: "Already have USDOT & MC — CDL / heavy" },
];

type ServiceKey = "usdot" | "mc-authority" | "boc-3" | "ucr" | "dq-files" | "clearinghouse" | "consortium" | "irp" | "ifta";

const SERVICE_BLURBS: Record<ServiceKey, { title: string; href: string; description: string }> = {
  usdot: {
    title: "USDOT number",
    href: "/dot-registration/",
    description: "Your federal carrier ID. Every commercial truck needs one before it can legally operate.",
  },
  "mc-authority": {
    title: "MC authority",
    href: "/mc-registration/",
    description: "Your legal permission to haul freight for other people, for pay, across state lines.",
  },
  "boc-3": {
    title: "BOC-3 filing",
    href: "/boc-3-filing/",
    description: "Names someone in every state who can accept legal paperwork for you.",
  },
  ucr: {
    title: "UCR registration",
    href: "/ucr-registration/",
    description: "The annual registration almost every carrier must renew.",
  },
  "dq-files": {
    title: "Driver qualification files",
    href: "/driver-qualification-files/",
    description: "The paperwork FMCSA requires on file for every driver you run.",
  },
  clearinghouse: {
    title: "Clearinghouse registration",
    href: "/fmcsa-clearinghouse-registration/",
    description: "The federal drug and alcohol violation database CDL carriers must check.",
  },
  consortium: {
    title: "Drug & alcohol consortium",
    href: "/drug-and-alcohol-consortium/",
    description: "The required random drug and alcohol testing pool for your CDL drivers.",
  },
  irp: {
    title: "IRP registration",
    href: "/irp-registration/",
    description: "Apportioned plates so you can run legally in multiple states.",
  },
  ifta: {
    title: "IFTA registration",
    href: "/ifta-registration/",
    description: "Fuel-tax registration for running across state lines.",
  },
};

// The quick-buy-eligible services get a purchase-ready link (/buy/<service>/)
// on paths 2/3, where the visitor already has USDOT + MC and is acting on a
// known need. Path 1 (still deciding, hasn't got a USDOT yet) always links to
// the marketing page instead, via BLURB_HREF override below.
const QUICK_BUY_HREF: Partial<Record<ServiceKey, string>> = {
  "boc-3": "/buy/boc-3/",
  ucr: "/buy/ucr/",
  "dq-files": "/buy/dq-files/",
  clearinghouse: "/buy/clearinghouse/",
  consortium: "/buy/consortium/",
};

function CrossLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
    >
      {children}
    </Link>
  );
}

function ChecklistItem({ service, quickBuy }: { service: ServiceKey; quickBuy?: boolean }) {
  const s = SERVICE_BLURBS[service];
  const href = quickBuy ? QUICK_BUY_HREF[service] ?? s.href : s.href;
  return (
    <li className="flex items-start gap-3 text-ink">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-steel" aria-hidden="true" />
      <div>
        <CrossLink href={href}>{s.title}</CrossLink>
        <p className="mt-0.5 text-sm text-slate">{s.description}</p>
      </div>
    </li>
  );
}

function BundleCallout({ bundleKey, name }: { bundleKey: "compliance-continuation-non-cdl" | "compliance-continuation-cdl-heavy"; name: string }) {
  const b = getBundleBreakdown(bundleKey);
  return (
    <p className="mt-6 rounded-card border border-steel/25 bg-steel/[0.05] p-4 text-sm text-ink">
      Need more than one of these? The <span className="font-semibold">{name}</span> package covers all of
      them for <span className="font-mono font-semibold">${b.finalPrice.toLocaleString("en-US")}</span>,
      a <span className="font-mono font-semibold">${b.savings.toLocaleString("en-US")}</span> saving over
      buying separately.{" "}
      <CrossLink href={`/compliance-packages/#package-${bundleKey}`}>See the package</CrossLink>
    </p>
  );
}

// The 4-step required sequence for a from-scratch carrier: order matters here
// because each step gates the next (most notably BOC-3, which has to be filed
// inside the 21-day protest period or authority never activates).
const BEGINNER_SEQUENCE: { service: ServiceKey; note?: string }[] = [
  { service: "usdot" },
  { service: "mc-authority" },
  {
    service: "boc-3",
    note: "Along with your insurer's proof of insurance, it must be on file before the 21-day federal waiting period ends, or your authority will not activate.",
  },
  { service: "ucr" },
];

export function CompliancePathPicker() {
  const [active, setActive] = useState<PathKey>("beginner");

  return (
    <div>
      {/* Stacked, not flex-wrap: at this container width, three labels this
          long never reliably fit one row, and a wrapped 2-then-1 line reads
          like an accident. One per row is consistent regardless of label
          length or viewport. */}
      <div className="flex flex-col items-start gap-2" role="tablist" aria-label="Which describes you">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`rounded-chip border-[1.5px] px-4 py-2 text-left text-sm font-medium outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel ${
              active === tab.key
                ? "border-ink bg-ink text-cloud"
                : "border-slate/25 bg-paper text-ink hover:border-steel"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "beginner" ? (
        <div className="mt-6">
          <p className="text-slate">
            You do not have a USDOT number yet, or you are early in the process. Do these four in order: each
            one gates the next, and doing them out of sequence is the most common reason authority sits
            inactive for weeks with no clear cause.
          </p>
          <ol className="mt-6 space-y-5">
            {BEGINNER_SEQUENCE.map((step, i) => {
              const s = SERVICE_BLURBS[step.service];
              return (
                <li key={step.service} className="flex gap-4">
                  <span className="font-mono text-sm font-medium tabular-nums text-steel" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <CrossLink href={s.href}>{s.title}</CrossLink>
                    <p className="mt-0.5 text-sm text-slate">
                      {s.description}
                      {step.note ? ` ${step.note}` : ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mt-8 text-ink">
            If you will run CDL drivers, you will also need:
          </p>
          <ul className="mt-4 space-y-4">
            <ChecklistItem service="dq-files" />
            <ChecklistItem service="clearinghouse" />
            <ChecklistItem service="consortium" />
          </ul>

          <p className="mt-6 text-slate">
            You do not have to figure this out yourself. We do the filings in the right order, so nothing you
            did (or did not) do is the reason your authority is stuck. Or get it all handled together: see our{" "}
            <CrossLink href="/compliance-packages/">Authority Launch packages</CrossLink>.
          </p>
        </div>
      ) : active === "non-cdl" ? (
        <div className="mt-6">
          <p className="text-slate">
            You already have your USDOT and MC authority. For a vehicle that does not require a CDL, this is
            usually what is still missing:
          </p>
          <ul className="mt-6 space-y-4">
            <ChecklistItem service="boc-3" quickBuy />
            <ChecklistItem service="ucr" quickBuy />
            <ChecklistItem service="dq-files" quickBuy />
          </ul>
          <BundleCallout bundleKey="compliance-continuation-non-cdl" name="Compliance Continuation — Non-CDL" />
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-slate">
            You already have your USDOT and MC authority. For a CDL or heavy interstate vehicle, this is
            usually what is still missing:
          </p>
          <ul className="mt-6 space-y-4">
            <ChecklistItem service="boc-3" quickBuy />
            <ChecklistItem service="ucr" quickBuy />
            <ChecklistItem service="dq-files" quickBuy />
            <ChecklistItem service="consortium" quickBuy />
            <ChecklistItem service="clearinghouse" quickBuy />
            <ChecklistItem service="ifta" />
            <ChecklistItem service="irp" />
          </ul>
          <BundleCallout bundleKey="compliance-continuation-cdl-heavy" name="Compliance Continuation — CDL/Heavy" />
        </div>
      )}
    </div>
  );
}
