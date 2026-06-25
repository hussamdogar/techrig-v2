import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the MOTUS migration page (design/motus-migration.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "MOTUS Migration | Tech Rig";

export default function Image() {
  return ogImage({ title: "MOTUS Migration", category: "Compliance" });
}
