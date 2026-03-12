import { supabase } from "../lib/supabaseClient";

export async function getPendingAchievements() {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("status", "pending");

  return { data, error };
}

export async function approveAchievement(id: string) {
  const { data, error } = await supabase
    .from("achievements")
    .update({ status: "approved", verified_at: new Date() })
    .eq("id", id);

  return { data, error };
}

export async function rejectAchievement(id: string) {
  const { data, error } = await supabase
    .from("achievements")
    .update({ status: "rejected" })
    .eq("id", id);

  return { data, error };
}