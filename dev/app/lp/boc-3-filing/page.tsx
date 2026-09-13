import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { PriceChip } from "@/components/ui/price-chip";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import {
  ArrowRightIcon,
  CheckSealIcon,
  ClockIcon,
  FilingIcon,
  PhoneIcon,
  RouteNodeIcon,
  ShieldIcon,
  StampIcon,
} from "@/components/icons";
import { TrackedForm } from "@/components/tracked-form";
import { TrackedLink } from "@/components/tracked-link";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { pricing } from "@/lib/services";
import { site } from "@/lib/site";
import { startQuickBuyLookup } from "@/app/buy/[service]/actions";
import { LandingTabs } from "./tabs";
import { LandingHeader } from "./landing-header";

/*
 * Dedicated Google Ads landing page for BOC-3 filing. Deliberately separate
 * from the SEO page at /boc-3-filing/: noindex + canonical back to that page
 * (see metadata below) so the two never compete in organic search, and a
 * page-scoped header (landing-header.tsx) instead of the site-wide one, since
 * this page's job is a single conversion path, not site navigation.
 *
 * The hero embeds the real USDOT quick-buy form (the same `startQuickBuyLookup`
 * server action `/buy/boc-3/` uses), so a submission here goes into the actual
 * lookup-and-pay flow, not a mockup. GTM funnel tracking (TrackedForm/
 * TrackedLink/TrackedAnchor, see lib/gtm.ts) is wired through every CTA and the
 * form itself.
 *
 * "No extra charges for documents received" and "Refund guarantee" are ops-
 * confirmed policy (signed off 2026-09-13), not placeholder copy.
 */

const applyHref = "/buy/boc-3/";
const price = pricing["/boc-3-filing/"];
const startBoc3Lookup = startQuickBuyLookup.bind(null, "boc-3");

// The "Tech Rig" Google Business Profile listing (5.0 aggregate, 4 reviews).
// Every review card and the aggregate line link back here so a visitor can
// verify these in place rather than take the page's word for it.
const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/QJTUHyD5LkdomX1r6";

// Real reviews from that listing, quoted verbatim (2026-09-11). Names are
// exactly as Google displays them (the reviewer's own choice under Google's
// real-name policy). Dates supplied by the client from the Business Profile
// dashboard (Google's public page only gave relative times like "2 months
// ago", which would quietly go false if hardcoded). A 4th 5-star review
// exists on the listing but needs a signed-in Google session to expand, so
// it is not included here.
const googleReviews = [
  {
    name: "Marcus Curry",
    meta: "4 reviews · 7 photos",
    stars: 5,
    date: "2026-07-01",
    dateLabel: "Jul 1, 2026",
    text: "I dealt with Adam @ Tech Rig to help me set up my trucking company. Marx LLC. He was very polite and patient. He never once got annoyed by all my questions. He helped me through every step of the way. I can't say enough about Tech Rig. I would highly recommended them to anyone looking to get into the logistics industry!",
  },
  {
    name: "Felix Feliciano",
    meta: "10 reviews",
    stars: 5,
    date: "2026-06-25",
    dateLabel: "Jun 25, 2026",
    text: "Very helpful, always available, respectful and polite, this was the first time for me and the experience was great. I definitely recommend to use their services",
  },
  {
    name: "Kyle Draeger",
    meta: "Local Guide · 8 reviews",
    stars: 5,
    date: "2026-07-03",
    dateLabel: "Jul 3, 2026",
    text: "We're very helpful and quick to get things done once we worked everything out. They weren't pushy and just helped so I chose to file with them.",
  },
];

