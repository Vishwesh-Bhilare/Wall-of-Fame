import { createClient } from "@supabase/supabase-js";

const fallbackUrl = "https://placeholder-project.supabase.co";
const fallbackAnonKey = "placeholder-anon-key";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? fallbackUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? fallbackAnonKey;

export const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

if (!isSupabaseConfigured && process.env.NODE_ENV !== "test") {
  console.warn(
    "Supabase environment variables are missing. Using a placeholder client so builds can complete. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment environment.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
