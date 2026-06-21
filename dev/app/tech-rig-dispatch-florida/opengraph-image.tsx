import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the Florida state page (design/state-pages.md):
// the per-state variant by title + tag, never a shared image across states.
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Start a Trucking Company in Florida | Tech Rig";

export default function Image() {
  return ogImage({ title: "Trucking in Florida", category: "Compliance" });
}
