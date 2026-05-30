import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, BookmarkX, Linkedin, Trash2, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { ProfileDetail } from "@/components/ProfileDetail";
import { FilterDrawer, emptyFilters, type Filters } from "@/components/FilterDrawer";
import {
  applyFilters,
  useBookmarks,
  useProfiles,
  useToggleBookmark,
} from "@/hooks/useNetworking";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Profile } from "@/lib/profiles";

export const Route = createFileRoute("/saved")({
  component: () => (
    <AppShell>
      <Saved />
    </AppShell>
  ),
});

function Saved() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expanded, setExpanded] = useState<Profile | null>(null);

  const { data: profiles = [], isLoading } = useProfiles();
  const { data: bookmarks = [] } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const savedIds = useMemo(() => new Set(bookmarks.map((b) => b.profile_id)), [bookmarks]);

  const list = useMemo(() => {
    const onlySaved = profiles.filter((p) => savedIds.has(p.id));
    return applyFilters(onlySaved, search, [], filters.tags, filters.allStars);
  }, [profiles, savedIds, search, filters]);
    /* Replaced 'filters.companyTypes' with an empty array '[]' to remove companyType filter while
    satisfying the hook's method arguments.*/
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of profiles) if (savedIds.has(p.id)) for (const t of p.tags ?? []) if (t) set.add(t);
    return [...set].sort();
  }, [profiles, savedIds]);
  
  /* Removed 'filters.companyTypes.length +' from the count */
  const activeFilterCount = filters.tags.length + (filters.allStars ? 1 : 0);

  const handleRemove = (profileId: string) => {
    toggleBookmark.mutate({ profileId, save: false });
    setExpanded(null);
  };

  // Support device back button (Android BackHandler / browser back / iOS swipe back)
  // to close the expanded profile dialog. ESC key is handled natively by Dialog.
  useEffect(() => {
    if (!expanded) return;
    window.history.pushState({ etwExpanded: true }, "");
    const onPop = () => setExpanded(null);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (window.history.state?.etwExpanded) {
        window.history.back();
      }
    };
  }, [expanded]);

  return (
    <>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="mb-4 flex items-baseline justify-between">
          <h1 className="text-xl font-extrabold tracking-tight">Saved profiles</h1>
          <span className="text-xs font-semibold text-muted-foreground">
            {bookmarks.length} total
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-8 text-center">
            <BookmarkX className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <h3 className="font-bold">No saved profiles yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Swipe right on the deck to bookmark people you want to meet.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {list.map((profile) => (
              <li key={profile.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(profile)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 text-left transition hover:border-primary/60 hover:bg-card"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-secondary">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-bold text-muted-foreground">
                        {profile.name?.[0] ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-foreground">{profile.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[profile.role, profile.company].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <FilterDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onChange={setFilters}
        availableTags={availableTags}
      />

      <Dialog open={!!expanded} onOpenChange={(o) => !o && setExpanded(null)}>
        <DialogContent
          className="max-h-[90dvh] w-[95vw] max-w-md gap-0 overflow-hidden rounded-3xl border-border/60 bg-card p-0 [&>button.absolute]:top-4 [&>button.absolute]:right-4 [&>button.absolute]:z-30 [&>button.absolute]:rounded-full [&>button.absolute]:bg-background/80 [&>button.absolute]:p-1.5 [&>button.absolute]:backdrop-blur"
        >
          {expanded && (
            <div className="flex max-h-[90dvh] flex-col">
              <div className="flex-1 overflow-y-auto">
                <ProfileDetail profile={expanded} saved />
              </div>
              <div className="grid shrink-0 grid-cols-[auto_1fr] gap-2 border-t border-border/60 bg-card/95 p-3 backdrop-blur">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleRemove(expanded.id)}
                  className="h-12 border-destructive/50 text-destructive hover:bg-destructive/10"
                  aria-label="Remove from saved"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                {expanded.linkedin_url ? (
                  <Button
                    asChild
                    size="lg"
                    className="h-12 gap-2 text-base font-bold text-white"
                    style={{ background: "var(--linkedin)" }}
                  >
                    <a
                      href={expanded.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Connect with <Linkedin className="h-5 w-5" fill="white" />
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" disabled className="h-12">
                    No LinkedIn
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
