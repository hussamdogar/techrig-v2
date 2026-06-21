import { cn } from "@/lib/utils";
import type { Price } from "@/lib/services";

/**
 * The single-source price chip (design-system §8). Renders from a Price object
 * (from lib/services pricing) so on-page prices never drift from services.md.
 * Three states plus fee separation:
 *  - flat:   $100 with a small label.
 *  - from:   "from $100" (the "from" set smaller, Slate).
 *  - quote:  "Contact for quote".
 *  - verify: "Fee to be confirmed" (service fee not yet confirmed; never invented).
 * When a government/third-party fee applies, it is shown on a separate Slate
 * line, never blended into the service-fee number.
 */
export function PriceChip({
  price,
  label,
  govFeeNote = "+ gov fee (varies)",
  note,
  className,
}: {
  /** Optional: a card for a non-priced page (e.g. a hub) passes undefined and the chip renders nothing. */
  price?: Price;
  label?: string;
  /** Override the gov-fee line, e.g. "+ gov fee, set by fleet bracket". */
  govFeeNote?: string;
  /** A plain clarifying line under the price, e.g. "includes USDOT number". Not
   *  a fee, so it renders whether or not a government fee applies. */
  note?: string;
  className?: string;
}) {
  if (!price) return null;
  return (
    <span
      className={cn(
        "inline-flex flex-col gap-0.5 rounded-card border border-slate/20 bg-cloud px-4 py-3",
        className,
      )}
    >
      <span className="font-mono text-xl font-medium tabular-nums text-ink">
        {price.kind === "from" ? (
          <span className="mr-1 text-sm text-slate">from</span>
        ) : null}
        {price.kind === "quote"
          ? "Contact for quote"
          : price.kind === "verify"
            ? "Fee to be confirmed"
            : `$${price.amount}`}
        {price.unit ? (
          <span className="ml-1 text-sm text-slate">{price.unit}</span>
        ) : null}
      </span>

      {label ? <span className="text-sm text-slate">{label}</span> : null}

      {price.govFee ? (
        <span className="mt-1 font-mono text-xs text-slate">{govFeeNote}</span>
      ) : null}

      {note ? (
        <span className="mt-1 font-mono text-xs text-slate">{note}</span>
      ) : null}
    </span>
  );
}
