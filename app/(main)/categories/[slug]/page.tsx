import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategoryBySlug } from "@/lib/db/categories";
import { listPublishedPosts } from "@/lib/db/posts";
import { PostCard } from "@/components/post/PostCard";
import { Pagination } from "@/components/post/Pagination";
import { CategoryStrip } from "@/components/nav/CategoryStrip";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description ?? `Posts in ${cat.name}`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10));

  const [cat, { posts, totalPages }] = await Promise.all([
    getCategoryBySlug(slug),
    listPublishedPosts({ page, categorySlug: slug }),
  ]);

  if (!cat) notFound();

  function buildHref(p: number) {
    return `/categories/${slug}${p > 1 ? `?page=${p}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <Suspense>
        <CategoryStrip activeSlug={slug} />
      </Suspense>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{cat.name}</h1>
        {cat.description && (
          <p className="mt-1 text-muted-foreground">{cat.description}</p>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No posts yet in this category.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} {...(post as Parameters<typeof PostCard>[0])} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
    </div>
  );
}
