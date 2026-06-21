import Link from "next/link";

export type Crumb = { name: string; href?: string };

/**
 * Visible breadcrumb trail (the logical hierarchy, not the flat URL path). The
 * matching BreadcrumbList schema is added separately via lib/schema breadcrumbNode.
 * The current page (last crumb) has no link.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 font-mono text-xs text-slate">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.name} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className="underline-offset-4 hover:text-steel hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                >
                  {c.name}
                </Link>
              ) : (
                <span className={last ? "text-ink" : undefined} aria-current={last ? "page" : undefined}>
                  {c.name}
                </span>
              )}
              {!last ? <span aria-hidden>/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
