import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the hot shot dispatch page
// (design/dispatch-trailer-pages.md, the per-trailer OG template).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Hot Shot Dispatch | Tech Rig";

export default function Image() {
  return ogImage({ title: "Hot Shot Dispatch", category: "Dispatch" });
}
