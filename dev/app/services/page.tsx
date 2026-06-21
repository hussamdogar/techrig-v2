import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { TrailerCard } from "@/components/trailer-card";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { ArrowRightIcon, RouteNodeIcon } from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { dispatchNav, type NavLink } from "@/lib/services";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  // Title tag with brand stripped per the dev rule; the brand is reattached by
  // the root layout template, so the page-level title carries no " | Tech Rig".
  title: "Truck Dispatch Service for Carriers",
  description:
    "A truck dispatch service that keeps you loaded, with no long-term contracts and no forced dispatch. We book freight for owner-operators and small fleets, by load.",
  alternates: { canonical: "/services/" },
  openGraph: {
    title: "Truck Dispatch Service for Carriers",
    description:
      "A truck dispatch service that keeps you loaded, with no long-term contracts and no forced dispatch. We book freight for owner-operators and small fleets, by load.",
    url: "/services/",
    type: "website",
  },
};

// The five capabilities of the dispatch service (brief H2 "What our truck
// dispatch service does"). Rendered as content-bearing rows, two-up on desktop.
const capabilities = [
  {
    label: "Load matching",
    text: "to your equipment, lanes, and rate targets.",
  },
  {
    label: "Rate negotiation",
    text: "with brokers so you are not leaving money on the table.",
  },
  {
    label: "Route planning",
    text: "to cut empty miles.",
  },
  {
    label: "Billing and paperwork",
    text: "including rate confirmations and the documents factoring needs.",
  },
  {
    label: "Support",
    text: "when something changes on the road.",
  },
];

// The six trailer spokes. dispatchNav[0] is the hub entry (this page), so it is
// skipped. Each card's one-line value is transcribed from the per-trailer brief
// lane profiles. Box truck is the franchise (emphasized + "MOST ESTABLISHED").
type TrailerCardData = {
  nav: NavLink;
  value: string;
  emphasized?: boolean;
  tag?: string;
};

const trailerCards: TrailerCardData[] = [
  {
    nav: dispatchNav[1], // /box-truck-dispatch/
    value: "Our most established service, built around steady box truck freight.",
    emphasized: true,
    tag: "MOST ESTABLISHED",
  },
  {
    nav: dispatchNav[2], // /reefers-trucking/
    value:
      "Temperature-controlled freight on tight appointment windows: produce, protein, frozen, and pharma.",
  },
  {
    nav: dispatchNav[3], // /flatbed-dispatch/
    value:
      "Open-deck freight: steel, lumber, machinery, with securing, tarping, and permits part of the job.",
  },
  {
    nav: dispatchNav[4], // /dry-van-trucking/
    value:
      "The volume workhorse: general palletized freight, broad load availability, real rate pressure.",
  },
  {
    nav: dispatchNav[5], // /power-only-trucking/
    value:
      "Pulling trailers others supply: drop-and-hook efficiency for carriers and 3PLs.",
  },
  {
    nav: dispatchNav[6], // /hot-shot-trucking/
    value:
      "Expedited, smaller loads on a dually and gooseneck: speed-sensitive, often for newer operators.",
  },
];

