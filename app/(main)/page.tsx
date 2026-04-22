import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/posts");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
          shoulder
        </h1>
        <p className="mb-2 text-xl text-muted-foreground">
          A space for help, advice and services.
        </p>
        <p className="mb-10 text-muted-foreground">
          Connect with mentors. Share what you know. Find what you need.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="w-full rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          Or{" "}
          <Link
            href="/posts"
            className="underline underline-offset-2 hover:text-foreground"
          >
            browse posts
          </Link>{" "}
          without an account.
        </p>
      </div>
    </main>
  );
}
