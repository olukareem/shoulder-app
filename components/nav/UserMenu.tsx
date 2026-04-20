"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PenLine, BookmarkCheck, LayoutDashboard, LogOut, Rss } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  userId: string;
}

export function UserMenu({ userId }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const menuItems = [
    { href: "/posts/new", label: "New post", icon: PenLine },
    { href: "/feed", label: "Your feed", icon: Rss },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/bookmarks", label: "Bookmarks", icon: BookmarkCheck },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground transition-opacity hover:opacity-80"
      >
        {userId.slice(0, 2).toUpperCase()}
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-10 z-50 min-w-[180px] rounded-lg border border-border bg-card shadow-lg",
            "py-1",
          )}
        >
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
              {label}
            </Link>
          ))}
          <hr className="my-1 border-border" />
          <button
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-muted"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
