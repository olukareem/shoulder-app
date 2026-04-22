import type { Metadata } from "next";
import { Suspense } from "react";
import { listPublishedPosts, type PostSort } from "@/lib/db/posts";
import { PostCard } from "@/components/post/PostCard";
import { Pagination } from "@/components/post/Pagination";
import { CategoryStrip } from "@/components/nav/CategoryStrip";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Posts",
  description: "Advice, services, help and more from the shoulder community.",
};

interface SearchParams {
  page?: string;
  sort?: string;
  category?: string;
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const sort = (params.sort === "popular" ? "popular" : "newest") as PostSort;
  const category = params.category;

  const { posts, totalPages } = await listPublishedPosts({ page, sort, categorySlug: category });

  function buildHref(p: number) {
    const sp = new URLSearchParams();
    if (p > 1) sp.set("page", String(p));
    if (sort !== "newest") sp.set("sort", sort);
    if (category) sp.set("category", category);
    const qs = sp.toString();
    return `/posts${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      {/* Category strip */}
      <Suspense>
        <CategoryStrip activeSlug={category} />
      </Suspense>

      {/* Sort controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {category ? undefined : "All posts"}
        </h1>
        <div className="flex gap-2 text-sm">
          <Link
            href={buildHref(1).replace(/sort=[^&]*&?/, "")}
            className={
              sort === "newest"
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Newest
          </Link>
          <span className="text-border">|</span>
          <Link
            href={`/posts?sort=popular${category ? `&category=${category}` : ""}` }
            className={
              sort === "popular"
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            Popular
          </Link>
        </div>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No posts yet.</p>
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
