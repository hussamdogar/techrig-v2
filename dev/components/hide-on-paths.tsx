"use client";

import { usePathname } from "next/navigation";

/**
 * Path gates for layout chrome. They let the root layout keep server-rendered
 * chrome (e.g. <SiteFooter>) while a section with its own chrome, like the
 * /buy/ checkout, swaps it out, without nesting that chrome inside <main>.
 */
function matches(pathname: string | null, prefixes: string[]) {
  return prefixes.some((p) => (pathname ?? "").startsWith(p));
}

/** Renders its children everywhere except under the given path prefixes. */
export function HideOnPaths({ prefixes, children }: { prefixes: string[]; children: React.ReactNode }) {
  return matches(usePathname(), prefixes) ? null : <>{children}</>;
}

/** Renders its children only under the given path prefixes. */
export function OnlyOnPaths({ prefixes, children }: { prefixes: string[]; children: React.ReactNode }) {
  return matches(usePathname(), prefixes) ? <>{children}</> : null;
}
