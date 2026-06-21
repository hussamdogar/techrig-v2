import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { FounderCard } from "@/components/founder-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { ShieldIcon, TrailerNavIcon } from "@/components/icons";
import { aboutPageNode, breadcrumbNode, graph, personNode } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  // Brief title tag is "About Tech Rig | Trucking Compliance"; the layout
  // appends the " | Tech Rig" brand suffix, so we set the absolute title to the
  // brief's intent without doubling the brand.
  title: { absolute: "About Tech Rig | Trucking Compliance" },
  description:
    "About Tech Rig: a trucking compliance and dispatch team helping carriers since 2021. FMCSA-listed BOC-3 process agent, led by hands-on co-founders.",
  alternates: { canonical: "/about-us/" },
  openGraph: {
    title: "About Tech Rig | Trucking Compliance",
    description:
      "About Tech Rig: a trucking compliance and dispatch team helping carriers since 2021. FMCSA-listed BOC-3 process agent, led by hands-on co-founders.",
    url: "/about-us/",
    type: "website",
  },
};

// The two founder bios, verbatim from the brief. Aliases only; the third
// (finance/strategy) founder is never published, and real names never appear.
// The ids are the canonical anchor targets reused by money-page "Reviewed by"
// links, so they must stay stable (#adam-smith / #robert-hooke).
const founders = [
  {
    id: "adam-smith",
    name: "Adam Smith",
    role: "Co-Founder",
    initials: "AS",
    bio: "Adam leads our sales and trucking-compliance operations. He works directly with new motor carriers, owner-operators, and brokers to spot registration issues, complete the required filings, and untangle problems with operating authority, BOC-3, UCR, MCS-150 records, and driver compliance. His law background shows in how carefully he handles regulatory requirements and documentation.",
  },
  {
    id: "robert-hooke",
    name: "Robert Hooke",
    role: "Co-Founder",
    initials: "RH",
    bio: "Robert works across sales and compliance, helping clients with FMCSA registration, authority filings, BOC-3, UCR, and related requirements. A software engineer by training, he brings a systems mindset to how we manage client information, filings, and compliance workflows, which is part of why we move quickly on things like MOTUS issues.",
  },
];

