import { supabase } from "../lib/supabaseClient";
import type { Achievement, CreateAchievementInput } from "../types/achievement";

export async function getAchievements(userId: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data: (data as Achievement[]) || [], error };
}

export async function createAchievement(payload: CreateAchievementInput) {
  const enrichedPayload = {
    ...payload,
    submitted_at: new Date().toISOString(),
    status: "pending" as const,
  };

  const { data, error } = await supabase
    .from("achievements")
    .insert(enrichedPayload)
    .select("*")
    .single();

  return { data: (data as Achievement | null) || null, error };
}

export async function getAchievementById(id: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*,profiles(name,department,year,email),verifier_profile:profiles!achievements_verified_by_fkey(name,email)")
    .eq("id", id)
    .single();

  return { data: (data as Achievement | null) || null, error };
}

export async function getPublicApprovedAchievements(limit = 60) {
  const { data, error } = await supabase
    .from("achievements")
    .select("id,title,type,status,description,rank,created_at,certificate,academic_year,accomplishment_date,submitter_email")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data: (data as Achievement[]) || [], error };
}
