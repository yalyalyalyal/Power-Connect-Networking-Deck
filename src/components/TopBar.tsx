import { Search, SlidersHorizontal } from "lucide-react";
import { Logo } from "./Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TopBar({
  search,
  onSearchChange,
  onOpenFilters,
  activeFilterCount,
}: {
  search: string;
  onSearchChange: (s: string) => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-md px-4 pt-3 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <Logo className="h-7" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-glow">
            Connect
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1" data-tour="search">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search name or company"
              className="h-11 rounded-full border-border/60 bg-secondary/40 pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenFilters}
            data-tour="filters"
            className="relative h-11 w-11 rounded-full border-border/60 bg-secondary/40"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground glow">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
