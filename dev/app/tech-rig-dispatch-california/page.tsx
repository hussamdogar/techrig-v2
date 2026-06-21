import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AuthorityStatusTracker,
  type Step,
} from "@/components/authority-status-tracker";
import { PriceChip } from "@/components/ui/price-chip";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { FilingIcon, RouteNodeIcon } from "@/components/icons";
import {
  breadcrumbNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing, type NavLink } from "@/lib/services";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a Trucking Company in California",
  description:
    "How to start a trucking company in California: clear the state layer (CA Motor Carrier Permit, CA Number, CARB) plus federal USDOT and MC. Tech Rig maps it.",
  alternates: { canonical: "/tech-rig-dispatch-california/" },
  openGraph: {
    title: "Start a Trucking Company in California",
    description:
      "How to start a trucking company in California: the state layer plus federal USDOT and MC, mapped together so nothing is missed.",
    url: "/tech-rig-dispatch-california/",
    type: "website",
  },
};

// Hero tracker: the state-agnostic federal setup sequence (design spec §2). The
// 21-day step is the fixed federal protest period, never a Tech-Rig countdown or
// a promised activation date. Identical content across state pages by mandate.
const setupSteps: Step[] = [
  { label: "Application filed", status: "Filed", state: "filed", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
];

// The curated "what we file" subset (design spec §4): cards route UP to the
// national money pages, which do the actual filing. The state page is the
// on-ramp and never restates their content. Prices render from the single
// source (lib/services pricing), keeping service-fee vs government-fee split.
const filingCards: NavLink[] = [
  { slug: "/dot-registration/", label: "USDOT Registration", short: "Your federal carrier number, MOTUS account set up the first time." },
  { slug: "/mc-registration/", label: "MC Authority", short: "Interstate for-hire operating authority, filed and tracked." },
  { slug: "/mc-dot-registration/", label: "Authority Package (DOT + MC)", short: "DOT and MC together when you are starting from scratch." },
  { slug: "/compliance-services/", label: "Compliance Services hub", short: "The full federal setup, lined up so nothing blocks your authority." },
];

export default function CaliforniaStatePage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "Trucking compliance and dispatch in California",
            slug: "/tech-rig-dispatch-california/",
            description:
              "Tech Rig sets up California carriers across the federal and state layers, from USDOT and MC authority to the California Motor Carrier Permit and CA Number, then dispatches owner-operators and small fleets.",
            areaServedState: "California",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "California" },
          ]),
          personNode("adam"),
        )}
      />

      {/* Hero */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "California" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                How to Start a Trucking Company in California
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                California layers state rules on top of the federal ones, so
                getting set up here means clearing requirements most other states
                do not have. Tech Rig maps the federal authority and the
                California state pieces together, files the federal side on the
                national pages that do that work, and flags every state step so
                nothing trips you up before your first load.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Start your California setup
                </Link>
                <Link
                  href="#what-we-file"
                  className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                >
                  or see what we file
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            <AuthorityStatusTracker steps={setupSteps} />
          </div>
        </Container>
      </Section>

      {/* Starting a trucking company in California (state nuance) */}
      <Section surface="cloud">
        <Container className="max-w-[68ch]">
          <h2 className="font-display text-3xl font-bold text-ink">
            Starting a trucking company in California
          </h2>
          <p className="mt-4 text-slate">
            The first thing to settle is whether you will run across state lines
            or stay inside California, because each path carries different
            paperwork. Run interstate for-hire and you still need federal USDOT
            and MC authority. Stay intrastate and California adds its own permit
            on top. We confirm which path fits before anything is filed.
          </p>

          {/* State distinctions as a Slate definition list, not stat callouts.
              Each carries [VERIFY] framing per the brief: state schedules change,
              so Dev/writer confirms against the agency before publishing. */}
          <dl className="mt-6 space-y-5">
            <div className="border-l-4 border-steel pl-4">
              <dt className="flex items-start gap-2 font-display font-semibold text-ink">
                <RouteNodeIcon size={20} className="mt-0.5 shrink-0 text-steel" />
                Interstate carriers
              </dt>
              <dd className="mt-1 text-slate">
                If you cross state lines for hire, you need federal USDOT and MC
                authority, the same federal filings we handle on the national
                pages below.
              </dd>
            </div>
            <div className="border-l-4 border-steel pl-4">
              <dt className="flex items-start gap-2 font-display font-semibold text-ink">
                <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
                California Motor Carrier Permit and CA Number
              </dt>
              <dd className="mt-1 text-slate">
                Intrastate California carriers generally need a California Motor
                Carrier Permit (MCP) and a CA Number. Confirm the current
                requirement with the state agency before you file, as the
                schedule can change.
              </dd>
            </div>
            <div className="border-l-4 border-steel pl-4">
              <dt className="flex items-start gap-2 font-display font-semibold text-ink">
                <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
                CARB Clean Truck Check
              </dt>
              <dd className="mt-1 text-slate">
                Most diesel vehicles operating here must meet CARB Clean Truck
                Check requirements. Because emissions rules move, verify the
                current CARB schedule for your vehicles before you rely on it.
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-slate">
            We map the state and federal pieces together so nothing is missed,
            then route the actual filings to the pages built to do them.
          </p>

          {/* Real, cleared CA worked example. Worded verbatim from the brief so
              no sentence matches the /dot-registration/ telling of the same client. */}
          <div className="mt-8 border-l-4 border-steel pl-4 text-slate">
            <p>
              A California box-truck operator came to us after his records would
              not link in the FMCSA MOTUS system, which stalled his setup. We
              bridged the old data into MOTUS and got him moving. California is
              where these system and state-layer snags show up most, and handling
              them is daily work for us.
            </p>
          </div>
        </Container>
      </Section>

      {/* What we file for California carriers (routes UP to national money pages) */}
      <Section surface="paper" id="what-we-file">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What we file for California carriers
          </h2>
          <p className="mt-4 text-slate">
            The federal setup is the same wherever you are based, so we run it on
            the national pages built for each filing. California is the on-ramp:
            you start here, and the filing itself happens on the page that owns
            it.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {filingCards.map((card) => (
              <div
                key={card.slug}
                className="rounded-card border border-slate/15 bg-cloud p-5"
              >
                <FilingIcon size={22} className="text-steel" />
                <h3 className="mt-3 font-display text-lg font-semibold">
                  <Link
                    href={card.slug}
                    className="text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                  >
                    {card.label}
                  </Link>
                </h3>
                {card.short ? (
                  <p className="mt-2 text-sm text-slate">{card.short}</p>
                ) : null}
                <div className="mt-4">
                  <PriceChip price={pricing[card.slug]} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Truck dispatch in California (retained, subordinate, Steel-accented) */}
      <Section surface="cloud">
        <Container className="max-w-[68ch]">
          <h2 className="font-display text-3xl font-bold text-ink">
            Truck dispatch in California
          </h2>
          <p className="mt-4 text-slate">
            Once your California authority is active, the next job is keeping the
            truck loaded. We book freight for owner-operators and small fleets
            running out of California, negotiate rates, and handle the back office
            so you stay on the road. See our{" "}
            <Link
              href="/services/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              truck dispatch
            </Link>{" "}
            for how the retainer works.
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Setting up in California? We will map the state and federal steps and file it right."
        cta={{ label: "Start your California setup", href: filingCtaHref }}
      />
    </>
  );
}
