import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the reefer dispatch page (design/dispatch-trailer-pages.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Reefer Dispatch | Tech Rig";

export default function Image() {
  return ogImage({ title: "Reefer Dispatch", category: "Dispatch" });
}
