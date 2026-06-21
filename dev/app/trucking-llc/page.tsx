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
  title: "LLC for Your Trucking Company",
  description:
    "Form an LLC for your trucking company the right way. We set up your trucking LLC and EIN so your authority, insurance, and banking all line up from day one.",
  alternates: { canonical: "/trucking-llc/" },
  openGraph: {
    title: "Trucking LLC",
    description:
      "Form an LLC for your trucking company the right way. We set up your trucking LLC and EIN so your authority, insurance, and banking line up from day one.",
    url: "/trucking-llc/",
    type: "website",
  },
};

// Tracker reframed for "entity first": a "Company formed" node is prepended so
// the sequence reads Company formed -> Application filed -> 21-day protest period
// -> Authority active. The "Company formed" node is this page's highlighted step
// (active state), the rest carry the canonical authority journey. Honesty rules:
// the protest period is a fixed federal step, never a guaranteed date.
const llcSteps: Step[] = [
  { label: "Company formed", status: "This step", state: "active", icon: "stamp" },
  { label: "Application filed", status: "Filed", state: "filed", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
];

// The ordered "LLC, then authority" sequence. A genuine order, so numbered
// connected steps are appropriate here (and only here). Restrained 01 to 06.
const orderSteps = [
  { n: "01", label: "Trucking LLC", href: undefined as string | undefined },
  { n: "02", label: "USDOT number", href: "/dot-registration/" },
  { n: "03", label: "MC authority", href: "/mc-registration/" },
  { n: "04", label: "BOC-3", href: "/boc-3-filing/" },
  { n: "05", label: "Insurance", href: undefined as string | undefined },
  { n: "06", label: "UCR", href: "/ucr-registration/" },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "Do I need an LLC to start trucking?",
    a: "It is not legally required, but most carriers form one to separate personal and business liability and to get a clean entity for authority, insurance, and banking.",
  },
  {
    q: "What is an EIN and do I need one?",
    a: "An EIN is your federal tax ID. You generally need one to open a business bank account and run payroll, and we get it as part of setup.",
  },
  {
    q: "Which state should I form my LLC in?",
    a: "Usually the state where you operate. We can talk through your situation.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on your state and scope, so we quote it. State filing fees are separate.",
  },
];

