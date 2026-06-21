import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the pillar guide
// (design/how-to-start-a-trucking-company.md, OG section).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "How to Start a Trucking Company | Tech Rig";

export default function Image() {
  return ogImage({ title: "How to Start a Trucking Company", category: "Guide" });
}
