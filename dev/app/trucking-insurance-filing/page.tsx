import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AuthorityStatusTracker,
  type Step,
} from "@/components/authority-status-tracker";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { CheckSealIcon, FilingIcon, ShieldIcon } from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trucking Insurance Filing (BMC-91)",
  description:
    "Trucking insurance filing explained. Your authority activates only after your insurer files proof with FMCSA. We coordinate the filing so it lands on time.",
  alternates: { canonical: "/trucking-insurance-filing/" },
  openGraph: {
    title: "Insurance Filing",
    description:
      "Trucking insurance filing explained. Your authority activates only after your insurer files proof with FMCSA. We coordinate the filing so it lands on time.",
    url: "/trucking-insurance-filing/",
    type: "website",
  },
};

// Tracker scoped to where the insurance filing sits in the activation path. The
// surrounding nodes (Application filed -> 21-day protest period -> Authority
// active) stay present but quiet; the insurance filing is the highlighted node,
// shown as the gate between paperwork and an active authority. Honesty rules:
// the protest period is a fixed federal step, no guaranteed date or countdown.
const filingSteps: Step[] = [
  { label: "Application filed", status: "Filed", state: "todo", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "todo",
    icon: "clock",
  },
  { label: "Insurance filed with FMCSA", status: "This step", state: "filed", icon: "shield" },
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "What is a BMC-91 filing?",
    a: "It is how your insurer proves to FMCSA you carry the required liability coverage. FMCSA needs it on file before your authority activates.",
  },
  {
    q: "Do I file it, or does my insurance company?",
    a: "Your insurer files it. We coordinate so it actually gets done on time.",
  },
  {
    q: "Why has my authority not activated when I already have insurance?",
    a: "Often the proof has not been filed with FMCSA yet. Having a policy and having the filing in are two different things.",
  },
  {
    q: "Does this cost extra?",
    a: "Your premium is separate and set by your insurer. We coordinate the filing as part of your authority setup.",
  },
];

export default function TruckingInsuranceFilingPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "FMCSA insurance filing coordination",
            slug: "/trucking-insurance-filing/",
            description:
              "Tech Rig coordinates your trucking insurance filing so your insurer's proof of coverage reaches FMCSA on time and your operating authority can activate.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "Insurance Filing" },
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
              { name: "Insurance Filing" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Trucking Insurance Filing (BMC-91)
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Your operating authority does not activate the moment you buy
                insurance. It activates after your insurer files proof of that
                coverage with FMCSA, usually on a form like the BMC-91.
              </p>
              {/* The policy-vs-filing distinction is the emotional core, so it
                  breathes as its own line rather than being buried mid-paragraph. */}
              <p className="mt-4 max-w-[60ch] text-lg text-slate">
                This is one of the quiet steps that strands new carriers: they
                have a policy, they have an application, and they still cannot
                operate because the filing is not in.{" "}
                <span className="font-medium text-ink">
                  Tech Rig does not sell or handle insurance, and we are not
                  partnered with any insurer.
                </span>{" "}
                What we do is work with your own insurer so the required filing
                reaches FMCSA and your authority can activate.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get help with my filing
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            <AuthorityStatusTracker steps={filingSteps} />
          </div>
        </Container>
      </Section>

      {/* What a BMC-91 filing is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What a BMC-91 filing is
          </h2>
          {/* The key fact pulled out as a scannable lead-in line. */}
          <p className="mt-4 font-medium text-ink">
            The filing is made by your insurance company, not by you directly.
          </p>
          <p className="mt-4 text-slate">
            The BMC-91 (and related forms) is how an insurer certifies to FMCSA
            that a motor carrier has the required public liability coverage. FMCSA
            needs this proof on file before granting or activating operating
            authority. The filing is made by your insurance company, not by you
            directly, which is why timing and coordination matter: if the insurer
            has not filed, your authority waits, no matter how complete the rest
            of your paperwork is.
          </p>

          <div className="mt-6 flex gap-3 text-slate">
            <FilingIcon size={24} className="mt-0.5 shrink-0 text-steel" />
            <span>
              FMCSA needs the insurer's proof on file before your authority can
              activate.
            </span>
          </div>
        </Container>
      </Section>

      {/* Why the insurance filing trips up new carriers */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Why the insurance filing trips up new carriers
          </h2>
          <p className="mt-4 text-slate">
            A carrier can finish the MC application and the BOC-3 and still sit at
            the end of the 21-day protest period unable to activate, because the
            insurance filing was the missing piece. The filing itself is
            straightforward; making sure it is actually in, on time, alongside
            your other filings, is the part worth getting right.
          </p>

          {/* Generalized real example: a quiet cautionary aside, calm register,
              worded distinctly from /mc-registration/. No badge, no alarm. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            We have seen an authority dismissed entirely after a carrier missed
            the insurance and BOC-3 deadlines. The paperwork was nearly done; the
            filing was not in, and the window closed.
          </p>
        </Container>
      </Section>

      {/* How we help with your insurance filing */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How we help with your insurance filing
          </h2>
          <p className="mt-4 text-slate">
            Worth stating plainly: only your insurance provider can legally file
            the BMC-91 and MCS-90 with FMCSA. Tech Rig does not file these forms
            and is not partnered with any insurance company. What we do is
            coordinate with your own insurer so the filing is actually submitted
            and clears, on the right timeline.
          </p>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We tell you exactly what filing your authority needs and when.
              </span>
            </li>
            <li className="flex gap-4">
              <ShieldIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We coordinate with your insurer so the proof is filed with FMCSA,
                not left pending.
              </span>
            </li>
            <li className="flex gap-4">
              <FilingIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We line the filing up with your{" "}
                <CrossLink href="/mc-registration/">MC authority</CrossLink>,{" "}
                <CrossLink href="/boc-3-filing/">BOC-3</CrossLink>, and{" "}
                <CrossLink href="/ucr-registration/">UCR</CrossLink> so all the
                activation pieces are in together.
              </span>
            </li>
          </ul>

          {/* Fee-clarity note, not a price chip. There is no standalone published
              price for this page ([VERIFY]), so no number appears: the premium is
              the insurer's and separate; our role is coordinating the filing. */}
          <p className="mt-7 border-l-4 border-slate/30 pl-4 text-slate">
            Your insurance premium is set by your insurer and is separate. Tech
            Rig's role is coordinating the filing as part of your authority setup.
          </p>
        </Container>
      </Section>

      {/* Funnel cross-link forward to the full setup */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            One piece of getting road-legal
          </h2>
          <p className="mt-4 text-slate">
            The insurance filing is one piece of activating your authority. If you
            would rather not track each step yourself, have us handle the{" "}
            <CrossLink href="/compliance-services/">full setup</CrossLink>.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Insurance filing FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Waiting on your authority? Make sure the insurance filing is actually in."
        cta={{ label: "Get help with my filing", href: filingCtaHref }}
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
