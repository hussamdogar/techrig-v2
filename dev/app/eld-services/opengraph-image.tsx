import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the ELD Services page (design/eld-services.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "ELD | Tech Rig";

export default function Image() {
  return ogImage({ title: "ELD", category: "Compliance" });
}
