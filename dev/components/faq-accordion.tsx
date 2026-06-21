import type { ReactNode } from "react";
import { ChevronDownIcon } from "@/components/icons";

/**
 * `a` is the plain-text answer used for the FAQPage schema (parity is required).
 * `aNode` is an optional rich display version (e.g. with an inline link) whose
 * visible text must match `a`. When omitted, the plain `a` string is shown.
 */
export type Faq = { q: string; a: string; aNode?: ReactNode };

/**
 * The FAQ accordion (design-system §8). Built on native <details>/<summary>:
 * keyboard accessible, works without JS, and stays light. The question is a
 * control, not a heading (per SEO standards). The chevron rotates on open and
 * respects reduced motion (transitions are neutralised globally). The same
 * `items` feed the FAQPage schema, so the visible answer matches it verbatim.
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="border-t border-slate/15">
      {items.map((item) => (
        <details key={item.q} className="group border-b border-slate/15">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-semibold text-ink marker:hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDownIcon
              size={20}
              className="shrink-0 text-steel transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="max-w-[68ch] pb-4 text-slate">{item.aNode ?? item.a}</p>
        </details>
      ))}
    </div>
  );
}
