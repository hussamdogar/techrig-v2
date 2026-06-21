import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the MC Authority page (design/mc-registration.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "MC Authority | Tech Rig";

export default function Image() {
  return ogImage({ title: "MC Authority", category: "Compliance" });
}
