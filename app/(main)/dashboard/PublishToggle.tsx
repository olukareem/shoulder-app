"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PublishToggleProps {
  postId: string;
  currentStatus: "draft" | "published";
}

export function PublishToggle({ postId, currentStatus }: PublishToggleProps) {
  const [status, setStatus] = useState(currentStatus);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const next = status === "published" ? "draft" : "published";
    setStatus(next);

    startTransition(async () => {
      await fetch("/api/posts/autosave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, title: "_", body: {}, status: next }),
      });
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "rounded px-2 py-0.5 text-xs font-medium transition-colors",
        status === "published"
          ? "bg-muted text-muted-foreground hover:text-red-500"
          : "bg-primary/10 text-primary hover:bg-primary/20",
      )}
    >
      {status === "published" ? "Unpublish" : "Publish"}
    </button>
  );
}
