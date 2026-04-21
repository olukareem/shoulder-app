import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE } from "./posts";

export async function getBookmarks(userId: string, page = 1) {
  const supabase = await createClient();
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error } = await supabase
    .from("bookmarks")
    .select(
      `
      created_at,
      posts (
        id, title, slug, excerpt, status, view_count, published_at, created_at,
        profiles!posts_author_id_fkey ( id, username, full_name, avatar_url ),
        post_categories ( categories ( id, name, slug ) )
      )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) throw error;
  return (data ?? []).map((b) => b.posts).filter(Boolean);
}

export async function isBookmarked(userId: string, postId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  return data !== null;
}

export async function addBookmark(userId: string, postId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: userId, post_id: postId });
  if (error && error.code !== "23505") throw error; // ignore duplicate-key
}

export async function removeBookmark(userId: string, postId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", postId);
  if (error) throw error;
}
