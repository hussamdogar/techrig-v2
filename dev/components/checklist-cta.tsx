import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The page-level call to action for the compliance check (/compliance-check/),
 * which replaced "Start your compliance setup" (owner, 2026-10-08): the
 * button plus one short line saying what happens next. Label and line live
 * here once, so every page says the same thing. The header keeps its own
 * shorter "Check my filings" (components/site-header.tsx).
 *
 * The line uses text-slate, so it reads on light sections and, through the
 * dark-section colour remap (app/globals.css), on Ink ones too.
 */
export const CHECKLIST_CTA = {
  label: "Get my filing checklist",
  href: "/compliance-check/",
  note: "Two quick questions, then see exactly which filings your truck needs.",
} as const;

export function ChecklistCta({ align = "start", className }: { align?: "start" | "center"; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", align === "center" ? "items-center text-center" : "items-start", className)}>
      <Link href={CHECKLIST_CTA.href} className={buttonVariants({ variant: "primary", size: "md" })}>
        {CHECKLIST_CTA.label}
      </Link>
      <p className="max-w-[40ch] text-sm text-slate">{CHECKLIST_CTA.note}</p>
    </div>
  );
}
