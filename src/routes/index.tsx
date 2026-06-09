import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Bookmark, X, Undo2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { SwipeCard } from "@/components/SwipeCard";
import { FilterDrawer, emptyFilters, type Filters } from "@/components/FilterDrawer";
import {
  applyFilters,
  useBookmarks,
  useProfiles,
  useReject,
  useRejections,
  useToggleBookmark,
  useUndoRejection,
} from "@/hooks/useNetworking";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingTour } from "@/hooks/useOnboardingTour";

export const Route = createFileRoute("/")({
  component: () => (
    <AppShell>
      <Discover />
    </AppShell>
  ),
});

type Action = { profileId: string; type: "save" | "reject" };

function Discover() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [history, setHistory] = useState<Action[]>([]);

  const { user } = useAuth();
  const { data: profiles = [], isLoading } = useProfiles();
  const { data: bookmarks = [] } = useBookmarks();
  const { data: rejections = [] } = useRejections();
  const toggleBookmark = useToggleBookmark();
  const reject = useReject();
  const undoReject = useUndoRejection();

  const bookmarkedIds = useMemo(() => new Set(bookmarks.map((b) => b.profile_id)), [bookmarks]);
  const rejectedIds = useMemo(() => new Set(rejections.map((r) => r.profile_id)), [rejections]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of profiles) for (const t of p.tags ?? []) if (t) set.add(t);
    return [...set].sort();
  }, [profiles]);

  /* Replaced 'filters.companyTypes' with an empty array '[]'. 
       This allows the filter module hook to evaluate search, tags, and all-stars correctly. */
  const deck = useMemo(() => {
    const filtered = applyFilters(profiles, search, [], filters.tags, filters.allStars);
    return filtered.filter((p) => !rejectedIds.has(p.id) && !bookmarkedIds.has(p.id));
  }, [profiles, search, filters, rejectedIds, bookmarkedIds]);

  const handleSwipe = (dir: "left" | "right", profileId: string) => {
    if (dir === "right") {
      toggleBookmark.mutate({ profileId, save: true });
      setHistory((h) => [...h, { profileId, type: "save" }]);
      toast("Saved to your network", { className: "border-primary/40" });
    } else {
      reject.mutate(profileId);
      setHistory((h) => [...h, { profileId, type: "reject" }]);
      toast("Passed", { className: "border-border/60" });
    }
  };

  const handleUndo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    if (last.type === "save") {
      toggleBookmark.mutate({ profileId: last.profileId, save: false });
    } else {
      undoReject.mutate(last.profileId);
    }
    setHistory((h) => h.slice(0, -1));
    toast("Last action undone", { className: "border-primary/40" });
  };

  /* Removed 'filters.companyTypes.length +' from the activeFilterCountcalculation */
  const activeFilterCount = filters.tags.length + (filters.allStars ? 1 : 0);
  const top = deck[0];

  useOnboardingTour({
    userId: user?.id,
    ready: !isLoading,
    hasDeck: deck.length > 0,
  });

  return (
    <>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <main className="flex flex-1 flex-col px-4 pt-3 pb-2 min-h-0">
        <div className="relative mx-auto w-full max-w-sm flex-1 min-h-0" data-tour="deck">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-border/60 bg-card">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : deck.length === 0 ? (
            <EmptyDeck hasFilters={activeFilterCount > 0 || search.length > 0} />
          ) : (
            <AnimatePresence>
              {deck.slice(0, 3).map((profile, i) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  isTop={i === 0}
                  stackIndex={i}
                  onSwipe={(dir) => handleSwipe(dir, profile.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {top && (
          <div
            className="relative z-10 mt-4 flex shrink-0 items-center justify-center gap-5"
            data-tour="actions"
          >
            <ActionButton label="Pass" onClick={() => handleSwipe("left", top.id)} variant="reject">
              <X className="w-[24px] h-[24px]" strokeWidth={3} />
            </ActionButton>
            <ActionButton
              label="Undo"
              onClick={handleUndo}
              variant="undo"
              disabled={history.length === 0}
            >
              <Undo2 className="h-5 w-5" />
            </ActionButton>
            <ActionButton label="Save" onClick={() => handleSwipe("right", top.id)} variant="save">
              <Bookmark className="h-6 w-6 text-slate-50" fill="currentColor" />
            </ActionButton>
          </div>
        )}
      </main>

      <FilterDrawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onChange={setFilters}
        availableTags={availableTags}
      />
    </>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  variant,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: "reject" | "save" | "undo";
  disabled?: boolean;
}) {
  const styles = {
    reject:
      "h-16 w-16 border-2 border-destructive/60 text-destructive hover:bg-destructive/10 hover:scale-105",
    save: "h-16 w-16 gradient-primary border-0 text-primary-foreground glow hover:scale-105",
    undo: "h-12 w-12 border border-border/60 bg-secondary/40 text-foreground hover:scale-105",
  } as const;
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`rounded-full transition-transform disabled:hover:scale-100 ${styles[variant]} ${variant === "reject" ? "bg-[#c7c7c7]/0 opacity-100" : "disabled:opacity-40"}`}
    >
      {children}
    </Button>
  );
}

function EmptyDeck({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 p-8 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full gradient-primary glow">
        <Bookmark className="h-6 w-6 text-primary-foreground text-slate-50" />
      </div>
      <h3 className="text-lg font-bold">You're all caught up</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {hasFilters
          ? "No profiles match your search and filters."
          : "Reset your deck from Settings to revisit profiles you passed."}
      </p>
    </div>
  );
}
