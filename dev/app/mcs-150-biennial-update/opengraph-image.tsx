import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the MCS-150 page (design/mcs-150-biennial-update.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "MCS-150 Update | Tech Rig";

export default function Image() {
  return ogImage({ title: "MCS-150 Update", category: "Compliance" });
}
