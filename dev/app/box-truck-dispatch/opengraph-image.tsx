import { ogImage, ogSize, ogContentType } from "@/lib/og";

// Unique branded OG image for the box truck dispatch page (design/box-truck-dispatch.md).
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Box Truck Dispatch | Tech Rig";

export default function Image() {
  return ogImage({ title: "Box Truck Dispatch", category: "Dispatch" });
}
