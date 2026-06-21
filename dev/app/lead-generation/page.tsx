import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { RouteNodeIcon, FilingIcon, ArrowRightIcon } from "@/components/icons";
import { breadcrumbNode, faqNode, graph, serviceNode } from "@/lib/schema";

// The single capture action for this page. The brief flags the route [VERIFY]:
// "/services/" or "/contact-us/". Routing to the dispatch hub "/services/" (a
// confirmed slug and the page's forward destination), per the design spec which
// frames capture toward the dispatch consultation. Re-confirm with SEO. [VERIFY]
const captureHref = "/services/";
const captureLabel = "Get loads on new authority";

export const metadata: Metadata = {
  title: "Brokers That Work With New Authority",
  description:
    "Just got your authority and brokers keep saying no? We help new-authority carriers find loads and brokers that work with new MCs, then dispatch you steadily.",
  alternates: { canonical: "/lead-generation/" },
  openGraph: {
    title: "Brokers That Work With New Authority",
    description:
      "Just got your authority and brokers keep saying no? We help new-authority carriers find loads and brokers that work with new MCs, then dispatch you steadily.",
    url: "/lead-generation/",
    type: "website",
  },
};

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// The "can you both set up" answer carries inline links; its aNode display text
// matches the plain `a` string word for word.
const faqs: Faq[] = [
  {
    q: "Why won't brokers give me loads on new authority?",
    a: "Many screen on authority age to limit risk. New MCs get fewer approvals at first.",
  },
  {
    q: "How long until more brokers work with me?",
    a: "It varies, and we cannot promise a timeline, but building a clean track record steadily opens more doors.",
  },
  {
    q: "Can you both set up my authority and find me loads?",
    a: "Yes. That is the advantage of one team: compliance plus dispatch.",
    aNode: (
      <>
        Yes. That is the advantage of one team:{" "}
        <CrossLink href="/compliance-services/">compliance</CrossLink> plus{" "}
        <CrossLink href="/services/">dispatch</CrossLink>.
      </>
    ),
  },
];

