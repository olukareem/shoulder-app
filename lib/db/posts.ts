import { createClient } from "@/lib/supabase/server";
import type { PostInput } from "@/lib/validation/post";
import type { Json } from "@/lib/types/database";
import { slugify } from "@/lib/slug";

export const PAGE_SIZE = 12;

export type PostSort = "newest" | "popular";

export interface ListPostsOptions {
  page?: number;
  categorySlug?: string;
  sort?: PostSort;
  authorId?: string;
}

export async function listPublishedPosts(options: ListPostsOptions = {}) {
  const supabase = await createClient();
  const { page = 1, categorySlug, sort = "newest", authorId } = options;
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("posts")
    .select(
      `
      id, author_id, title, slug, excerpt, status, view_count,
      published_at, created_at, updated_at,
      profiles!inner ( id, username, full_name, avatar_url ),
      post_categories ( category_id, categories ( id, name, slug ) )
      `,
      { count: "exact" },
    )
    .eq("status", "published");

  if (authorId) {
    query = query.eq("author_id", authorId);
  }

  if (categorySlug) {
    query = query.eq("post_categories.categories.slug", categorySlug);
  }

  if (sort === "popular") {
    query = query.order("view_count", { ascending: false });
  } else {
    query = query.order("published_at", { ascending: false });
  }

  const { data, error, count } = await query
    .range(offset, offset + PAGE_SIZE - 1);

  if (error) throw error;

  return {
    posts: data ?? [],
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles!inner ( id, username, full_name, bio, avatar_url ),
      post_categories ( category_id, categories ( id, name, slug ) )
      `,
    )
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function listPublishedSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((r) => r.slug);
}

export async function getDraftsByAuthor(authorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, status, view_count, created_at, updated_at")
    .eq("author_id", authorId)
    .eq("status", "draft")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPostsByAuthor(authorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, status, view_count, published_at, created_at, updated_at")
    .eq("author_id", authorId)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createPost(
  authorId: string,
  input: PostInput & { category_ids?: string[] },
) {
  const supabase = await createClient();

  // Fetch existing slugs matching the base to enable dedup
  const base = slugify(input.title);
  const { data: existing } = await supabase
    .from("posts")
    .select("slug")
    .like("slug", `${base}%`);

  const existingSlugs = new Set((existing ?? []).map((r) => r.slug));

  const { uniqueSlug } = await import("@/lib/slug");
  const slug = uniqueSlug(input.title, existingSlugs);

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      author_id: authorId,
      title: input.title,
      slug,
      excerpt: input.excerpt || null,
      body: input.body as Json,
      status: input.status,
    })
    .select("id, slug")
    .single();

  if (error) throw error;

  // Assign categories
  if (input.category_ids && input.category_ids.length > 0) {
    await supabase.from("post_categories").insert(
      input.category_ids.map((cid) => ({ post_id: post.id, category_id: cid })),
    );
  }

  return post;
}

export async function updatePost(
  postId: string,
  authorId: string,
  input: Partial<PostInput> & { category_ids?: string[] },
) {
  const supabase = await createClient();

  const updateData: {
    title?: string;
    excerpt?: string | null;
    body?: Json;
    status?: "draft" | "published";
  } = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.excerpt !== undefined) updateData.excerpt = input.excerpt || null;
  if (input.body !== undefined) updateData.body = input.body as Json;
  if (input.status !== undefined) updateData.status = input.status;

  const { data: post, error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", postId)
    .eq("author_id", authorId)  // RLS also enforces this; belt-and-suspenders
    .select("id, slug")
    .single();

  if (error) throw error;

  // Re-sync categories if provided
  if (input.category_ids !== undefined) {
    await supabase
      .from("post_categories")
      .delete()
      .eq("post_id", postId);

    if (input.category_ids.length > 0) {
      await supabase.from("post_categories").insert(
        input.category_ids.map((cid) => ({ post_id: postId, category_id: cid })),
      );
    }
  }

  return post;
}

export async function deletePost(postId: string, authorId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", authorId);
  if (error) throw error;
}

export async function togglePublish(
  postId: string,
  authorId: string,
  publish: boolean,
) {
  return updatePost(postId, authorId, { status: publish ? "published" : "draft" });
}

export async function incrementViewCount(slug: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_view_count", {
    post_slug: slug,
  });
  if (error) throw error;
}

export async function searchPosts(
  q: string,
  page = 1,
) {
  const supabase = await createClient();
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error } = await supabase.rpc("search_posts", {
    q,
    page_size: PAGE_SIZE,
    page_offset: offset,
  });

  if (error) throw error;
  return data ?? [];
}

export async function getFeed(userId: string, page = 1) {
  const supabase = await createClient();
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error } = await supabase.rpc("get_feed", {
    user_id: userId,
    page_size: PAGE_SIZE,
    page_offset: offset,
  });

  if (error) throw error;
  return data ?? [];
}
