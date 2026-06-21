import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import {
  ArrowRightIcon,
  ClockIcon,
  ReeferIcon,
  RouteNodeIcon,
} from "@/components/icons";
import { breadcrumbNode, faqNode, graph, serviceNode } from "@/lib/schema";
import { dispatchNav } from "@/lib/services";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  // Title tag with brand stripped per the dev rule; the brand is reattached by
  // the root layout template, so the page-level title carries no " | Tech Rig".
  title: "Reefer Dispatch Service",
  description:
    "Reefer dispatch for owner-operators and small fleets. We keep your reefer on temperature-controlled lanes that respect your hours and your rate, by load.",
  alternates: { canonical: "/reefers-trucking/" },
  openGraph: {
    title: "Reefer Dispatch Service",
    description:
      "Reefer dispatch for owner-operators and small fleets. We keep your reefer on temperature-controlled lanes that respect your hours and your rate, by load.",
    url: "/reefers-trucking/",
    type: "website",
  },
};

// What our reefer dispatch covers: the system line-icon-row capability list
// (content-bearing rows), two-up on desktop. Reefer-specific, distinct wording
// from the hub's generic capability copy (uniqueness rule).
const capabilities = [
  {
    label: "Temperature-aware booking",
    text: "matched to your reefer, set-point, and the commodities you run.",
  },
  {
    label: "Appointment scheduling",
    text: "kept on top of the tight delivery windows reefer brokers demand.",
  },
  {
    label: "Backhaul pairing",
    text: "so an inbound produce run finds profitable outbound freight, not deadhead.",
  },
  {
    label: "Rate negotiation",
    text: "for the premium that temperature accountability should pay.",
  },
  {
    label: "Billing and paperwork",
    text: "including rate confirmations and the documents factoring needs.",
  },
];

// Sibling pointer per the design deltas: cross-link to a relevant sibling
// (dry van) and up to the dispatch hub. Steel, subordinate to the amber action.
const dryVanNav = dispatchNav[4]; // /dry-van-trucking/

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "How does reefer dispatch pricing work?",
    a: "Reefer dispatch is 3% of your gross monthly revenue. We earn when you earn, with no long-term contract and no forced dispatch.",
  },
  {
    q: "Do you handle the appointment scheduling reefer brokers require?",
    a: "Yes. Reefer freight runs on narrow delivery windows, so we stay on top of the appointment scheduling and keep your slots from slipping.",
  },
  {
    q: "Can you find paying backhauls instead of one-way produce runs?",
    a: "That is the core of the work: pairing inbound produce with profitable outbound freight so the truck is not running empty back.",
  },
  {
    q: "Do you dispatch single-truck reefer owner-operators?",
    a: "Yes. Owner-operators and small fleets running temperature-controlled freight are who we serve.",
  },
];

