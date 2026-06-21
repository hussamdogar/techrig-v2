import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AuthorityStatusTracker,
  type Step,
} from "@/components/authority-status-tracker";
import { ServiceCard } from "@/components/service-card";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { icons } from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing } from "@/lib/services";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  // Brand is appended by the title template, so it is stripped here.
  title: "Start a Trucking Company in Texas",
  description:
    "How to start a trucking company in Texas: intrastate TxDMV authority versus interstate USDOT and MC, what we file, and Texas truck dispatch. Tech Rig.",
  alternates: { canonical: "/tech-rig-dispatch-texas/" },
  openGraph: {
    title: "Start a Trucking Company in Texas",
    description:
      "How to start a trucking company in Texas: intrastate TxDMV authority versus interstate USDOT and MC, plus Texas truck dispatch.",
    url: "/tech-rig-dispatch-texas/",
    type: "website",
  },
};

// Scoped to the federal setup sequence (design spec): the tracker content is
// identical across states (the federal sequence is the same everywhere) and the
// state copy carries the difference. Honesty rules: the protest step is the
// fixed federal period, never a Tech-Rig-controlled date.
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

// The "what we file" subset: routes UP to the national money pages (the brief's
// list). Prices come from the single source; no price is restated here.
const filings: {
  icon: keyof typeof icons;
  title: string;
  href: string;
  description: string;
  priceLabel?: string;
  govFeeNote?: string;
}[] = [
  {
    icon: "filing",
    title: "USDOT Registration",
    href: "/dot-registration/",
    description: "Your federal USDOT number for interstate for-hire operation.",
    priceLabel: "USDOT filing",
    govFeeNote: "+ gov fee",
  },
  {
    icon: "stamp",
    title: "MC Authority",
    href: "/mc-registration/",
    description: "Interstate operating authority for for-hire carriers.",
    priceLabel: "MC filing",
    govFeeNote: "+ gov fee",
  },
  {
    icon: "checkSeal",
    title: "Authority Package (DOT + MC)",
    href: "/mc-dot-registration/",
    description: "USDOT and MC handled together as one setup.",
    priceLabel: "DOT + MC",
    govFeeNote: "+ gov fee",
  },
  {
    icon: "shield",
    title: "Compliance Services hub",
    href: "/compliance-services/",
    description: "The full setup: BOC-3, UCR, insurance filing, and the rest.",
  },
];

// Genuinely Texas-specific Q&A (intrastate TxDMV vs interstate MC), written
// independently of any other state page. Schema parity: the `a` text is reused
// verbatim by faqNode below.
const faqs: Faq[] = [
  {
    q: "Do I need an MC number to run only inside Texas?",
    a: "Often no. Intrastate-only Texas carriers register with the TxDMV for intrastate operating authority and may not need a federal MC number. We confirm which path fits before filing.",
  },
  {
    q: "What does an interstate Texas carrier need?",
    a: "For-hire carriers crossing state lines still need a federal USDOT number and MC authority. The TxDMV intrastate registration does not replace those federal filings.",
  },
  {
    q: "Who issues intrastate authority in Texas?",
    a: "The Texas Department of Motor Vehicles (TxDMV) handles intrastate operating authority for carriers running only within the state.",
  },
];

