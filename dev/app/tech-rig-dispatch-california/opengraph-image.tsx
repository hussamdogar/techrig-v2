import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the California state page (design/state-pages.md):
// per-state variant by title and category tag, never shared across states.
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Start a Trucking Company in California | Tech Rig";

export default function Image() {
  return ogImage({ title: "Trucking in California", category: "California" });
}
