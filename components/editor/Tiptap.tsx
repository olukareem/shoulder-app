"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TiptapProps {
  initialContent?: Record<string, unknown>;
  onUpdate?: (json: Record<string, unknown>) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  initialContent,
  onUpdate,
  placeholder = "Write your post…",
  className,
}: TiptapProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialContent ?? "",
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-lg max-w-none min-h-[240px] focus:outline-none",
          "text-foreground",
        ),
      },
    },
    onUpdate({ editor }) {
      onUpdate?.(editor.getJSON() as Record<string, unknown>);
    },
  });

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-4 py-3",
        "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
        className,
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

// ---------------------------------------------------------------
// Higher-level PostEditor with autosave + publish
// ---------------------------------------------------------------
interface PostEditorProps {
  postId?: string;       // undefined = new post
  initialTitle?: string;
  initialExcerpt?: string;
  initialBody?: Record<string, unknown>;
  initialStatus?: "draft" | "published";
  initialCategoryIds?: string[];
  categories: { id: string; name: string; slug: string }[];
  onSave?: (postId: string, slug: string) => void;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function PostEditor({
  postId,
  initialTitle = "",
  initialExcerpt = "",
  initialBody,
  initialStatus = "draft",
  initialCategoryIds = [],
  categories,
  onSave,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [body, setBody] = useState<Record<string, unknown>>(initialBody ?? {});
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(initialCategoryIds),
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [publishStatus, setPublishStatus] = useState<"draft" | "published">(initialStatus);
  const [isPublishing, setIsPublishing] = useState(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentPostId = useRef<string | undefined>(postId);

  const save = useCallback(
    async (status: "draft" | "published") => {
      if (!title.trim()) return;
      setSaveStatus("saving");

      try {
        const payload = {
          postId: currentPostId.current,
          title,
          excerpt,
          body,
          status,
          category_ids: Array.from(selectedCategories),
        };

        const res = await fetch("/api/posts/autosave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Save failed");

        const data = (await res.json()) as { id: string; slug: string };
        currentPostId.current = data.id;
        setSaveStatus("saved");
        onSave?.(data.id, data.slug);
      } catch {
        setSaveStatus("error");
      }
    },
    [title, excerpt, body, selectedCategories, onSave],
  );

  // Trigger autosave 30s after last change. Do not reset saveStatus here:
  // React 19's react-hooks/set-state-in-effect rule flags synchronous
  // setState in effect bodies as cascading. The "Saved"/"Saving…" label
  // transitions happen inside save() when the timer actually fires, which
  // also gives better UX (the prior "Saved" label persists while typing).
  useEffect(() => {
    if (!title.trim()) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => void save("draft"), 30_000);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [title, excerpt, body, save]);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handlePublish() {
    setIsPublishing(true);
    await save("published");
    setPublishStatus("published");
    setIsPublishing(false);
  }

  async function handleSaveDraft() {
    await save("draft");
  }

  const saveLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved"
        ? "Saved"
        : saveStatus === "error"
          ? "Save failed"
          : "";

  return (
    <div className="mx-auto max-w-article space-y-6 px-4 pb-16 pt-8 sm:px-0">
      {/* Save status indicator */}
      {saveLabel && (
        <p className={cn(
          "text-xs",
          saveStatus === "error" ? "text-red-500" : "text-muted-foreground",
        )}>
          {saveLabel}
        </p>
      )}

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={100}
        className={cn(
          "w-full border-0 bg-transparent text-3xl font-bold text-foreground",
          "placeholder:text-muted-foreground/50 focus:outline-none sm:text-4xl",
        )}
      />

      {/* Excerpt */}
      <input
        type="text"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Short excerpt (optional)"
        maxLength={300}
        className={cn(
          "w-full border-0 bg-transparent text-lg text-muted-foreground",
          "placeholder:text-muted-foreground/40 focus:outline-none",
        )}
      />

      {/* Body */}
      <TiptapEditor
        initialContent={initialBody}
        onUpdate={setBody}
      />

      {/* Categories */}
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={cn(
                "rounded-full px-3 py-1 text-sm transition-colors",
                selectedCategories.has(cat.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePublish}
          disabled={isPublishing || !title.trim()}
          className={cn(
            "rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground",
            "transition-opacity hover:opacity-90 disabled:opacity-50",
          )}
        >
          {isPublishing ? "Publishing…" : publishStatus === "published" ? "Update" : "Publish"}
        </button>
        <button
          onClick={handleSaveDraft}
          disabled={saveStatus === "saving" || !title.trim()}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Save draft
        </button>
      </div>
    </div>
  );
}
