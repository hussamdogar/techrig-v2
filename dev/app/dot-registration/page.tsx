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
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Get a DOT Number for Trucking",
  description:
    "How to get a DOT number without the headaches. Tech Rig sets up your USDOT registration, handles the MOTUS Portal, and gets your number right the first time.",
  alternates: { canonical: "/dot-registration/" },
  openGraph: {
    title: "How to Get a DOT Number for Trucking",
    description:
      "How to get a DOT number without the headaches. Tech Rig sets up your USDOT registration, handles the MOTUS Portal, and gets your number right the first time.",
    url: "/dot-registration/",
    type: "website",
  },
};

// Tracker scoped to where the USDOT number sits: the entry point of the
// activation sequence. The USDOT number identifies the carrier and comes before
// operating authority, so the first node (USDOT registered) is the active entry
// point; the protest period and activation are shown as later steps that apply
// when authority is also needed. Honesty rules: no guaranteed dates.
const dotSteps: Step[] = [
  { label: "USDOT number registered", status: "First step", state: "active", icon: "checkSeal" },
  { label: "Operating authority filed", status: "If needed", state: "filed", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "Do I need a USDOT number, an MC number, or both?",
    a: "It depends on your operation. Interstate for-hire carriers usually need both. Some carriers need only a USDOT number. We confirm which applies to you.",
  },
  {
    q: "How long does it take to get a USDOT number?",
    a: "The registration itself is quick once the application is correct. Government processing and MOTUS issues can add time, so we do not promise a date, but we keep your side moving.",
  },
  {
    q: "What is MOTUS and why does it matter?",
    a: "MOTUS is FMCSA's newer system. Existing records sometimes have to be claimed or linked before you can register or update, and that is where carriers get stuck. We handle it.",
  },
  {
    q: "Can you reactivate an old USDOT number?",
    a: "Yes. Reactivation often starts with an MCS-150 and may involve a MOTUS linkage. We do this regularly.",
  },
  {
    q: "Is the USDOT number a one-time thing?",
    a: "The number is yours, but you must keep it current with MCS-150 updates, including the biennial update.",
    // Visible text matches `a`; the inline link restores the brief's internal link.
    aNode: (
      <>
        The number is yours, but you must keep it current with{" "}
        <Link
          href="/mcs-150-biennial-update/"
          className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
        >
          MCS-150 updates
        </Link>
        , including the biennial update.
      </>
    ),
  },
];

