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
  CheckSealIcon,
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

// Primary CTA routes into the /apply engine, pre-selecting the BOC-3 service.
const applyHref = "/apply/?service=boc-3";

export const metadata: Metadata = {
  title: {
    absolute: "BOC-3 Filing for Trucking: Process Agent | Tech Rig",
  },
  description:
    "BOC-3 filing done today. As an FMCSA-listed blanket process agent, Tech Rig files your BOC-3 across all 50 states for $100, one time, so your authority can activate.",
  alternates: { canonical: "/boc-3-filing/" },
  openGraph: {
    title: "BOC-3 Filing for Trucking: Process Agent",
    description:
      "BOC-3 filing done today. As an FMCSA-listed blanket process agent, Tech Rig files your BOC-3 across all 50 states for $100, one time, so your authority can activate.",
    url: "/boc-3-filing/",
    type: "website",
  },
};

// Tracker scoped to show BOC-3 as the prerequisite that UNBLOCKS the sequence:
// the BOC-3 designation is the gate that lets the application proceed to the
// protest period and activation. Because BOC-3 is a one-time filing, this
// instance carries NO annual-renewal marker (the deliberate visual contrast with
// the UCR page). No guaranteed dates: the protest period is a fixed federal step.
const bocSteps: Step[] = [
  {
    label: "BOC-3 process agent designated",
    status: "Required first",
    state: "filed",
    icon: "routeNode",
  },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
  {
    label: "Authority active",
    status: "Active",
    state: "active",
    icon: "checkSeal",
  },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "What is a BOC-3?",
    a: "A federal filing that names a process agent in every state to receive legal documents for you. It is required before operating authority can activate.",
  },
  {
    q: "How much does a BOC-3 cost?",
    a: "$100, one time. It is also included in every compliance package.",
    // Visible text matches `a`; the inline link points to the bundle catalog.
    aNode: (
      <>
        $100, one time. It is also included in every{" "}
        <CrossLink href="/compliance-packages/">compliance package</CrossLink>.
      </>
    ),
  },
  {
    q: "Do I have to renew my BOC-3 every year?",
    a: "No. It is generally a one-time filing. You refile only if you change process agents or a specific circumstance requires it.",
  },
  {
    q: "Is the BOC-3 a certificate I print?",
    a: "No. It is filed electronically and shows on your public FMCSA record, where it can be verified.",
  },
  {
    q: "Can you file my BOC-3 today?",
    a: "Yes. As an FMCSA-listed blanket process agent we file it directly. Government processing posts it to your record after.",
  },
  {
    q: "Do I need anything else for my authority to activate?",
    a: "MC authority activation requires the BOC-3 filing and the required insurance filing from your insurer. UCR is a separate annual registration and is not required for authority activation. We can handle the full setup so nothing is missed. (BOC-3 is generally not required for a private motor carrier not operating for hire.)",
    // Visible text matches `a`; the inline link now points to the bundle catalog
    // (was /compliance-services/) since the fixed bundles replaced the old package.
    aNode: (
      <>
        MC authority activation requires the BOC-3 filing and the required
        insurance filing from your insurer. UCR is a separate annual
        registration and is not required for authority activation. We can
        handle the{" "}
        <CrossLink href="/compliance-packages/">full setup</CrossLink> so
        nothing is missed. (BOC-3 is generally not required for a private
        motor carrier not operating for hire.)
      </>
    ),
  },
];

