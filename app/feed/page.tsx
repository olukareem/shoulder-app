import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFeed } from "@/lib/db/posts";

export const metadata: Metadata = { title: "Your feed" };

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function FeedPage({ searchParams }: Props) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, parseInt(rawPage ?? "1", 10));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const posts = await getFeed(user.id, page);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Your feed</h1>

      {posts.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <p>Nothing here yet.</p>
          <p className="mt-2 text-sm">
            Follow some authors to see their posts here.
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <article key={post.id} className="border-b border-border py-4 last:border-0">
              <h2 className="font-semibold text-foreground">
                <a href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </a>
              </h2>
              {post.excerpt && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
