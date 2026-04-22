import type { Metadata } from "next";
import Link from "next/link";
import { searchPosts } from "@/lib/db/posts";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Search" };

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10));

  const results = q ? await searchPosts(q, page) : [];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
        {q && (
          <p className="mt-1 text-sm text-muted-foreground">
            {results.length === 0 ? "No results found." : `${results.length} posts`}
          </p>
        )}
      </div>

      {results.length > 0 && (
        <div className="divide-y divide-border">
          {results.map((post) => (
            <article key={post.id} className="py-5">
              <h2 className="mb-1 text-lg font-semibold text-foreground">
                <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h2>
              {post.headline && (
                <p
                  className="mb-2 text-sm text-muted-foreground [&_mark]:bg-primary/20 [&_mark]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.headline }}
                />
              )}
              <p className="text-xs text-muted-foreground">
                {formatDate(post.published_at ?? post.created_at)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
