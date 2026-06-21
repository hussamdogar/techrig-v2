import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the BOC-3 page (design/boc-3-filing.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "BOC-3 Filing | Tech Rig";

export default function Image() {
  return ogImage({ title: "BOC-3 Filing", category: "Compliance" });
}
