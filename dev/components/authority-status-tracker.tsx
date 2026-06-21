"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRightIcon, icons, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The Authority Status Tracker: the site's signature element (design-system §7).
 * It visualises the carrier's journey, Application filed -> 21-day federal
 * protest period -> Authority active, and recurs on the home hero, the pillar,
 * and compliance page headers.
 *
 * Honesty rules (non-negotiable, from brand guidelines): the protest period is
 * shown as a fixed federal step, never a guaranteed activation date or a
 * countdown that implies Tech Rig controls timing. The status tags below label
 * stages, they do not promise a schedule.
 *
 * Motion: a calm staggered reveal on load (<=200ms each); the optional handoff
 * chip draws last. prefers-reduced-motion renders the final state instantly.
 */

type StepState = "todo" | "filed" | "progress" | "active";

export type Step = {
  label: string;
  /** Mono status tag. Labels a stage, never a date or countdown. */
  status: string;
  state: StepState;
  /** Icon by registry name, so steps can cross the server/client boundary. */
  icon: IconName;
};

// The canonical authority journey. Callers may pass a scoped subset on a
// specific filing page.
const authoritySteps: Step[] = [
  { label: "Application filed", status: "Filed", state: "filed", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
];

// Status palette mapping (design-system §3). Color is never the sole signal:
// each node also carries an icon and a text label.
const badgeStyles: Record<StepState, string> = {
  todo: "border-slate/40 text-slate",
  filed: "border-status-filed text-status-filed",
  progress: "border-status-progress text-status-progress",
  active: "border-status-active bg-status-active text-cloud",
};
const tagStyles: Record<StepState, string> = {
  todo: "text-slate",
  filed: "text-status-filed",
  progress: "text-status-progress",
  active: "text-status-active",
};

function Badge({ step }: { step: Step }) {
  const Icon = icons[step.icon];
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
        badgeStyles[step.state],
      )}
    >
      <Icon size={20} />
    </span>
  );
}

function StepText({ step, className }: { step: Step; className?: string }) {
  return (
    <div className={className}>
      <p className="font-display text-sm font-semibold leading-snug text-ink">
        {step.label}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em]",
          tagStyles[step.state],
        )}
      >
        {step.status}
      </p>
    </div>
  );
}

export function AuthorityStatusTracker({
  steps = authoritySteps,
  handoff,
  className,
}: {
  steps?: Step[];
  /** Optional forward chip, e.g. "keep loaded" pointing to dispatch (home hero). */
  handoff?: { label: string; href: string };
  className?: string;
}) {
  const reduce = useReducedMotion();
  const lastIndex = steps.length - 1;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "rounded-card border border-slate/15 bg-cloud p-5 shadow-card md:p-6",
        className,
      )}
    >
      <p className="mb-5 font-mono text-xs uppercase tracking-[0.08em] text-slate">
        Authority journey
      </p>

      {/* Mobile: vertical stepper with connecting line down the badges. */}
      <ol className="md:hidden">
        {steps.map((step, i) => (
          <motion.li variants={item} key={step.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Badge step={step} />
              {i < lastIndex ? (
                <span className="my-1 w-px flex-1 bg-slate/25" aria-hidden />
              ) : null}
            </div>
            <StepText step={step} className={i < lastIndex ? "pb-6" : ""} />
          </motion.li>
        ))}
      </ol>

      {/* Desktop: horizontal stepper with connectors between the badges. */}
      <ol className="hidden md:flex">
        {steps.map((step, i) => (
          <motion.li
            variants={item}
            key={step.label}
            className="flex flex-1 flex-col"
          >
            <div className="flex w-full items-center">
              <Badge step={step} />
              {i < lastIndex ? (
                <span className="mx-3 h-px flex-1 bg-slate/25" aria-hidden />
              ) : null}
            </div>
            <StepText step={step} className="pr-4 pt-3" />
          </motion.li>
        ))}
      </ol>

      {handoff ? (
        <motion.div variants={item} className="mt-5 border-t border-slate/15 pt-4">
          <Link
            href={handoff.href}
            className="inline-flex items-center gap-2 rounded-chip font-mono text-xs uppercase tracking-[0.08em] text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            <ArrowRightIcon size={16} />
            {handoff.label}
          </Link>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