export default function Boc3FilingPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "BOC-3 filing",
            slug: "/boc-3-filing/",
            description:
              "Tech Rig files your BOC-3 designating a blanket process agent across all 50 states, so your operating authority can activate.",
            price: 100,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "BOC-3 Filing" },
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
              { name: "BOC-3 Filing" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                BOC-3 Filing (Blanket Process Agent)
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                A BOC-3 is one of the small filings that quietly decides whether
                your operating authority activates. It names a process agent in
                every state where you operate, someone who can receive legal
                documents on your behalf. No BOC-3, no active authority. DGR Tech
                Rig LLC is officially listed by FMCSA as a BOC-3 blanket
                process-agent company, so we can file your BOC-3 across all 50
                states, for $100, one time.
              </p>
              <div className="mt-7">
                <Link
                  href={applyHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  File my BOC-3
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            <AuthorityStatusTracker steps={bocSteps} />
          </div>
        </Container>
      </Section>

      {/* What a BOC-3 is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What a BOC-3 is
          </h2>
          <p className="mt-4 text-slate">
            The BOC-3 is the federal form that designates a process agent in each
            state: a person or company authorized to accept legal papers for you
            in that state. FMCSA requires it for motor carriers, brokers, and
            freight forwarders before operating authority can be granted. A
            "blanket" process agent covers all 50 states in one filing, which is
            why most carriers use a blanket company instead of naming individual
            agents state by state. The BOC-3 is filed electronically; it is not a
            printed certificate FMCSA hands you, and you can verify it on your
            public FMCSA record.
          </p>
        </Container>
      </Section>

      {/* Who needs a BOC-3, and when */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Who needs a BOC-3, and when
          </h2>
          <ul className="mt-6 space-y-3">
            <li className="flex gap-3 text-ink">
              <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <span>
                Anyone applying for operating authority (an{" "}
                <CrossLink href="/mc-registration/">MC number</CrossLink>) needs a
                BOC-3 before it activates.
              </span>
            </li>
            <li className="flex gap-3 text-ink">
              <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <span>Brokers and freight forwarders need one too.</span>
            </li>
            <li className="flex gap-3 text-ink">
              <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <span>
                A private motor carrier that is not operating for hire generally
                does not need a BOC-3.
              </span>
            </li>
            <li className="flex gap-3 text-ink">
              <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <span>
                You file it once during setup. It is generally a one-time filing.
                You only refile if you change process agents or another specific
                circumstance requires it.
              </span>
            </li>
          </ul>

          {/* Myth-correction: BOC-3 is not annual. Quiet callout, left Steel rule. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Important: a BOC-3 is not an annual renewal. If anyone tells you to
            renew your BOC-3 every year as a matter of course, that is not how it
            normally works. (Your{" "}
            <CrossLink href="/ucr-registration/">UCR</CrossLink>, by contrast, is
            annual.)
          </p>
        </Container>
      </Section>

      {/* How our BOC-3 filing works */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How our BOC-3 filing works
          </h2>
          {/* The differentiator, set as a styled emphasis line above the stepper. */}
          <p className="mt-4 font-medium text-ink">
            Because we are an FMCSA-listed blanket process agent, your BOC-3 is
            direct, not outsourced:
          </p>

          <ol className="mt-6 space-y-5">
            {[
              {
                n: "01",
                text: (
                  <>
                    You give us your company details through our{" "}
                    <CrossLink href={applyHref}>BOC-3 form</CrossLink>.
                  </>
                ),
              },
              {
                n: "02",
                text: (
                  <>We file your BOC-3 designating coverage across all 50 states.</>
                ),
              },
              {
                n: "03",
                text: (
                  <>
                    Your filing posts to your FMCSA record, where it can be
                    verified.
                  </>
                ),
              },
              {
                n: "04",
                text: (
                  <>
                    If your BOC-3 is part of getting your authority, we line it up
                    with your MC application, and we coordinate so your insurer's
                    proof of insurance lands, so activation is not held up.
                  </>
                ),
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <span
                  className="font-mono text-sm font-medium tabular-nums text-steel"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <span className="text-ink">{step.text}</span>
              </li>
            ))}
          </ol>

          {/* Price line directly under the stepper, from the single source. No gov
              fee applies to the BOC-3 service itself. The old BOC-3 + UCR combo
              chip is gone: BOC-3 is now included in every compliance package. */}
          <div className="mt-8 flex flex-wrap gap-4">
            <PriceChip
              price={pricing["/boc-3-filing/"]}
              label="BOC-3 filing, one time"
            />
          </div>
          <p className="mt-4 text-slate">
            $100, one time. BOC-3 is also included in every{" "}
            <CrossLink href="/compliance-packages/">
              compliance package
            </CrossLink>{" "}
            (as a filing when required, or verification your existing BOC-3
            is on file).
          </p>

          {/* Mid-page CTA: subordinate Steel text link, same route. */}
          <p className="mt-6">
            <Link
              href={applyHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              File my BOC-3
            </Link>
          </p>
        </Container>
      </Section>

      {/* BOC-3 as part of getting road-legal */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            BOC-3 as part of getting road-legal
          </h2>
          {/* This page's unique worked example. Real past case, framed as such. */}
          <p className="mt-4 border-l-4 border-steel pl-4 text-slate">
            A North Carolina power-only carrier first came to us just to buy a
            BOC-3. When we looked at her file, her self-filed USDOT and MC were
            full of errors, and because she had not established her MOTUS account
            yet, she was locked out of fixing them online. Claiming an existing
            USDOT on MOTUS needs a USDOT PIN, and getting that PIN was lagging
            during the MOTUS transition, so she was stuck waiting on a mailed
            letter. We moved her forward with
            paper filings and then an official FMCSA callback to verify her
            identity and unlock the record. A simple BOC-3 request turned into
            untangling the whole authority, which is exactly the kind of thing we
            catch.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            BOC-3 filing FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Need a BOC-3 to activate your authority? File it directly with an FMCSA-listed process agent."
        cta={{ label: "File my BOC-3", href: applyHref }}
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
