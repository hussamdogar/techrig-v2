"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon, CheckSealIcon, PhoneIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { cn } from "@/lib/utils";
import { pushDataLayerEvent } from "@/lib/gtm";
import { site } from "@/lib/site";
import { computeQuickBuyPricing, type QuickBuyServiceKey } from "@/lib/services-registry";
import { preselectQuery } from "@/lib/quick-buy-preselect";
import {
  QUICK_BUY_PRIMARY_ORDER,
  REQUIREMENTS,
  isCdl,
  requirementsFor,
  type RequirementKey,
  type Vehicle,
} from "@/lib/compliance-check";

/**
 * The "Am I road-legal?" wizard on /compliance-check/. Two or three taps:
 * interstate or intrastate, whether the carrier has a USDOT/MC yet, and what
 * they drive (plus one weight question for a hotshot). The rules live in
 * lib/compliance-check.ts; this file is only the steps and the result.
 *
 * Result for a carrier with a USDOT/MC: a checklist of what they typically
 * need, every quick-buy item ticked by default with a running total from
 * computeQuickBuyPricing (the same function checkout charges with). They
 * untick what they already have, and one button sends the ticked items to
 * /buy/<first>/?add=<rest>, where the review screen shows them pre-ticked.
 * Not-started carriers (checkout needs a USDOT) and intrastate visitors get a
 * call next step instead.
 */

type Where = "interstate" | "intrastate";
type Status = "not-started" | "has-numbers";
type Answers = { where?: Where; status?: Status; vehicle?: Vehicle; hotshotHeavy?: boolean };
type StepKey = "where" | "status" | "vehicle" | "hotshot";

const VEHICLES: { value: Vehicle; title: string; sub: string }[] = [
  { value: "semi", title: "Semi / tractor-trailer", sub: "CDL required" },
  { value: "straight", title: "Box truck or straight truck", sub: "10,001 to 26,000 lbs, no CDL" },
  { value: "hotshot", title: "Pickup with a trailer (hotshot)", sub: "One more question on weight" },
  { value: "van", title: "Cargo or sprinter van", sub: "Under 10,001 lbs" },
];

function stepsFor(a: Answers): StepKey[] {
  if (a.where !== "interstate") return ["where"];
  return a.vehicle === "hotshot" ? ["where", "status", "vehicle", "hotshot"] : ["where", "status", "vehicle"];
}

/** True once every step on the current path is answered. */
function isComplete(a: Answers): boolean {
  if (a.where === "intrastate") return true;
  if (a.where !== "interstate" || !a.status || !a.vehicle) return false;
  return a.vehicle !== "hotshot" || a.hotshotHeavy !== undefined;
}

export function ComplianceCheck() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const steps = stepsFor(answers);
  const done = isComplete(answers) && step >= steps.length;

  // Move focus to the new question or result so keyboard and screen-reader
  // users land on it, not on the button that just disappeared.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step, done]);

  function answer<K extends keyof Answers>(key: K, value: Answers[K], question: StepKey) {
    // Changing an earlier answer clears the ones after it.
    const order: (keyof Answers)[] = ["where", "status", "vehicle", "hotshotHeavy"];
    const next: Answers = {};
    for (const k of order) {
      if (k === key) break;
      (next as Record<string, unknown>)[k] = answers[k];
    }
    next[key] = value;
    pushDataLayerEvent("compliance_check_answer", { question, answer: String(value) });
    setAnswers(next);
    setStep(stepsFor(next).indexOf(question) + 1);
  }

  const back = () => setStep((s) => Math.max(0, s - 1));

  if (done) {
    return (
      <Card>
        <Result
          answers={answers}
          headingRef={headingRef}
          onRestart={() => {
            setAnswers({});
            setStep(0);
          }}
          onBack={back}
        />
      </Card>
    );
  }

  const current = steps[Math.min(step, steps.length - 1)];
  // Interstate path: 3 questions, 4 for a hotshot (shown as 3 until known).
  const total = answers.vehicle === "hotshot" ? 4 : 3;
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
          Step {step + 1} of {total}
        </p>
        {step > 0 ? (
          <button type="button" onClick={back} className="text-sm font-medium text-steel hover:underline">
            &larr; Back
          </button>
        ) : null}
      </div>

      {current === "where" ? (
        <Question headingRef={headingRef} title="Where do you haul?">
          <Option
            selected={answers.where === "interstate"}
            title="Interstate"
            sub="I cross state lines"
            onClick={() => answer("where", "interstate", "where")}
          />
          <Option
            selected={answers.where === "intrastate"}
            title="Intrastate"
            sub="I stay inside one state"
            onClick={() => answer("where", "intrastate", "where")}
          />
        </Question>
      ) : current === "status" ? (
        <Question headingRef={headingRef} title="Where are you with your paperwork?">
          <Option
            selected={answers.status === "not-started"}
            title="Not started yet"
            sub="No USDOT or MC number"
            onClick={() => answer("status", "not-started", "status")}
          />
          <Option
            selected={answers.status === "has-numbers"}
            title="I have a USDOT / MC number"
            onClick={() => answer("status", "has-numbers", "status")}
          />
        </Question>
      ) : current === "vehicle" ? (
        <Question headingRef={headingRef} title="What do you drive?">
          {VEHICLES.map((v) => (
            <Option
              key={v.value}
              selected={answers.vehicle === v.value}
              title={v.title}
              sub={v.sub}
              onClick={() => answer("vehicle", v.value, "vehicle")}
            />
          ))}
        </Question>
      ) : (
        <Question
          headingRef={headingRef}
          title="Is your truck and trailer rated over 26,000 lbs combined, with a trailer over 10,000 lbs?"
          hint="Check the GVWR stickers on the truck and the trailer. If both are true, the driver needs a CDL."
        >
          <Option
            selected={answers.hotshotHeavy === true}
            title="Yes"
            sub="CDL operation"
            onClick={() => answer("hotshotHeavy", true, "hotshot")}
          />
          <Option
            selected={answers.hotshotHeavy === false}
            title="No"
            sub="Non-CDL operation"
            onClick={() => answer("hotshotHeavy", false, "hotshot")}
          />
        </Question>
      )}
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-card border border-slate/15 bg-cloud p-5 text-ink shadow-card sm:p-7">{children}</div>;
}

