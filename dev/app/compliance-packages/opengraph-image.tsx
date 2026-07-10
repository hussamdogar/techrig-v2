import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the four-bundle selector (design/compliance-packages.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Trucking Compliance Packages | Tech Rig";

export default function Image() {
  return ogImage({ title: "Compliance Packages", category: "Compliance" });
}
