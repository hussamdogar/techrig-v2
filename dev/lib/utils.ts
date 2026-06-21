import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind utilities,
 * so later classes win (e.g. cn("px-4", isWide && "px-8") yields "px-8").
 * Shared by every component and required by shadcn/ui primitives when added.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
