import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDraftsByAuthor, getPostsByAuthor } from "@/lib/db/posts";
import { getProfileById } from "@/lib/db/profiles";
import { formatDate } from "@/lib/utils";
import { Eye, PenLine } from "lucide-react";
import { PublishToggle } from "./PublishToggle";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const [profile, drafts, published] = await Promise.all([
    getProfileById(user.id),
    getDraftsByAuthor(user.id),
    getPostsByAuthor(user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Link
          href="/posts/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <PenLine className="h-4 w-4" aria-hidden />
          New post
        </Link>
      </div>

      {/* Profile link */}
      {profile && (
        <p className="text-sm text-muted-foreground">
          Your profile:{" "}
          <Link
            href={`/u/${profile.username}`}
            className="text-primary underline underline-offset-2"
          >
            @{profile.username}
          </Link>
        </p>
      )}

      {/* Published */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Published ({published.length})
        </h2>
        {published.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published posts yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {published.map((post) => (
              <li key={post.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="truncate font-medium text-foreground hover:text-primary"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(post.published_at ?? post.created_at)} ·{" "}
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" aria-hidden />
                      {post.view_count.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/posts/${post.slug}/edit`}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Edit
                  </Link>
                  <PublishToggle
                    postId={post.id}
                    currentStatus="published"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Drafts */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          Drafts ({drafts.length})
        </h2>
        {drafts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No drafts.</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {drafts.map((post) => (
              <li key={post.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <span className="truncate font-medium text-foreground">{post.title}</span>
                  <p className="text-xs text-muted-foreground">
                    Last updated {formatDate(post.updated_at)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/posts/${post.slug}/edit`}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Edit
                  </Link>
                  <PublishToggle postId={post.id} currentStatus="draft" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
