"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/editor/Tiptap";
import type { Category } from "@/lib/types/database";

export default function NewPostPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => {});
  }, []);

  function handleSave(_postId: string, slug: string) {
    router.push(`/posts/${slug}`);
  }

  return (
    <Suspense>
      <PostEditor
        categories={categories}
        onSave={handleSave}
      />
    </Suspense>
  );
}
