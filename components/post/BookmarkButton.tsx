"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  postId: string;
  initialBookmarked: boolean;
}

export function BookmarkButton({ postId, initialBookmarked }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [, startTransition] = useTransition();

  async function toggle() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const next = !bookmarked;
    setBookmarked(next); // optimistic

    startTransition(async () => {
      if (next) {
        await supabase.from("bookmarks").insert({ user_id: user.id, post_id: postId });
      } else {
        await supabase.from("bookmarks").delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this post"}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
        bookmarked
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} aria-hidden />
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}
