import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the lead-generation page (design/lead-generation.md).
// The capture routes toward dispatch, so the category tag reads "Dispatch".
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "New Authority Loads | Tech Rig";

export default function Image() {
  return ogImage({ title: "New Authority Loads", category: "Dispatch" });
}