export default function ReeferDispatchPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Percentage model, so no single price is encoded on the Service node.
          serviceNode({
            serviceType: "Reefer dispatch",
            slug: "/reefers-trucking/",
            description:
              "Tech Rig dispatches reefer owner-operators and small fleets on temperature-controlled lanes, keeping appointment windows and pairing backhauls, with no long-term contract and no forced dispatch.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services", slug: "/services/" },
            { name: "Reefer Dispatch" },
          ]),
          faqNode(faqs),
        )}
      />

      {/* Hero (Paper): copy-dominant left, the reefer signature visual right
          (trailer icon at spot scale with a tight-window / temperature motif,
          NOT the Authority Status Tracker). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Dispatch Services", href: "/services/" },
              { name: "Reefer Dispatch" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Reefer Dispatch Service
              </h1>
              {/* Hero lede transcribed verbatim from the brief. Styled paragraph,
                  never an H-tag. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Reefer freight pays well because it is unforgiving. Narrow
                delivery windows, temperature accountability, and seasonal
                swings in produce and protein mean a missed appointment or a
                soft lane costs real money. Our reefer dispatch service keeps
                your trailer on lanes that respect your hours and your rate, and
                stays on top of the appointment scheduling reefer brokers
                demand.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get dispatched
                </Link>
              </div>
            </div>

            <ReeferSignature />
          </div>
        </Container>
      </Section>

      {/* What our reefer dispatch covers (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our reefer dispatch covers
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {capabilities.map((c) => (
              <li key={c.label} className="flex gap-3">
                <RouteNodeIcon size={20} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">
                  <span className="font-display font-semibold">{c.label}</span>{" "}
                  {c.text}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Equipment-specific differentiator (Paper): temperature windows,
          produce/protein seasonality, reefer breakdown risk. The bold styled
          lead-in plus copy, with the page's worked scenario as the quiet
          example callout (left Steel rule, Slate text). */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Why reefer dispatch is its own discipline
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            <span className="font-display font-semibold text-ink">
              The clock and the thermometer set the terms.
            </span>{" "}
            Produce and protein seasons swing hard, the best windows are tight,
            and a reefer that goes down mid-load turns a profitable run into a
            claim. Dispatch for this equipment means reading the seasonal market,
            protecting the appointment, and keeping the truck on lanes where the
            temperature premium is real, not chasing whatever posts.
          </p>

          {/* Worked scenario: [CLIENT PROOF NEEDED] rendered as a graceful,
              research-led example callout. No client named, no metric claimed. */}
          <p className="mt-6 border-l-[1.5px] border-steel pl-4 text-slate">
            Take a reefer carrier running seasonal produce out of a major growing
            region. The trap is one-way runs into a soft market, then deadhead
            home. The dispatch work is pairing those inbound loads with paying
            backhauls, so each leg earns and the truck is rarely empty. A real
            carrier story will sit here once a client clears one to share.
          </p>
        </Container>
      </Section>

      {/* Reefer dispatch pricing: the percentage model in mono (NOT a PriceChip).
          Reefer is the confirmed 3% of gross. (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Reefer dispatch pricing
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            One rate, tied to what you bring in. We charge a percentage of your
            gross, so we earn only when you do.
          </p>

          <p className="mt-6 font-mono text-3xl tabular-nums text-ink">
            3%
            <span className="text-lg text-slate"> of gross monthly revenue</span>
          </p>

          {/* The dispatch trust signal, weighted like the hub's. */}
          <p className="mt-6 border-l-4 border-steel pl-4 font-medium text-ink">
            No long-term contract, no forced dispatch, no sign-up to lock you in.
          </p>
        </Container>
      </Section>

      {/* Need authority first? funnel band: full-bleed Ink, the
          dispatch-to-compliance bridge. Inline Steel anchor, no second primary
          button competing with the hero/close amber action. */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            Need authority first? We can do both halves
          </h2>
          <p className="mt-4 text-cloud/80">
            If you are not active yet, we also handle the setup: see our{" "}
            <InkLink href="/compliance-services/">compliance services</InkLink>.
            The people who get your authority road-legal are the same ones who
            keep your reefer loaded after, with no handoff and no gap.
          </p>

          {/* Two-node Get road-legal -> Keep loaded diagram (one Steel accent). */}
          <div className="mt-8 flex items-center gap-4">
            <span className="rounded-btn border border-cloud/30 px-4 py-2 font-display text-sm font-semibold text-cloud">
              Get road-legal
            </span>
            <ArrowRightIcon size={24} className="text-steel" />
            <span className="rounded-btn border border-cloud/30 px-4 py-2 font-display text-sm font-semibold text-cloud">
              Keep loaded
            </span>
          </div>
        </Container>
      </Section>

      {/* Reefer dispatch FAQ (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Reefer dispatch FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
          {/* Sibling + hub links, Steel and subordinate to the amber action. */}
          <p className="mt-8 text-slate">
            Run more than one trailer type? See{" "}
            <SteelLink href={dryVanNav.slug}>dry van dispatch</SteelLink> or the
            full <SteelLink href="/services/">dispatch hub</SteelLink>.
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Keep your reefer on lanes that respect your hours and your rate. Get dispatched."
        cta={{ label: "Get dispatched", href: filingCtaHref }}
      />
    </>
  );
}

/**
 * The reefer hero signature visual: the trailer's own line icon at spot scale
 * with a tight-window / temperature motif (a clock accent on the load nodes),
 * expressing "temperature-controlled, time-critical" per the design deltas.
 * Built from borders and inline SVG, one Steel accent, no revenue or utilization
 * numbers. Static server markup; any calm fade-in lives in the design system.
 */
function ReeferSignature() {
  const nodes = ["Inbound produce", "Tight window", "Paying backhaul"];
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-6"
      aria-label="Reefer dispatch: inbound produce, tight delivery window, paying backhaul."
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
          Temperature, time-critical
        </p>
        <ReeferIcon size={28} className="text-steel" />
      </div>
      <ul className="mt-5 space-y-4">
        {nodes.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-steel text-steel">
              {i === 1 ? <ClockIcon size={18} /> : <RouteNodeIcon size={18} />}
            </span>
            <span className="font-display font-semibold text-ink">{label}</span>
            {i < nodes.length - 1 ? (
              <ArrowRightIcon size={18} className="ml-auto text-slate" />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Steel inline cross-link (1 to 3 word contextual anchor), never a button. Used
// for the sibling and hub links on Paper/Cloud surfaces.
function SteelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
    >
      {children}
    </Link>
  );
}

// Inline link tuned for the Ink funnel band: Steel anchor with a Cloud focus
// ring for contrast against the dark surface.
function InkLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
    >
      {children}
    </Link>
  );
}
