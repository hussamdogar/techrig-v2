import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { PriceChip } from "@/components/ui/price-chip";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Boc3OrderCard } from "@/components/boc3-order-card";
import { JsonLd } from "@/components/json-ld";
import { CheckIcon, ClockIcon, ExternalLinkIcon, MinusCircleIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { buttonVariants } from "@/components/ui/button";
import { Boc3PageStickyBar } from "@/components/boc3-page-sticky-bar";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing } from "@/lib/services";
import { site } from "@/lib/site";

// Primary CTA routes into the quick-buy USDOT confirm-and-pay flow (no account,
// no multi-step form).
const applyHref = "/buy/boc-3/";

// Light sections on laptop: H2 on the left (stays in view), content on the
// right, 4:8 (shared/design/boc-3-filing-v2.md §4).
const SPLIT = "max-w-3xl lg:grid lg:max-w-[1200px] lg:grid-cols-[4fr_8fr] lg:items-start lg:gap-x-16";
const SPLIT_H2 = "font-display text-3xl font-bold text-ink lg:sticky lg:top-24";

export const metadata: Metadata = {
  title: {
    absolute: "BOC-3 Filing for Trucking: Process Agent | Tech Rig",
  },
  description:
    "BOC-3 filing done today. As an FMCSA-listed blanket process agent, Tech Rig files your BOC-3 across all 50 states for $50, one time, so your authority can activate.",
  alternates: { canonical: "/boc-3-filing/" },
  openGraph: {
    title: "BOC-3 Filing for Trucking: Process Agent",
    description:
      "BOC-3 filing done today. As an FMCSA-listed blanket process agent, Tech Rig files your BOC-3 across all 50 states for $50, one time, so your authority can activate.",
    url: "/boc-3-filing/",
    type: "website",
  },
};

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "What is a BOC-3?",
    a: "A federal filing that names a process agent in every state to receive legal documents for you. It is required before operating authority can activate.",
  },
  {
    q: "How much does a BOC-3 cost?",
    a: "$50, one time, with no annual renewal fee.",
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
    // Visible text matches `a`; the inline link points to the compliance hub.
    aNode: (
      <>
        MC authority activation requires the BOC-3 filing and the required
        insurance filing from your insurer. UCR is a separate annual
        registration and is not required for authority activation. We can
        handle the{" "}
        <CrossLink href="/compliance-services/">full setup</CrossLink> so
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
            price: 50,
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

      {/* Hero: dark (Ink) with a Signal highlight, the /lp/boc-3-filing/ look
          (owner, 2026-10-08); sections below alternate dark and light. */}
      <Section surface="ink" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            tone="dark"
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services", href: "/compliance-services/" },
              { name: "BOC-3 Filing" },
            ]}
          />
          {/* Owner, 2026-10-27: the order card comes straight after the H1
              (on phones, before the intro), and the separate hero button is
              gone, so the card is the one action. Laptop keeps two columns:
              H1 and intro on the left, the card on the right. The phone H1 is
              32px so the H1 and the card's button share the first screen. */}
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-0">
            <h1 className="font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-cloud lg:col-start-1 lg:row-start-1 lg:text-[clamp(2.25rem,4.5vw,3.5rem)]">
              BOC-3 Filing <span className="text-signal">(Blanket Process Agent)</span>
            </h1>

            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <Boc3OrderCard serviceKey="boc-3" amount={pricing["/boc-3-filing/"].amount ?? 50} location="boc3_page_hero" />
            </div>

            <div className="lg:col-start-1 lg:row-start-2 lg:mt-5">
              {/* The FMCSA listing, highlighted in place (owner chose treatment
                  B, 2026-10-27): the same sentence in white with a soft
                  underline, plus a link to FMCSA's own page so it can be
                  checked. A sentence, never a badge or seal. */}
              <p className="max-w-[60ch] text-[17px] text-cloud/80 lg:text-lg">
                A BOC-3 is one of the small filings that quietly decides whether
                your operating authority activates. It names a process agent in
                every state where you operate, someone who can receive legal
                documents on your behalf. No BOC-3, no active authority.{" "}
                <span className="font-medium text-cloud underline decoration-[#9cc7e8]/60 decoration-2 underline-offset-[5px]">
                  DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket
                  process-agent company
                </span>
                , so we can file your BOC-3 across all 50 states, for $50, one
                time.{" "}
                <TrackedAnchor
                  href={site.fmcsaListingUrl}
                  event="fmcsa_listing_click"
                  data={{ location: "boc3_page_hero" }}
                  target="_blank"
                  rel="noopener nofollow"
                  className="whitespace-nowrap text-cloud underline underline-offset-4 hover:text-signal outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
                >
                  See our listing
                  <span className="sr-only"> on fmcsa.dot.gov (opens in a new tab)</span>
                  <ExternalLinkIcon size={14} className="ml-1 inline align-[-2px]" aria-hidden="true" />
                </TrackedAnchor>
              </p>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" tone="dark" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What a BOC-3 is. Light sections put the H2 left and the content
          right on laptop (4:8), against the single-column dark bands. */}
      <Section surface="cloud">
        <Container className={SPLIT}>
          <h2 className={SPLIT_H2}>
            What a BOC-3 is
          </h2>
          <p className="mt-4 max-w-[68ch] text-slate lg:mt-0">
            The BOC-3 is the federal form that designates a process agent in each
            state: a person or company authorized to accept legal papers for you
            in that state. FMCSA requires it for motor carriers, brokers, and
            freight forwarders before operating authority can be granted. A
            &quot;blanket&quot; process agent covers all 50 states in one filing, which is
            why most carriers use a blanket company instead of naming individual
            agents state by state. The BOC-3 is filed electronically; it is not a
            printed certificate FMCSA hands you, and you can verify it on your
            public FMCSA record.
          </p>
        </Container>
      </Section>

      {/* Who needs a BOC-3, and when (dark band) */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            Who needs a BOC-3, and when
          </h2>
          {/* Icons carry meaning: check = needs one, minus = generally does
              not, clock = timing. */}
          <ul className="mt-6 space-y-3.5">
            <li className="flex gap-3 text-cloud/90">
              <CheckIcon size={20} className="mt-0.5 shrink-0 text-[#9cc7e8]" aria-hidden="true" />
              <span>
                Anyone applying for operating authority (an{" "}
                <CrossLink dark href="/mc-registration/">MC number</CrossLink>) needs a
                BOC-3 before it activates.
              </span>
            </li>
            <li className="flex gap-3 text-cloud/90">
              <CheckIcon size={20} className="mt-0.5 shrink-0 text-[#9cc7e8]" aria-hidden="true" />
              <span>Brokers and freight forwarders need one too.</span>
            </li>
            <li className="flex gap-3 text-cloud/90">
              <MinusCircleIcon size={20} className="mt-0.5 shrink-0 text-cloud/55" aria-hidden="true" />
              <span>
                A private motor carrier that is not operating for hire generally
                does not need a BOC-3.
              </span>
            </li>
            <li className="flex gap-3 text-cloud/90">
              <ClockIcon size={20} className="mt-0.5 shrink-0 text-[#9cc7e8]" aria-hidden="true" />
              <span>
                You file it once during setup. It is generally a one-time filing.
                You only refile if you change process agents or another specific
                circumstance requires it.
              </span>
            </li>
          </ul>

          {/* Myth-correction: BOC-3 is not annual. A note, not a quote. */}
          <p className="mt-6 rounded-r-card border-l-4 border-signal bg-cloud/5 px-4 py-3.5 text-cloud/80">
            <strong className="font-semibold text-cloud">Important:</strong> a BOC-3 is not an annual renewal. If anyone tells you to
            renew your BOC-3 every year as a matter of course, that is not how it
            normally works. (Your{" "}
            <CrossLink dark href="/ucr-registration/">UCR</CrossLink>, by contrast, is
            annual.)
          </p>
        </Container>
      </Section>

      {/* How our BOC-3 filing works */}
      <Section surface="cloud">
        <Container className={SPLIT}>
          <h2 className={SPLIT_H2}>
            How our BOC-3 filing works
          </h2>
          <div className="lg:min-w-0">
          {/* The differentiator, set as a styled emphasis line above the stepper. */}
          <p className="mt-4 text-[17px] font-medium text-ink lg:mt-0">
            Because we are an FMCSA-listed blanket process agent, your BOC-3 is
            direct, not outsourced:
          </p>

          <ol className="mt-6">
            {[
              {
                n: "01",
                text: (
                  <>
                    You confirm your carrier record from a quick{" "}
                    <CrossLink href={applyHref}>USDOT lookup</CrossLink>; no forms to fill out.
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
                    with your MC application, and we coordinate so your insurer&apos;s
                    proof of insurance lands, so activation is not held up.
                  </>
                ),
              },
            ].map((step) => (
              // A numbered stepper; the <ol> carries the order for screen readers.
              <li
                key={step.n}
                className="relative pb-[22px] pl-12 last:pb-0 before:absolute before:bottom-1 before:left-[15px] before:top-[34px] before:w-0.5 before:bg-slate/15 last:before:hidden"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 grid size-8 place-items-center rounded-full border-[1.5px] border-steel bg-cloud font-mono text-[13px] font-medium text-steel"
                >
                  {step.n}
                </span>
                <span className="block pt-1 text-ink">{step.text}</span>
              </li>
            ))}
          </ol>

          {/* Price panel: price (single source, no gov fee on the BOC-3
              service itself), the one-time sentence, and a tappable secondary
              button, subordinate to the hero card's amber one. */}
          <div className="mt-8 grid gap-3.5 rounded-card border border-slate/20 bg-paper p-4 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6 lg:px-6 lg:py-5">
            <PriceChip
              price={pricing["/boc-3-filing/"]}
              label="BOC-3 filing, one time"
              className="border-0 bg-transparent px-0 py-0"
            />
            <p className="text-slate">
              $50, one time, with no annual renewal fee.
            </p>
            <Link href={applyHref} className={`${buttonVariants({ variant: "secondary", size: "md" })} w-full lg:w-auto`}>
              File my BOC-3
            </Link>
          </div>
          </div>
        </Container>
      </Section>

      {/* BOC-3 as part of getting road-legal (dark band) */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            BOC-3 as part of getting road-legal
          </h2>
          {/* This page's unique worked example. Real past case, framed as such. */}
          <div className="mt-4 max-w-[62ch] space-y-4 border-l-4 border-signal pl-4 text-cloud/80 lg:text-lg">
          <p>
            A North Carolina power-only carrier first came to us just to buy a
            BOC-3. When we looked at her file, her self-filed USDOT and MC were
            full of errors, and because she had not established her MOTUS account
            yet, she was locked out of fixing them online. Claiming an existing
            USDOT on MOTUS needs a USDOT PIN, and getting that PIN was lagging
            during the MOTUS transition, so she was stuck waiting on a mailed
            letter.
          </p>
          <p>
            We moved her forward with
            paper filings and then an official FMCSA callback to verify her
            identity and unlock the record. A simple BOC-3 request turned into
            untangling the whole authority, which is exactly the kind of thing we
            catch.
          </p>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className={SPLIT}>
          <h2 className={SPLIT_H2}>
            BOC-3 filing FAQ
          </h2>
          <div className="mt-6 lg:mt-0">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* Closing: the order card itself, so a ready visitor types the USDOT
          here instead of tapping through to another page (owner, 2026-10-27). */}
      <Section surface="ink">
        <Container className="grid items-center gap-6 lg:grid-cols-[1fr_440px] lg:gap-x-16">
          <p className="font-display text-2xl font-bold text-cloud lg:text-3xl">
            Need a BOC-3 to activate your authority? File it directly with an
            FMCSA-listed process agent.
          </p>
          <Boc3OrderCard
            serviceKey="boc-3"
            amount={pricing["/boc-3-filing/"].amount ?? 50}
            location="boc3_page_closing"
            idSuffix="-closing"
          />
        </Container>
      </Section>

      <Boc3PageStickyBar />
    </>
  );
}

// Inline cross-link (1 to 3 word contextual anchor), never a button. Steel on
// light sections; `dark` for the Ink bands, where Steel fails contrast.
function CrossLink({ href, dark = false, children }: { href: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={
        dark
          ? "font-medium text-cloud underline underline-offset-4 hover:text-signal outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
          : "font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
      }
    >
      {children}
    </Link>
  );
}
