"use client";

import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/editor/Tiptap";
import type { Category } from "@/lib/types/database";

interface Props {
  postId: string;
  initialSlug: string;
  initialTitle: string;
  initialExcerpt: string;
  initialBody: Record<string, unknown>;
  initialStatus: "draft" | "published";
  initialCategoryIds: string[];
  categories: Category[];
}

export function EditPageClient({
  postId,
  initialSlug,
  initialTitle,
  initialExcerpt,
  initialBody,
  initialStatus,
  initialCategoryIds,
  categories,
}: Props) {
  const router = useRouter();

  function handleSave(_id: string, slug: string) {
    if (slug !== initialSlug) {
      router.replace(`/posts/${slug}/edit`);
    } else {
      router.refresh();
    }
  }

  return (
    <PostEditor
      postId={postId}
      initialTitle={initialTitle}
      initialExcerpt={initialExcerpt}
      initialBody={initialBody}
      initialStatus={initialStatus}
      initialCategoryIds={initialCategoryIds}
      categories={categories}
      onSave={handleSave}
    />
  );
}
