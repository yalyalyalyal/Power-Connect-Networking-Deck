import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/supabase-singleton";
import { fetchProfiles, type Profile } from "@/lib/profiles";
import { useAuth } from "./useAuth";

const LS_BOOKMARKS = "etw-test-bookmarks";
const LS_REJECTIONS = "etw-test-rejections";

function lsRead(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function lsWrite(key: string, ids: string[]) {
  localStorage.setItem(key, JSON.stringify(ids));
}

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBookmarks() {
  const { user, isTestUser } = useAuth();
  return useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (isTestUser) {
        return lsRead(LS_BOOKMARKS).map((profile_id) => ({
          profile_id,
          created_at: new Date().toISOString(),
        }));
      }
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
  const { user, isTestUser } = useAuth();
  return useQuery({
    queryKey: ["rejections", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (isTestUser) {
        return lsRead(LS_REJECTIONS).map((profile_id) => ({ profile_id }));
      }
      const { data, error } = await supabase.from("rejections").select("profile_id");
      if (error) throw error;
      return data ?? [];
    },
  });
}

/* // OLD IMPLEMENTATION - Keep for reverting back if needed
export function useToggleBookmark() {
  const qc = useQueryClient();
  const { user, isTestUser } = useAuth();
  return useMutation({
    mutationFn: async ({ profileId, save }: { profileId: string; save: boolean }) => {
      if (!user) throw new Error("Not signed in");
      if (isTestUser) {
        const cur = new Set(lsRead(LS_BOOKMARKS));
        if (save) cur.add(profileId);
        else cur.delete(profileId);
        lsWrite(LS_BOOKMARKS, [...cur]);
        return;
      }
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
*/

export function useToggleBookmark() {
  const qc = useQueryClient();
  const { user, isTestUser } = useAuth();
  const queryKey = ["bookmarks", user?.id];

  return useMutation({
    mutationFn: async ({ profileId, save }: { profileId: string; save: boolean }) => {
      if (!user) throw new Error("Not signed in");
      if (isTestUser) {
        const cur = new Set(lsRead(LS_BOOKMARKS));
        if (save) cur.add(profileId);
        else cur.delete(profileId);
        lsWrite(LS_BOOKMARKS, [...cur]);
        return;
      }
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
    onMutate: async ({ profileId, save }) => {
      await qc.cancelQueries({ queryKey });
      const previousBookmarks = qc.getQueryData(queryKey);

      qc.setQueryData(queryKey, (old: any) => {
        const current = old ? [...old] : [];
        if (save) {
          if (!current.some((b: any) => b.profile_id === profileId)) {
            current.unshift({ profile_id: profileId, created_at: new Date().toISOString() });
          }
        } else {
          return current.filter((b: any) => b.profile_id !== profileId);
        }
        return current;
      });

      return { previousBookmarks };
    },
    onError: (err, variables, context) => {
      if (context?.previousBookmarks) {
        qc.setQueryData(queryKey, context.previousBookmarks);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
}

/* // OLD IMPLEMENTATION - Keep for reverting back if needed
export function useReject() {
  const qc = useQueryClient();
  const { user, isTestUser } = useAuth();
  return useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Not signed in");
      if (isTestUser) {
        const cur = new Set(lsRead(LS_REJECTIONS));
        cur.add(profileId);
        lsWrite(LS_REJECTIONS, [...cur]);
        return;
      }
      const { error } = await supabase
        .from("rejections")
        .upsert({ user_id: user.id, profile_id: profileId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rejections"] }),
  });
}
*/

export function useReject() {
  const qc = useQueryClient();
  const { user, isTestUser } = useAuth();
  const queryKey = ["rejections", user?.id];

  return useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Not signed in");
      if (isTestUser) {
        const cur = new Set(lsRead(LS_REJECTIONS));
        cur.add(profileId);
        lsWrite(LS_REJECTIONS, [...cur]);
        return;
      }
      const { error } = await supabase
        .from("rejections")
        .upsert({ user_id: user.id, profile_id: profileId });
      if (error) throw error;
    },
    onMutate: async (profileId) => {
      await qc.cancelQueries({ queryKey });
      const previousRejections = qc.getQueryData(queryKey);

      qc.setQueryData(queryKey, (old: any) => {
        const current = old ? [...old] : [];
        if (!current.some((r: any) => r.profile_id === profileId)) {
          current.push({ profile_id: profileId });
        }
        return current;
      });

      return { previousRejections };
    },
    onError: (err, profileId, context) => {
      if (context?.previousRejections) {
        qc.setQueryData(queryKey, context.previousRejections);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
}

/* // OLD IMPLEMENTATION - Keep for reverting back if needed
export function useUndoRejection() {
  const qc = useQueryClient();
  const { user, isTestUser } = useAuth();
  return useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Not signed in");
      if (isTestUser) {
        const cur = new Set(lsRead(LS_REJECTIONS));
        cur.delete(profileId);
        lsWrite(LS_REJECTIONS, [...cur]);
        return;
      }
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
*/

export function useUndoRejection() {
  const qc = useQueryClient();
  const { user, isTestUser } = useAuth();
  const queryKey = ["rejections", user?.id];

  return useMutation({
    mutationFn: async (profileId: string) => {
      if (!user) throw new Error("Not signed in");
      if (isTestUser) {
        const cur = new Set(lsRead(LS_REJECTIONS));
        cur.delete(profileId);
        lsWrite(LS_REJECTIONS, [...cur]);
        return;
      }
      const { error } = await supabase
        .from("rejections")
        .delete()
        .eq("user_id", user.id)
        .eq("profile_id", profileId);
      if (error) throw error;
    },
    onMutate: async (profileId) => {
      await qc.cancelQueries({ queryKey });
      const previousRejections = qc.getQueryData(queryKey);

      qc.setQueryData(queryKey, (old: any) => {
        return old ? old.filter((r: any) => r.profile_id !== profileId) : [];
      });

      return { previousRejections };
    },
    onError: (err, profileId, context) => {
      if (context?.previousRejections) {
        qc.setQueryData(queryKey, context.previousRejections);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
}

/* // OLD IMPLEMENTATION - Keep for reverting back if needed
export function useResetRejections() {
  const qc = useQueryClient();
  const { user, isTestUser } = useAuth();
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (isTestUser) {
        lsWrite(LS_REJECTIONS, []);
        return;
      }
      const { error } = await supabase.from("rejections").delete().eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rejections"] }),
  });
}
*/

export function useResetRejections() {
  const qc = useQueryClient();
  const { user, isTestUser } = useAuth();
  const queryKey = ["rejections", user?.id];

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not signed in");
      if (isTestUser) {
        lsWrite(LS_REJECTIONS, []);
        return;
      }
      const { error } = await supabase.from("rejections").delete().eq("user_id", user.id);
      if (error) throw error;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey });
      const previousRejections = qc.getQueryData(queryKey);
      
      qc.setQueryData(queryKey, []);
      
      return { previousRejections };
    },
    onError: (err, variables, context) => {
      if (context?.previousRejections) {
        qc.setQueryData(queryKey, context.previousRejections);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });
}

export function applyFilters(
  profiles: Profile[],
  search: string,
  companyTypes: string[],
  tags: string[],
  allStars: boolean = false,
): Profile[] {
  const q = search.trim().toLowerCase();
  return profiles.filter((p) => {
    if (q) {
      const hay = `${p.name ?? ""} ${p.company ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (companyTypes.length && !companyTypes.includes(p.company_type ?? "")) return false;
    if (tags.length) {
      const profileTags = p.tags ?? [];
      if (!tags.some((t) => profileTags.includes(t))) return false;
    }
    if (allStars && !p.all_star) return false;
    return true;
  });
}
