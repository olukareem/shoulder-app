import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPost, updatePost } from "@/lib/db/posts";

interface AutosavePayload {
  postId?: string;
  title: string;
  excerpt?: string;
  body: Record<string, unknown>;
  status: "draft" | "published";
  category_ids?: string[];
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as AutosavePayload;

  if (!payload.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    if (payload.postId) {
      const post = await updatePost(payload.postId, user.id, {
        title: payload.title,
        excerpt: payload.excerpt,
        body: payload.body,
        status: payload.status,
        category_ids: payload.category_ids,
      });
      return NextResponse.json(post);
    } else {
      const post = await createPost(user.id, {
        title: payload.title,
        excerpt: payload.excerpt,
        body: payload.body,
        status: payload.status,
        category_ids: payload.category_ids,
      });
      return NextResponse.json(post);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
