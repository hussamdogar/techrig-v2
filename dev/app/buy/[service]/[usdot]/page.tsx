import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { GtmEvent } from "@/components/gtm-event";
import { performLookup } from "@/lib/server/lookup-capture";
import { sendQuickBuyLookupAdminAlert } from "@/lib/email/lifecycle";
import { SERVICES, isQuickBuyServiceKey, type QuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";
import { carrierFacts } from "@/lib/apply/diff";
import { service as serviceClient } from "@/lib/server/supabase";
import { verifyLeadAccessToken } from "@/lib/server/security";
import { QUICK_BUY_TOKEN_COOKIE } from "@/lib/server/quick-buy";
import { parsePreselectedAddOns } from "@/lib/quick-buy-preselect";
import { placeQuickBuyOrder } from "./actions";
import { CheckoutForm } from "./checkout-form";

/**
 * Quick-buy checkout: the one screen between USDOT entry and payment (owner,
 * 2026-10-13: the old confirm and review screens merged; layout in
 * shared/design/quick-buy-checkout-v2.md). Runs the same performLookup() path
 * as `/lookup/[usdot]/` (rate-limited, captures a lead + snapshot, mints a
 * signed lead token), then shows the carrier record, pre-filled contact
 * details, add-ons, the order summary and the signature. Submitting writes the
 * signed quick_buy_orders row and hands off to payment; no account.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Review your order",
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

export default async function QuickBuyCheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ service: string; usdot: string }>;
  searchParams: Promise<{ add?: string; from?: string }>;
}) {
  const { service, usdot } = await params;
  const { add: addParam, from } = await searchParams;
  if (!isQuickBuyServiceKey(service)) notFound();
  const add = parsePreselectedAddOns(addParam, service);
  const def = SERVICES[service as ServiceKey];

  // Opened from a paid order's thank-you page (?from=<orderId>): leave out
  // what that order already bought, and when the visitor proves it's theirs
  // (the order's signed lead cookie), fill in the contact details they
  // actually gave and keep the same lead (no second lead alert or lead
  // conversion for a returning customer).
  const fromOrder = await loadFromOrder(from, usdot);
  const ownsFromOrder =
    !!fromOrder && verifyLeadAccessToken((await cookies()).get(QUICK_BUY_TOKEN_COOKIE)?.value, fromOrder.lead_id);

  const outcome = await performLookup(usdot, await headers(), ownsFromOrder ? fromOrder.lead_id : undefined);

  // Owner wants to know as soon as a real prospect enters a USDOT number for
  // one of the 5 quick-buy services, success or not-found alike (not_found
  // still means someone typed a real number and is mid-flow). Skipped for
  // invalid/rate-limited/lookup-error outcomes since those aren't a genuine
  // lookup attempt reaching this screen. Best-effort, never blocks the render.
  // A reload or error redirect reuses the visitor's existing lead
  // (performLookup's `reused`), so it never re-sends the alert or re-counts
  // the lead.
  const isLead =
    outcome.kind === "done" &&
    !outcome.reused &&
    (outcome.result.status === "success" || outcome.result.status === "not_found");
  if (isLead) {
    const carrier = outcome.result.carrier;
    await sendQuickBuyLookupAdminAlert({
      serviceName: def.name,
      usdot,
      contact: {
        companyName: carrier ? (carrier.legalName ?? carrier.dbaName) : null,
        email: carrier?.contactEmail ?? null,
        phone: carrier?.contactPhone ?? null,
        address: carrier?.physicalAddress ?? null,
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

  const events = (
    <>
      <GtmEvent event="quick_buy_confirm_view" data={{ service, outcome: outcomeStatus }} />
      {/* The lead conversion (owner definition, 2026-09-30): entering a real
          USDOT number is an interested prospect, the same moment the admin
          lead alert above fires, not when they later reach payment. Fired once
          per lead: a reload reuses the lead and skips this (isLead above), and
          the lookup's reference id is also the Ads transaction id. No
          personal data here: the FMCSA record is public-registry data, not
          contact details the visitor gave us, so it is never sent to Ads. */}
      {isLead && outcome.kind === "done" ? (
        <GtmEvent
          event="quick_buy_lead"
          data={{ lead_id: outcome.referenceId, service, outcome: outcomeStatus }}
        />
      ) : null}
    </>
  );

  if (outcome.kind === "done" && outcome.result.status === "success" && outcome.result.carrier) {
    const carrier = outcome.result.carrier;
    const { truckTractors, straightTrucks } = carrier.equipmentSummary;
    return (
      <>
        {events}
        <CheckoutForm
          action={placeQuickBuyOrder.bind(null, service, usdot)}
          primary={service as QuickBuyServiceKey}
          usdot={usdot}
          token={outcome.token}
          carrier={{ legalName: carrier.legalName, powerUnits: carrier.powerUnits, address: carrier.physicalAddress }}
          contact={
            ownsFromOrder
              ? {
                  first: fromOrder.first_name ?? "",
                  last: fromOrder.last_name ?? "",
                  email: fromOrder.email ?? "",
                  phone: fromOrder.phone ?? "",
                }
              : {
                  first: carrier.contactFirstName ?? "",
                  last: carrier.contactLastName ?? "",
                  email: carrier.contactEmail ?? "",
                  phone: carrier.contactPhone ?? "",
                }
          }
          qualifyingPowerUnits={truckTractors + straightTrucks}
          truckTractors={truckTractors}
          boc3OnFile={carrierFacts(carrier).hasActiveBoc3}
          preselected={add}
          alreadyOrdered={fromOrder?.purchased ?? []}
          hiddenFields={{
            // UCR's government fee bracket is by QUALIFYING CMVs only (truck
            // tractors + straight trucks); trailers and non-commercial
            // vehicles never count. NOT carrier.powerUnits, a general figure
            // that can include non-commercial vehicles and would inflate the
            // bracket. Only MOTUS reports the equipment breakdown;
            // QCMobile-sourced lookups sum to 0 here, which correctly defaults
            // to the 0-2 bracket.
            power_units: String(truckTractors + straightTrucks),
            // Add-on eligibility signal (Clearinghouse and Consortium need
            // truck tractors), re-checked by the server action.
            truck_tractors: String(truckTractors),
            // Structured address for Stripe (fraud scoring / dispute evidence,
            // owner decision 2026-09-15); not shown as an editable field.
            address_line1: carrier.addressLine1 ?? "",
            address_line2: carrier.addressLine2 ?? "",
            address_city: carrier.addressCity ?? "",
            address_state: carrier.addressState ?? "",
            address_zip: carrier.addressZip ?? "",
            address_country: carrier.addressCountry ?? "",
          }}
        />
      </>
    );
  }

  return (
    <Section surface="paper" className="pt-8 md:pt-12">
      {events}
      <Container className="max-w-2xl">
        {outcome.kind === "done" && outcome.result.status === "not_found" ? (
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

/** The paid order a thank-you "Order" button came from, if it's real, for
 *  this same USDOT, and paid. Anything else is ignored. */
async function loadFromOrder(from: string | undefined, usdot: string) {
  if (!from || !/^[0-9a-f-]{36}$/i.test(from)) return null;
  const { data } = await serviceClient()
    .from("quick_buy_orders")
    .select("lead_id, usdot_number, status, service_key, additional_service_keys, first_name, last_name, email, phone")
    .eq("id", from)
    .maybeSingle();
  if (!data || data.usdot_number !== usdot || !(data.status === "paid" || data.status === "fulfilled")) return null;
  const extra = Array.isArray(data.additional_service_keys) ? data.additional_service_keys : [];
  const purchased = [data.service_key, ...extra].filter(isQuickBuyServiceKey) as QuickBuyServiceKey[];
  return { ...data, lead_id: data.lead_id as string, purchased };
}
