import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Supabase is the primary and exclusive database source
export const isSupabaseConfigured = true;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ VitalCore warning: Supabase URL or Anon Key is missing from your environment variables. Please check your .env.local configuration."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