function Question({
  title,
  hint,
  headingRef,
  children,
}: {
  title: string;
  hint?: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mt-3">
      <legend className="sr-only">{title}</legend>
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none">
        {title}
      </h2>
      {hint ? <p className="mt-2 text-sm text-slate">{hint}</p> : null}
      <div className="mt-5 grid gap-2.5">{children}</div>
    </fieldset>
  );
}

function Option({
  title,
  sub,
  selected,
  onClick,
}: {
  title: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex min-h-14 w-full items-center justify-between gap-3 rounded-btn border-[1.5px] px-4 py-3 text-left transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel",
        selected ? "border-steel bg-steel/[0.06]" : "border-slate/25 bg-paper hover:border-steel",
      )}
    >
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        {sub ? <span className="mt-0.5 block text-sm text-slate">{sub}</span> : null}
      </span>
      <ArrowRightIcon size={18} className="shrink-0 text-steel" aria-hidden="true" />
    </button>
  );
}

function CallButton({ label }: { label: string }) {
  return (
    <TrackedAnchor
      href={site.telHref}
      event="call_click"
      data={{ location: "compliance_check" }}
      className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full sm:w-auto")}
    >
      <PhoneIcon size={18} aria-hidden="true" />
      {label} {site.telephone}
    </TrackedAnchor>
  );
}

