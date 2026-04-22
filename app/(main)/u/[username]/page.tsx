import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProfileByUsername, getFollowCounts } from "@/lib/db/profiles";
import { getPostsByAuthor } from "@/lib/db/posts";
import { createClient } from "@/lib/supabase/server";
import { isFollowing } from "@/lib/db/follows";
import { FollowButton } from "@/components/profile/FollowButton";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) return {};
  return {
    title: profile.full_name ?? profile.username,
    description: profile.bio ?? `Posts by ${profile.username} on shoulder`,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const [posts, counts, alreadyFollowing] = await Promise.all([
    getPostsByAuthor(profile.id),
    getFollowCounts(profile.id),
    currentUser && currentUser.id !== profile.id
      ? isFollowing(currentUser.id, profile.id)
      : Promise.resolve(false),
  ]);

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Profile header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {profile.username.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {profile.full_name ?? profile.username}
            </h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground">{counts.followers}</span>{" "}
                followers
              </span>
              <span>
                <span className="font-semibold text-foreground">{counts.following}</span>{" "}
                following
              </span>
            </div>
          </div>
        </div>

        {isOwnProfile ? (
          <Link
            href="/dashboard"
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            Edit profile
          </Link>
        ) : currentUser ? (
          <FollowButton targetId={profile.id} initialFollowing={alreadyFollowing} />
        ) : null}
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-muted-foreground">{profile.bio}</p>
      )}

      {/* Posts */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Posts ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No posts yet.</p>
        ) : (
          <div>
            {posts.map((post) => (
              <article key={post.id} className="border-b border-border py-4 last:border-0">
                <h3 className="font-semibold text-foreground">
                  <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(post.published_at ?? post.created_at)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