// Google's "G" mark, used only as a source indicator (never alone: always
// paired with visible "Google" text) so it reads as attribution, not as an
// implied partnership. Worth a check against Google's current review-widget
// brand guidelines before this ships anywhere real.
function GoogleIcon({ size = 16, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.6H24v9h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.1-3.8 6.6-9.5 6.6-16.6Z" />
      <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.6-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.3 46 24 46Z" />
      <path fill="#FBBC05" d="M11.6 28.1c-.5-1.3-.7-2.7-.7-4.1s.3-2.8.7-4.1v-5.7H4.3C2.8 17.1 2 20.5 2 24s.8 6.9 2.3 9.8l7.3-5.7Z" />
      <path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 4.2 30 2 24 2 15.3 2 7.9 6.9 4.3 14.2l7.3 5.7c1.8-5.2 6.6-9.1 12.4-9.1Z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: { absolute: "BOC-3 Filing, $100 One Time | Tech Rig" },
  description:
    "File your BOC-3 today, direct with an FMCSA-listed process agent, all 50 states, $100 one time. Confirm your USDOT number to get started.",
  // Deliberately noindex: this is the Google Ads landing page, a variant of
  // the real SEO page (canonical target below). Never meant to rank on its
  // own, so the two pages can't compete in organic search.
  robots: { index: false, follow: false },
  alternates: { canonical: "/boc-3-filing/" },
};

// The real USDOT entry form, embedded in the hero card instead of the
// reference's name/phone/MC-DOT fields. Same server action `/buy/boc-3/` uses.
function UsdotForm({ compact = false }: { compact?: boolean }) {
  return (
    <TrackedForm
      action={startBoc3Lookup}
      event="quick_buy_lookup_submit"
      data={{ service: "boc-3", location: "lp_hero" }}
      className="space-y-3"
    >
      <div>
        {/* Hidden by default (opacity, not display, so no layout shift when it
            appears). The header CTA's click handler reveals this by id after
            it finishes scrolling here, then hides it again after a few
            seconds. See landing-header.tsx. */}
        <p
          id="usdot-hint"
          aria-live="polite"
          className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-steel opacity-0 transition-opacity duration-300"
        >
          <ArrowRightIcon size={12} className="rotate-90" aria-hidden="true" />
          Enter your USDOT number here to get started
        </p>
        <label htmlFor="usdot" className="text-sm font-medium text-ink">
          USDOT number
        </label>
        <input
          id="usdot"
          name="usdot"
          inputMode="numeric"
          pattern="\d{1,12}"
          required
          placeholder="e.g. 1234567"
          className="mt-1 w-full rounded-card border border-slate/25 bg-paper px-4 py-3 text-lg text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
        />
      </div>
      <button
        type="submit"
        className={`${buttonVariants({ variant: "primary", size: compact ? "sm" : "md" })} w-full`}
      >
        File my BOC-3 &mdash; $100
      </button>
    </TrackedForm>
  );
}

const trustStripItems = [
  { icon: <ClockIcon size={17} />, text: "Filed same day" },
  { icon: <RouteNodeIcon size={17} />, text: "50-state coverage" },
  { icon: <ShieldIcon size={17} />, text: "No extra charges for documents received" },
];

const trustBarItems = [
  { icon: <StampIcon size={16} />, text: "FMCSA-listed process agent" },
  { icon: <CheckSealIcon size={16} />, text: "No extra charges for documents received" },
  { icon: <ClockIcon size={16} />, text: "Most filings post within hours" },
  { icon: <ShieldIcon size={16} />, text: "Refund guarantee, no fine print" },
];

const howItWorks = [
  {
    n: "01",
    icon: <FilingIcon size={22} className="text-steel" />,
    h: "We confirm your record",
    p: "A quick USDOT lookup, no forms to fill out.",
  },
  {
    n: "02",
    icon: <StampIcon size={22} className="text-steel" />,
    h: "We file your BOC-3",
    p: "Coverage designated across all 50 states in one filing.",
  },
  {
    n: "03",
    icon: <CheckSealIcon size={22} className="text-steel" />,
    h: "It posts to your record",
    p: "Verifiable directly on your public FMCSA record.",
  },
  {
    n: "04",
    icon: <RouteNodeIcon size={22} className="text-steel" />,
    h: "Authority activates",
    p: "Once your BOC-3 is filed and your insurer has filed proof of insurance, your authority goes active.",
  },
];

// Reused verbatim from the live page: single source for this claim, no drift.
const priceFeatures = [
  "Filed direct with FMCSA, same day",
  "Coverage across all 50 states",
  "Included in every compliance package",
  "Verifiable on your FMCSA record",
];

// Kept: real, factual, matching the live page. Trimmed to the 6 highest-intent
// questions (the reference's list, already close to ours).
const faqs: Faq[] = [
  {
    q: "What is a BOC-3?",
    a: "A federal filing that names a process agent in every state to receive legal documents for you. It is required before operating authority can activate.",
  },
  {
    q: "How much does a BOC-3 cost?",
    a: "$100, one time. No renewals. Unlike some process agents, we never charge extra if a legal document is received on your behalf, something many bury in their terms and conditions. If that happens, we mail it to you at no additional cost.",
  },
  {
    q: "Do I have to renew my BOC-3 every year?",
    a: "No. It is generally a one-time filing. You refile only if you change process agents or a specific circumstance requires it. Your UCR, by contrast, is annual.",
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
    a: "MC authority activation requires the BOC-3 filing and the required insurance filing from your insurer. We handle the BOC-3; the insurance filing comes from your insurer directly.",
  },
];

const tabs = [
  {
    id: "what",
    label: "What it is",
    content: (
      <p className="text-slate">
        The BOC-3 is the federal form that designates a process agent in each
        state: a person or company authorized to accept legal papers for you
        in that state. FMCSA requires it for motor carriers, brokers, and
        freight forwarders before operating authority can be granted. A
        blanket process agent covers all 50 states in one filing, which is why
        most carriers use a blanket company instead of naming individual
        agents state by state. The BOC-3 is filed electronically; it is not a
        printed certificate FMCSA hands you, and you can verify it on your
        public FMCSA record.
      </p>
    ),
  },
  {
    id: "who",
    label: "Who needs one",
    content: (
      <ul className="space-y-3">
        {[
          "Anyone applying for operating authority (an MC number) needs a BOC-3 before it activates.",
          "Brokers and freight forwarders need one too.",
          "A private motor carrier that is not operating for hire generally does not need a BOC-3.",
        ].map((t) => (
          <li key={t} className="flex gap-3 text-ink">
            <CheckSealIcon size={18} className="mt-0.5 shrink-0 text-status-active" aria-hidden="true" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    // Swapped from "Why one-time" (2026-09-13): that fact is already covered
    // in the FAQ below, and this is the more-searched follow-up question that
    // wasn't answered anywhere on the page. See page.tsx history for sources.
    id: "self-file",
    label: "Can I file it myself?",
    content: (
      <>
        <p className="text-slate">
          Only for the one state where your business keeps a physical
          address, since FMCSA requires the agent to be reachable there
          during business hours. For every other state you run in, you would
          need to personally find someone with a physical address there, get
          their consent to act as your agent, and file a separate
          designation naming them.
        </p>
        <p className="mt-4 text-slate">
          Most carriers run in more states than that, so it turns into
          several individual arrangements to set up and keep current, not
          one form. That legwork is what you are paying to skip.
        </p>
      </>
    ),
  },
];

export default function Boc3LandingPage() {
  return (
    <>
      <LandingHeader />

      {/* Hero */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Left: offer, proof, action */}
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-chip border border-steel px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-steel">
                <StampIcon size={13} aria-hidden="true" />
                FMCSA-listed process agent &middot; all 50 states
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Your operating authority doesn&apos;t activate{" "}
                <span className="text-steel">without this filing.</span>
              </h1>
              <p className="mt-4 max-w-[52ch] text-lg text-slate">
                A BOC-3 names the process agent who can accept legal documents
                for you in every state you run. We file it direct with
                FMCSA/MOTUS electronically, for a flat $100 you pay once.
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {trustStripItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-medium text-ink">
                    <span className="text-steel" aria-hidden="true">
                      {item.icon}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: the real USDOT quick-buy form, in place of the reference's
                multi-field lead form. id="file" is the header's scroll target,
                kept on the card itself so the scroll lands on the form, not
                the call banner below it. */}
            <div className="flex flex-col gap-4">
              <div id="file" className="scroll-mt-24 rounded-card border border-slate/15 bg-cloud p-6 shadow-card">
                <p className="font-display text-lg font-bold text-ink">
                  Get your BOC-3 filed
                </p>
                <p className="mt-1 text-sm text-slate">
                  About 2 minutes: confirm your record, pay, and we file the same day.
                </p>
                <div className="mt-5">
                  <UsdotForm />
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate">
                  <CheckSealIcon size={16} className="text-status-active" aria-hidden="true" />
                  One-time $100. No annual renewal.
                </p>
              </div>

              <TrackedAnchor
                href={site.telHref}
                event="call_click"
                data={{ location: "hero_consult_banner" }}
                className="flex items-center gap-3 rounded-card border border-slate/20 bg-cloud px-4 py-3 text-sm text-ink hover:border-steel"
              >
                <PhoneIcon size={18} className="shrink-0 text-steel" aria-hidden="true" />
                <span>
                  Not sure you even need to file?{" "}
                  <strong className="font-semibold">Call for a free consultation</strong>{" "}
                  &middot; {site.telephone}
                </span>
              </TrackedAnchor>
            </div>
          </div>
        </Container>
      </Section>

      {/* Trust bar */}
      <div className="border-y border-slate/15 bg-cloud">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-sm text-ink md:justify-between">
          {trustBarItems.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-steel" aria-hidden="true">
                {item.icon}
              </span>
              {item.text}
            </span>
          ))}
        </Container>
      </div>

      {/* How it works */}
      <Section id="how-it-works" surface="paper" className="scroll-mt-24">
        <Container>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-steel">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">
            Four steps, no forms to chase
          </h2>
          <p className="mt-3 max-w-[60ch] text-slate">
            Because we are the FMCSA-listed agent ourselves, filing is direct.
            Nothing gets handed off to a third party.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <div key={step.n}>
                <span aria-hidden="true">{step.icon}</span>
                <p className="mt-3 font-mono text-xs font-semibold tabular-nums text-steel">
                  {step.n}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                  {step.h}
                </h3>
                <p className="mt-1.5 text-sm text-slate">{step.p}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Know before you file: tabs */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-steel">
            Know before you file
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">
            Everything a first-time filer asks us
          </h2>
          <div className="mt-8">
            <LandingTabs tabs={tabs} />
          </div>
        </Container>
      </Section>

      {/* Pricing */}
      <Section id="pricing" surface="paper" className="scroll-mt-24">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              Simple pricing
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink">
              No tiers, no surprise renewal
            </h2>
            <p className="mt-4 max-w-[52ch] text-slate">
              Most process agents bill an annual fee to keep the relationship
              going. We charge once, file the same day, and that is the
              relationship: done correctly, on your record, verifiable.
            </p>
          </div>

          <div className="rounded-card border border-steel bg-cloud p-6 shadow-card">
            <PriceChip price={price} label="BOC-3 filing" className="border-none bg-transparent p-0" />
            <ul className="mt-5 space-y-2.5">
              {priceFeatures.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-ink">
                  <CheckSealIcon size={16} className="mt-0.5 shrink-0 text-status-active" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <TrackedLink
              href={applyHref}
              event="cta_click"
              data={{ location: "pricing" }}
              className={`${buttonVariants({ variant: "primary", size: "md" })} mt-6 w-full`}
            >
              File my BOC-3 now
            </TrackedLink>
          </div>
        </Container>
      </Section>

      {/* Real Google reviews for the "Tech Rig" listing (5.0 aggregate, 4
          reviews, all 5-star), quoted verbatim with the exact dates the
          client supplied from the Business Profile dashboard. */}
      <Section id="reviews" surface="ink" className="scroll-mt-24">
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-signal">
                What carriers say
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-cloud">
                Filed by carriers who searched exactly what you searched
              </h2>
            </div>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-cloud/80 hover:text-cloud"
            >
              <GoogleIcon size={16} />
              <span aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              5.0 on Google reviews
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {googleReviews.map((r) => (
              <figure key={r.name} className="flex flex-col rounded-card border border-cloud/15 bg-cloud/5 p-5">
                <span className="text-signal" aria-label={`${r.stars} out of 5 stars`}>
                  {"★".repeat(r.stars)}
                </span>
                <blockquote className="mt-2 flex-1 text-cloud/90">&ldquo;{r.text}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-3 border-t border-cloud/10 pt-3 text-sm text-cloud/60">
                  <span>
                    {r.name}
                    <span className="block text-xs text-cloud/40">
                      {r.meta} &middot; <time dateTime={r.date}>{r.dateLabel}</time>
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-cloud/50">
                    <GoogleIcon size={14} />
                    Google
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cloud/70 underline underline-offset-4 hover:text-cloud"
          >
            Read all our reviews on Google
            <ArrowRightIcon size={14} aria-hidden="true" />
          </a>
        </Container>
      </Section>

      {/* FAQ */}
      <Section id="faq" surface="paper" className="scroll-mt-24">
        <Container className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-steel">
            Questions
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">
            BOC-3 filing FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section surface="ink">
        <Container className="max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-cloud md:text-3xl">
            Stop waiting on paperwork. File your BOC-3 and clear your
            authority today.
          </h2>
          <p className="mt-3 text-cloud/70">
            FMCSA-listed. Filed the same day. $100, once.
          </p>
          <div className="mt-6 flex justify-center">
            <TrackedLink
              href={applyHref}
              event="cta_click"
              data={{ location: "final_cta" }}
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              File my BOC-3 &mdash; $100
              <ArrowRightIcon size={18} aria-hidden="true" />
            </TrackedLink>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.08em] text-cloud/60">
            <span className="flex items-center gap-1.5">
              <CheckSealIcon size={14} aria-hidden="true" />
              FMCSA-listed
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon size={14} aria-hidden="true" />
              Same-day filing
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldIcon size={14} aria-hidden="true" />
              Refund guarantee
            </span>
          </div>
        </Container>
      </Section>

      {/* Sticky mobile CTA. CSS only, mobile only. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-slate/15 bg-cloud px-4 py-3 shadow-card md:hidden">
        <TrackedAnchor
          href={site.telHref}
          event="call_click"
          data={{ location: "sticky_mobile" }}
          className={`${buttonVariants({ variant: "secondary", size: "sm" })} flex-1`}
        >
          <PhoneIcon size={16} aria-hidden="true" />
          Call
        </TrackedAnchor>
        <TrackedLink
          href={applyHref}
          event="cta_click"
          data={{ location: "sticky_mobile" }}
          className={`${buttonVariants({ variant: "primary", size: "sm" })} flex-[2]`}
        >
          File my BOC-3
        </TrackedLink>
      </div>
      {/* Spacer so the sticky bar never covers the footer's last line on mobile. */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
