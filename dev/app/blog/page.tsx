import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph, personNode } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trucking Compliance and Dispatch Blog",
  // Composed (no verbatim meta description in the brief). 152 chars.
  description:
    "Plain-English guides on FMCSA compliance and truck dispatch for owner-operators and small fleets, each linking up to the Tech Rig service it explains.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: "Blog",
    description:
      "Plain-English guides on FMCSA compliance and truck dispatch for owner-operators and small fleets, each linking up to the service it explains.",
    url: "/blog/",
    type: "website",
  },
};

/**
 * The blog index. Per shared/page-briefs/blog-feeders.md the blog is TOFU
 * support, not a money silo, and the revamp job is triage plus interlinking,
 * not writing 40 posts. So the index does NOT fabricate post bodies, dates, or
 * /blog/<slug>/ entries (none of which are built yet). Instead it organises the
 * blog's two real silos (Compliance, Dispatch) and surfaces each cluster's
 * education topic, routing every link UP to the matching money/hub page on a
 * 1 to 3 word contextual anchor, exactly per the brief's interlink rules and
 * shared/sitemap-plan.md. Topics shown are the brief's own listed feeder
 * topics; their anchors are the brief's own pairings.
 */

type Topic = {
  // The education-stage question this feeder answers (the brief's own topics).
  question: string;
  // The visible anchor words (1 to 3) and the money/hub page they point UP to.
  anchor: string;
  href: string;
  // An optional second destination where the brief pairs a topic with two pages.
  anchor2?: string;
  href2?: string;
};

type Cluster = {
  // Plex Mono eyebrow category, ties the cluster to its silo (design spec §2).
  category: string;
  heading: string;
  intro: string;
  topics: Topic[];
};

const clusters: Cluster[] = [
  {
    category: "Compliance",
    heading: "Getting and keeping your authority",
    intro:
      "Education-stage answers on the filings that make and keep you road-legal. Each one hands you up to the page that gets it done.",
    topics: [
      {
        question: "How do you get a DOT and MC number?",
        anchor: "USDOT registration",
        href: "/dot-registration/",
        anchor2: "MC authority",
        href2: "/mc-registration/",
      },
      {
        question: "What is IFTA, and who has to file it?",
        anchor: "IFTA registration",
        href: "/ifta-registration/",
      },
      {
        question: "What is an ELD, and when is one required?",
        anchor: "ELD services",
        href: "/eld-services/",
      },
      {
        question: "What is CSA, and how does your score work?",
        anchor: "driver files",
        href: "/driver-qualification-files/",
        anchor2: "the Clearinghouse",
        href2: "/fmcsa-clearinghouse-registration/",
      },
      {
        question: "Surviving the FMCSA MOTUS transition: PINs, Pay.gov, and manual filings.",
        anchor: "DOT registration",
        href: "/dot-registration/",
        anchor2: "the MCS-150 update",
        href2: "/mcs-150-biennial-update/",
      },
      {
        question: "The new-carrier safety-audit checklist, in order, before you haul.",
        anchor: "driver files",
        href: "/driver-qualification-files/",
        anchor2: "consortium enrollment",
        href2: "/drug-and-alcohol-consortium/",
      },
    ],
  },
  {
    category: "Dispatch",
    heading: "Running loaded once you are legal",
    intro:
      "How dispatch actually works for owner-operators and small fleets, from rates to who books your freight. Each one links up to the dispatch page that fits.",
    topics: [
      {
        question: "What is the load-to-truck ratio, and why does it move rates?",
        anchor: "truck dispatch",
        href: "/services/",
      },
      {
        question: "Freight broker vs dispatcher: who does what for you?",
        anchor: "truck dispatch",
        href: "/services/",
      },
      {
        question: "How do you find a dispatcher for a box truck?",
        anchor: "box truck dispatch",
        href: "/box-truck-dispatch/",
      },
      {
        question: "Do you need a CDL for a box truck?",
        anchor: "box truck dispatch",
        href: "/box-truck-dispatch/",
      },
      {
        question: "The Amazon-approved box-truck blueprint: entity setup and the one-year authority rule.",
        anchor: "MC authority",
        href: "/mc-registration/",
        anchor2: "box truck dispatch",
        href2: "/box-truck-dispatch/",
      },
    ],
  },
];

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode([{ name: "Home", slug: "/" }, { name: "Blog" }]),
          // CollectionPage describes the index itself. No fabricated post list
          // (no posts are built), so mainEntity stays the Organization.
          {
            "@type": "CollectionPage",
            url: `${site.url}/blog/`,
            name: "Trucking Compliance and Dispatch Blog",
            isPartOf: { "@id": `${site.url}/#website` },
            about: { "@id": `${site.url}/#org` },
          },
          personNode("adam"),
        )}
      />

      {/* Header (Paper, single readable column, not a money-page hero). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Blog" }]}
          />
          <p className="mt-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
            Compliance and Dispatch
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            Trucking compliance and dispatch, explained
          </h1>
          <p className="mt-5 text-lg text-slate">
            Short, plain-English answers to the questions owner-operators and
            small fleets ask before they file or before they hand off their
            freight. No hype, no filler. Each topic points you up to the page
            that actually does the work.
          </p>
        </Container>
      </Section>

      {/* The two silos. Topics route UP to money/hub pages on contextual anchors. */}
      {clusters.map((cluster, i) => (
        <Section key={cluster.category} surface={i % 2 === 0 ? "cloud" : "paper"}>
          <Container className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
              {cluster.category}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">
              {cluster.heading}
            </h2>
            <p className="mt-4 text-slate">{cluster.intro}</p>

            <ul className="mt-8 space-y-7">
              {cluster.topics.map((t) => (
                <li
                  key={t.question}
                  className="border-l-2 border-slate/15 pl-5"
                >
                  <p className="font-display text-lg font-semibold text-ink">
                    {t.question}
                  </p>
                  <p className="mt-2 text-slate">
                    Reads up to <CrossLink href={t.href}>{t.anchor}</CrossLink>
                    {t.anchor2 ? (
                      <>
                        {" "}
                        and <CrossLink href={t.href2!}>{t.anchor2}</CrossLink>
                      </>
                    ) : null}
                    .
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      {/* Quiet end note, not a money-page CTA band. The blog converts through
          the contextual interlinks above, not a hard sell (design spec §4). */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <p className="border-l-4 border-steel pl-4 text-slate">
            Not sure which filing you need first? Start at the{" "}
            <CrossLink href="/compliance-services/">compliance hub</CrossLink>,
            or see how setup hands off to{" "}
            <CrossLink href="/services/">truck dispatch</CrossLink> once your
            authority is active.
          </p>
        </Container>
      </Section>
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
