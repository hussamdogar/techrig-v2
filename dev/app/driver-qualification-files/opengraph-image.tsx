import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the DQ files page (design/driver-qualification-files.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Driver Qualification Files | Tech Rig";

export default function Image() {
  return ogImage({ title: "Driver Qualification Files", category: "Compliance" });
}