export default function DotRegistrationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "USDOT registration",
            slug: "/dot-registration/",
            description:
              "Tech Rig sets up your USDOT registration, handles the MOTUS Portal account, and confirms your number the first time.",
            price: 300,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "USDOT Registration" },
          ]),
          faqNode(faqs),
          personNode("robert"),
        )}
      />

      {/* Hero */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services", href: "/compliance-services/" },
              { name: "USDOT Registration" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                How to Get a DOT Number
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                A USDOT number is how the federal government identifies and
                tracks your trucking operation. If you run a commercial vehicle
                over a certain weight, carry enough passengers, or haul
                interstate, you need one before you operate. Figuring out how to
                get a DOT number on your own means navigating the MOTUS Portal,
                the right operation classifications, and the MOTUS system. Tech
                Rig does it for you and gets it right the first time.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get my USDOT number
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Robert Hooke" />
              </div>
            </div>

            <AuthorityStatusTracker steps={dotSteps} />
          </div>
        </Container>
      </Section>

      {/* What a USDOT number is and who needs one */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What a USDOT number is and who needs one
          </h2>
          <p className="mt-4 text-slate">
            A USDOT number is your unique federal ID as a motor carrier. FMCSA
            uses it for safety records, inspections, audits, and crash data. You
            generally need one if you operate a vehicle that meets the federal
            weight, passenger, or hazardous-materials thresholds in interstate
            commerce, and many states require it for intrastate operation too. A
            USDOT number is not the same as operating authority (your MC number).
            Some carriers need only a USDOT number; others need both. We tell you
            which applies to your operation.
          </p>

          {/* USDOT-vs-MC two-item comparison, set in the line system so the
              distinction reads at a glance (kept consistent with the MC page). */}
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border-l-4 border-steel bg-cloud/60 pl-4 pr-4 py-4">
              <dt className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
                <FilingIcon size={20} className="shrink-0 text-steel" />
                USDOT number
              </dt>
              <dd className="mt-2 text-sm text-slate">
                Identification and safety. Your federal ID for records,
                inspections, and audits.
              </dd>
            </div>
            <div className="rounded-card border-l-4 border-steel bg-cloud/60 pl-4 pr-4 py-4">
              <dt className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
                <StampIcon size={20} className="shrink-0 text-steel" />
                MC number
              </dt>
              <dd className="mt-2 text-sm text-slate">
                Authority to haul for hire. The operating authority that lets you
                run loads for pay.
              </dd>
            </div>
          </dl>
        </Container>
      </Section>

      {/* How to get a DOT number, step by step */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How to get a DOT number, step by step
          </h2>

          <ol className="mt-6 space-y-5">
            {[
              {
                n: "01",
                body: (
                  <>
                    Decide your operation type and classification (carrier,
                    interstate or intrastate, cargo type). Getting this wrong
                    causes problems later.
                  </>
                ),
              },
              {
                n: "02",
                body: <>Set up your MOTUS Portal account.</>,
              },
              {
                n: "03",
                body: (
                  <>
                    Complete the MCS-150 application, which creates your USDOT
                    record.
                  </>
                ),
              },
              {
                n: "04",
                body: <>Submit and receive your USDOT number.</>,
              },
              {
                n: "05",
                body: (
                  <>
                    If you also need operating authority, file your{" "}
                    <CrossLink href="/mc-registration/">MC application</CrossLink>{" "}
                    and <CrossLink href="/boc-3-filing/">BOC-3</CrossLink> next.
                  </>
                ),
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-4">
                <span
                  aria-hidden
                  className="font-mono text-sm font-semibold tabular-nums text-steel"
                >
                  {step.n}
                </span>
                <span className="text-ink">{step.body}</span>
              </li>
            ))}
          </ol>

          {/* The honest stall line, as a Slate emphasis line beneath the stepper. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            This is doable yourself. It is also where new carriers most often
            stall, because of classification mistakes and MOTUS account issues.
          </p>
        </Container>
      </Section>

      {/* What a USDOT number costs */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What a USDOT number costs
          </h2>

          <div className="mt-6 flex flex-wrap gap-4">
            <PriceChip
              price={pricing["/dot-registration/"]}
              label="USDOT registration, one time"
            />
          </div>

          <p className="mt-6 text-slate">
            Tech Rig service fee: $300, one-time, to register your USDOT number
            and set up your MOTUS Portal correctly. That $300 is the total for a
            standalone USDOT registration: there is no separate federal USDOT
            application fee. This price is for carriers who need a USDOT number
            only. If you also need operating authority, your{" "}
            <CrossLink href="/mc-registration/">MC filing</CrossLink> includes the
            USDOT, so you would not pay this separately.
          </p>
          <p className="mt-4 text-slate">
            Need authority too? See the{" "}
            <CrossLink href="/mc-registration/">MC authority</CrossLink> page, or
            get the{" "}
            <CrossLink href="/compliance-services/">full setup</CrossLink> as one
            package.
          </p>
        </Container>
      </Section>

      {/* Let us handle how to get a DOT number for you */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Let us handle how to get a DOT number for you
          </h2>

          {/* The page's unique worked example. New-carrier registration. */}
          <p className="mt-4 border-l-4 border-steel pl-4 text-slate">
            A Texas owner-operator starting a single-truck dry van company came to
            us before he had any federal record. We opened his MOTUS Portal
            account, classified him as an interstate for-hire carrier with one
            power unit and one driver, and filed the MCS-150 with his cargo and
            operation details. His USDOT number issued on that registration. The
            piece new carriers most often get wrong is the operation
            classification, and a wrong answer there follows you into every later
            filing, so we set it correctly the first time.
          </p>

          <p className="mt-6 font-display text-sm font-semibold text-ink">
            What you get with us:
          </p>
          <ul className="mt-4 space-y-5">
            {[
              {
                Icon: CheckSealIcon,
                text: "Correct operation classification from the start.",
              },
              {
                Icon: FilingIcon,
                text: "Your MOTUS Portal account set up properly.",
              },
              {
                Icon: StampIcon,
                text: "Your USDOT number registered and confirmed.",
              },
              {
                Icon: RouteNodeIcon,
                text: "A clean handoff into MC authority, BOC-3, and the rest if you need them.",
              },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">{text}</span>
              </li>
            ))}
          </ul>

          {/* Mid-page CTA: subordinate Steel text link, same route as hero. */}
          <p className="mt-6">
            <Link
              href={filingCtaHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Get my USDOT number
            </Link>
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            USDOT number FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Starting a trucking operation? Get your USDOT number set up right, the first time."
        cta={{ label: "Get my USDOT number", href: filingCtaHref }}
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