// The percentage-by-equipment rate model, from the single source (services.md
// via the brief). Equipment with no confirmed percentage renders "Contact for
// quote" per the [VERIFY] discipline, never a guessed number.
const rateRows: { equipment: string; rate: string }[] = [
  { equipment: "Box trucks", rate: "8%" },
  { equipment: "Cargo vans", rate: "5%" },
  { equipment: "Flatbeds and reefer vans", rate: "3%" },
  // Not separately listed in services.md, so [VERIFY] -> quote, not a number.
  { equipment: "Dry van", rate: "Contact for quote" },
  { equipment: "Power only", rate: "Contact for quote" },
  { equipment: "Hot shot", rate: "Contact for quote" },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// The "can you set up my authority too?" answer carries an inline Steel link via
// aNode; the plain `a` string stays identical for schema parity.
const faqs: Faq[] = [
  {
    q: "How does your dispatch pricing work?",
    a: "A percentage of your gross by equipment (box 8%, cargo van 5%, flatbed and reefer 3%). We earn when you earn.",
  },
  {
    q: "Do I have to sign a long contract?",
    a: "No. No long-term contract and no forced dispatch.",
  },
  {
    q: "What do you handle besides finding loads?",
    a: "Rate negotiation, route planning, billing and paperwork, and support.",
  },
  {
    q: "Do you dispatch single-truck owner-operators?",
    a: "Yes. Owner-operators and small fleets are who we serve.",
  },
  {
    q: "Can you set up my authority too?",
    a: "Yes. See compliance services.",
    aNode: (
      <>
        Yes. See <CrossLink href="/compliance-services/">compliance services</CrossLink>.
      </>
    ),
  },
];

export default function ServicesDispatchHubPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Percentage model, so no single price is encoded on the Service node.
          serviceNode({
            serviceType: "Truck dispatch service",
            slug: "/services/",
            description:
              "Tech Rig dispatches owner-operators and small fleets across every major trailer type, booking freight load by load with no long-term contract and no forced dispatch.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services" },
          ]),
          faqNode(faqs),
          personNode("robert"),
        )}
      />

      {/* Hero (Paper): copy-dominant left, the quiet "loaded loop" line diagram
          right (the dispatch signature, NOT the Authority Status Tracker). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Dispatch Services" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Truck Dispatch Service for Owner-Operators and Fleets
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                A good truck dispatch service does more than find loads. It
                negotiates rates, plans your routes, handles the paperwork, and
                keeps your wheels turning so you can drive. Tech Rig has
                dispatched carriers since 2021, across every major trailer type,
                with no long-term contracts and no forced dispatch. You own your
                authority and your decisions; we keep your truck loaded and your
                rates strong.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get dispatched
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Robert Hooke" />
              </div>
            </div>

            <LoadedLoop />
          </div>
        </Container>
      </Section>

      {/* What our truck dispatch service does (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our truck dispatch service does
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
          <p className="mt-6 max-w-[60ch] text-slate">
            We dispatch owner-operators and small fleets. If you run a single
            truck or a handful, this is built for you.
          </p>
        </Container>
      </Section>

      {/* Dispatch by trailer type (Paper band so the Cloud cards lift off it) */}
      <Section surface="paper">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            Dispatch by trailer type
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            Pick your equipment. Each trailer type is its own dispatch desk, with
            specialists who know its lanes, brokers, and paperwork.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trailerCards.map(({ nav, value, emphasized, tag }) => (
              <TrailerCard
                key={nav.slug}
                icon={nav.icon!}
                title={nav.label}
                href={nav.slug}
                value={value}
                emphasized={emphasized}
                tag={tag}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Truck dispatch service pricing: the percentage-by-equipment rate model
          in mono (NOT a PriceChip). Unconfirmed percentages -> "Contact for
          quote", never a guessed number. (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Truck dispatch service pricing
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            We charge a percentage of your gross by equipment, so we earn only
            when you do.
          </p>

          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate/25">
                <th className="py-2 pr-4 font-display text-sm font-semibold text-ink">
                  Equipment
                </th>
                <th className="py-2 font-display text-sm font-semibold text-ink">
                  Dispatch rate
                </th>
              </tr>
            </thead>
            <tbody>
              {rateRows.map((r) => (
                <tr key={r.equipment} className="border-b border-slate/15">
                  <td className="py-2 pr-4 text-slate">{r.equipment}</td>
                  <td className="py-2 font-mono tabular-nums text-ink">
                    {r.rate}
                    {r.rate.endsWith("%") ? (
                      <span className="text-slate"> of gross monthly revenue</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* The dispatch trust signal, weighted like compliance fee-transparency. */}
          <p className="mt-6 border-l-4 border-steel pl-4 font-medium text-ink">
            No long-term contract, no forced dispatch, no sign-up to lock you in.
          </p>
        </Container>
      </Section>

      {/* New authority? funnel band: full-bleed Ink (reserved high-emphasis),
          the dispatch-to-compliance bridge. Inline Steel anchors, no second
          primary button competing with the hero/close amber action. */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            New authority? We can do both halves
          </h2>
          <p className="mt-4 text-cloud/80">
            If you are not active yet, we also handle the setup: see{" "}
            <InkLink href="/compliance-services/">compliance services</InkLink> or
            our{" "}
            <InkLink href="/how-to-start-a-trucking-company/">
              guide to starting a trucking company
            </InkLink>
            . The advantage of one team is simple. The people who get your
            authority active are the same ones who keep your truck loaded after,
            with no handoff and no gap.
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

      {/* Why carriers choose Tech Rig dispatch: documented proof only (Paper) */}
      <Section surface="paper">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            Why carriers choose Tech Rig dispatch
          </h2>

          {/* Since-2021 / ~100 carriers in the mono "official record" treatment. */}
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border-t-2 border-steel pt-3">
              <dt className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
                Since 2021
              </dt>
              <dd className="mt-1 text-ink">Around 100 carriers dispatched.</dd>
            </div>
            <div className="border-t-2 border-steel pt-3">
              <dt className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
                Every major trailer type
              </dt>
              <dd className="mt-1 text-ink">
                Specialists per equipment, from box truck to hot shot.
              </dd>
            </div>
          </dl>

          <ul className="mt-8 max-w-2xl space-y-3 text-ink">
            <li>No long-term contracts and no forced dispatch.</li>
            <li>
              Factoring relationships with OTR Solutions and RTS Financial when
              you need cash flow.
            </li>
          </ul>

          {/* Graceful, empty-friendly review slot (no ratings, no invented proof). */}
          <p className="mt-8 max-w-2xl text-sm text-slate">
            Client stories appear here as permissions clear.
          </p>
        </Container>
      </Section>

      {/* Truck dispatch FAQ (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Truck dispatch FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Keep your truck loaded without chasing loads yourself. Get dispatched."
        cta={{ label: "Get dispatched", href: filingCtaHref }}
      />
    </>
  );
}

/**
 * The hero "loaded loop" diagram: the dispatch signature visual that replaces
 * the compliance hub's Authority Status Tracker. A quiet line-style cycle (find
 * load -> negotiate -> rolling -> repeat) built from borders and inline SVG, one
 * Steel accent, no numbers or percentages. Static by default; the one calm
 * on-load animation lives in the design system, not in this server component.
 */
function LoadedLoop() {
  const nodes = ["Find load", "Negotiate", "Rolling"];
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-6"
      aria-label="The dispatch loop: find load, negotiate, rolling, repeat."
    >
      <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
        The loaded loop
      </p>
      <ul className="mt-5 space-y-4">
        {nodes.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-steel text-steel">
              <RouteNodeIcon size={18} />
            </span>
            <span className="font-display font-semibold text-ink">{label}</span>
            {i < nodes.length - 1 ? (
              <ArrowRightIcon size={18} className="ml-auto text-slate" />
            ) : null}
          </li>
        ))}
      </ul>
      {/* The "repeat" closing arm, drawn as a 2px line returning to the top. */}
      <div className="mt-4 flex items-center gap-2 border-t-2 border-steel pt-4 text-steel">
        <ArrowRightIcon size={18} className="-scale-x-100" />
        <span className="font-mono text-sm uppercase tracking-[0.08em]">
          Repeat
        </span>
      </div>
    </div>
  );
}

// Steel inline cross-link on a Paper/Cloud surface (1 to 3 word contextual
// anchor), never a button. Used by the FAQ aNode.
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
