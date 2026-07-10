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

// Primary file/apply CTAs route into the /apply engine, prefilled to this service.
const applyHref = "/apply/?service=mc-authority";

export const metadata: Metadata = {
  title: { absolute: "How to Get Your MC Number | Tech Rig Filing" },
  description:
    "How to get an MC number and operating authority the right way. Tech Rig files your MC application and BOC-3, and coordinates your insurance, so your authority actually activates.",
  alternates: { canonical: "/mc-registration/" },
  openGraph: {
    title: "How to Get Your MC Number | Tech Rig Filing",
    description:
      "How to get an MC number and operating authority the right way. Tech Rig files your MC application and BOC-3, and coordinates your insurance, so your authority actually activates.",
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
    a: "A USDOT number may be sufficient for intrastate for-hire operations where permitted by state law. MC operating authority is generally required when transporting property for compensation in interstate commerce. Not every carrier hauling for compensation automatically needs MC authority, so we confirm before you pay.",
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
    a: "Almost always a missing or incorrect BOC-3 or insurance filing. We make sure both are right so activation is not held up. UCR is a separate registration and is not an activation requirement.",
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
            price: 650,
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
                submitting a form. Tech Rig files your MC application and your
                BOC-3, and coordinates with your insurer, so your authority
                actually activates instead of stalling at the finish line.
              </p>
              <div className="mt-7">
                <Link
                  href={applyHref}
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
            their authority still will not activate, because the BOC-3 or the
            insurance filing was missing or wrong. Submitting the application is
            not the same as being ready to operate.
          </p>
        </Container>
      </Section>

      {/* How to get an MC number with Tech Rig */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How to get an MC number with Tech Rig
          </h2>

          {/* The dismissed-MC / legacy-account worked example now lives on the
              MOTUS migration page (client S2); point that buyer there instead. */}
          <p className="mt-4 border-l-4 border-steel pl-4 text-slate">
            Already had an MC that was dismissed, or an older account stuck
            outside MOTUS? That is a different path. A dismissed MC generally
            cannot be reinstated, so we file a new authority and get your record
            claimed in MOTUS. See{" "}
            <CrossLink href="/motus-migration/">MOTUS migration</CrossLink>.
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
              href={applyHref}
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
              label="required for most for-hire applicants"
            />
          </div>

          <ul className="mt-6 space-y-4 text-slate">
            <li>
              <span className="font-medium text-ink">Tech Rig service fee:</span>{" "}
              $650 standalone ($600 inside a{" "}
              <CrossLink href="/compliance-packages/">
                compliance package
              </CrossLink>
              ), one-time, for your MC authority application. This includes
              your USDOT number: when you file for MC authority, the USDOT is
              issued with it, so you do not pay the standalone USDOT fee on
              top. (USDOT-only, if that is all you need, is $300.)
            </li>
            <li>
              <span className="font-medium text-ink">Insurance:</span> your
              insurance provider must file the required proof of insurance
              directly with FMCSA, and the premium is separate. Tech Rig does not
              sell or file insurance; we coordinate so the filing lands on time.
            </li>
            <li>
              <span className="font-medium text-ink">Government fee:</span> any
              FMCSA application fee is shown separately.
            </li>
            <li>
              Want it all handled at once? Our{" "}
              <CrossLink href="/compliance-packages/">
                compliance packages
              </CrossLink>{" "}
              bundle MC + USDOT with BOC-3, UCR, and driver compliance at
              lower in-bundle prices (Authority Launch — Non-CDL $1,000, or
              CDL/Heavy $1,700). Insurance is coordinated with your own
              insurer, not a Tech Rig service.
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
        cta={{ label: "Get my MC authority", href: applyHref }}
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
