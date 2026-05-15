import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2, BookmarkX } from "lucide-react";
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

  const { data: profiles = [], isLoading } = useProfiles();
  const { data: bookmarks = [] } = useBookmarks();
  const toggleBookmark = useToggleBookmark();

  const savedIds = useMemo(() => new Set(bookmarks.map((b) => b.profile_id)), [bookmarks]);

  const list = useMemo(() => {
    const onlySaved = profiles.filter((p) => savedIds.has(p.id));
    return applyFilters(onlySaved, search, filters.companyTypes, filters.departments);
  }, [profiles, savedIds, search, filters]);

  const activeFilterCount = filters.companyTypes.length + filters.departments.length;

  return (
    <>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />
      <main className="flex-1 px-4 pt-4">
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
          <div className="space-y-4">
            {list.map((profile) => (
              <div
                key={profile.id}
                className="overflow-hidden rounded-3xl border border-border/60 bg-card card-shadow"
              >
                <ProfileDetail profile={profile} saved compact />
                <div className="border-t border-border/60 p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      toggleBookmark.mutate({ profileId: profile.id, save: false })
                    }
                  >
                    Remove from saved
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <FilterDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onChange={setFilters}
      />
    </>
  );
}
