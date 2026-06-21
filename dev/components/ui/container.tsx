import { cn } from "@/lib/utils";

/** Centers content to the 1200px grid with the system gutters (16px / 24px). */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--container-content)] px-4 md:px-6",
        className,
      )}
      {...props}
    />
  );
}

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Surface band. Paper and Cloud alternate; Ink is reserved for emphasis. */
  surface?: "paper" | "cloud" | "ink";
};

const surfaceClass: Record<NonNullable<SectionProps["surface"]>, string> = {
  paper: "bg-paper text-ink",
  cloud: "bg-cloud text-ink",
  ink: "bg-ink text-cloud",
};

/**
 * A page band: a surface plus the section rhythm (56px mobile, 96px desktop).
 * Wrap inner content in <Container> to hold the grid width.
 */
export function Section({
  surface = "paper",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(surfaceClass[surface], "py-14 md:py-24", className)}
      {...props}
    >
      {children}
    </section>
  );
}
