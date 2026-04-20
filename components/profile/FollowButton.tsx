"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  targetId: string;
  initialFollowing: boolean;
}

export function FollowButton({ targetId, initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [, startTransition] = useTransition();

  async function toggle() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const next = !following;
    setFollowing(next);

    startTransition(async () => {
      if (next) {
        await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: targetId });
      } else {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetId);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
        following
          ? "border border-border bg-transparent text-muted-foreground hover:border-red-400 hover:text-red-500"
          : "bg-primary text-primary-foreground hover:opacity-90",
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
