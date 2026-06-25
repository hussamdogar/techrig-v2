import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { AuthorityStatusTracker } from "@/components/authority-status-tracker";
import { PriceChip } from "@/components/ui/price-chip";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import {
  ClockIcon,
  FilingIcon,
  RouteNodeIcon,
  ShieldIcon,
} from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  ORG_ID,
  PERSON_IDS,
  personNode,
} from "@/lib/schema";
import { type Price } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Start a Trucking Company",
  description:
    "How to start a trucking company, step by step: form your LLC, get your USDOT and MC authority, file BOC-3 and UCR, and pass your first safety audit. A clear guide.",
  alternates: { canonical: "/how-to-start-a-trucking-company/" },
  openGraph: {
    title: "How to Start a Trucking Company",
    description:
      "How to start a trucking company, step by step: form your LLC, get your USDOT and MC authority, file BOC-3 and UCR, and pass your first safety audit. A clear guide.",
    url: "/how-to-start-a-trucking-company/",
    type: "website",
  },
};

// The nine genuine steps of the guide. Mono numbers are aria-hidden (the
// sequence is decorative ordering, not part of the step title). Each step
// carries the brief's inline 1 to 3 word money-page links, Steel anchors.
type RoadmapStep = {
  num: string;
  title: string;
  body: React.ReactNode;
  /** Step 9 echoes the hero tracker's protest-period node visually. */
  protest?: boolean;
};

const steps: RoadmapStep[] = [
  {
    num: "01",
    title: "Form your business entity",
    body: (
      <>
        Most carriers set up an <CrossLink href="/trucking-llc/">LLC</CrossLink>{" "}
        and get an EIN. This separates your business and personal liability.
      </>
    ),
  },
  {
    num: "02",
    title: "Get your USDOT number",
    body: (
      <>
        Your federal ID as a carrier. See{" "}
        <CrossLink href="/dot-registration/">USDOT registration</CrossLink>.
      </>
    ),
  },
  {
    num: "03",
    title: "Get your MC operating authority",
    body: (
      <>
        If you will haul regulated freight for hire. See{" "}
        <CrossLink href="/mc-registration/">MC authority</CrossLink>.
      </>
    ),
  },
  {
    num: "04",
    title: "File your BOC-3",
    body: (
      <>
        Names a process agent in every state; required before authority
        activates. See{" "}
        <CrossLink href="/boc-3-filing/">BOC-3 filing</CrossLink>.
      </>
    ),
  },
  {
    num: "05",
    title: "Get insurance and have it filed with FMCSA",
    body: (
      <>
        Your authority will not activate until your insurer files proof of
        insurance with FMCSA. Insurance is arranged with your own insurer; we do
        not sell or file it.
      </>
    ),
  },
  {
    num: "06",
    title: "Register for UCR",
    body: (
      <>
        Annual, based on fleet size. See{" "}
        <CrossLink href="/ucr-registration/">UCR registration</CrossLink>.
      </>
    ),
  },
  {
    num: "07",
    title: "Set up driver compliance",
    body: (
      <>
        <CrossLink href="/driver-qualification-files/">
          driver qualification files
        </CrossLink>
        ,{" "}
        <CrossLink href="/fmcsa-clearinghouse-registration/">
          Clearinghouse
        </CrossLink>
        , and a{" "}
        <CrossLink href="/drug-and-alcohol-consortium/">
          drug and alcohol consortium
        </CrossLink>{" "}
        with pre-employment testing. This applies even if you are the only
        driver.
      </>
    ),
  },
  {
    num: "08",
    title: "Handle interstate operations filings",
    body: (
      <>
        <CrossLink href="/irp-registration/">IRP apportioned plates</CrossLink>{" "}
        and <CrossLink href="/ifta-registration/">IFTA</CrossLink> if you run
        across state lines, plus an{" "}
        <CrossLink href="/eld-services/">ELD</CrossLink>.
      </>
    ),
  },
  {
    num: "09",
    title: "Get through the 21-day protest period and your first safety audit",
    body: (
      <>
        Authority can activate after the mandatory protest period; new carriers
        face a safety audit early, so your driver files and records need to be in
        order.
      </>
    ),
    protest: true,
  },
];

