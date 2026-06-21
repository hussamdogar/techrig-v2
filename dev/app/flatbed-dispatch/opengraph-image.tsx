import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the flatbed dispatch page (design/dispatch-trailer-pages.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Flatbed Dispatch | Tech Rig";

export default function Image() {
  return ogImage({ title: "Flatbed Dispatch", category: "Dispatch" });
}
