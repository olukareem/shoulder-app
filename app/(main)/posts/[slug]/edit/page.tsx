import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPostBySlug } from "@/lib/db/posts";
import { listCategories } from "@/lib/db/categories";
import { EditPageClient } from "./EditPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/posts/${slug}/edit`);

  const [post, categories] = await Promise.all([
    getPostBySlug(slug),
    listCategories(),
  ]);

  if (!post || post.author_id !== user.id) notFound();

  const initialCategoryIds = (post.post_categories ?? [])
    .map((pc: { category_id: string }) => pc.category_id);

  return (
    <EditPageClient
      postId={post.id}
      initialSlug={slug}
      initialTitle={post.title}
      initialExcerpt={post.excerpt ?? ""}
      initialBody={post.body as Record<string, unknown>}
      initialStatus={post.status as "draft" | "published"}
      initialCategoryIds={initialCategoryIds}
      categories={categories}
    />
  );
}
