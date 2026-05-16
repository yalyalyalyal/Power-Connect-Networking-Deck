import { createClient } from "@supabase/supabase-js";

// External read-only Supabase project hosting the TEST2 profiles table.
const PROFILES_URL = "https://tukqplsjvwrehkwbpojm.supabase.co";
const PROFILES_KEY = "sb_publishable_lzThihKwRiwuXGUCwCqgjA__Vj0AyQI";

export const profilesClient = createClient(PROFILES_URL, PROFILES_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type Profile = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  company_type: string | null;
  department: string | null;
  category: string | null;
  looking_for: string | null;
  tags: string[] | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  all_star: boolean | null;
};

export async function fetchProfiles(): Promise<Profile[]> {
  const { data, error } = await profilesClient
    .from("TEST2")
    .select("*")
    .limit(1000);
  if (error) throw error;
  return (data ?? []) as Profile[];
}
