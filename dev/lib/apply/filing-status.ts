/**
 * Filing status lifecycle (M5). The single source for: the allowed state-machine
 * transitions (enforced server-side in the transition API), the client-facing
 * label + plain-language meaning (Grade 8, brand voice), and the mapping onto the
 * AuthorityStatusTracker stages. No fabricated timelines — the registry's
 * expectedTimeline is guidance, shown separately, never a guarantee.
 */
import type { Step } from "@/components/authority-status-tracker";

export type FilingStatus =
  | "not_started"
  | "queued"
  | "filed"
  | "active"
  | "completed"
  | "awaiting_info"
  | "manual_review"
  | "cancelled";

export const FILING_STATUSES: FilingStatus[] = [
  "not_started",
  "queued",
  "filed",
  "active",
  "completed",
  "awaiting_info",
  "manual_review",
  "cancelled",
];

export function isFilingStatus(v: unknown): v is FilingStatus {
  return typeof v === "string" && (FILING_STATUSES as string[]).includes(v);
}

/**
 * Allowed transitions (M5 §3). The forward path is
 * not_started -> queued -> filed -> active -> completed; awaiting_info and
 * manual_review are side states that return into the flow; cancelled is terminal.
 * Anything not listed is rejected (422).
 */
export const ALLOWED_TRANSITIONS: Record<FilingStatus, FilingStatus[]> = {
  not_started: ["queued", "awaiting_info", "manual_review", "cancelled"],
  queued: ["filed", "awaiting_info", "manual_review", "cancelled"],
  filed: ["active", "awaiting_info", "manual_review", "cancelled"],
  active: ["completed", "cancelled"],
  awaiting_info: ["queued", "filed", "manual_review", "cancelled"],
  manual_review: ["queued", "filed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function canTransition(from: FilingStatus, to: FilingStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Client-facing label + one-line meaning per status (M5 §6, brand voice). */
export const STATUS_COPY: Record<FilingStatus, { label: string; meaning: string }> = {
  not_started: { label: "Not started", meaning: "Received and waiting to be queued." },
  queued: { label: "In our queue", meaning: "In our queue, starting soon." },
  filed: { label: "Filed", meaning: "Filed with FMCSA, awaiting processing." },
  active: { label: "Active", meaning: "Active and approved." },
  completed: { label: "Completed", meaning: "Done and on file." },
  awaiting_info: { label: "Needs your input", meaning: "We need something from you to continue." },
  manual_review: { label: "Under review", meaning: "Under manual review on our side." },
  cancelled: { label: "Cancelled", meaning: "This filing was cancelled." },
};

// Tracker mapping: the forward stages a filing moves through, mapped onto the
// AuthorityStatusTracker. The current status sets which stage is active; earlier
// stages read as done. Side states are surfaced as the status note, not a stage.
const STAGES: { key: FilingStatus; label: string; icon: Step["icon"] }[] = [
  { key: "queued", label: "Queued", icon: "clock" },
  { key: "filed", label: "Filed with FMCSA", icon: "stamp" },
  { key: "active", label: "Active", icon: "shield" },
  { key: "completed", label: "Completed", icon: "checkSeal" },
];

/** Build tracker steps for one filing's current status. */
export function buildTrackerSteps(status: FilingStatus): Step[] {
  // Side/terminal states have no clean forward index; show the first stage as the
  // live one with the real status tag so we never imply false progress.
  const sideState = status === "awaiting_info" || status === "manual_review" || status === "cancelled" || status === "not_started";
  const currentIndex = sideState ? 0 : STAGES.findIndex((s) => s.key === status);

  return STAGES.map((stage, i): Step => {
    let state: Step["state"];
    if (i < currentIndex) state = "filed"; // done
    else if (i === currentIndex && !sideState) state = status === "completed" ? "active" : "progress";
    else if (i === 0 && sideState) state = "progress";
    else state = "todo";
    const isCurrent = i === currentIndex || (i === 0 && sideState);
    return {
      label: stage.label,
      status: isCurrent ? STATUS_COPY[status].label : i < currentIndex ? "Done" : "Upcoming",
      state,
      icon: stage.icon,
    };
  });
}
