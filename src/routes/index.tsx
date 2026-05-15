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

  const { data: profiles = [], isLoading } = useProfiles();
  const { data: bookmarks = [] } = useBookmarks();
  const { data: rejections = [] } = useRejections();
  const toggleBookmark = useToggleBookmark();
  const reject = useReject();
  const undoReject = useUndoRejection();

  const bookmarkedIds = useMemo(() => new Set(bookmarks.map((b) => b.profile_id)), [bookmarks]);
  const rejectedIds = useMemo(() => new Set(rejections.map((r) => r.profile_id)), [rejections]);

  const deck = useMemo(() => {
    const filtered = applyFilters(profiles, search, filters.companyTypes, filters.departments);
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
  };

  const activeFilterCount = filters.companyTypes.length + filters.departments.length;
  const top = deck[0];

  return (
    <>
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <main className="flex flex-1 flex-col px-4 pt-3 pb-2 min-h-0">
        <div className="relative mx-auto w-full max-w-sm flex-1 min-h-[360px]">
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
          <div className="mt-6 flex items-center justify-center gap-5">
            <ActionButton
              label="Pass"
              onClick={() => handleSwipe("left", top.id)}
              variant="reject"
            >
              <X className="h-7 w-7" strokeWidth={3} />
            </ActionButton>
            <ActionButton
              label="Undo"
              onClick={handleUndo}
              variant="undo"
              disabled={history.length === 0}
            >
              <Undo2 className="h-5 w-5" />
            </ActionButton>
            <ActionButton
              label="Save"
              onClick={() => handleSwipe("right", top.id)}
              variant="save"
            >
              <Bookmark className="h-6 w-6" fill="currentColor" />
            </ActionButton>
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
      className={`rounded-full transition-transform disabled:opacity-40 disabled:hover:scale-100 ${styles[variant]}`}
    >
      {children}
    </Button>
  );
}

function EmptyDeck({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 p-8 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full gradient-primary glow">
        <Bookmark className="h-6 w-6 text-primary-foreground" />
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
