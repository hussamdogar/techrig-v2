import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { PriceChip } from "@/components/ui/price-chip";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import {
  CheckSealIcon,
  ClockIcon,
  FilingIcon,
  RouteNodeIcon,
  StampIcon,
} from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing } from "@/lib/services";

// This page's own primary action: the apply flow, preselecting the migration
// service. The /apply/ route validates ?service= against the registry, so the
// motus-migration key lands the buyer on the right path.
const applyHref = "/apply/?service=motus-migration";

export const metadata: Metadata = {
  title: { absolute: "FMCSA Portal to MOTUS Migration | Tech Rig" },
  description:
    "Stuck moving an older FMCSA Portal account into MOTUS? Tech Rig handles claiming your USDOT, Company Official setup, and FMCSA support tickets, for a flat $125.",
  alternates: { canonical: "/motus-migration/" },
  openGraph: {
    title: "MOTUS Migration",
    description:
      "Tech Rig moves an older FMCSA Portal account into MOTUS: claiming your USDOT, Company Official setup, and FMCSA support tickets, for a flat $125.",
    url: "/motus-migration/",
    type: "website",
  },
};

// One source feeds both the visible FAQ accordion and the FAQPage schema
// (verbatim parity).
const faqs: Faq[] = [
  {
    q: "Why won't my old account work in MOTUS?",
    a: "FMCSA's move off the legacy portal means many existing records have to be claimed, linked, or verified before you can use or file on them. That is what this service does.",
  },
  {
    q: "Can you reinstate a dismissed MC?",
    a: "A dismissed MC generally cannot be reinstated; we file a new operating-authority application and you usually keep the old MC number (the authority age resets). We handle this often.",
  },
  {
    q: "Do I need a USDOT PIN?",
    a: "Claiming an existing USDOT can require a USDOT PIN, which FMCSA mails to the address on record, so there may be a wait for it. We work around blocks with the FMCSA callback/support process.",
  },
  {
    q: "How much and how long?",
    a: "$125 flat; about 1 to 2 weeks depending on FMCSA.",
  },
];

