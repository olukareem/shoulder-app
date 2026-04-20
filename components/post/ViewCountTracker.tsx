"use client";

import { useEffect } from "react";

export function ViewCountTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Fire-and-forget POST to increment view count on mount
    fetch("/api/posts/increment-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {
      // Non-critical — view count increment failure should not affect UX
    });
  }, [slug]);

  return null;
}
