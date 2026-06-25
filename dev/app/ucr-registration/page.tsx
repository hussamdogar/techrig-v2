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
  StampIcon,
} from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing, type Price } from "@/lib/services";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "UCR Registration and Renewal",
  description:
    "UCR registration and annual renewal done for you. We file your Unified Carrier Registration, confirm your fleet bracket, and keep you legal to run interstate.",
  alternates: { canonical: "/ucr-registration/" },
  openGraph: {
    title: "UCR Registration",
    description:
      "UCR registration and annual renewal done for you. We confirm your fleet bracket and keep you legal to run interstate.",
    url: "/ucr-registration/",
    type: "website",
  },
};

// Tracker scoped to where UCR sits: annual upkeep that keeps an active authority
// legal. The journey resolves to "Authority active", then a recurring annual
// marker (status-progress), visually separating UCR from one-time filings.
const ucrSteps: Step[] = [
  { label: "Application filed", status: "Filed", state: "filed", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
  { label: "Renews annually", status: "Every year", state: "progress", icon: "clock" },
];

// Government fee per fleet-size bracket (the UCR program fee), shown separately
// from the flat $50 Tech Rig filing fee, never blended (client Q1.3 / D6).
// Bracket = number of qualifying commercial vehicles; an operation running only
// non-CMVs stays in 0-2 even with more than two of them. Re-verify the
// government portion against the official UCR Plan schedule each registration year.
const brackets = [
  { size: "0 to 2 (and brokers / leasing)", fee: "$46" },
  { size: "3 to 5", fee: "$138" },
  { size: "6 to 20", fee: "$276" },
  { size: "21 to 100", fee: "$963" },
  { size: "101 to 1,000", fee: "$4,592" },
  { size: "1,001+", fee: "$44,836" },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "Is UCR a one-time fee?",
    a: "No. UCR is annual. You renew every year, usually before the new registration year opens. (BOC-3, by contrast, is generally one-time.)",
  },
  {
    q: "What happens if I do not pay UCR?",
    a: "In states that enforce it, you can be fined at roadside and your vehicle can be held until it is resolved. Renewing on time avoids this.",
  },
  {
    q: "Do brokers need UCR?",
    a: "Yes, brokers and freight forwarders register too, normally in the lowest bracket, even without trucks.",
  },
  {
    q: "Can you tell me my correct bracket?",
    a: "Yes. We confirm your vehicle count and the right bracket before filing so you do not over or underpay.",
  },
  {
    q: "Do I pay the government fee to Tech Rig?",
    a: "The government fee is separate and goes to the program. Our service fee is for filing it correctly and on time. You see both before you pay.",
  },
];

// The BOC-3 + UCR bundle price (a separate, quiet option, not in the per-slug
// map): BOC-3 $100 + UCR filing $50 = $150 in Tech Rig service fees. The UCR
// government fee is bracket-based and shown separately, never blended in.
const bundlePrice: Price = { kind: "flat", amount: 150 };

