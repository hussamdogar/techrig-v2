import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the power only dispatch page
// (design/dispatch-trailer-pages.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Power Only Dispatch | Tech Rig";

export default function Image() {
  return ogImage({ title: "Power Only Dispatch", category: "Dispatch" });
}
