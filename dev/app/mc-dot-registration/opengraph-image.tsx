import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the bundle page (design/mc-dot-registration.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "MC + DOT Authority Package | Tech Rig";

export default function Image() {
  return ogImage({ title: "MC + DOT Authority Package", category: "Compliance" });
}