export default function UcrRegistrationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "UCR registration",
            slug: "/ucr-registration/",
            description:
              "Tech Rig files your annual Unified Carrier Registration, confirms the correct fleet bracket, and reminds you before each renewal.",
            price: 50,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "UCR Registration" },
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
              { name: "UCR Registration" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                UCR Registration and Renewal
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                If you run a commercial vehicle across state lines, UCR
                registration is not optional, and it comes due every year. Miss
                it and you risk roadside fines and held loads in states that
                enforce it. Tech Rig files your Unified Carrier Registration for
                you, confirms the right fleet bracket so you do not overpay, and
                reminds you before the next renewal. You stay focused on freight,
                not federal forms.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  File my UCR
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            <AuthorityStatusTracker steps={ucrSteps} />
          </div>
        </Container>
      </Section>

      {/* What UCR registration is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What UCR registration is
          </h2>
          <p className="mt-4 text-slate">
            UCR (Unified Carrier Registration) is a federal program that requires
            motor carriers, brokers, freight forwarders, and leasing companies
            operating in interstate commerce to register and pay an annual fee
            based on fleet size. The money funds state enforcement of motor
            carrier safety programs. It is separate from your USDOT number and
            your operating authority: you can have an active USDOT and MC and
            still be out of compliance if your UCR is not paid for the current
            year.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              "Carriers running vehicles in interstate commerce.",
              "Brokers, freight forwarders, and leasing companies, even without trucks.",
              "New carriers, in their first year, as soon as they begin interstate operation.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-ink">
                <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Honest applicability, as reassurance not fine print. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Not every operation owes UCR the same way. Purely intrastate carriers
            and some operations are treated differently. If you are not sure UCR
            applies to you, we will tell you before you pay.
          </p>
        </Container>
      </Section>

      {/* How UCR fees work */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How UCR fees work (and why brackets matter)
          </h2>
          <p className="mt-4 text-slate">
            The government fee is tiered by the number of qualifying commercial
            vehicles you operate, and the brackets jump fast, so a miscount can
            cost you. Brokers and forwarders without vehicles pay the lowest
            bracket. Our filing fee is a flat $50 per registration, added on top
            of the government fee for your bracket shown below:
          </p>

          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate/25">
                <th className="py-2 pr-4 font-display text-sm font-semibold text-ink">
                  Fleet size (vehicles)
                </th>
                <th className="py-2 font-display text-sm font-semibold text-ink">
                  2026 UCR government fee
                </th>
              </tr>
            </thead>
            <tbody>
              {brackets.map((b) => (
                <tr key={b.size} className="border-b border-slate/15">
                  <td className="py-2 pr-4 text-slate">{b.size}</td>
                  <td className="py-2 font-mono tabular-nums text-ink">{b.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-slate">
            2026 registration year; fees were unchanged from 2025. Source: the UCR
            Plan fee-bracket schedule.
          </p>

          <p className="mt-6 text-slate">
            What this means for you: the most common mistake we fix is a carrier
            who paid the wrong bracket, either overpaying or underpaying and
            getting flagged. We confirm your correct bracket first, then file.
          </p>
        </Container>
      </Section>

      {/* What our UCR registration service costs */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our UCR registration service costs
          </h2>

          <div className="mt-6 flex flex-wrap gap-4">
            <PriceChip
              price={pricing["/ucr-registration/"]}
              label="UCR filing"
              govFeeNote="+ gov fee, set by fleet bracket"
            />
            <PriceChip
              price={bundlePrice}
              label="BOC-3 + UCR filing"
              govFeeNote="+ UCR gov fee by bracket"
            />
          </div>

          <p className="mt-6 text-slate">
            We do not advertise one flat UCR price for every carrier, because the
            government fee genuinely depends on your fleet size. You see both
            numbers up front.
          </p>

          <p className="mt-6">
            <Link
              href={filingCtaHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              File my UCR
            </Link>
          </p>
        </Container>
      </Section>

      {/* What you get */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What you get when Tech Rig files your UCR
          </h2>
          <ul className="mt-6 space-y-5">
            {[
              {
                Icon: CheckSealIcon,
                text: "We confirm your fleet bracket so the fee is right.",
              },
              {
                Icon: StampIcon,
                text: "We complete and submit your registration for the current year.",
              },
              {
                Icon: ClockIcon,
                text: "We keep a record and remind you before the next annual renewal, so you do not lapse.",
                weight: true,
              },
              {
                Icon: FilingIcon,
                text: "If your UCR is part of a larger setup, we line it up with your USDOT, MC, and BOC-3 so your annual obligations are handled together. UCR is a separate annual filing, not a step that activates your authority.",
              },
            ].map(({ Icon, text, weight }) => (
              <li key={text} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-steel" />
                <span className={weight ? "font-medium text-ink" : "text-ink"}>
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Funnel cross-link + worked example */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            New carrier? UCR fits into the bigger setup
          </h2>
          <p className="mt-4 text-slate">
            UCR is one piece of getting road-legal. If you are still standing up
            your company, see how it fits with your{" "}
            <CrossLink href="/mc-registration/">operating authority</CrossLink>{" "}
            and <CrossLink href="/boc-3-filing/">BOC-3 filing</CrossLink>, or have
            us handle the{" "}
            <CrossLink href="/compliance-services/">full setup</CrossLink>. Many
            of our clients start with a{" "}
            <CrossLink href="/boc-3-filing/">BOC-3 and UCR</CrossLink> together,
            then add the rest.
          </p>

          {/* The page's unique worked example. Real past result, not a promise. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            A Maryland CDL hotshot owner-operator came to us needing both
            company-level and driver-level compliance before he could haul. We
            handled his BOC-3, UCR, driver qualification file, consortium
            enrollment, Clearinghouse setup, and pre-employment drug test in about
            7 days, and he began running after the protest period.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            UCR registration FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Due for UCR or starting fresh? We will file it right and remind you next year."
        cta={{ label: "File my UCR", href: filingCtaHref }}
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
