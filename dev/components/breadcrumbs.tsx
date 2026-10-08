import Link from "next/link";

export type Crumb = { name: string; href?: string };

/**
 * Visible breadcrumb trail (the logical hierarchy, not the flat URL path). The
 * matching BreadcrumbList schema is added separately via lib/schema breadcrumbNode.
 * The current page (last crumb) has no link. `tone="dark"` is for the dark
 * (Ink) page heroes, where Slate/Steel text would fail contrast.
 */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1 font-mono text-xs ${dark ? "text-cloud/70" : "text-slate"}`}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.name} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className={`underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    dark ? "hover:text-signal focus-visible:outline-cloud" : "hover:text-steel focus-visible:outline-steel"
                  }`}
                >
                  {c.name}
                </Link>
              ) : (
                <span className={last ? (dark ? "text-cloud" : "text-ink") : undefined} aria-current={last ? "page" : undefined}>
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