export default function TexasStatePage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "Trucking compliance and dispatch in Texas",
            slug: "/tech-rig-dispatch-texas/",
            description:
              "Tech Rig helps Texas operators set up trucking authority, sorting intrastate TxDMV registration from interstate USDOT and MC, then dispatches their trucks.",
            areaServedState: "Texas",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Texas" },
          ]),
          faqNode(faqs),
          personNode("adam"),
        )}
      />

      {/* Hero (Paper, asymmetric two-column) */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Texas" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                How to Start a Trucking Company in Texas
              </h1>
              {/* State-specific lede (per-state slot, independent wording). */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Texas carries one of the largest in-state freight bases in the
                country, so a lot of Texas operators run intrastate only, and
                intrastate operation has its own state registration on top of (or
                instead of) federal authority. We sort out which side of that line
                your trucks sit on, then set you up the right way.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Start your Texas setup
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

      {/* Starting a trucking company in Texas (state-nuance explainer) */}
      <Section surface="cloud">
        <Container className="max-w-[68ch]">
          <h2 className="font-display text-3xl font-bold text-ink">
            Starting a trucking company in Texas
          </h2>
          {/* State nuances, verbatim framing from the brief. [VERIFY] kept. */}
          <p className="mt-4 text-slate">
            The first question for any new Texas company is whether you will cross
            state lines or stay inside the state, because the two paths register
            differently{" "}
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
              [VERIFY current TxDMV schedule]
            </span>
            :
          </p>

          <dl className="mt-6 space-y-5">
            <div className="border-l-4 border-steel pl-4">
              <dt className="font-display font-semibold text-ink">
                Interstate, for-hire
              </dt>
              <dd className="mt-1 text-slate">
                Carriers running across state lines still need federal{" "}
                <CrossLink href="/dot-registration/">USDOT</CrossLink> and{" "}
                <CrossLink href="/mc-registration/">MC authority</CrossLink>.
              </dd>
            </div>
            <div className="border-l-4 border-steel pl-4">
              <dt className="font-display font-semibold text-ink">
                Intrastate-only Texas
              </dt>
              <dd className="mt-1 text-slate">
                These carriers register with the Texas Department of Motor Vehicles
                (TxDMV) for intrastate operating authority and may not need an MC
                number. We confirm which path fits your operation.
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      {/* What we file for Texas carriers (routes up to national money pages) */}
      <Section surface="paper" id="what-we-file">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            What we file for Texas carriers
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            The filings themselves are federal and done on our national pages. The
            Texas page just points you to the right ones.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filings.map((f) => (
              <ServiceCard
                key={f.href}
                icon={f.icon}
                title={f.title}
                href={f.href}
                description={f.description}
                price={pricing[f.href]}
                priceLabel={f.priceLabel}
                govFeeNote={f.govFeeNote}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Truck dispatch in Texas (retained, Steel-accented, subordinate) */}
      <Section surface="cloud">
        <Container className="max-w-[68ch]">
          <h2 className="font-display text-3xl font-bold text-ink">
            Truck dispatch in Texas
          </h2>
          <p className="mt-4 text-slate">
            Once you are road-legal, keeping the truck loaded is the next job. We
            book freight, handle broker calls, and run the back office so you can
            stay driving. See how our{" "}
            <CrossLink href="/services/">truck dispatch</CrossLink> works across
            equipment types.
          </p>
          {/* Quiet capability strip: the trailer line icons, Steel cue. */}
          <ul className="mt-6 flex flex-wrap gap-4" aria-hidden>
            {(["boxTruck", "reefer", "flatbed", "dryVan", "powerOnly", "hotShot"] as const).map(
              (name) => {
                const Icon = icons[name];
                return (
                  <li
                    key={name}
                    className="flex h-12 w-12 items-center justify-center rounded-card border border-slate/15 text-steel"
                  >
                    <Icon size={24} />
                  </li>
                );
              },
            )}
          </ul>
        </Container>
      </Section>

      {/* One-team funnel bridge (Ink band, used once). */}
      <Section surface="ink">
        <Container className="max-w-2xl text-center">
          <p className="font-display text-2xl font-bold text-cloud">
            One team gets you road-legal, then keeps you loaded.
          </p>
          <p className="mt-4 text-cloud/80">
            Read the full guide to{" "}
            <Link
              href="/how-to-start-a-trucking-company/"
              className="font-medium text-signal underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            >
              starting a trucking company
            </Link>
            , or go straight to{" "}
            <Link
              href="/services/"
              className="font-medium text-signal underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            >
              dispatch
            </Link>
            .
          </p>
        </Container>
      </Section>

      {/* Texas worked example: [CLIENT PROOF NEEDED] -> graceful empty-proof block.
          Short state-specific line under 8 words, unique to this page. */}
      <Section surface="paper">
        <Container className="max-w-[68ch]">
          <h2 className="font-display text-3xl font-bold text-ink">
            A Texas example
          </h2>
          <p className="mt-4 border-l-4 border-slate/25 pl-4 text-slate">
            Texas client story clearing review.
          </p>
        </Container>
      </Section>

      {/* FAQ (real Texas-specific Q&A). */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Texas trucking FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Setting up in Texas? We will sort intrastate from interstate and file it right."
        cta={{ label: "Start your Texas setup", href: filingCtaHref }}
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
