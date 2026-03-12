import { supabase } from "../lib/supabaseClient";

export async function getAchievements(userId: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
}

export async function createAchievement(payload: any) {
  const { data, error } = await supabase
    .from("achievements")
    .insert(payload);

  return { data, error };
}

export async function getAchievementById(id: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}