import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AuthorityStatusTracker,
  type Step,
} from "@/components/authority-status-tracker";
import { ServiceCard } from "@/components/service-card";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { RouteNodeIcon, FilingIcon } from "@/components/icons";
import type { IconName } from "@/components/icons";
import {
  breadcrumbNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing } from "@/lib/services";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a Trucking Company in New York",
  description:
    "Learn how to start a trucking company in New York: federal USDOT and MC authority plus the state Highway Use Tax certificate and decal, set up by Tech Rig.",
  alternates: { canonical: "/tech-rig-dispatch-new-york/" },
  openGraph: {
    title: "Start a Trucking Company in New York",
    description:
      "How to start a trucking company in New York: federal authority plus the state Highway Use Tax step, handled by Tech Rig.",
    url: "/tech-rig-dispatch-new-york/",
    type: "website",
  },
};

// Scoped to the federal setup sequence (state-agnostic content, per the state
// design spec): the same honest stepper the compliance pages use, framing the
// authority journey a New York carrier is about to start. The 21-day step is the
// fixed federal protest period, never a Tech-Rig-controlled date.
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

// "What we file for New York carriers": a curated subset routing UP to the
// national money pages. The state page is the on-ramp; the filing is done on the
// national page, so these never duplicate that content. Prices come from the
// single source (lib/services).
const filingCards: {
  icon: IconName;
  title: string;
  slug: string;
  description: string;
  govFeeNote?: string;
}[] = [
  {
    icon: "stamp",
    title: "USDOT Registration",
    slug: "/dot-registration/",
    description:
      "Your federal USDOT number, the foundation for interstate operation out of New York.",
    govFeeNote: "+ gov fee (varies)",
  },
  {
    icon: "shield",
    title: "MC Authority",
    slug: "/mc-registration/",
    description:
      "For-hire interstate operating authority, filed and tracked through the protest period.",
    govFeeNote: "+ gov fee (varies)",
  },
  {
    icon: "filing",
    title: "Authority Package (DOT + MC)",
    slug: "/mc-dot-registration/",
    description:
      "USDOT and MC together as one sequenced setup, so nothing blocks activation.",
    govFeeNote: "+ gov fee (varies)",
  },
  {
    icon: "checkSeal",
    title: "Compliance Services hub",
    slug: "/compliance-services/",
    description:
      "BOC-3, UCR, insurance filing, and the rest of the federal setup in one place.",
  },
];

export default function NewYorkStatePage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "Trucking compliance and dispatch in New York",
            slug: "/tech-rig-dispatch-new-york/",
            description:
              "Tech Rig sets up trucking companies in New York: federal USDOT and MC authority, the state Highway Use Tax step, and ongoing dispatch.",
            areaServedState: "New York",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "New York" },
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
              { name: "New York" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                How to Start a Trucking Company in New York
              </h1>
              {/* State-specific hero lede (styled paragraph, never an H-tag). NY
                  lead fact, transcribed from the brief. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                New York adds a state highway-use obligation on top of federal
                authority, which catches carriers who set up only the federal
                side. Tech Rig runs the federal setup, your USDOT number and MC
                authority, and flags the New York step so you are not stopped
                short of legal once the work is done.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Start my New York setup
                </Link>
                <Link
                  href="#filings"
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

      {/* Starting a trucking company in New York: the state-nuance beat */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Starting a trucking company in New York
          </h2>
          {/* State nuances transcribed from the brief; [VERIFY] framing kept. */}
          <p className="mt-4 max-w-[68ch] text-slate">
            Carriers operating qualifying vehicles in New York generally need a
            Highway Use Tax (HUT) certificate and decal, in addition to federal
            USDOT and MC for interstate operation. New York City can carry
            further local considerations. We handle the federal setup and flag
            the state HUT step so it does not get missed after your authority is
            filed.
          </p>

          {/* State distinctions as a short definition list, not invented stats. */}
          <dl className="mt-6 space-y-5">
            <div className="flex gap-3">
              <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <div>
                <dt className="font-display font-semibold text-ink">
                  Highway Use Tax certificate and decal
                </dt>
                <dd className="mt-1 text-slate">
                  A New York state obligation for qualifying vehicles, separate
                  from your federal authority. We point you to it so the state
                  layer is not left open.
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <RouteNodeIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <div>
                <dt className="font-display font-semibold text-ink">
                  New York City considerations
                </dt>
                <dd className="mt-1 text-slate">
                  Running into the city can add further local requirements on
                  top of the state and federal pieces.
                </dd>
              </div>
            </div>
          </dl>

          {/* Honesty note: the state schedule can change; confirm before filing. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            State requirements can change. We confirm the current New York HUT
            schedule against the state agency before anything is filed, so what
            you owe is what is current.
          </p>
        </Container>
      </Section>

      {/* What we file for New York carriers: routing up to the national pages */}
      <Section surface="paper" id="filings">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            What we file for New York carriers
          </h2>
          <p className="mt-4 max-w-2xl text-slate">
            The federal setup is the same nationwide, so we file it on our
            national pages and route you there. New York carriers usually start
            with these, then add the state HUT step. Prices are our service fee;
            any government fee is shown separately.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {filingCards.map((card) => (
              <ServiceCard
                key={card.slug}
                icon={card.icon}
                title={card.title}
                href={card.slug}
                description={card.description}
                price={pricing[card.slug]}
                govFeeNote={card.govFeeNote}
              />
            ))}
          </div>

          {/* Worked example: [CLIENT PROOF NEEDED] for NY. Graceful empty-proof
              block, NY-specific line under 8 words, not reused from any page. */}
          <p className="mt-8 border-l-4 border-slate/30 pl-4 text-slate">
            New York client story coming soon.
          </p>
        </Container>
      </Section>

      {/* Truck dispatch in New York: the retained, lighter, Steel-accented beat */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Truck dispatch in New York
          </h2>
          <p className="mt-4 border-l-[3px] border-steel pl-4 text-slate">
            Once your authority is active, we keep the truck moving. Tech Rig
            books loads, negotiates rates, and handles the back-office for owner
            operators and small fleets running out of New York. If you want us
            to keep you loaded after setup, see our{" "}
            <Link
              href="/services/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              truck dispatch
            </Link>{" "}
            service.
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Ready to run in New York? We set up the federal side and flag the state step."
        cta={{ label: "Start my New York setup", href: filingCtaHref }}
      />
    </>
  );
}
