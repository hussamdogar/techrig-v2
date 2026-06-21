import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the Trucking LLC page (design/trucking-llc.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Trucking LLC | Tech Rig";

export default function Image() {
  return ogImage({ title: "Trucking LLC", category: "Compliance" });
}