export default function TruckingLlcPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "Trucking LLC formation",
            slug: "/trucking-llc/",
            description:
              "Tech Rig forms an LLC for your trucking company and obtains your EIN, with the company details kept consistent with the FMCSA filings that follow.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "Trucking LLC" },
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
              { name: "Trucking LLC" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Form an LLC for Your Trucking Company
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Most carriers start their company as an LLC, and for good reason:
                it separates your business from your personal assets and gives you
                the clean entity that your authority, insurance, and bank account
                all attach to. Set the entity up wrong, or with details that do
                not match your FMCSA filings, and you create problems that surface
                later. Tech Rig forms an LLC for your trucking company and gets
                your EIN, so the foundation is right before you file for authority.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Form my trucking LLC
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            <AuthorityStatusTracker steps={llcSteps} />
          </div>
        </Container>
      </Section>

      {/* Featured offer / price treatment: Contact-for-quote, no published price */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-4 rounded-card border border-slate/15 bg-paper p-6">
            <PriceChip
              price={pricing["/trucking-llc/"]}
              label="Trucking LLC formation"
              className="self-start"
            />
            <p className="text-slate">
              LLC formation pricing depends on your state and scope. State filing
              fees are separate and set by your state. We quote it before you
              commit, so there are no surprises.
            </p>
            <p>
              <CrossLink href="/contact-us/">Contact us for a quote</CrossLink>.
            </p>
          </div>
        </Container>
      </Section>

      {/* Why form an LLC */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Why form an LLC for your trucking company
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-display font-semibold text-ink">
                Liability separation.
              </p>
              <p className="mt-2 text-slate">
                An LLC helps keep your personal assets separate from business risk.
              </p>
            </div>
            <div>
              <p className="font-display font-semibold text-ink">
                Clean entity for everything downstream.
              </p>
              <p className="mt-2 text-slate">
                Your <CrossLink href="/dot-registration/">USDOT</CrossLink>,{" "}
                <CrossLink href="/mc-registration/">MC authority</CrossLink>,
                insurance, and banking all attach to the company. Consistent
                details across them prevent headaches.
              </p>
            </div>
            <div>
              <p className="font-display font-semibold text-ink">
                Credibility with brokers and factoring.
              </p>
              <p className="mt-2 text-slate">
                A registered company is the baseline most brokers and factoring
                partners expect.
              </p>
            </div>
          </div>

          {/* The page's distinct wrong-setup lesson, calm not alarmist. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            The entity decision also interacts with your authority type. Choosing
            the wrong setup, like registering in a way that does not match how you
            actually operate, is a real and costly mistake we have had to correct
            for carriers.
          </p>
        </Container>
      </Section>

      {/* What our setup includes */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our LLC for trucking company setup includes
          </h2>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4">
              <StampIcon size={24} className="mt-0.5 shrink-0 text-status-active" />
              <span className="text-ink">We form your LLC in your chosen state.</span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon
                size={24}
                className="mt-0.5 shrink-0 text-status-active"
              />
              <span className="text-ink">
                We obtain your EIN (your federal tax ID).
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon
                size={24}
                className="mt-0.5 shrink-0 text-status-active"
              />
              <span className="text-ink">
                We make sure the company details are consistent with the FMCSA
                filings that come next, so your{" "}
                <CrossLink href="/dot-registration/">USDOT</CrossLink> and{" "}
                <CrossLink href="/mc-registration/">MC authority</CrossLink> line up
                cleanly.
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon
                size={24}
                className="mt-0.5 shrink-0 text-status-active"
              />
              <span className="text-ink">
                We hand off straight into the rest of your setup if you want it done
                as one package.
              </span>
            </li>
          </ul>
        </Container>
      </Section>

      {/* LLC, then authority: the right order */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            LLC, then authority: the right order
          </h2>
          <p className="mt-4 text-slate">
            Forming the company is step one. Then comes your{" "}
            <CrossLink href="/dot-registration/">USDOT number</CrossLink>,{" "}
            <CrossLink href="/mc-registration/">MC authority</CrossLink>,{" "}
            <CrossLink href="/boc-3-filing/">BOC-3</CrossLink>, insurance, and{" "}
            <CrossLink href="/ucr-registration/">UCR</CrossLink>. Doing them in
            order, with matching details, is what keeps your authority from
            stalling. See the full path in our{" "}
            <CrossLink href="/how-to-start-a-trucking-company/">
              guide to starting a trucking company
            </CrossLink>
            , or have us handle the{" "}
            <CrossLink href="/compliance-services/">full setup</CrossLink>.
          </p>

          {/* The genuine ordered sequence: connected stepper, restrained numbering. */}
          <ol className="mt-6 grid gap-px overflow-hidden rounded-card border border-slate/15 bg-slate/15 sm:grid-cols-2 lg:grid-cols-3">
            {orderSteps.map((step) => (
              <li
                key={step.n}
                className="flex items-center gap-3 bg-paper px-4 py-4"
              >
                <span className="font-mono text-sm tabular-nums text-steel">
                  {step.n}
                </span>
                <span className="font-display font-semibold text-ink">
                  {step.href ? (
                    <CrossLink href={step.href}>{step.label}</CrossLink>
                  ) : (
                    step.label
                  )}
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Funnel cross-link forward */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Rather have it all done as one package?
          </h2>
          <p className="mt-4 text-slate">
            Set up the entity, then let us run the rest of the filings in order so
            nothing stalls your authority. See the{" "}
            <CrossLink href="/compliance-services/">full setup</CrossLink>.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Trucking LLC FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Starting your trucking company? Set the entity up right before you file for authority."
        cta={{ label: "Form my trucking LLC", href: filingCtaHref }}
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