function Result({
  answers,
  headingRef,
  onRestart,
  onBack,
}: {
  answers: Answers;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  onRestart: () => void;
  onBack: () => void;
}) {
  const footer = (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate/15 pt-4 text-sm">
      <button type="button" onClick={onBack} className="font-medium text-steel hover:underline">
        &larr; Change my answer
      </button>
      <button type="button" onClick={onRestart} className="font-medium text-steel hover:underline">
        Start over
      </button>
    </div>
  );

  useEffect(() => {
    const segment =
      answers.where === "intrastate"
        ? "intrastate"
        : [answers.status, answers.vehicle, isCdl(answers.vehicle!, answers.hotshotHeavy ?? null) ? "cdl" : "non-cdl"].join("|");
    pushDataLayerEvent("compliance_check_result", { segment });
  }, [answers]);

  if (answers.where === "intrastate") {
    return (
      <>
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none">
          Intrastate carriers
        </h2>
        <p className="mt-3 text-slate">
          If you only haul inside one state, some states need nothing more than a USDOT number, and some require
          their own state filings. We work with interstate carriers, so we don&apos;t handle intrastate setups. If
          you&apos;re not sure, or you plan to cross state lines, call us and we&apos;ll point you the right way.
        </p>
        <div className="mt-6">
          <CallButton label="Call us" />
        </div>
        {footer}
      </>
    );
  }

  const cdl = isCdl(answers.vehicle!, answers.hotshotHeavy ?? null);
  const started = answers.status === "has-numbers";
  const items = requirementsFor({ started, vehicle: answers.vehicle!, cdl });

  if (!started) {
    return (
      <>
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none">
          Here&apos;s what you&apos;ll need
        </h2>
        <p className="mt-2 text-slate">
          Starting from scratch, these are typically required{cdl ? " for a CDL operation" : ""}. Call us and
          we&apos;ll set them up in the right order.
        </p>
        <ul className="mt-5 space-y-3">
          {items.map((k) => (
            <li key={k} className="flex gap-3">
              <CheckSealIcon size={18} className="mt-0.5 shrink-0 text-steel" aria-hidden="true" />
              <span>
                <span className="block font-medium text-ink">{REQUIREMENTS[k].title}</span>
                <span className="block text-sm text-slate">{REQUIREMENTS[k].why}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <CallButton label="Call" />
        </div>
        <Disclaimer />
        {footer}
      </>
    );
  }

  return <Checklist items={items} cdl={cdl} headingRef={headingRef} footer={footer} />;
}

function Checklist({
  items,
  cdl,
  headingRef,
  footer,
}: {
  items: RequirementKey[];
  cdl: boolean;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  footer: React.ReactNode;
}) {
  const buyable = items.flatMap((k) => (REQUIREMENTS[k].quickBuy ? [REQUIREMENTS[k].quickBuy!] : []));
  const callItems = items.filter((k) => REQUIREMENTS[k].handling === "call");
  const notOffered = items.filter((k) => REQUIREMENTS[k].handling === "not-offered");
  const [ticked, setTicked] = useState<Set<QuickBuyServiceKey>>(() => new Set(buyable));

  // Baseline pricing: UCR's 0-2 truck bracket and one driver. Checkout
  // re-prices from the carrier's own FMCSA record and driver count.
  const selected = QUICK_BUY_PRIMARY_ORDER.filter((k) => ticked.has(k));
  const pricing = selected.length ? computeQuickBuyPricing(selected, { powerUnits: 0, driverCount: 1 }) : null;
  const linePrice = (k: QuickBuyServiceKey) =>
    pricing?.lines.find((l) => l.key === k)?.amount ??
    computeQuickBuyPricing([k], { powerUnits: 0, driverCount: 1 }).total;

  const [primary, ...addOns] = selected;
  const href = primary ? `/buy/${primary}/${preselectQuery(addOns)}` : null;

  function toggle(k: QuickBuyServiceKey) {
    setTicked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  return (
    <>
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink outline-none">
        Here&apos;s what you need
      </h2>
      <p className="mt-2 text-slate">
        Typically required for an interstate {cdl ? "CDL" : "non-CDL"} carrier. Untick anything you already have.
      </p>

      <ul className="mt-5 divide-y divide-slate/15 rounded-card border border-slate/15 bg-paper">
        {buyable.map((k) => {
          const req = REQUIREMENTS[k as RequirementKey];
          const on = ticked.has(k);
          return (
            <li key={k}>
              <label className="flex cursor-pointer items-start gap-3 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(k)}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-slate/40 accent-[var(--color-steel)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-medium text-ink">{req.title}</span>
                    <span className={cn("shrink-0 font-mono tabular-nums", on ? "text-ink" : "text-slate line-through")}>
                      {k === "ucr" ? "from " : ""}${linePrice(k)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate">{req.why}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate">
          {pricing ? (
            <>
              <span className="font-display text-xl font-bold text-ink">${pricing.total}</span> for{" "}
              {selected.length} {selected.length === 1 ? "filing" : "filings"}
            </>
          ) : (
            "Nothing selected"
          )}
        </p>
        {href ? (
          <Link
            href={href}
            onClick={() => pushDataLayerEvent("compliance_check_buy", { items: selected.join(","), value: pricing?.total })}
            className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full sm:w-auto")}
          >
            Continue
            <ArrowRightIcon size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span className={cn(buttonVariants({ variant: "primary", size: "md" }), "pointer-events-none w-full opacity-50 sm:w-auto")}>
            Continue
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-slate">
        Priced for 0-2 trucks and one driver. You confirm your USDOT next, and checkout uses your FMCSA record and
        driver count. Each is a one-time payment.
      </p>

      {callItems.length || notOffered.length ? (
        <div className="mt-6 rounded-card border border-slate/15 p-4">
          <p className="text-sm font-semibold text-ink">Also typically required for CDL carriers</p>
          <ul className="mt-3 space-y-2.5">
            {[...callItems, ...notOffered].map((k) => (
              <li key={k} className="text-sm">
                <span className="font-medium text-ink">{REQUIREMENTS[k].title}</span>
                <span className="text-slate">
                  {": "}
                  {REQUIREMENTS[k].why}
                  {REQUIREMENTS[k].handling === "call" ? " Call us to arrange it." : ""}
                </span>
              </li>
            ))}
          </ul>
          {callItems.length ? (
            <p className="mt-3 text-sm">
              <TrackedAnchor
                href={site.telHref}
                event="call_click"
                data={{ location: "compliance_check_extras" }}
                className="font-medium text-steel underline underline-offset-4"
              >
                Call {site.telephone}
              </TrackedAnchor>
            </p>
          ) : null}
        </div>
      ) : null}

      <Disclaimer />
      {footer}
    </>
  );
}

function Disclaimer() {
  return (
    <p className="mt-5 text-xs text-slate">
      A general guide to federal requirements for interstate carriers, based on your answers. State rules can add
      more. Not legal advice.
    </p>
  );
}
