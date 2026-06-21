import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the New York state page (design/state-pages.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Start a Trucking Company in New York | Tech Rig";

export default function Image() {
  return ogImage({ title: "Trucking in New York", category: "New York" });
}