export default function LeadGenerationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "New-authority load finding and dispatch",
            slug: "/lead-generation/",
            description:
              "Tech Rig helps new-authority carriers find brokers and loads that work with new MCs, then dispatches them so their authority builds a track record.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "New Authority Loads" },
          ]),
          faqNode(faqs),
        )}
      />

      {/* Hero */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "New Authority Loads" },
            ]}
          />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Finding Brokers That Work With New Authority
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Getting your authority is the first hurdle. The second one
                surprises new carriers: brokers that want to see 6 months or a
                year of authority before they will give you a load. With a
                brand-new MC, you can feel locked out of the freight you just got
                legal to haul. We help new-authority carriers get past that, by
                finding the brokers and loads that work with new MCs and by
                dispatching you so you build a track record fast.
              </p>
              <div className="mt-7">
                <Link
                  href={captureHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  {captureLabel}
                </Link>
              </div>
            </div>

            <BreakInDiagram />
          </div>
        </Container>
      </Section>

      {/* Why brokers avoid new authority */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Why brokers avoid new authority
          </h2>
          <div className="mt-6 flex gap-3">
            <FilterIcon size={24} className="mt-0.5 shrink-0 text-steel" />
            <p className="text-slate">
              Many brokers screen on authority age to limit risk, so a new MC
              (the "30-day authority" stage) gets fewer yeses. It is not
              personal, it is a filter.
            </p>
          </div>
          {/* Lead-in line that sets up the next section. */}
          <p className="mt-6 font-display text-xl font-semibold text-ink">
            The way past a filter is a combination of the right broker
            relationships and a clean, growing track record.
          </p>
        </Container>
      </Section>

      {/* How we help new-authority carriers get loads */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How we help new-authority carriers get loads
          </h2>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4">
              <RouteNodeIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We point you to brokers and load sources that work with new
                authority.
              </span>
            </li>
            <li className="flex gap-4">
              <ArrowRightIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We dispatch you so loads start moving and your authority builds
                history.
              </span>
            </li>
            <li className="flex gap-4">
              <FilingIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We make sure your compliance is airtight, because a clean record
                is part of what gets you approved (see{" "}
                <CrossLink href="/compliance-services/">
                  compliance services
                </CrossLink>
                ).
              </span>
            </li>
          </ul>
        </Container>
      </Section>

      {/* New authority? Start at the source: the two-direction funnel bridge. */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            New authority? Start at the source
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Back to acquisition (no authority yet). */}
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-signal">
                Get road-legal
              </p>
              <p className="mt-3 text-cloud/80">
                If you do not have your authority yet, we set it up: see{" "}
                <CrossLink href="/compliance-services/" onInk>
                  compliance services
                </CrossLink>{" "}
                or the{" "}
                <CrossLink href="/how-to-start-a-trucking-company/" onInk>
                  guide to starting a trucking company
                </CrossLink>
                .
              </p>
            </div>

            {/* Two-node line diagram: road-legal -> loaded. */}
            <div className="flex items-center justify-center gap-3 text-cloud/70">
              <RouteNodeIcon size={28} className="shrink-0 text-signal" />
              <span aria-hidden="true" className="h-px w-10 bg-cloud/30" />
              <ArrowRightIcon size={20} className="shrink-0" />
              <span aria-hidden="true" className="h-px w-10 bg-cloud/30" />
              <RouteNodeIcon size={28} className="shrink-0 text-signal" />
            </div>

            {/* Forward to retention (already active). */}
            <div className="md:col-span-2">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-signal">
                Keep loaded
              </p>
              <p className="mt-3 text-cloud/80">
                Already active? Our{" "}
                <CrossLink href="/services/" onInk>
                  dispatch service
                </CrossLink>{" "}
                keeps you loaded while your authority ages into more broker
                approvals, including{" "}
                <CrossLink href="/box-truck-dispatch/" onInk>
                  box truck dispatch
                </CrossLink>{" "}
                for franchise-equipment carriers.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            New authority loads FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="New authority and no loads? We will help you break in and keep you moving."
        cta={{ label: captureLabel, href: captureHref }}
      />
    </>
  );
}

/**
 * The hero "break-in" device: a quiet static line graphic of the new-authority
 * problem resolving. Three stages in the system's single-line language with one
 * Steel accent. Honest by design: no numbers, percentages, or promised timeline.
 * Static (no animation), which is also the reduced-motion final state.
 */
function BreakInDiagram() {
  const stages = [
    "New MC, brokers say no",
    "Dispatched, track record building",
    "More broker yeses",
  ];
  return (
    <div className="rounded-2xl border border-slate/20 bg-cloud p-6 md:p-8">
      <ol className="space-y-4">
        {stages.map((stage, i) => (
          <li key={stage} className="flex items-center gap-4">
            <RouteNodeIcon
              size={22}
              className={i === stages.length - 1 ? "shrink-0 text-steel" : "shrink-0 text-slate"}
            />
            <span
              className={
                i === stages.length - 1
                  ? "font-medium text-ink"
                  : "text-slate"
              }
            >
              {stage}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Filter / gate line icon (single-line, 2px stroke, 24px grid, currentColor),
 * approximated inline because the shared icon set has no filter mark. Flag: if a
 * FilterIcon is added to components/icons.tsx, swap this for it. Do not modify
 * the shared set from this page.
 */
function FilterIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />
    </svg>
  );
}

/**
 * Steel inline cross-link (1 to 3 word contextual anchor), never a button. On the
 * Ink funnel band the anchor needs a lighter tone for AA contrast, so `onInk`
 * switches it to a Cloud/Signal treatment.
 */
function CrossLink({
  href,
  children,
  onInk = false,
}: {
  href: string;
  children: React.ReactNode;
  onInk?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        onInk
          ? "font-medium text-signal underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          : "font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
      }
    >
      {children}
    </Link>
  );
}
