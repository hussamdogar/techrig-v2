import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { ArrowRightIcon, FlatbedIcon, RouteNodeIcon } from "@/components/icons";
import { breadcrumbNode, faqNode, graph, serviceNode } from "@/lib/schema";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  // Title tag with brand stripped per the dev rule; the brand is reattached by
  // the root layout template, so the page-level title carries no " | Tech Rig".
  title: "Flatbed Dispatch Service",
  description:
    "Our flatbed dispatch service finds steel, lumber, and machinery lanes, negotiates the work your truck is rated for, and keeps your permit and paperwork moving.",
  alternates: { canonical: "/flatbed-dispatch/" },
  openGraph: {
    title: "Flatbed Dispatch Service",
    description:
      "Our flatbed dispatch service finds steel, lumber, and machinery lanes, negotiates the work your truck is rated for, and keeps your permit and paperwork moving.",
    url: "/flatbed-dispatch/",
    type: "website",
  },
};

// What flatbed dispatch covers: the system line-icon-row capability list. Copy
// is specific to open-deck work (securing, tarping, permits, broker lanes) so it
// shares no 8+ word sentence with the hub or the other trailer pages.
const capabilities = [
  {
    label: "Load matching",
    text: "to your deck rating, securement gear, and the lanes you want to run.",
  },
  {
    label: "Rate negotiation",
    text: "that prices in the tarping, strapping, and skill the load demands.",
  },
  {
    label: "Permit coordination",
    text: "for oversize and overweight runs before the truck rolls.",
  },
  {
    label: "Billing and paperwork",
    text: "rate confirmations, BOLs, and the documents your factor needs.",
  },
  {
    label: "Support",
    text: "when a securement question or a routing change comes up mid-haul.",
  },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// The authority answer carries an inline Steel link via aNode; the plain `a`
// string stays identical for schema parity.
const faqs: Faq[] = [
  {
    q: "What does flatbed dispatch cost?",
    a: "Three percent of your gross monthly revenue. We earn when you earn, with no long-term contract and no forced dispatch.",
  },
  {
    q: "Do you handle oversize and permit loads?",
    a: "Yes. We coordinate the permits for oversize and overweight runs and keep that conversation moving so you stay loaded and legal.",
  },
  {
    q: "What kind of freight will you book?",
    a: "Steel, lumber, machinery, and building materials: the open-deck lanes your truck is rated for, matched to your securement gear.",
  },
  {
    q: "Do I have to sign a long contract?",
    a: "No. No long-term contract and no forced dispatch. You stay in control of your authority and your loads.",
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

export default function FlatbedDispatchPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Percentage model, so no single price is encoded on the Service node.
          serviceNode({
            serviceType: "Flatbed dispatch",
            slug: "/flatbed-dispatch/",
            description:
              "Tech Rig dispatches flatbed owner-operators and fleets on open-deck steel, lumber, and machinery lanes, handling securement, tarping, and oversize permits with no long-term contract.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services", slug: "/services/" },
            { name: "Flatbed Dispatch" },
          ]),
          faqNode(faqs),
        )}
      />

      {/* Hero (Paper): copy-dominant left, the quiet open-deck loop diagram right
          (the dispatch signature, NOT the Authority Status Tracker). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Dispatch Services", href: "/services/" },
              { name: "Flatbed Dispatch" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Flatbed Dispatch Service for Open-Deck Carriers
              </h1>
              {/* Hero lede transcribed verbatim from the brief. Styled paragraph,
                  never an H-tag. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Flatbed pays for skill. Loads must be secured and often tarped,
                oversize runs need permits, and the best steel, lumber, and
                machinery lanes go to carriers brokers trust. Our flatbed dispatch
                service finds those lanes, negotiates for the work your truck is
                rated for, and keeps the permit and paperwork conversations moving
                so you stay loaded and legal.
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

            <OpenDeckLoop />
          </div>
        </Container>
      </Section>

      {/* What our flatbed dispatch covers (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our flatbed dispatch covers
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
            We dispatch flatbed owner-operators and small fleets. Run one deck or
            a handful, this desk is tuned to open-deck freight.
          </p>
        </Container>
      </Section>

      {/* Equipment differentiator (Paper): the open-deck angle that sets flatbed
          apart. The bold styled lead-in plus copy, with the worked-scenario
          example callout (empty-friendly, no client named, no metric). */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Why open-deck freight needs its own desk
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            <span className="font-display font-semibold text-ink">
              Securing and tarping are part of the rate, not an afterthought.
            </span>{" "}
            A flatbed dispatcher who has never strapped a coil of steel or chained
            a piece of machinery will undersell the effort and the risk. We price
            the securement and the tarping into every load, route oversize and
            overweight runs around the permits they need, and concentrate on the
            steel, lumber, and machinery lanes where the better-paying repeat work
            lives.
          </p>

          {/* The page's worked scenario, rendered as a graceful example callout.
              Research-led framing per the brief; no client named, no metric. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Take a flatbed owner-operator who wants steady building-materials lanes
            within a regional radius rather than chasing one-off oversize runs. The
            dispatch work there is patient: building the repeatable broker
            relationships that keep that kind of freight flowing week after week.
            Client stories appear here as permissions clear.
          </p>
        </Container>
      </Section>

      {/* Flatbed dispatch pricing: the confirmed 3% percentage in the mono "price"
          treatment (NOT a PriceChip), with the no-contract trust lead-out. (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Flatbed dispatch pricing
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            One rate, tied to what you bring in, so the incentive stays on keeping
            your deck loaded with good freight.
          </p>

          <div className="mt-6 border-t-2 border-steel pt-3">
            <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
              Flatbed dispatch rate
            </p>
            <p className="mt-1 font-mono text-3xl tabular-nums text-ink">
              3%
              <span className="text-base text-slate"> of gross monthly revenue</span>
            </p>
          </div>

          {/* The dispatch trust signal, weighted like compliance fee-transparency. */}
          <p className="mt-6 border-l-4 border-steel pl-4 font-medium text-ink">
            No long-term contract, no forced dispatch, no sign-up to lock you in.
          </p>
        </Container>
      </Section>

      {/* Need authority first? funnel band: full-bleed Ink (reserved
          high-emphasis), the dispatch-to-compliance bridge. Inline Steel anchors,
          no second primary button competing with the hero/close amber action. */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            Need authority first? We can do both halves
          </h2>
          <p className="mt-4 text-cloud/80">
            Not road-legal yet? We also stand up the company, so see{" "}
            <InkLink href="/compliance-services/">compliance services</InkLink> or
            our{" "}
            <InkLink href="/how-to-start-a-trucking-company/">
              guide to starting a trucking company
            </InkLink>
            . One team means the people who get your flatbed authority active are
            the same ones who keep your deck loaded after, with no handoff and no
            gap.
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

      {/* Flatbed dispatch FAQ (Paper) */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Flatbed dispatch FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Keep your flatbed on lanes that pay for the skill the load takes. Get dispatched."
        cta={{ label: "Get dispatched", href: filingCtaHref }}
      />
    </>
  );
}

/**
 * The hero open-deck loop diagram: the dispatch signature visual that replaces
 * the compliance Authority Status Tracker. A quiet line-style cycle (find lane ->
 * secure and price -> rolling -> repeat) built from borders and inline SVG, one
 * Steel accent, no numbers or percentages. The flatbed line icon anchors the top
 * so the silo reads consistently with the dispatch-hub card.
 */
function OpenDeckLoop() {
  const nodes = ["Find lane", "Secure and price", "Rolling"];
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-6"
      aria-label="The flatbed dispatch loop: find lane, secure and price, rolling, repeat."
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
          The open-deck loop
        </p>
        <span className="text-steel">
          <FlatbedIcon size={28} />
        </span>
      </div>
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
