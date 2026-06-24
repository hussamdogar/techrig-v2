import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";
import { performLookup } from "@/lib/server/lookup-capture";
import { startClaim } from "./actions";
import type { CarrierData } from "@/lib/lookup/types";

/**
 * USDOT lookup results page (M1 R1/R2). A noindex (ADR-5) server component that
 * runs the shared performLookup() path (lookup + rate-limit + lead/snapshot
 * capture) and renders the COMPLETE FMCSA/MOTUS docket grouped into readable
 * sections. SSR keeps Supabase/Stripe out of the client bundle. Every null shows
 * "Not on file" (standards.md, never fabricated). Safety rating + insurance-on-
 * file come only from the QCMobile backup, so they are labelled by source.
 */
export const dynamic = "force-dynamic";

// noindex: the whole platform is excluded from search (ADR-5). A header is also
// set for this path in next.config.ts; this emits the <meta robots> tag too.
export const metadata: Metadata = {
  title: "USDOT lookup",
  robots: { index: false, follow: false },
};

// ---- formatting helpers -------------------------------------------------
function text(v: string | number | null | undefined): string | null {
  if (v === null || v === undefined || v === "") return null;
  return String(v);
}
function bool(v: boolean | null | undefined): string | null {
  if (v === null || v === undefined) return null;
  return v ? "Yes" : "No";
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="text-sm text-slate">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">
        {value === null ? <span className="text-slate">Not on file</span> : value}
      </dd>
    </div>
  );
}

function DocketSection({ title, rows }: { title: string; rows: { label: string; value: string | null }[] }) {
  return (
    <div className="rounded-card border border-slate/15 bg-cloud p-5">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      <dl className="mt-2 divide-y divide-slate/10">
        {rows.map((r) => (
          <Row key={r.label} label={r.label} value={r.value} />
        ))}
      </dl>
    </div>
  );
}

function statusTone(status: string | null): "positive" | "warning" | "neutral" {
  if (!status) return "neutral";
  const s = status.toLowerCase();
  if (s.includes("not ") || s.includes("out of service") || s.includes("inactive") || s.includes("revoked")) return "warning";
  if (s.includes("active") || s.includes("authorized")) return "positive";
  return "neutral";
}

function AuthorityChip({ status }: { status: string | null }) {
  if (!status) return <span className="text-slate">Not on file</span>;
  const tone = statusTone(status);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-chip px-2 py-0.5 text-sm font-semibold",
        tone === "positive" && "bg-status-active/12 text-status-active",
        tone === "warning" && "bg-signal/15 text-ink",
        tone === "neutral" && "bg-slate/12 text-slate",
      )}
    >
      {status}
    </span>
  );
}

