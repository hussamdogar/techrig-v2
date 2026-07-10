import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * CTA hierarchy from design-system §8. The amber-never-white rule is baked in:
 * the primary variant is always Ink text on Signal. Exactly one primary should
 * appear per view (Signal is rationed). Every variant carries the system focus
 * ring (2px Steel, 2px offset) and clears the 44px hit-target floor.
 *
 * For link CTAs (most of them), apply buttonVariants() to a next/link instead of
 * using <Button>, e.g. <Link className={buttonVariants({ variant: "primary" })}>.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-btn font-body font-semibold whitespace-nowrap transition-[background-color,color,filter] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary action: Signal fill + Ink text. Darkens slightly on hover.
        primary: "bg-signal text-ink hover:brightness-95",
        // Subordinate on light surfaces: Ink outline, fills on hover.
        secondary:
          "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-cloud",
        // Subordinate on light surfaces, pre-filled (design-system §8: "solid Ink
        // on light sections"). Used where a view already carries a rationed
        // Signal action elsewhere (e.g. package card CTAs on /compliance-packages/).
        solidInk: "bg-ink text-cloud hover:brightness-110",
        // Subordinate on Ink surfaces: Cloud outline (e.g. the header Call button).
        outlineOnInk:
          "border-[1.5px] border-cloud/70 text-cloud hover:bg-cloud hover:text-ink",
        // Tertiary, low-emphasis.
        ghost: "text-steel hover:bg-steel/10",
      },
      size: {
        md: "min-h-12 px-6 text-base", // 48px: primary/secondary CTAs
        sm: "min-h-11 px-4 text-sm", // 44px hit-target floor: header controls
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps;

/** Native <button> for real actions (toggles, submits). Link CTAs use buttonVariants() on next/link. */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
