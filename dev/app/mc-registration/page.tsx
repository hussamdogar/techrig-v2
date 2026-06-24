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
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "How to Get Your MC Number | Tech Rig Filing" },
  description:
    "How to get an MC number and operating authority the right way. Tech Rig files your MC application, BOC-3, and insurance so your authority actually activates.",
  alternates: { canonical: "/mc-registration/" },
  openGraph: {
    title: "How to Get Your MC Number | Tech Rig Filing",
    description:
      "How to get an MC number and operating authority the right way. Tech Rig files your MC application, BOC-3, and insurance so your authority actually activates.",
    url: "/mc-registration/",
    type: "website",
  },
};

// Tracker scoped to the MC activation sequence: this is the page where the full
// authority journey is most at home, because the MC journey IS the tracker.
// Application filed -> 21-day federal protest period (the fixed federal step,
// never a countdown) -> Authority active. Honesty rules apply: no dates, no
// countdowns.
const mcSteps: Step[] = [
  { label: "Application filed", status: "Filed", state: "filed", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
];

// One source feeds both the visible FAQ accordion and the FAQPage schema
// (verbatim parity).
const faqs: Faq[] = [
  {
    q: "Do I need an MC number or just a USDOT number?",
    a: "Many interstate for-hire carriers need both. Private carriers and some exempt freight may need only a USDOT number. We confirm before you pay.",
  },
  {
    q: "How long does it take to get an MC number?",
    a: "After filing, FMCSA requires a mandatory 21-day protest period, and activation also depends on your BOC-3 and insurance being in place. We do not promise a date, but we make sure nothing on your side delays it.",
  },
  {
    q: "My MC was dismissed. Can you reinstate it?",
    a: "A dismissed MC generally cannot be reinstated. We file a new operating authority application; you usually keep the old MC number, but the authority age resets. We do this often.",
  },
  {
    q: "Why did my authority not activate after 21 days?",
    a: "Almost always a missing or incorrect BOC-3, insurance filing, or UCR. We make sure all three are correct so activation is not held up.",
  },
  {
    q: "Can you fix an MC I started myself?",
    a: "Yes. Correcting wrong classifications and incomplete DIY filings is a large part of our work.",
  },
];

export default function McRegistrationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "MC operating authority registration",
            slug: "/mc-registration/",
            description:
              "Tech Rig files your MC operating authority application and BOC-3, and coordinates your insurance filing, so your authority actually activates after the federal protest period.",
            price: 600,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "MC Authority" },
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
              { name: "MC Authority" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                How to Get Your MC Number (Operating Authority)
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                An MC number is your operating authority: the federal permission
                to haul regulated freight for hire across state lines. A USDOT
                number identifies you; an MC number lets you legally carry other
                people&apos;s goods for money. Getting one means more than
                submitting a form. Tech Rig files your MC application, your
                BOC-3, and lines up your insurance filing so your authority
                actually activates instead of stalling at the finish line.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get my MC authority
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" role="Co-Founder" />
              </div>
            </div>

            <AuthorityStatusTracker steps={mcSteps} />
          </div>
        </Container>
      </Section>

      {/* What an MC number is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What an MC number is
          </h2>
          <p className="mt-4 text-slate">
            An MC number (motor carrier operating authority) is issued by FMCSA
            and is required for most for-hire carriers moving regulated
            commodities in interstate commerce. It is separate from your USDOT
            number. Many interstate for-hire carriers need both: the USDOT
            number for identification and safety, the MC number for the
            authority to haul for pay. Private carriers hauling only their own
            goods, and some exempt commodities, may not need an MC number. We
            confirm whether you do before you pay for anything.
          </p>

          {/* USDOT vs MC, the same two-item line comparison used on the DOT page,
              kept visually consistent so the cross-link reads as one idea. */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-slate/15 bg-paper p-5">
              <p className="font-display text-sm font-semibold text-ink">
                USDOT number
              </p>
              <p className="mt-2 text-slate">
                Identifies you for safety and identification.
              </p>
            </div>
            <div className="rounded-card border border-slate/15 bg-paper p-5">
              <p className="font-display text-sm font-semibold text-ink">
                MC number
              </p>
              <p className="mt-2 text-slate">
                The authority to haul regulated freight for pay.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* How to get an MC number, and where it goes wrong */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How to get an MC number, and where it goes wrong
          </h2>

          {/* A genuine sequence, numbered 01 to 06 via CSS counters, not typed
              into headings. Step 4 carries the BOC-3 link; step 6 is the protest
              period, tied to the hero tracker's protest node. */}
          <ol className="mt-6 space-y-5">
            {[
              "Confirm you actually need operating authority for your operation (not everyone does).",
              "Choose the correct authority type. The wrong classification can mean you cannot legally do the work you intended.",
              "File the MC application (OP-1 family).",
              <>
                File your{" "}
                <CrossLink href="/boc-3-filing/">BOC-3</CrossLink> to designate
                a process agent in every state.
              </>,
              "Get your insurance filed with FMCSA by your insurer.",
              "Clear the mandatory 21-day protest period, after which the authority can activate if everything else is in place.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-sm font-semibold tabular-nums text-steel">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-ink">{step}</span>
              </li>
            ))}
          </ol>

          {/* "The trap": the page's signature insight, set apart from the steps
              as a quiet warning callout (left Steel rule, Slate text). */}
          <p className="mt-8 border-l-4 border-steel pl-4 text-slate">
            The trap: carriers reach the end of the 21-day window and discover
            their authority still will not activate, because the BOC-3, the
            insurance filing, or the UCR was missing or wrong. Submitting the
            application is not the same as being ready to operate.
          </p>
        </Container>
      </Section>

      {/* How to get an MC number with Tech Rig */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How to get an MC number with Tech Rig
          </h2>

          {/* This page's unique worked example. Real past case, framed as such:
              no metrics, no celebratory styling, no guaranteed timeline. */}
          <p className="mt-4 border-l-4 border-steel pl-4 text-slate">
            A California box-truck owner already had a USDOT and MC, but he had
            missed his insurance and BOC-3 deadline, so FMCSA dismissed his MC.
            He wanted it reinstated to keep a one-year-old authority for an
            Amazon Relay requirement. We had to explain that a dismissed MC
            cannot simply be reinstated: we filed a brand-new operating
            authority application (he keeps the old MC number, but the age clock
            resets), set up his FMCSA portal, and filed the MC application,
            BOC-3, and UCR in one day, then waited out the protest period. He is
            active now and has hired a driver.
          </p>

          <p className="mt-8 font-medium text-ink">What you get with us:</p>
          <ul className="mt-4 space-y-5">
            {[
              {
                Icon: CheckSealIcon,
                text: "Confirmation that you need authority, and the correct authority type.",
              },
              {
                Icon: FilingIcon,
                text: "Your MC application, BOC-3, and insurance coordination handled together so nothing blocks activation.",
              },
              {
                Icon: ClockIcon,
                text: "A realistic picture of timing, including the mandatory protest period.",
              },
              {
                Icon: RouteNodeIcon,
                text: "A clean path into driver compliance and dispatch once you are active.",
              },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">{text}</span>
              </li>
            ))}
          </ul>

          {/* Mid-page CTA: subordinate Steel text link, same route as hero. */}
          <p className="mt-8">
            <Link
              href={filingCtaHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Get my MC authority
            </Link>
          </p>
        </Container>
      </Section>

      {/* What an MC number costs */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What an MC number costs
          </h2>

          <div className="mt-6 flex flex-wrap gap-4">
            <PriceChip
              price={{ ...pricing["/mc-registration/"], govFee: false }}
              label="MC authority application, one time"
              note="includes USDOT number"
            />
            <PriceChip
              price={pricing["/boc-3-filing/"]}
              label="required to activate authority"
            />
          </div>

          <ul className="mt-6 space-y-4 text-slate">
            <li>
              <span className="font-medium text-ink">Includes your USDOT number:</span>{" "}
              when you file for MC authority, the USDOT is issued with it, so you
              do not pay the standalone USDOT fee on top.
            </li>
            <li>
              <span className="font-medium text-ink">Insurance filing:</span>{" "}
              filed by your insurer; the premium is separate. We coordinate the
              filing so it lands. See{" "}
              <CrossLink href="/trucking-insurance-filing/">
                insurance filing
              </CrossLink>
              .
            </li>
            <li>
              <span className="font-medium text-ink">Government fee:</span> any
              FMCSA application fee is shown separately. Current FMCSA fee to be
              confirmed.
            </li>
            <li>
              Want it all handled at once? The{" "}
              <CrossLink href="/compliance-services/">full setup</CrossLink>{" "}
              bundles USDOT, MC, BOC-3, insurance, UCR, and driver compliance.
            </li>
          </ul>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            MC authority FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Ready to run for hire? Get your MC authority filed so it actually activates."
        cta={{ label: "Get my MC authority", href: filingCtaHref }}
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
