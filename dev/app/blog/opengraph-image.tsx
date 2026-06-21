import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the blog index (design/blog-feeders.md OG section).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Blog | Tech Rig";

export default function Image() {
  return ogImage({ title: "Blog", category: "Compliance" });
}