// The generalized lessons, the pillar's E-E-A-T payload. No client names, no
// invented metrics. Each row pairs a single-line icon with the brief's lesson.
const mistakes: { Icon: typeof ShieldIcon; lead: string; rest: string }[] = [
  {
    Icon: FilingIcon,
    lead: "Submitting an application is not the same as being ready to operate.",
    rest: "Carriers reach day 21 and cannot activate because the BOC-3 or insurance was missing or wrong. UCR is separate and does not gate activation.",
  },
  {
    Icon: ShieldIcon,
    lead: "The wrong authority classification",
    rest: "blocks the work you intended to do.",
  },
  {
    Icon: FilingIcon,
    lead: "Owner-operators still need driver qualification files.",
    rest: "Being the only driver does not waive it.",
  },
  {
    Icon: ClockIcon,
    lead: "Drug tests expire.",
    rest: "A pre-employment test older than 30 days can mean a new one before a driver can start.",
  },
  {
    Icon: FilingIcon,
    lead: "Small record errors cause big problems.",
    rest: "A missing apartment number on an FMCSA record nearly got a carrier's insurance cancelled.",
  },
  {
    Icon: ClockIcon,
    lead: "The MOTUS transition adds delays.",
    rest: "Records often must be claimed or linked before a filing will go through.",
  },
];

// The full setup package fee ($1,700, from the brief and services.md).
// services.ts has no "/compliance-services/" pricing key, so the package figure
// is declared inline here rather than read from the single pricing source. If a
// package slug is added to lib/services pricing, switch this to read from it so
// the number cannot drift.
const packagePrice: Price = { kind: "flat", amount: 1700 };

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "How long does it take to start a trucking company?",
    a: "The filings can be done quickly, but FMCSA requires a mandatory 21-day protest period before authority activates, and processing time varies. We do not promise a date.",
  },
  {
    q: "Do I need an LLC to start a trucking company?",
    a: "Not legally required, but most carriers form one to separate business and personal liability and to get an EIN.",
  },
  {
    q: "Do I need both a USDOT and an MC number?",
    a: "Many interstate for-hire carriers need both. Some carriers need only a USDOT number. It depends on your operation.",
  },
  {
    q: "Can I do this myself?",
    a: "Yes. Most of it is doable. People come to us when classifications, MOTUS, or the order of filings trips them up, or when they would rather not risk a delay.",
  },
  {
    q: "What is the first thing I should do?",
    a: "Decide what and where you will haul and your equipment, then form your entity. Those choices drive every filing after.",
  },
];

// The on-page table of contents. Anchor links to the major H2s and the 9-step
// roadmap, the long-form aid the brief requires (mono "document index" feel).
const toc: { id: string; label: string }[] = [
  { id: "before-you-file", label: "Before you file" },
  { id: "nine-steps", label: "How to start in 9 steps" },
  { id: "costs", label: "How much it costs" },
  { id: "mistakes", label: "Mistakes that stall carriers" },
  { id: "after-activation", label: "After activation" },
  { id: "faq", label: "FAQ" },
];

// The Article node, built from the brief's facts. Headline matches the H1. No
// dates: the brief calls for real datePublished/dateModified but supplies none,
// so they are omitted rather than invented.
function articleNode() {
  return {
    "@type": "Article",
    headline: "How to Start a Trucking Company",
    description:
      "A step-by-step guide to starting a trucking company: forming your entity, getting your USDOT and MC authority, filing BOC-3 and UCR, driver compliance, and your first safety audit.",
    author: { "@id": PERSON_IDS.adam },
    publisher: { "@id": ORG_ID },
    url: `${site.url}/how-to-start-a-trucking-company/`,
  };
}

export default function HowToStartATruckingCompanyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          articleNode(),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "How to Start a Trucking Company" },
          ]),
          faqNode(faqs),
          personNode("adam"),
        )}
      />

      {/* Hero: asymmetric two-column, copy-first on mobile. The guide is the
          hero, not a button: the only CTA here is a quiet inline soft route. */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <div className="mt-2 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
                Guide
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                How to Start a Trucking Company
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Starting a trucking company is a sequence of decisions and
                federal filings, and the order matters. Do it in the right order
                and you are hauling in weeks. Do it out of order and you can
                finish all the paperwork only to find your authority will not
                activate. This guide walks the whole path, from forming your
                company to passing your first safety audit, and points you to the
                exact filing when you are ready to act. It is written from the
                filings we run every week, including the ones that go wrong.
              </p>

              {/* Soft inline route, the hero's only CTA (no hard button). */}
              <p className="mt-5 text-slate">
                Want this done for you? See our{" "}
                <CrossLink href="/compliance-services/">
                  compliance services
                </CrossLink>
                .
              </p>

              {/* Article author byline (E-E-A-T). A byline, not a Reviewed-by
                  chip, per the design spec: mono label plus name. */}
              <p className="mt-6 font-mono text-sm text-slate">
                <span className="uppercase tracking-[0.08em]">By</span>{" "}
                <span className="text-ink">Adam Smith</span>, Co-Founder
              </p>
            </div>

            {/* Signature visual: the canonical authority journey, honest states,
                no dates or countdown. Sets the mental model for the guide. */}
            <AuthorityStatusTracker />
          </div>
        </Container>
      </Section>

      {/* On-page table of contents (document index). */}
      <Section surface="cloud" className="py-8 md:py-10">
        <Container>
          <nav aria-label="On this page">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
              On this page
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {toc.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`#${t.id}`}
                    className="font-mono text-sm text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      {/* Before you file: decisions. Lead-ins are styled paragraphs, not H-tags.
          The freight-forwarder mistake is the system's quiet example callout. */}
      <Section surface="paper" id="before-you-file" className="scroll-mt-24">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Before you file: decisions that shape everything
          </h2>

          <div className="mt-6 space-y-5 text-slate">
            <p>
              <span className="font-semibold text-ink">
                What will you haul, and where?
              </span>{" "}
              Cargo type and interstate vs intrastate decide which authority and
              filings you need.
            </p>
            <p>
              <span className="font-semibold text-ink">What equipment?</span> Box
              truck, hotshot, reefer, flatbed, dry van, or power only. This
              affects insurance and, later, how you get loads.
            </p>
            <p>
              <span className="font-semibold text-ink">Carrier or broker?</span>{" "}
              They are different authorities with different requirements.
            </p>
          </div>

          <p className="mt-6 border-l-[1.5px] border-steel pl-4 text-slate">
            A wrong call here is the single most expensive mistake we fix. One
            carrier registered as a freight forwarder when he meant to haul his
            own freight, which did not authorize him to operate, and it cost him
            a refile and weeks of delay.
          </p>
        </Container>
      </Section>

      {/* The 9-step roadmap: the centerpiece and the main internal-link
          distributor. A vertical connected spine with numbered nodes. Mono step
          numbers are aria-hidden; titles carry no number. */}
      <Section surface="paper" id="nine-steps" className="scroll-mt-24 border-t border-slate/10">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How to start a trucking company in 9 steps
          </h2>
          <p className="mt-4 text-slate">
            Each step links to the exact filing when you are ready to act. The
            order is what keeps your authority from stalling.
          </p>

          <ol className="mt-8">
            {steps.map((step, i) => {
              const last = i === steps.length - 1;
              return (
                <li key={step.num} className="flex gap-5">
                  {/* Spine: numbered node plus connector down to the next step. */}
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden
                      className={
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-medium tabular-nums " +
                        (step.protest
                          ? "border-status-progress text-status-progress"
                          : "border-steel text-steel")
                      }
                    >
                      {step.num}
                    </span>
                    {!last ? (
                      <span
                        className="my-1 w-px flex-1 bg-slate/25"
                        aria-hidden
                      />
                    ) : null}
                  </div>

                  <div className={last ? "" : "pb-8"}>
                    <p className="font-display text-lg font-semibold text-ink">
                      {step.title}
                    </p>
                    <p className="mt-1.5 max-w-[60ch] text-slate">{step.body}</p>
                    {step.protest ? (
                      <p className="mt-2 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-status-progress">
                        <ClockIcon size={14} />
                        21-day federal protest period
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>

      {/* How much it costs: honest framing. The $1,700 package renders from the
          single PriceChip source; government and insurance costs stay on
          separate Slate lines, never blended into the service fee. */}
      <Section surface="cloud" id="costs" className="scroll-mt-24">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How much it costs to start a trucking company
          </h2>

          <div className="mt-6">
            <PriceChip
              price={packagePrice}
              label="Full setup package (service fee)"
            />
          </div>

          <div className="mt-6 space-y-4 text-slate">
            <p>
              Company and authority filings (USDOT, MC, BOC-3) plus driver
              compliance are the main service costs. Our full package that covers
              the setup is $1,700, and individual services are listed on each
              page.
            </p>
            <p>
              On top of service fees you have government fees (for example IRP and
              state fees) and your insurance premium, which vary by your
              operation. We always show government and third-party costs
              separately from our fee.
            </p>
            <p>
              The largest real-world cost is usually insurance, which depends on
              your equipment, experience, and driving record.
            </p>
          </div>

          <p className="mt-6 border-l-[1.5px] border-steel pl-4 text-slate">
            We do not publish a single &ldquo;it costs $X to start&rdquo; number,
            because an honest answer depends on your equipment, state, and whether
            you hire drivers.
          </p>
        </Container>
      </Section>

      {/* The mistakes that stall new carriers: the E-E-A-T payload. Generalized
          real lessons, no client names, no invented metrics. */}
      <Section surface="paper" id="mistakes" className="scroll-mt-24">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            The mistakes that stall new carriers
          </h2>
          <ul className="mt-6 space-y-5">
            {mistakes.map((m) => (
              <li key={m.lead} className="flex gap-4">
                <m.Icon size={22} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-slate">
                  <span className="font-medium text-ink">{m.lead}</span>{" "}
                  {m.rest}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* After activation: the funnel bridge to dispatch. A full-bleed Ink band,
          the two-node "get road-legal -> keep loaded" handoff, soft inline links. */}
      <Section surface="ink" id="after-activation" className="scroll-mt-24">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            After activation: keep your truck loaded
          </h2>

          {/* Two-node bridge diagram: get road-legal -> keep loaded. */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-chip border border-cloud/25 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-cloud">
              <ShieldIcon size={16} />
              Get road-legal
            </span>
            <span aria-hidden className="text-cloud/50">
              <RouteNodeIcon size={18} />
            </span>
            <span className="inline-flex items-center gap-2 rounded-chip border border-cloud/25 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-cloud">
              <RouteNodeIcon size={16} />
              Keep loaded
            </span>
          </div>

          <p className="mt-6 max-w-[60ch] text-cloud/85">
            Getting authority is the start. Once you are active you need freight.
            That is the other half of what we do:{" "}
            <DarkCrossLink href="/services/">truck dispatch</DarkCrossLink> that
            finds and books loads so your new authority starts earning. If you are
            running a box truck, our{" "}
            <DarkCrossLink href="/box-truck-dispatch/">
              box truck dispatch
            </DarkCrossLink>{" "}
            is our most established service.
          </p>
        </Container>
      </Section>

      {/* FAQ: FAQPage schema. The "how long" answer is the honest-expectations
          moment, no promised date. */}
      <Section surface="cloud" id="faq" className="scroll-mt-24">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How to start a trucking company FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* Closing CTA: the soft pillar close, one Signal action, routes to the
          hub rather than a hard money-page sell. */}
      <ClosingCta
        text="Know the steps but want them handled? We will take you from setup to active authority."
        cta={{ label: "See compliance services", href: "/compliance-services/" }}
      />
    </>
  );
}

// Steel inline cross-link (1 to 3 word contextual anchor), never a button.
function CrossLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
    >
      {children}
    </Link>
  );
}

// Cross-link variant tuned for the dark Ink funnel band (legible on Ink).
function DarkCrossLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-cloud underline underline-offset-4 decoration-signal hover:decoration-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
    >
      {children}
    </Link>
  );
}
