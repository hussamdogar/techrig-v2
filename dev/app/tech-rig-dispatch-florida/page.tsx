import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { AuthorityStatusTracker } from "@/components/authority-status-tracker";
import { ServiceCard } from "@/components/service-card";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { RouteNodeIcon, type IconName } from "@/components/icons";
import { breadcrumbNode, graph, personNode, serviceNode } from "@/lib/schema";
import { pricing } from "@/lib/services";
import { filingCtaHref } from "@/lib/site";

// State page for Florida. REALIGN of a traffic-bearing URL: leads with state
// setup and authority, keeps a dispatch beat, and routes the actual filing UP
// to the national money pages. All copy transcribed from the Florida row and
// the "FULL PER-PAGE COPY" block in shared/page-briefs/state-pages.md. No
// fabricated state market statistics; the FL worked example is not cleared yet,
// so it renders as a graceful empty-proof block. The lede and nuances are
// written independently of other state pages and the pillar (no shared 8+ word
// sentences), per the brief's top duplication-risk rule.

export const metadata: Metadata = {
  title: "Start a Trucking Company in Florida",
  description:
    "How to start a trucking company in Florida: federal USDOT and MC setup, IRP and IFTA through FLHSMV, plus Florida truck dispatch. Tech Rig files it for you.",
  alternates: { canonical: "/tech-rig-dispatch-florida/" },
  openGraph: {
    title: "Start a Trucking Company in Florida",
    description:
      "Federal USDOT and MC setup, IRP and IFTA through FLHSMV, and Florida truck dispatch, handled by Tech Rig.",
    url: "/tech-rig-dispatch-florida/",
    type: "website",
  },
};

// The "what we file" curated subset. These route UP to the national money pages
// that do the actual filing; the state page never restates their content. IRP
// and IFTA are surfaced here because the Florida nuance points carriers to them
// through FLHSMV, but the filing lives on the national page (single source).
const filingCards: {
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  govFeeNote?: string;
}[] = [
  {
    slug: "/dot-registration/",
    title: "USDOT number",
    description: "Your federal carrier ID, filed correctly the first time.",
    icon: "stamp",
  },
  {
    slug: "/mc-registration/",
    title: "MC authority",
    description: "Operating authority to haul freight for hire across state lines.",
    icon: "shield",
  },
  {
    slug: "/mc-dot-registration/",
    title: "Authority Package (DOT + MC)",
    description: "USDOT and MC together, the usual starting point for a new carrier.",
    icon: "shield",
  },
  {
    slug: "/irp-registration/",
    title: "IRP plates",
    description: "Apportioned plates, handled in Florida through FLHSMV.",
    icon: "routeNode",
  },
  {
    slug: "/ifta-registration/",
    title: "IFTA",
    description: "Fuel-tax registration, also run through FLHSMV for Florida carriers.",
    icon: "routeNode",
  },
  {
    slug: "/compliance-services/",
    title: "Full compliance setup",
    description: "Every filing in one sequence, from formation to active authority.",
    icon: "filing",
  },
];

export default function TechRigDispatchFloridaPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "Trucking compliance and dispatch in Florida",
            slug: "/tech-rig-dispatch-florida/",
            description:
              "Tech Rig sets up Florida carriers with federal USDOT and MC authority, routes IRP and IFTA through FLHSMV, and dispatches owner-operators and small fleets in Florida.",
            areaServedState: "Florida",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Florida" },
          ]),
          personNode("adam"),
        )}
      />

      {/* Hero (Paper, asymmetric two-column) */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Florida" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                How to Start a Trucking Company in Florida
              </h1>
              {/* Styled hero lede (the FL lead fact, verbatim). Not a heading. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Florida is a major port and import-freight state, and for most
                interstate carriers the setup here is largely federal, with the
                interstate operating filings run through the state motor-vehicle
                agency. Tech Rig stands up your federal authority, lines up the
                Florida pieces, and then keeps your truck loaded.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Start your Florida setup
                </Link>
                {/* Subordinate Steel anchor into the filings section. */}
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

            {/* Signature visual: the state-agnostic federal authority journey. */}
            <AuthorityStatusTracker />
          </div>
        </Container>
      </Section>

      {/* Starting a trucking company in Florida (the state-nuance beat) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Starting a trucking company in Florida
          </h2>
          <p className="mt-4 max-w-[68ch] text-slate">
            What you owe depends on whether you cross state lines, but the core of
            a Florida startup sits at the federal level. Interstate carriers need
            a federal{" "}
            <CrossLink href="/dot-registration/">USDOT</CrossLink> number and{" "}
            <CrossLink href="/mc-registration/">MC authority</CrossLink> before
            they can run for hire. On top of that, the apportioned-plate and
            fuel-tax filings are handled by the state.
          </p>

          {/* State distinctions as a quiet definition list, not stat callouts.
              [VERIFY current FLHSMV schedule], per the brief framing. */}
          <dl className="mt-6 space-y-5">
            <div className="flex gap-3">
              <RouteNodeIcon
                size={20}
                className="mt-0.5 shrink-0 text-steel"
              />
              <div>
                <dt className="font-display font-semibold text-ink">
                  Federal authority (interstate)
                </dt>
                <dd className="mt-1 text-slate">
                  Interstate carriers need federal USDOT and MC. We file both and
                  track them to active authority.
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <RouteNodeIcon
                size={20}
                className="mt-0.5 shrink-0 text-steel"
              />
              <div>
                <dt className="font-display font-semibold text-ink">
                  IRP and IFTA through FLHSMV
                </dt>
                <dd className="mt-1 text-slate">
                  In Florida,{" "}
                  <CrossLink href="/irp-registration/">IRP</CrossLink> apportioned
                  plates and{" "}
                  <CrossLink href="/ifta-registration/">IFTA</CrossLink> are
                  handled through the Florida Department of Highway Safety and
                  Motor Vehicles (FLHSMV). We confirm what your Florida operation
                  needs.
                </dd>
              </div>
            </div>
          </dl>

          <p className="mt-6 border-l-4 border-steel pl-4 text-sm text-slate">
            State filing details can change. We verify the current FLHSMV schedule
            against the agency before we file for you.
          </p>
        </Container>
      </Section>

      {/* What we file for Florida carriers (routing UP to the money pages) */}
      <Section surface="paper">
        <Container>
          <h2
            id="what-we-file"
            className="scroll-mt-24 font-display text-3xl font-bold text-ink"
          >
            What we file for Florida carriers
          </h2>
          <p className="mt-4 max-w-[68ch] text-slate">
            The setup is done on our national filing pages. This is the Florida
            on-ramp: each card links to the page that actually does the filing, so
            the work and the pricing stay in one place.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </Container>
      </Section>

      {/* Truck dispatch in Florida (retained, lighter, Steel-accented) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Truck dispatch in Florida
          </h2>
          <p className="mt-4 max-w-[68ch] text-slate">
            Once you are road-legal, the next problem is keeping the truck moving.
            We dispatch Florida owner-operators and small fleets: finding loads,
            negotiating rate, and handling the booking paperwork so you stay
            driving. If you are already running and just need freight, our{" "}
            <CrossLink href="/services/">truck dispatch</CrossLink> picks up from
            there.
          </p>

          {/* Empty-proof block: no Florida client story cleared yet. Short
              FL-specific line, under 8 words, distinct from other pages. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Florida client story landing here soon.
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Starting a trucking company in Florida? We file the federal setup, route the FLHSMV pieces, and keep you loaded."
        cta={{ label: "Start your Florida setup", href: filingCtaHref }}
      />
    </>
  );
}

// Steel inline cross-link (1 to 3 word contextual anchor), never a button.
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
