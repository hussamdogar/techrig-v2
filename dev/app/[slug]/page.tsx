import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewedBy } from "@/components/reviewed-by";
import { JsonLd } from "@/components/json-ld";
import {
  articleNode,
  breadcrumbNode,
  graph,
  personNode,
} from "@/lib/schema";
import { getPost, getPostSlugs, type PostMeta } from "@/lib/blog";

/**
 * Root-level KEEP blog post route. The old site published posts at `/{slug}/`
 * (site root, not `/blog/`), and shared/blog-disposition.md marks ~42 of them
 * KEEP at their existing URL. This dynamic route renders those migrated posts at
 * their original root URLs so they do not 404 on launch and keep their rankings.
 *
 * Static money pages are static sibling routes and take precedence; only the
 * generated KEEP slugs render here. dynamicParams=false makes every other root
 * slug a 404 (no arbitrary slug renders a blank post).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

const REVIEWER_NAME: Record<NonNullable<PostMeta["reviewer"]>, string> = {
  adam: "Adam Smith",
  robert: "Robert Hooke",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const { title, description } = post.meta;
  return {
    title,
    description,
    alternates: { canonical: `/${slug}/` },
    openGraph: {
      title,
      description,
      url: `/${slug}/`,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { meta, html } = post;
  const reviewerName = meta.reviewer ? REVIEWER_NAME[meta.reviewer] : null;

  return (
    <>
      <JsonLd
        data={graph(
          articleNode({
            slug: `/${slug}/`,
            headline: meta.title,
            description: meta.description,
            author: meta.reviewer,
            datePublished: meta.date,
            dateModified: meta.updated,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Blog", slug: "/blog/" },
            { name: meta.title },
          ]),
          ...(meta.reviewer ? [personNode(meta.reviewer)] : []),
        )}
      />

      {/* Header (Paper, single readable column, not a money-page hero). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog/" },
              { name: meta.title },
            ]}
          />
          <h1 className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink">
            {meta.title}
          </h1>
          {(reviewerName || meta.date) && (
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              {reviewerName ? <ReviewedBy name={reviewerName} /> : null}
              {meta.date ? (
                <time
                  dateTime={meta.date}
                  className="font-mono text-sm text-slate"
                >
                  {formatDate(meta.date)}
                </time>
              ) : null}
            </div>
          )}
        </Container>
      </Section>

      {/* Body: migrated markdown rendered to HTML, styled by .blog-prose. */}
      <Section surface="paper" className="pt-0">
        <Container className="max-w-3xl">
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Interlink up to the money/hub page(s) this post supports. This is
              the blog's conversion path (blog-disposition.md), not a hard CTA.
              Kept deliberately short (under 8 words) so the templated lead-in
              cannot trip the site-wide duplicate-sentence rule; the posts also
              carry the same links inline in their bodies. */}
          {meta.interlinks.length > 0 ? (
            <p className="mt-12 border-l-4 border-steel pl-4 text-slate">
              Tech Rig handles{" "}
              {meta.interlinks.map((link, i) => (
                <span key={link.href}>
                  {i > 0 ? (i === meta.interlinks.length - 1 ? " and " : ", ") : ""}
                  <Link
                    href={link.href}
                    className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                  >
                    {link.anchor}
                  </Link>
                </span>
              ))}
              .
            </p>
          ) : null}
        </Container>
      </Section>
    </>
  );
}

// Human-readable date (e.g. "March 4, 2024") from an ISO yyyy-mm-dd string.
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
