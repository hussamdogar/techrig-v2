import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { GtmEvent } from "@/components/gtm-event";
import { TrackedForm } from "@/components/tracked-form";
import { performLookup } from "@/lib/server/lookup-capture";
import { sendQuickBuyLookupAdminAlert } from "@/lib/email/lifecycle";
import { SERVICES, isQuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";
import { text, DocketSection } from "@/lib/lookup/format";
import type { CarrierData } from "@/lib/lookup/types";
import { confirmQuickBuyOrder } from "./actions";

/**
 * Quick-buy confirm screen. Runs the same performLookup() path as
 * `/lookup/[usdot]/` (rate-limited, captures a lead + snapshot, mints a signed
 * lead token), then shows a CURATED identity subset (not the full docket) for
 * the visitor to confirm, with contact info pre-filled and editable. Confirming
 * writes a quick_buy_orders row and hands off straight to payment; no account.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Confirm your carrier record",
  robots: { index: false, follow: false },
};

function Message({ heading, body }: { heading: string; body: string }) {
  return (
    <>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">{heading}</h1>
      <p className="mt-4 max-w-[60ch] text-slate">{body}</p>
    </>
  );
}

export default async function QuickBuyConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ service: string; usdot: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { service, usdot } = await params;
  const { error: errorParam } = await searchParams;
  if (!isQuickBuyServiceKey(service)) notFound();
  const def = SERVICES[service as ServiceKey];

  const outcome = await performLookup(usdot, await headers());

  // Owner wants to know as soon as a real prospect enters a USDOT number for
  // one of the 5 quick-buy services, success or not-found alike (not_found
  // still means someone typed a real number and is mid-flow). Skipped for
  // invalid/rate-limited/lookup-error outcomes since those aren't a genuine
  // lookup attempt reaching this screen. Best-effort, never blocks the render.
  if (outcome.kind === "done" && (outcome.result.status === "success" || outcome.result.status === "not_found")) {
    const carrier = outcome.result.carrier;
    await sendQuickBuyLookupAdminAlert({
      serviceName: def.name,
      usdot,
      contact: {
        companyName: carrier ? (carrier.legalName ?? carrier.dbaName) : null,
        email: carrier?.contactEmail ?? null,
        phone: carrier?.contactPhone ?? null,
      },
    });
  }

  // Funnel signal: this URL is identical regardless of outcome, so success vs.
  // not-found vs. rate-limited would otherwise be invisible to GTM's own
  // page-view tracking. Mirrors the branching below exactly, so it can't drift.
  const outcomeStatus =
    outcome.kind === "done" && outcome.result.status === "success" && outcome.result.carrier
      ? "success"
      : outcome.kind === "done" && outcome.result.status === "not_found"
        ? "not_found"
        : outcome.kind === "invalid"
          ? "invalid"
          : outcome.kind === "rate_limited"
            ? "rate_limited"
            : "error";

  return (
    <Section surface="paper" className="pt-8 md:pt-12">
      <GtmEvent event="quick_buy_confirm_view" data={{ service, outcome: outcomeStatus }} />
      <Container className="max-w-2xl">
        {outcome.kind === "done" && outcome.result.status === "success" && outcome.result.carrier ? (
          <Confirm
            carrier={outcome.result.carrier}
            service={service as ServiceKey}
            usdot={usdot}
            token={outcome.token}
            error={errorParam}
          />
        ) : outcome.kind === "done" && outcome.result.status === "not_found" ? (
          <>
            <Message
              heading="No carrier found"
              body="We couldn't find a carrier with that USDOT number. Check the number and try again."
            />
            <BackLink service={service} />
          </>
        ) : outcome.kind === "invalid" ? (
          <>
            <Message heading="That doesn't look like a USDOT number" body="A USDOT number is digits only. Check the number and try again." />
            <BackLink service={service} />
          </>
        ) : outcome.kind === "rate_limited" ? (
          <>
            <Message heading="Too many lookups" body="You've run several lookups in a short window. Please wait a few minutes and try again." />
            <BackLink service={service} />
          </>
        ) : (
          <>
            <Message
              heading="Lookup is temporarily unavailable"
              body="We couldn't reach the FMCSA records just now. Try again in a moment, or contact us and we'll pull it for you."
            />
            <BackLink service={service} />
          </>
        )}
        <p className="mt-2 text-sm text-ink">{def.name}</p>
      </Container>
    </Section>
  );
}

function BackLink({ service }: { service: string }) {
  return (
    <div className="mt-7">
      <Link href={`/buy/${service}/`} className="font-medium text-steel underline-offset-4 hover:underline">
        Try another USDOT
      </Link>
    </div>
  );
}

const CONFIRM_ERROR_MESSAGES: Record<string, string> = {
  invalid_contact: "That email or phone number doesn't look right. Please check and try again.",
  "1": "Something went wrong saving your details. Please try again.",
};

function Confirm({
  carrier,
  service,
  usdot,
  token,
  error,
}: {
  carrier: CarrierData;
  service: ServiceKey;
  usdot: string;
  token: string;
  error?: string;
}) {
  const def = SERVICES[service];
  const confirmAction = confirmQuickBuyOrder.bind(null, service, usdot);
  const errorMessage = error ? CONFIRM_ERROR_MESSAGES[error] : undefined;

  return (
    <>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
        {def.name} · USDOT {usdot}
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Confirm your carrier record</h1>
      <p className="mt-3 text-slate">Check the details below, then continue to review your order.</p>

      {errorMessage ? (
        <p className="mt-4 rounded-card border border-signal/40 bg-signal/10 px-4 py-3 text-sm text-ink">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6">
        <DocketSection
          title="Carrier identity"
          rows={[
            { label: "Legal name", value: text(carrier.legalName) },
            { label: "USDOT #", value: text(carrier.usdotNumber) },
            { label: "Power units", value: text(carrier.powerUnits) },
            { label: "Address", value: text(carrier.physicalAddress) },
          ]}
        />
      </div>

      <TrackedForm
        action={confirmAction}
        event="quick_buy_confirm_submit"
        data={{ service, usdot }}
        className="mt-6 space-y-5"
      >
        <input type="hidden" name="token" value={token} />
        {/* UCR's government fee bracket is by QUALIFYING CMVs only (truck
            tractors + straight trucks) — trailers and non-commercial vehicles
            never count, even if that's most of the fleet. This is NOT the
            same as carrier.powerUnits (a general FMCSA-reported figure that
            can include non-commercial vehicles and would inflate the
            bracket). Auto-detected here so UCR pricing (if selected now or
            upsold on review) never needs the visitor to type a fleet size in.
            Only MOTUS reports the equipment breakdown; QCMobile-sourced
            lookups always sum to 0 here, which correctly defaults to the 0-2
            bracket rather than trusting an undifferentiated total. */}
        <input
          type="hidden"
          name="power_units"
          value={carrier.equipmentSummary.truckTractors + carrier.equipmentSummary.straightTrucks}
        />
        {/* Raw signal for the review screen's "You may also need" upsell
            eligibility (truck tractors present), kept separate from
            power_units above since that's a combined figure. */}
        <input type="hidden" name="truck_tractors" value={carrier.equipmentSummary.truckTractors} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="text-sm font-medium text-ink">
              First name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              defaultValue={carrier.contactFirstName ?? ""}
              placeholder="First name"
              required
              className="mt-1 w-full rounded-card border border-slate/25 bg-paper px-4 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            />
            <p className="mt-1 text-xs text-slate">Pulled from your FMCSA record, edit if needed.</p>
          </div>
          <div>
            <label htmlFor="last_name" className="text-sm font-medium text-ink">
              Last name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              defaultValue={carrier.contactLastName ?? ""}
              placeholder="Last name"
              required
              className="mt-1 w-full rounded-card border border-slate/25 bg-paper px-4 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            />
            <p className="mt-1 text-xs text-slate">Pulled from your FMCSA record, edit if needed.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={carrier.contactEmail ?? ""}
              placeholder="you@company.com"
              required
              className="mt-1 w-full rounded-card border border-slate/25 bg-paper px-4 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            />
            <p className="mt-1 text-xs text-slate">Pulled from your FMCSA record, edit if needed.</p>
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-ink">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={carrier.contactPhone ?? ""}
              placeholder="(555) 555-5555"
              className="mt-1 w-full rounded-card border border-slate/25 bg-paper px-4 py-3 text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            />
            <p className="mt-1 text-xs text-slate">Pulled from your FMCSA record, edit if needed.</p>
          </div>
        </div>

        {/* Power units (UCR) / driver count (DQ files) are collected on the next
            screen, not here — the review step is where the final service list
            (primary + any upsells) is locked in, so that's the one place those
            fields need to live regardless of how the visitor got there. */}

        <button type="submit" className={`${buttonVariants({ variant: "primary", size: "md" })} w-full sm:w-auto`}>
          Continue to review
        </button>
      </TrackedForm>

      <div className="mt-4">
        <BackLink service={service} />
      </div>
    </>
  );
}