// ---- the full docket ----------------------------------------------------
function Docket({ carrier, usdot, token }: { carrier: CarrierData; usdot: string; token: string }) {
  const eq = carrier.equipmentSummary;
  // Safety rating + insurance-on-file are MOTUS-absent: label them by source so a
  // null reads honestly ("from the FMCSA QCMobile record" vs "not on file").
  const fromQc = carrier.source === "qcmobile";
  const officerName = [carrier.contactFirstName, carrier.contactLastName].filter(Boolean).join(" ").trim() || null;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">USDOT {usdot}</p>
          <h1 className="mt-1 font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink">
            {text(carrier.legalName) ?? "Carrier record"}
          </h1>
        </div>
        <AuthorityChip status={carrier.authorityStatus} />
      </div>
      <p className="mt-2 font-mono text-xs text-slate">
        Source: {carrier.source === "motus" ? "FMCSA MOTUS" : carrier.source === "qcmobile" ? "FMCSA QCMobile" : "manual"}
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <DocketSection
          title="Identity"
          rows={[
            { label: "Legal name", value: text(carrier.legalName) },
            { label: "DBA name", value: text(carrier.dbaName) },
            { label: "USDOT #", value: text(carrier.usdotNumber) },
            { label: "MC / docket #", value: text(carrier.mcNumber) },
            { label: "Business type", value: text(carrier.businessType) },
            { label: "Registration type", value: text(carrier.registrationType) },
          ]}
        />
        <DocketSection
          title="Authority & status"
          rows={[
            { label: "Operating authority", value: text(carrier.authorityStatus) },
            { label: "Allowed to operate", value: text(carrier.allowedToOperate) },
            { label: "New entrant", value: bool(carrier.isNewEntrant) },
            { label: "Protest period", value: bool(carrier.hasProtestPeriod) },
            { label: "Insurance required", value: bool(carrier.insuranceRequired) },
            { label: "BOC-3 eligible", value: bool(carrier.canDesignateBoc3) },
            {
              label: "Safety rating",
              value: text(carrier.safetyRating) ?? (fromQc ? null : "Not in MOTUS record"),
            },
            {
              label: "Insurance on file",
              value: text(carrier.insuranceOnFile) ?? (fromQc ? null : "Not in MOTUS record"),
            },
          ]}
        />
        <DocketSection
          title="Operation classification"
          rows={[
            { label: "Interstate", value: bool(carrier.isInterstate) },
            { label: "Intrastate", value: bool(carrier.isIntrastate) },
            { label: "For hire", value: bool(carrier.isForHire) },
            { label: "Private", value: bool(carrier.isPrivate) },
          ]}
        />
        <DocketSection
          title="Fleet & equipment"
          rows={[
            { label: "Power units", value: text(carrier.powerUnits) },
            { label: "Reported powered vehicles", value: text(carrier.reportedPoweredVehicles) },
            { label: "Truck tractors", value: text(eq.truckTractors) },
            { label: "Straight trucks", value: text(eq.straightTrucks) },
            { label: "Trailers", value: text(eq.trailers) },
          ]}
        />
        <DocketSection
          title="Drivers & contact"
          rows={[
            { label: "Drivers total", value: text(carrier.driverTotal) },
            { label: "CDL drivers", value: text(carrier.cdlDriverTotal) },
            { label: "Primary officer", value: officerName },
            { label: "Phone", value: text(carrier.contactPhone) },
            { label: "Email", value: text(carrier.contactEmail) },
          ]}
        />
        <DocketSection
          title="Address"
          rows={[{ label: "Physical / principal", value: text(carrier.physicalAddress) }]}
        />
      </div>

      {/* Save & track: stash the signed lead token and route into the magic-link
          flow; /auth/callback claims this lookup into the new account (M2). */}
      <form
        action={startClaim}
        className="mt-8 flex flex-col gap-3 rounded-card border border-steel/30 bg-cloud p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <input type="hidden" name="token" value={token} />
        <p className="text-sm text-ink">
          <span className="font-semibold">Save and track this lookup.</span> Create a free account
          to keep this record and follow every filing to completion.
        </p>
        <button type="submit" className={cn(buttonVariants({ variant: "primary", size: "md" }), "shrink-0")}>
          Create an account
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href="/compliance-services/" className={buttonVariants({ variant: "secondary", size: "md" })}>
          Get your compliance done
        </Link>
        <Link
          href="/"
          className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
        >
          Search another USDOT
        </Link>
      </div>
    </>
  );
}

// ---- non-success states -------------------------------------------------
function Message({ usdot, heading, body, showFileCta }: { usdot: string; heading: string; body: string; showFileCta?: boolean }) {
  return (
    <>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">USDOT {usdot}</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">{heading}</h1>
      <p className="mt-4 max-w-[60ch] text-slate">{body}</p>
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        {showFileCta ? (
          <Link href="/dot-registration/" className={buttonVariants({ variant: "primary", size: "md" })}>
            File for a USDOT
          </Link>
        ) : null}
        <Link
          href="/"
          className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
        >
          Search another USDOT
        </Link>
      </div>
    </>
  );
}

export default async function LookupResultsPage({ params }: { params: Promise<{ usdot: string }> }) {
  const { usdot } = await params;
  const outcome = await performLookup(usdot, await headers());

  return (
    <Section surface="paper" className="pt-8 md:pt-12">
      <Container className="max-w-4xl">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "USDOT lookup" }]} />
        <div className="mt-6">
          {outcome.kind === "done" && outcome.result.status === "success" && outcome.result.carrier ? (
            <Docket carrier={outcome.result.carrier} usdot={usdot} token={outcome.token} />
          ) : outcome.kind === "done" && outcome.result.status === "not_found" ? (
            <Message
              usdot={usdot}
              heading="No carrier found"
              body="We couldn't find a carrier with that USDOT number. Check the number, or file for a new USDOT."
              showFileCta
            />
          ) : outcome.kind === "invalid" ? (
            <Message
              usdot={usdot}
              heading="That doesn't look like a USDOT number"
              body="A USDOT number is digits only. Check the number and search again."
            />
          ) : outcome.kind === "rate_limited" ? (
            <Message
              usdot={usdot}
              heading="Too many lookups"
              body="You've run several lookups in a short window. Please wait a few minutes and try again."
            />
          ) : (
            // lookup_error, or done+manual_required (both providers unavailable)
            <Message
              usdot={usdot}
              heading="Lookup is temporarily unavailable"
              body="We couldn't reach the FMCSA records just now. Try again in a moment, or contact us and we'll pull it for you."
            />
          )}
        </div>
      </Container>
    </Section>
  );
}
