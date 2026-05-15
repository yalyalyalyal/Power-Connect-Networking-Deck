import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchProfiles, type Profile } from "@/lib/profiles";
import { useAuth } from "./useAuth";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBookmarks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("profile_id, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useRejections() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["rejections", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rejections")
        .select("profile_id");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useToggleBookmark() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ profileId, save }: { profileId: string; save: boolean }) => {
      if (!user) throw new Error("Not signed in");
      if (save) {
        const { error } = await supabase
          .from("bookmarks")
          .upsert({ user_id: user.id, profile_id: profileId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("profile_id", profileId);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookmarks"] }),
  });
}

export function useReject() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("rejections")
        .upsert({ user_id: user.id, profile_id: profileId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rejections"] }),
  });
}

export function useUndoRejection() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("rejections")
        .delete()
        .eq("user_id", user.id)
        .eq("profile_id", profileId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rejections"] }),
  });
}

export function useResetRejections() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("rejections")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rejections"] }),
  });
}

export function applyFilters(
  profiles: Profile[],
  search: string,
  companyTypes: string[],
  departments: string[],
): Profile[] {
  const q = search.trim().toLowerCase();
  return profiles.filter((p) => {
    if (q) {
      const hay = `${p.name ?? ""} ${p.company ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (companyTypes.length && !companyTypes.includes(p.company_type ?? "")) return false;
    if (departments.length && !departments.includes(p.department ?? "")) return false;
    return true;
  });
}
