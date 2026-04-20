"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

export function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn("relative flex items-center", className)}
    >
      <Search
        className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search posts..."
        aria-label="Search posts"
        className={cn(
          "h-9 w-full rounded-full border border-border bg-muted pl-9 pr-4 text-sm",
          "text-foreground placeholder:text-muted-foreground",
          "transition-colors focus:border-primary focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary",
        )}
      />
    </form>
  );
}
