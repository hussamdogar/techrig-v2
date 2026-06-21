import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the compliance hub (design/compliance-services-hub.md):
// Ink field, mono wordmark, title "Compliance services", category tag "Compliance",
// a line icon, Signal rule.
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Compliance services | Tech Rig";

export default function Image() {
  return ogImage({ title: "Compliance services", category: "Compliance" });
}
