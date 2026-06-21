import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the USDOT page (design/dot-registration.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "USDOT Number | Tech Rig";

export default function Image() {
  return ogImage({ title: "USDOT Number", category: "Compliance" });
}
