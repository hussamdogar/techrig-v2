import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { getPost, getPostSlugs } from "@/lib/blog";

// Unique branded OG image per KEEP post (no placeholders, per standards.md).
// Prerendered for the same slug set as the page route.
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  const title = post?.meta.title ?? "Tech Rig Blog";
  return ogImage({ title, category: "Blog" });
}
