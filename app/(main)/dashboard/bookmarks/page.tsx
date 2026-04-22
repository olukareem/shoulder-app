import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBookmarks } from "@/lib/db/bookmarks";
import { PostCard } from "@/components/post/PostCard";

export const metadata: Metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/bookmarks");

  const posts = await getBookmarks(user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Bookmarks</h1>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          No bookmarks yet. Save posts to find them here.
        </p>
      ) : (
        <div>
          {posts.map((post) =>
            post ? (
              <PostCard key={post.id} {...(post as Parameters<typeof PostCard>[0])} />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
