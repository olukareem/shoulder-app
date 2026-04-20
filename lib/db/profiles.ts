import { createClient } from "@/lib/supabase/server";
import type { ProfileUpdateInput } from "@/lib/validation/user";

export async function getProfileByUsername(username: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) return null;
  return data;
}

export async function getProfileById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function listProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, bio, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listUsernames(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("username");
  return (data ?? []).map((r) => r.username);
}

export async function updateProfile(userId: string, input: ProfileUpdateInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: input.full_name ?? null,
      bio: input.bio ?? null,
      location: input.location ?? null,
      website: input.website || null,
      avatar_url: input.avatar_url || null,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFollowCounts(profileId: string) {
  const supabase = await createClient();

  const [{ count: followers }, { count: following }] = await Promise.all([
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("following_id", profileId),
    supabase
      .from("follows")
      .select("*", { count: "exact", head: true })
      .eq("follower_id", profileId),
  ]);

  return {
    followers: followers ?? 0,
    following: following ?? 0,
  };
}
