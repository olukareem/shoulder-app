import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { SearchBox } from "@/components/nav/SearchBox";
import { UserMenu } from "@/components/nav/UserMenu";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-foreground"
        >
          shoulder
        </Link>

        {/* Search — hidden on mobile, full-width on sm+ */}
        <div className="hidden flex-1 sm:block">
          <Suspense>
            <SearchBox className="max-w-sm" />
          </Suspense>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <UserMenu userId={user.id} />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile search row */}
      <div className="border-t border-border px-4 py-2 sm:hidden">
        <Suspense>
          <SearchBox />
        </Suspense>
      </div>
    </header>
  );
}
