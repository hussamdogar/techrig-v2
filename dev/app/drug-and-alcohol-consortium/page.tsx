import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AuthorityStatusTracker,
  type Step,
} from "@/components/authority-status-tracker";
import { PriceChip } from "@/components/ui/price-chip";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import {
  ArrowRightIcon,
  CheckSealIcon,
  FilingIcon,
  ShieldIcon,
} from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing, type Price } from "@/lib/services";

// Primary file/apply CTAs route into the /apply engine, prefilled for the consortium.
const applyHref = "/apply/?service=consortium";

export const metadata: Metadata = {
  title: "Drug and Alcohol Consortium for Trucking",
  description:
    "Join a DOT drug and alcohol consortium the easy way. We enroll your drivers, set up random testing and pre-employment tests, and keep your program compliant.",
  alternates: { canonical: "/drug-and-alcohol-consortium/" },
  openGraph: {
    title: "Drug & Alcohol Consortium",
    description:
      "Join a DOT drug and alcohol consortium the easy way. We enroll your drivers, set up random testing and pre-employment tests, and keep your program compliant.",
    url: "/drug-and-alcohol-consortium/",
    type: "website",
  },
};

// Tracker scoped to driver readiness: the consortium sits after authority and
// alongside Clearinghouse and DQ files, not as a node that gates activation.
// Honesty rules apply (icon names only, no dates, no government endorsement).
const consortiumSteps: Step[] = [
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
  {
    label: "Driver in consortium pool",
    status: "Enrolled",
    state: "filed",
    icon: "shield",
  },
  {
    label: "Testing program compliant",
    status: "Ongoing",
    state: "progress",
    icon: "clock",
  },
];

// The pre-employment drug test is a flat service fee, mentioned alongside the
// consortium enrollment but not in the per-slug pricing map (it is a section
// item, not its own page). Single source, never an invented number. This is
// the standalone (a la carte) price; the in-bundle price is $100.
const preEmploymentPrice: Price = { kind: "flat", amount: 125 };

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// `a` carries the plain-text answer for schema; `aNode` adds the inline links
// for display, with matching visible text.
const faqs: Faq[] = [
  {
    q: "Do owner-operators need a consortium?",
    a: "If you hold a CDL and operate under FMCSA, yes. You cannot run a random pool of one, so you join a consortium.",
  },
  {
    q: "What testing does the program cover?",
    a: "Pre-employment, random, post-accident, and other DOT-required testing.",
  },
  {
    q: "Does every carrier need this?",
    a: "It depends on your vehicles, drivers, and operation. We confirm whether CDL drug-and-alcohol rules apply to you before you enroll.",
  },
  {
    q: "How much does it cost?",
    a: "Consortium enrollment is $175 standalone (renewed annually), or $150 inside a package; a pre-employment drug test is $125 standalone ($100 in a package).",
    aNode: (
      <>
        Consortium enrollment is{" "}
        <span className="font-mono tabular-nums text-ink">$175</span>{" "}
        standalone (renewed annually), or{" "}
        <span className="font-mono tabular-nums text-ink">$150</span> inside a
        package; a pre-employment drug test is{" "}
        <span className="font-mono tabular-nums text-ink">$125</span>{" "}
        standalone (
        <span className="font-mono tabular-nums text-ink">$100</span> in a
        package).
      </>
    ),
  },
  {
    q: "Is this connected to the Clearinghouse?",
    a: "Yes. Your consortium program and Clearinghouse registration work together. We can set up both.",
    aNode: (
      <>
        Yes. Your consortium program and{" "}
        <CrossLink href="/fmcsa-clearinghouse-registration/">
          Clearinghouse
        </CrossLink>{" "}
        registration work together. We can set up both.
      </>
    ),
  },
];

export default function DrugAndAlcoholConsortiumPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "Drug and alcohol consortium enrollment",
            slug: "/drug-and-alcohol-consortium/",
            description:
              "Tech Rig enrolls CDL drivers in a compliant DOT drug and alcohol consortium and random testing pool, sets up the required testing, and keeps the program compliant.",
            price: 175,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "Drug and Alcohol Consortium" },
          ]),
          faqNode(faqs),
          personNode("adam"),
        )}
      />

      {/* Hero */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services", href: "/compliance-services/" },
              { name: "Drug and Alcohol Consortium" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Drug and Alcohol Consortium Enrollment
              </h1>
              {/* Lede. The consequence clause is set at full Ink weight so it
                  lands, without becoming a heading. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                If you hold a CDL and operate under FMCSA, you are required to be
                in a DOT drug and alcohol testing program, and for owner-operators
                that means joining a consortium. A consortium pools drivers for
                random testing and manages the program for you.{" "}
                <span className="font-medium text-ink">
                  Skip it and you are not legal to drive a CDL vehicle, and it is
                  one of the first things an audit checks.
                </span>{" "}
                Tech Rig enrolls you in a drug and alcohol consortium and keeps
                your testing program compliant.
              </p>
              <div className="mt-7">
                <Link
                  href={applyHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Enroll in a consortium
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            <AuthorityStatusTracker steps={consortiumSteps} />
          </div>
        </Container>
      </Section>

      {/* What a drug and alcohol consortium is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What a drug and alcohol consortium is
          </h2>
          <p className="mt-4 text-slate">
            A consortium/third-party administrator (C/TPA) is an organization that
            manages DOT drug and alcohol testing for carriers, including the random
            testing pool. FMCSA requires CDL drivers to be part of a testing
            program, and an owner-operator cannot run their own random pool of one,
            so they join a consortium. The program covers pre-employment, random,
            post-accident, and other required testing, and ties into the{" "}
            <CrossLink href="/fmcsa-clearinghouse-registration/">
              FMCSA Clearinghouse
            </CrossLink>
            .
          </p>

          {/* The page's distinct angle, given quiet emphasis (left Steel rule),
              never amber. The memorable framing. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            An owner-operator cannot run their own random pool of one.
          </p>
        </Container>
      </Section>

      {/* Who needs to be in a consortium */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Who needs to be in a consortium
          </h2>

          <ul className="mt-6 space-y-3">
            {[
              "Owner-operators with a CDL operating under FMCSA.",
              "Carriers with CDL drivers (the carrier runs the program, the consortium administers it).",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-ink">
                <ShieldIcon size={20} className="mt-0.5 shrink-0 text-steel" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Honest applicability, set apart so the "we confirm" honesty is
              unmistakable. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Note: not every operation is subject to CDL drug-and-alcohol rules.
            Whether this applies depends on your vehicles, drivers, and operation.
            We confirm before you enroll.
          </p>
        </Container>
      </Section>

      {/* What our drug and alcohol consortium enrollment includes */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our drug and alcohol consortium enrollment includes
          </h2>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We enroll you or your drivers in a compliant consortium and random
                testing pool.
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We set up the required testing, including pre-employment (see
                below).
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We connect your program to your{" "}
                <CrossLink href="/fmcsa-clearinghouse-registration/">
                  Clearinghouse
                </CrossLink>{" "}
                registration and{" "}
                <CrossLink href="/driver-qualification-files/">
                  driver qualification files
                </CrossLink>
                .
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We keep your enrollment active so your program stays compliant.
              </span>
            </li>
          </ul>

          {/* Pricing from the single source. Standalone chips reflect the
              a-la-carte price; the in-package price and the Clearinghouse
              price are called out as a Slate line, never blended into a
              third chip. */}
          <div className="mt-8 flex flex-wrap gap-4">
            <PriceChip
              price={pricing["/drug-and-alcohol-consortium/"]}
              label="Consortium enrollment"
            />
            <PriceChip price={preEmploymentPrice} label="Pre-employment drug test" />
          </div>
          <p className="mt-4 text-sm text-slate">
            Consortium enrollment is{" "}
            <span className="font-mono tabular-nums text-ink">$175</span>{" "}
            standalone (
            <span className="font-mono tabular-nums text-ink">$150</span>{" "}
            inside a{" "}
            <CrossLink href="/compliance-packages/">
              compliance package
            </CrossLink>
            ), with annual renewal. A pre-employment drug test is{" "}
            <span className="font-mono tabular-nums text-ink">$125</span>{" "}
            standalone (
            <span className="font-mono tabular-nums text-ink">$100</span> in a
            package).{" "}
            <CrossLink href="/fmcsa-clearinghouse-registration/">
              Clearinghouse
            </CrossLink>{" "}
            setup is{" "}
            <span className="font-mono tabular-nums text-ink">$125</span>{" "}
            standalone, listed separately.
          </p>
        </Container>
      </Section>

      {/* Pre-employment drug test (absorbed term, its own H2) */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Pre-employment drug test
          </h2>
          <p className="mt-4 text-slate">
            A pre-employment drug test is required when a driver begins
            safety-sensitive work for a new employer. A previous pre-employment
            drug test may be used in place of a new one only if the driver has
            actively participated in a qualifying DOT drug testing program
            within the preceding{" "}
            <span className="font-mono tabular-nums text-ink">30 days</span>{" "}
            and meets FMCSA&apos;s other conditions for waiving a new test.
            Tech Rig will verify eligibility through TrueTest before waiving
            any test. We coordinate pre-employment testing (standalone{" "}
            <span className="font-mono tabular-nums text-ink">$125</span>, or{" "}
            <span className="font-mono tabular-nums text-ink">$100</span> in a
            package) so the timing is right and the result is documented in
            the{" "}
            <CrossLink href="/driver-qualification-files/">
              driver&apos;s qualification file
            </CrossLink>
            .
          </p>

          {/* The page's UNIQUE worked example, in the quiet credibility treatment
              (left Steel rule), mono only on the concrete data point. Worded as
              the consortium telling, distinct from the DQ-files page. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Worked example: for a New Jersey power-only carrier, an earlier
            test did not meet the waiver conditions, so a new pre-employment
            test had to be arranged before the driver could start.
          </p>
        </Container>
      </Section>

      {/* Consortium and the Clearinghouse */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Consortium and the Clearinghouse
          </h2>
          <p className="mt-4 text-slate">
            The{" "}
            <CrossLink href="/fmcsa-clearinghouse-registration/">
              FMCSA Clearinghouse
            </CrossLink>{" "}
            is the federal database of drug and alcohol violations. Your consortium
            program and Clearinghouse registration work together: queries and
            reporting flow between them. New carriers usually need both set up
            before hauling, which is why we handle them as a driver-compliance set
            with your{" "}
            <CrossLink href="/driver-qualification-files/">DQ files</CrossLink>.
          </p>

          {/* Compact two-node line diagram in the system language: the consortium
              program and Clearinghouse registration, queries and reporting flowing
              between them. Built from existing system icons, static for CWV. */}
          <div
            className="mt-8 flex flex-col items-stretch gap-4 rounded-card border border-slate/15 bg-paper p-6 sm:flex-row sm:items-center"
            aria-hidden="true"
          >
            <div className="flex flex-1 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-status-filed text-status-filed">
                <FilingIcon size={20} />
              </span>
              <span className="font-display text-sm font-semibold text-ink">
                Consortium program
              </span>
            </div>
            <div className="flex shrink-0 flex-col items-center text-steel">
              <ArrowRightIcon size={20} />
              <span className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-slate">
                Queries and reporting
              </span>
            </div>
            <div className="flex flex-1 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-status-active text-status-active">
                <ShieldIcon size={20} />
              </span>
              <span className="font-display text-sm font-semibold text-ink">
                Clearinghouse registration
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Driver-compliance cluster cross-link strip */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <p className="text-slate">
            The rest of the driver-compliance set:{" "}
            <CrossLink href="/fmcsa-clearinghouse-registration/">
              FMCSA Clearinghouse
            </CrossLink>{" "}
            and{" "}
            <CrossLink href="/driver-qualification-files/">
              driver qualification files
            </CrossLink>
            .
          </p>

          {/* Funnel cross-link forward to dispatch, subordinate Steel line. */}
          <p className="mt-4 text-sm text-slate">
            Road-legal and ready to run? See our{" "}
            <CrossLink href="/services/">dispatch service</CrossLink>.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Drug and alcohol consortium FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Driving a CDL vehicle? Get into a compliant testing program before you haul."
        cta={{ label: "Enroll in a consortium", href: applyHref }}
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
