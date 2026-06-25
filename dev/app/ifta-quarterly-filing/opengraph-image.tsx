import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the IFTA quarterly filing page
// (design/ifta-quarterly-filing.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "IFTA Quarterly Filing | Tech Rig";

export default function Image() {
  return ogImage({ title: "IFTA Quarterly Filing", category: "Compliance" });
}