// The three operating principles (How we work), bold lead-in plus the rest of
// the line. Brief's exact wording; rendered as typographic value lines, not
// cards.
const principles = [
  {
    lead: "We tell you which filings actually apply",
    rest: " to your operation, not a one-size list.",
  },
  {
    lead: "We separate our service fee from government and third-party costs",
    rest: ", every time.",
  },
  {
    lead: "We do not promise activation dates we cannot control",
    rest: ", and we do not publish numbers we cannot back up.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Both Person nodes are emitted here so the #adam-smith / #robert-hooke
          // references reused across money pages and blog posts resolve to the
          // canonical entities. No review/rating markup (brand rule).
          personNode("adam"),
          personNode("robert"),
          aboutPageNode("/about-us/"),
          breadcrumbNode([{ name: "Home", slug: "/" }, { name: "About" }]),
        )}
      />

      {/* Hero (Paper, asymmetric two-column; copy-first stack on mobile). No
          filing CTA here: the single Signal action is held for the close. */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "About" }]}
          />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                About Tech Rig
              </h1>
              {/* The brief's lede as a styled paragraph (never an H-tag). Carries
                  "Tech Rig" and "trucking compliance" for the Three Kings check,
                  and the FMCSA listing as a worded credibility line. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Tech Rig is a trucking compliance and dispatch company built by
                people who do the filings, not just talk about them. Since 2021
                we have helped new motor carriers, owner-operators, and brokers
                get set up and stay loaded, across more than 10 states. We are
                officially listed by FMCSA as a BOC-3 blanket process-agent
                company.
              </p>
            </div>

            {/* Signature visual: a quiet two-node "Get road-legal -> Keep loaded"
                line diagram, built inline (icons + a 2px SVG connector), not the
                Authority Status Tracker. Decorative, so it is hidden from a11y. */}
            <JourneyDiagram />
          </div>
        </Container>
      </Section>

      {/* H2 What we do: two short styled paragraphs (not matched cards) with
          inline Steel contextual links. Cloud surface. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What we do
          </h2>
          <p className="mt-5 text-lg text-slate">
            We handle the two things a trucking business needs: getting legally
            set up and staying that way (see{" "}
            <SteelLink href="/compliance-services/">compliance services</SteelLink>
            ), and keeping the truck earning once you are active (see{" "}
            <SteelLink href="/services/">dispatch</SteelLink>).
          </p>
          <p className="mt-5 text-lg text-slate">
            One team for the whole journey, from your first filing to your next
            load.
          </p>
        </Container>
      </Section>

      {/* H2 Our track record: the trust band. Documented proof only, in the mono
          "official record" treatment. The FMCSA line worded exactly; partners as
          plain text; an empty-friendly review slot (no stars, no invented
          testimonials). Paper surface. */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Our track record
          </h2>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                stat: "Since 2021",
                label: "Dispatching carriers, around 100 served.",
              },
              {
                stat: "40+ carriers",
                label:
                  "A compliance practice helping carriers, owner-operators, and brokers across more than 10 states since 2025.",
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="rounded-card border border-slate/15 bg-cloud p-6"
              >
                <dt className="font-mono text-2xl font-semibold tabular-nums text-ink">
                  {item.stat}
                </dt>
                <dd className="mt-2 text-slate">{item.label}</dd>
              </div>
            ))}
          </dl>

          {/* FMCSA credibility line, exact wording from site.fmcsaLine. A worded
              statement, never a government seal or endorsement badge. */}
          <p className="mt-8 border-l-4 border-steel pl-4 text-slate">
            {site.fmcsaLine}
          </p>

          <p className="mt-6 text-slate">
            We keep working relationships with Motive for ELD, and OTR Solutions
            and RTS Financial for factoring.
          </p>

          {/* Empty-friendly review slot: reads fine while empty, no ratings, no
              stars, no invented testimonials. The client populates it later. */}
          <div className="mt-8 rounded-card border border-dashed border-slate/25 bg-paper p-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate">
              Carrier reviews
            </p>
            <p className="mt-2 text-slate">
              We publish carrier feedback here as clients approve it. We do not
              post ratings or testimonials we cannot stand behind.
            </p>
          </div>
        </Container>
      </Section>

      {/* H2 Meet the team: EXACTLY TWO founder cards, aliases only, never a third.
          The shared FounderCard component carries the stable anchor ids. Cloud
          surface, two-up on desktop, stacked on mobile, equal height. */}
      <Section surface="cloud">
        <Container className="max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Meet the team
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {founders.map((f) => (
              <FounderCard
                key={f.id}
                id={f.id}
                name={f.name}
                role={f.role}
                bio={f.bio}
                initials={f.initials}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* H2 How we work: three short typographic value lines with bold styled
          lead-ins (the honesty principles), not cards. Paper surface. */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How we work
          </h2>
          <ul className="mt-8 space-y-6">
            {principles.map((p) => (
              <li key={p.lead} className="text-lg text-slate">
                <span className="font-semibold text-ink">{p.lead}</span>
                {p.rest}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Closing CTA band: the page's single Signal action, held for the close. */}
      <ClosingCta
        text="Want a team that handles setup and keeps you loaded? Talk to us."
        cta={{ label: "Contact Tech Rig", href: "/contact-us/" }}
      />
    </>
  );
}

// Steel inline contextual link (1 to 3 word anchor), never a button.
function SteelLink({
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

/**
 * The hero "one team, whole journey" device: two nodes (Get road-legal -> Keep
 * loaded) joined by a 2px line, expressing the dual-silo company in the brand's
 * line language. Built inline from existing icons plus a thin SVG connector, not
 * the Authority Status Tracker. Purely decorative, so it is hidden from
 * assistive tech; the meaning is carried by the visible labels.
 */
function JourneyDiagram() {
  return (
    <div
      aria-hidden
      className="rounded-card border border-slate/15 bg-cloud p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <Node
          icon={<ShieldIcon size={28} className="text-steel" />}
          label="Get road-legal"
        />
        {/* 2px connector line with a forward tick, in the brand line language. */}
        <svg
          viewBox="0 0 64 24"
          className="h-6 flex-1 text-slate/50"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12h54" />
          <path d="m50 6 6 6-6 6" />
        </svg>
        <Node
          icon={<TrailerNavIcon size={28} className="text-steel" />}
          label="Keep loaded"
        />
      </div>
      <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate">
        One team, the whole journey
      </p>
    </div>
  );
}

function Node({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-slate/20 bg-paper">
        {icon}
      </span>
      <span className="font-display text-sm font-semibold text-ink">
        {label}
      </span>
    </div>
  );
}
