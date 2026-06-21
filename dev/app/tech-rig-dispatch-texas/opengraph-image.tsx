import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the Texas state page (design/state-pages.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Start a Trucking Company in Texas | Tech Rig";

export default function Image() {
  return ogImage({ title: "Trucking in Texas", category: "Compliance" });
}
