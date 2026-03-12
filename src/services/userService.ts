import { supabase } from "../lib/supabaseClient";

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  return { data, error };
}