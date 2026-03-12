import { supabase } from "../lib/supabaseClient";
import type { UserProfile } from "../types/user";

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,name,email,prn,department,year,role,github_url,created_at,updated_at")
    .eq("id", userId)
    .single();

  return { data: data as UserProfile | null, error };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, "id" | "created_at" | "updated_at">>
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("id,name,email,prn,department,year,role,github_url,created_at,updated_at")
    .single();

  return { data: data as UserProfile | null, error };
}
