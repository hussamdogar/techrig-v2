import Link from "next/link";
import { ArrowRightIcon, icons, type IconName } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { PriceChip } from "@/components/ui/price-chip";
import { cn } from "@/lib/utils";
import type { Price } from "@/lib/services";

/**
 * The service card (design-system §8, full spec in
 * shared/design/service-card.md): the canonical card for the compliance hub
 * grid, the homepage and the state pages. Icon + title, one plain line, then a
 * footer with the single-source price chip and an arrow.
 *
 * Whole-card link: the title's link stretches over the card (`after:inset-0`),
 * so a click anywhere on it opens the service page, while keyboard and screen
 * reader users still get one link named after the service. Nothing else in the
 * card is a link, except the optional "Order now" (orderHref), which is raised
 * above the stretched link (`relative z-10`) rather than nested inside it.
 *
 * Works unchanged inside a dark <Section surface="ink">: bg-cloud switches the
 * colour tokens back to their light values (app/globals.css).
 */
export function ServiceCard({
  icon,
  title,
  href,
  orderHref,
  description,
  price,
  priceLabel,
  govFeeNote,
  note,
  className,
}: {
  icon: IconName;
  title: string;
  /** Omit for a service that has no dedicated page; the card then renders as
   *  plain, non-clickable content instead of a (would-be dead) link. */
  href?: string;
  /** Quick-buy checkout for this service (/buy/<key>/). Adds an "Order now"
   *  button beside a "Read more" cue (homepage, owner 2026-10-08). */
  orderHref?: string;
  description: string;
  price?: Price;
  priceLabel?: string;
  govFeeNote?: string;
  /** Optional plain note under the price (e.g. "includes USDOT number"). */
  note?: string;
  className?: string;
}) {
  const Icon = icons[icon];
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-card border border-slate/15 bg-cloud p-5 sm:p-6",
        href &&
          "transition-[border-color,box-shadow,transform,background-color] duration-150 ease-out hover:border-steel hover:shadow-card motion-safe:hover:-translate-y-0.5 has-[a:focus-visible]:border-steel active:bg-paper active:shadow-none motion-safe:active:translate-y-0",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon size={24} aria-hidden="true" className="mt-0.5 shrink-0 text-steel" />
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {href ? (
            // The ::after covers the card; its focus ring is drawn inset so it
            // stays visible (AA) on dark sections too.
            <Link
              href={href}
              className="text-ink outline-none transition-colors duration-150 group-hover:text-steel after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-steel"
            >
              {title}
            </Link>
          ) : (
            <span className="text-ink">{title}</span>
          )}
        </h3>
      </div>
      <p className="mt-2 text-sm text-slate">{description}</p>

      {price || href ? (
        <div className="mt-auto pt-5">
          <div className="border-t border-slate/10 pt-4">
            <div className="flex items-start justify-between gap-4">
              {price ? (
                <PriceChip
                  price={price}
                  label={priceLabel}
                  govFeeNote={govFeeNote}
                  note={note}
                  className="border-0 bg-transparent px-0 py-0"
                />
              ) : null}
              {href && !orderHref ? (
                <ArrowRightIcon
                  size={20}
                  aria-hidden="true"
                  className="ml-auto mt-1 shrink-0 text-steel transition-transform duration-150 ease-out motion-safe:group-hover:translate-x-1"
                />
              ) : null}
            </div>

            {href && orderHref ? (
              <div className="mt-4 flex items-center justify-between gap-3">
                <Link
                  href={orderHref}
                  className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "relative z-10")}
                >
                  Order now
                </Link>
                {/* Visual cue only: the card's own link already goes to the
                    service page, so this is not a second link to it. */}
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-1 text-sm font-medium text-steel"
                >
                  Read more
                  <ArrowRightIcon
                    size={16}
                    className="transition-transform duration-150 ease-out motion-safe:group-hover:translate-x-1"
                  />
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