export default function MotusMigrationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "FMCSA Portal to MOTUS migration",
            slug: "/motus-migration/",
            description:
              "Tech Rig moves an older FMCSA Portal account into MOTUS: claiming your existing USDOT, Company Official assignment, identity verification, and FMCSA support tickets, so you can operate and file again.",
            price: 125,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "MOTUS Migration" },
          ]),
          faqNode(faqs),
          personNode("robert"),
        )}
      />

      {/* Hero. No Authority Status Tracker on this page (design spec §13): the
          records here are stranded and not yet usable, so any "active" node
          would assert a status the page cannot support. A simple migration
          motif stands in for it. */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services", href: "/compliance-services/" },
              { name: "MOTUS Migration" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                FMCSA Portal to MOTUS Migration
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                FMCSA&apos;s move from the legacy FMCSA Portal to the new MOTUS
                system has stranded a lot of established carriers. Records will
                not link, a USDOT cannot be claimed, MC authority does not show
                up, or the account simply will not come over. Tech Rig handles
                the FMCSA Portal to MOTUS migration: we get your existing record
                claimed and accessible in MOTUS so you can operate and file
                again, for a flat $125.
              </p>
              <div className="mt-7">
                <Link
                  href={applyHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Start my MOTUS migration
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Robert Hooke" role="Co-Founder" />
              </div>
            </div>

            {/* Signature visual: a record moving from the legacy FMCSA Portal
                node to the MOTUS node, with a claim cue. Two-tone Ink/Steel with
                one Signal accent on the claimed record. Inline SVG, no tracker,
                no "active" status. */}
            <MigrationMotif />
          </div>
        </Container>
      </Section>

      {/* What it covers: the six-item scope the client confirmed. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What MOTUS migration covers
          </h2>

          <ul className="mt-6 space-y-4">
            {[
              {
                Icon: CheckSealIcon,
                text: "Claiming an existing USDOT number in MOTUS.",
              },
              {
                Icon: FilingIcon,
                text: "Company Official assignment.",
              },
              {
                Icon: StampIcon,
                text: "Manual identity verification when the online path is blocked.",
              },
              {
                Icon: RouteNodeIcon,
                text: "Missing MC authority that does not appear in MOTUS.",
              },
              {
                Icon: FilingIcon,
                text: "Legacy FMCSA Portal account problems.",
              },
              {
                Icon: ClockIcon,
                text: "FMCSA support-ticket assistance to unlock or bridge the record.",
              },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">{text}</span>
              </li>
            ))}
          </ul>

          {/* Eligibility strip: the brief's own disambiguation rendered as a
              "this applies / this is the wrong page, go here" line, preserving
              the Steel cross-links exactly. */}
          <p className="mt-8 border-l-4 border-steel pl-4 text-slate">
            This is for moving an older account into MOTUS. For a brand-new
            registration, see{" "}
            <CrossLink href="/dot-registration/">USDOT registration</CrossLink>;
            to fix details on a record you already control, see{" "}
            <CrossLink href="/usdot-correction/">USDOT Correction</CrossLink>.
          </p>
        </Container>
      </Section>

      {/* Pricing: flat $125 from the single source, plus the conditional
          government-fee caveat as a plain Slate line (never a fabricated figure,
          never blended into the service price). */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our MOTUS migration service costs
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <PriceChip
              price={pricing["/motus-migration/"]}
              label="MOTUS migration, flat"
            />
            <p className="max-w-[42ch] text-sm text-slate">
              Any FMCSA government fee tied to a specific filing is separate and
              shown before you pay.
            </p>
          </div>

          <p className="mt-6">
            <Link
              href={applyHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Start my MOTUS migration
            </Link>
          </p>
        </Container>
      </Section>

      {/* How fast: honest timing, FMCSA-controlled, no guaranteed date. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How fast it is done
          </h2>
          <p className="mt-4 flex gap-3 text-slate">
            <ClockIcon size={24} className="mt-1 shrink-0 text-steel" />
            <span>
              <span className="font-mono font-medium text-ink">
                Approximately 1 to 2 weeks.
              </span>{" "}
              MOTUS migrations depend on FMCSA processing and support response,
              which is outside our control, so we do not promise an exact date.
              We drive the tickets and the verification steps and keep you
              updated.
            </span>
          </p>
        </Container>
      </Section>

      {/* The relocated California worked example, rendered as a Client Case File:
          left Steel rule, Slate text, mono field labels, a "PAST RESULT" tag.
          Real, anonymized, framed strictly as a past example, never a guarantee.
          This narrative now lives only on this page (removed from the MC pages
          per S2). */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            A real migration we handled
          </h2>

          <div className="mt-6 border-l-4 border-steel pl-5">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-steel">
              Past result
            </p>
            <p className="mt-3 text-slate">
              A California box-truck owner had an older operating authority that
              had been dismissed and wanted it back so he could keep an aged MC
              for an Amazon requirement. A dismissed MC cannot simply be
              reinstated, so we set up his MOTUS access, filed a new
              operating-authority application (he keeps the old MC number, though
              the authority age resets), and handled the BOC-3 and UCR alongside
              it. He is active now and has hired a driver. The point: getting an
              older record working in MOTUS is rarely one click, and knowing the
              path is most of the job.
            </p>
            <p className="mt-4 text-sm text-slate">
              Need the authority side handled too? See{" "}
              <CrossLink href="/mc-registration/">MC authority</CrossLink>.
            </p>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            MOTUS migration FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* Quiet cross-link to the compliance hub, kept subordinate (Steel). */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <p className="text-slate">
            Migration is one piece of getting compliant and staying that way. See
            the full{" "}
            <CrossLink href="/compliance-services/">compliance services</CrossLink>{" "}
            we handle.
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Old account stuck outside MOTUS? We will get it claimed and working."
        cta={{ label: "Start my MOTUS migration", href: applyHref }}
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

/**
 * The hero's signature visual: a record moving from the "legacy FMCSA Portal"
 * node to the "MOTUS" node, with a claim/unlock cue on the destination. Two-tone
 * Ink/Steel with one Signal accent on the claimed (MOTUS) node, matching the
 * site's line system. Single-line SVG, 2px stroke, decorative, so it is hidden
 * from assistive tech (the scope list carries the meaning in text).
 */
function MigrationMotif() {
  return (
    <div className="rounded-card border border-slate/15 bg-cloud p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-wider text-slate">
        Migration
      </p>
      <svg
        viewBox="0 0 320 180"
        fill="none"
        role="presentation"
        aria-hidden="true"
        className="mt-4 w-full"
      >
        {/* Legacy FMCSA Portal node (Steel, the record being left behind) */}
        <rect
          x="8"
          y="58"
          width="116"
          height="64"
          rx="10"
          stroke="var(--color-steel)"
          strokeWidth="2"
        />
        {/* MOTUS node (Ink frame, Signal accent: the claimed destination) */}
        <rect
          x="196"
          y="58"
          width="116"
          height="64"
          rx="10"
          stroke="var(--color-ink)"
          strokeWidth="2"
        />
        <rect
          x="196"
          y="58"
          width="116"
          height="64"
          rx="10"
          stroke="var(--color-signal)"
          strokeWidth="2"
          strokeDasharray="6 220"
          strokeDashoffset="-8"
        />
        {/* Connecting path with an arrowhead: record moving across */}
        <path
          d="M124 90 H188"
          stroke="var(--color-steel)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M180 83 L190 90 L180 97"
          stroke="var(--color-steel)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Claim/unlock cue on the MOTUS node: a small check */}
        <path
          d="M236 92 L250 106 L274 78"
          stroke="var(--color-signal)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <div className="mt-3 flex items-center justify-between font-mono text-xs text-slate">
        <span>Legacy FMCSA Portal</span>
        <span className="text-ink">MOTUS</span>
      </div>
    </div>
  );
}
