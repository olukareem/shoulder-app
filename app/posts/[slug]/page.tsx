import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { getPostBySlug } from "@/lib/db/posts";
import { createClient } from "@/lib/supabase/server";
import { isBookmarked } from "@/lib/db/bookmarks";
import { BookmarkButton } from "@/components/post/BookmarkButton";
import { ViewCountTracker } from "@/components/post/ViewCountTracker";
import { BlogPostingJsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const ogImage = `${siteUrl}/api/og/${slug}`;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      url: `/posts/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [bookmarked] = await Promise.all([
    user ? isBookmarked(user.id, post.id) : Promise.resolve(false),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const author = post.profiles;
  type CatShape = { id: string; name: string; slug: string };
  const categories = (post.post_categories ?? [])
    .map((pc: { categories: CatShape | null }) => pc.categories)
    .filter((c): c is CatShape => c !== null);

  // Render Tiptap JSON to HTML server-side (no client JS needed for reading)
  let bodyHtml = "";
  try {
    bodyHtml = generateHTML(post.body as Parameters<typeof generateHTML>[0], [StarterKit]);
  } catch {
    bodyHtml = `<p>${post.body_text ?? ""}</p>`;
  }

  return (
    <>
      <BlogPostingJsonLd
        title={post.title}
        slug={slug}
        excerpt={post.excerpt}
        authorName={author.full_name ?? author.username}
        authorUsername={author.username}
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
        siteUrl={siteUrl}
      />

      {/* Increment view count on mount (client component, no SSR cost) */}
      <ViewCountTracker slug={slug} />

      <article className="mx-auto max-w-article px-4 pb-16 pt-8 sm:px-0">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {categories.map((cat: { id: string; name: string; slug: string }) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <Badge variant="muted">{cat.name}</Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Headline */}
        <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>

        {/* Author card */}
        <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {author.username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <Link
                href={`/u/${author.username}`}
                className="text-sm font-semibold text-foreground hover:text-primary"
              >
                {author.full_name ?? author.username}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(post.published_at ?? post.created_at, "long")}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" aria-hidden />
                  {post.view_count.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>

          <BookmarkButton postId={post.id} initialBookmarked={bookmarked} />
        </div>

        {/* Article body */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* Edit link (own post) */}
        {user?.id === post.author_id && (
          <div className="mt-12 border-t border-border pt-6">
            <Link
              href={`/posts/${slug}/edit`}
              className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Edit this post
            </Link>
          </div>
        )}
      </article>
    </>
  );
}
