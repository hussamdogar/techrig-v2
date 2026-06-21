/**
 * Blog post loader for the migrated KEEP posts.
 *
 * The old site (techrig.org) published ~60 posts at the SITE ROOT (`/{slug}/`),
 * not under `/blog/`. shared/blog-disposition.md marks ~42 of them KEEP (they
 * rank or feed money pages) and the migration prime directive is to preserve
 * those exact URLs. So each KEEP post is a markdown file here, rendered by the
 * root-level `app/[slug]/` route at its original `/{slug}/` URL. The 18 PRUNE
 * posts are 301'd in next.config.ts instead.
 *
 * Content is the migrated existing copy; the Operations Track (content-writer)
 * polishes it to standards.md post-launch. The contract for launch is only that
 * every KEEP URL resolves (no 404) and interlinks UP to its money page.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

/** One inline contextual link UP to the money/hub page this post supports. */
export type Interlink = { anchor: string; href: string };

export type PostMeta = {
  /** Headline (H1 + title tag stem). */
  title: string;
  /** Meta description. */
  description: string;
  /** Original publish date, ISO yyyy-mm-dd. Omitted if unknown (never faked). */
  date?: string;
  /** Last-updated date, ISO yyyy-mm-dd. Optional. */
  updated?: string;
  /** Reviewer alias for the Person schema + visible byline. */
  reviewer?: "adam" | "robert";
  /** The "interlink up" targets from blog-disposition.md (1 to 3 word anchors). */
  interlinks: Interlink[];
};

export type Post = {
  slug: string;
  meta: PostMeta;
  /** Rendered HTML body (markdown -> HTML). */
  html: string;
};

/** Every KEEP post slug (filename without .md). Drives generateStaticParams. */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** Load and render a single post. Returns null if the slug is not a KEEP post. */
export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const meta: PostMeta = {
    title: String(data.title ?? "").trim(),
    description: String(data.description ?? "").trim(),
    date: data.date ? String(data.date) : undefined,
    updated: data.updated ? String(data.updated) : undefined,
    reviewer: data.reviewer === "robert" ? "robert" : data.reviewer === "adam" ? "adam" : undefined,
    interlinks: Array.isArray(data.interlinks)
      ? data.interlinks
          .filter((i: unknown): i is Interlink =>
            !!i && typeof (i as Interlink).anchor === "string" && typeof (i as Interlink).href === "string",
          )
          .map((i: Interlink) => ({ anchor: i.anchor, href: i.href }))
      : [],
  };

  const html = await marked.parse(content, { async: true });

  return { slug, meta, html };
}
