import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the insurance filing page
// (design/trucking-insurance-filing.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Insurance Filing | Tech Rig";

export default function Image() {
  return ogImage({ title: "Insurance Filing", category: "Compliance" });
}
