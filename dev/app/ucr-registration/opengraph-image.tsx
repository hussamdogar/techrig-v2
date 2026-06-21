import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the UCR page (design/ucr-registration.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "UCR Registration | Tech Rig";

export default function Image() {
  return ogImage({ title: "UCR Registration", category: "Compliance" });
}
