import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the IFTA page (design/ifta-registration.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "IFTA Registration | Tech Rig";

export default function Image() {
  return ogImage({ title: "IFTA Registration", category: "Compliance" });
}
