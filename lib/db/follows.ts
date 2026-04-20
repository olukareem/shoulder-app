import { createClient } from "@/lib/supabase/server";

export async function isFollowing(followerId: string, followingId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  return data !== null;
}

export async function follow(followerId: string, followingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });
  if (error && error.code !== "23505") throw error;
}

export async function unfollow(followerId: string, followingId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (error) throw error;
}
