import { supabase } from "../lib/supabaseClient";
import type { Achievement } from "../types/achievement";

export async function getPendingAchievements() {
  const { data, error } = await supabase
    .from("achievements")
    .select("id,title,type,status,description,rank,certificate,submitted_at,profiles:profiles!achievements_user_id_fkey(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return { data: (data as Achievement[]) || [], error };
}

export async function approveAchievement(id: string) {
  const { data, error } = await supabase
    .from("achievements")
    .update({ status: "approved", verified_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  return { data: (data as Achievement | null) || null, error };
}

export async function rejectAchievement(id: string) {
  const { data, error } = await supabase
    .from("achievements")
    .update({ status: "rejected" })
    .eq("id", id)
    .select("*")
    .single();

  return { data: (data as Achievement | null) || null, error };
}
