import { CheckIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Shared look for the quick-buy checkout screens (checkout, payment, thank
 * you), so all three read as one product (shared/design/quick-buy-checkout-v2.md
 * and quick-buy-payment-thanks-v2.md).
 */

/** Visible keyboard focus on every interactive element. */
export const CHECKOUT_FOCUS = "outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-steel";

export const CHECKOUT_CARD = "rounded-[14px] border border-line bg-cloud p-4 shadow-[0_1px_2px_rgba(14,34,51,.05)] lg:p-6";

export const CHECKOUT_H2 = "font-display text-[19px] font-bold leading-6 text-ink";

/** The one amber action on a screen. */
export const CHECKOUT_PRIMARY_BUTTON =
  "flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-signal text-[17px] font-semibold text-ink shadow-[inset_0_-2px_0_rgba(14,34,51,.14),0_1px_2px_rgba(14,34,51,.12)] hover:bg-signal-hover active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-steel";

/** Outlined steel button for secondary actions (never amber). */
export const CHECKOUT_SECONDARY_BUTTON = cn(
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[10px] border border-steel bg-cloud px-4 text-[15px] font-semibold text-steel hover:bg-steel-50",
  CHECKOUT_FOCUS,
);

const STEPS = ["Service", "Review", "Payment"] as const;

/** "Service > Review > Payment", with everything before `current` done. */
export function CheckoutSteps({ current }: { current: (typeof STEPS)[number] }) {
  const at = STEPS.indexOf(current);
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-slate">
        {STEPS.map((label, i) => (
          <li key={label} className="contents">
            {i > 0 ? <span aria-hidden="true" className="h-px w-4 bg-field" /> : null}
            <span
              aria-current={i === at ? "step" : undefined}
              className={cn("flex items-center gap-1.5", i === at && "font-semibold text-ink")}
            >
              {i < at ? (
                <span className="grid size-5 place-items-center rounded-full bg-status-active text-cloud">
                  <CheckIcon size={12} strokeWidth={3} />
                </span>
              ) : (
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[11px]",
                    i === at ? "bg-steel text-cloud" : "border border-field",
                  )}
                >
                  {i + 1}
                </span>
              )}
              {label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CheckoutSpinner() {
  return (
    <svg className="size-5 motion-safe:animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
