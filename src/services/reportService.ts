import { supabase } from "../lib/supabaseClient";

export async function getDepartmentStats() {
  const { data, error } = await supabase
    .from("achievement_stats")
    .select("*");

  return { data, error };
}

export async function getYearlyAchievements(year: number) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .gte("submitted_at", `${year}-01-01`)
    .lte("submitted_at", `${year}-12-31`);

  return { data, error };
}