import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the IRP page (design/irp-registration.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "IRP Registration | Tech Rig";

export default function Image() {
  return ogImage({ title: "IRP Registration", category: "Compliance" });
}
