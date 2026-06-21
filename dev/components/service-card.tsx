import Link from "next/link";
import { icons, type IconName } from "@/components/icons";
import { PriceChip } from "@/components/ui/price-chip";
import { cn } from "@/lib/utils";
import type { Price } from "@/lib/services";

/**
 * The service card (design-system §8): the canonical card for the compliance hub
 * grid, reused on every hub. Content-bearing (real service, real price), not a
 * decorative icon triplet. Line icon + service name (Steel link) + one plain
 * line + the single-source price chip (rendered borderless inside the card).
 * Equal-height in a grid (h-full), Cloud surface, 1px outline.
 */
export function ServiceCard({
  icon,
  title,
  href,
  description,
  price,
  priceLabel,
  govFeeNote,
  note,
}: {
  icon: IconName;
  title: string;
  /** Omit for a service that has no dedicated page; the title renders as plain
   *  text instead of a (would-be dead) link. */
  href?: string;
  description: string;
  price?: Price;
  priceLabel?: string;
  govFeeNote?: string;
  /** Optional plain note under the price (e.g. "includes USDOT number"). */
  note?: string;
}) {
  const Icon = icons[icon];
  return (
    <div className="flex h-full flex-col rounded-card border border-slate/15 bg-cloud p-5">
      <Icon size={24} className="text-steel" />
      <h3 className="mt-3 font-display text-lg font-semibold">
        {href ? (
          <Link
            href={href}
            className="text-ink underline-offset-4 hover:text-steel hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            {title}
          </Link>
        ) : (
          <span className="text-ink">{title}</span>
        )}
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate">{description}</p>
      {price ? (
        <div className="mt-4">
          <PriceChip
            price={price}
            label={priceLabel}
            govFeeNote={govFeeNote}
            note={note}
            className={cn("border-0 bg-transparent px-0 py-0")}
          />
        </div>
      ) : null}
    </div>
  );
}
