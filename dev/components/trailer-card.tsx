import Link from "next/link";
import { icons, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * The trailer card (design-system §8): the dispatch counterpart to the service
 * card, for the dispatch hub grid and each trailer page's siblings context.
 * Distinct trailer line icon + name (link) + one-line value. The franchise (box
 * truck) gets a quiet "most established" emphasis via a Steel left rule and a
 * mono tag, never amber, so it leads the grid without breaking the rhythm.
 */
export function TrailerCard({
  icon,
  title,
  href,
  value,
  tag,
  emphasized = false,
}: {
  icon: IconName;
  title: string;
  href: string;
  value: string;
  tag?: string;
  emphasized?: boolean;
}) {
  const Icon = icons[icon];
  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col gap-2 rounded-card border border-slate/15 bg-cloud p-5 transition-colors hover:border-steel outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel",
        emphasized && "border-l-[3px] border-l-steel",
      )}
    >
      <div className="flex items-center justify-between">
        <Icon size={28} className="text-steel" />
        {tag ? (
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-slate">
            {tag}
          </span>
        ) : null}
      </div>
      <span className="font-display text-base font-semibold text-ink transition-colors group-hover:text-steel">
        {title}
      </span>
      <span className="text-sm text-slate">{value}</span>
    </Link>
  );
}
