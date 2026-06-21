import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the dry van dispatch page (design/dispatch-trailer-pages.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Dry Van Dispatch | Tech Rig";

export default function Image() {
  return ogImage({ title: "Dry Van Dispatch", category: "Dispatch" });
}
