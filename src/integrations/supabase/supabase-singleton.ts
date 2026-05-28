import { supabase as generatedSupabase } from "@/integrations/supabase/client";

// Extend the window object interface for TypeScript
declare global {
  interface Window {
    __supabaseInstance?: typeof generatedSupabase;
  }
}

let supabaseInstance: typeof generatedSupabase;

if (typeof window !== 'undefined') {
  // If the global instance doesn't exist on the browser window yet, assign it
  if (!window.__supabaseInstance) {
    window.__supabaseInstance = generatedSupabase;
  }
  supabaseInstance = window.__supabaseInstance;
} else {
  // Server-side fallback
  supabaseInstance = generatedSupabase;
}

export const supabase = supabaseInstance;
