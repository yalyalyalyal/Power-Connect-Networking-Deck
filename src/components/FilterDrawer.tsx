import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/* REMOVED: export const COMPANY_TYPES = ["Startup", "Corporate", "Investor", "NGO", "Government"] as const; */

export type Filters = {
  /* REMOVED: companyTypes: string[]; */
  tags: string[];
  allStars: boolean;
};

/* REMOVED companyTypes: [], from emptyFilters */
export const emptyFilters: Filters = { tags: [], allStars: false };

export function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onChange,
  availableTags,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  filters: Filters;
  onChange: (f: Filters) => void;
  availableTags: string[];
}) {
  const toggleArr = (key: "companyTypes" | "tags", value: string) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const Chip = ({
    active,
    label,
    onClick,
  }: {
    active: boolean;
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
        active
          ? "gradient-primary border-transparent text-primary-foreground glow"
          : "border-border/60 bg-secondary/40 text-foreground hover:border-primary/60",
      )}
    >
      {label}
    </button>
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-card border-border/60">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-xl font-extrabold">Filters</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[60vh] space-y-6 overflow-y-auto px-4 pb-4">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-secondary/40 p-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" fill="currentColor" />
                <div>
                  <p className="text-sm font-bold">All-Stars</p>
                  <p className="text-xs text-muted-foreground">Show featured profiles</p>
                </div>
              </div>
              <Switch
                checked={filters.allStars}
                onCheckedChange={(v) => onChange({ ...filters, allStars: v })}
              />
            </div>
            {/* REMOVED COMPANY TYPE FILTERS
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Company Type
              </h4>
              <div className="flex flex-wrap gap-2">
                {COMPANY_TYPES.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    active={filters.companyTypes.includes(t)}
                    onClick={() => toggleArr("companyTypes", t)}
                  />
                ))}
              </div>
            </div>
            */}
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Tags
              </h4>
              {availableTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags available.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((t) => (
                    <Chip
                      key={t}
                      label={t}
                      active={filters.tags.includes(t)}
                      onClick={() => toggleArr("tags", t)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <DrawerFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onChange(emptyFilters)}>
              Clear
            </Button>
            <Button
              className="flex-1 gradient-primary border-0"
              onClick={() => onOpenChange(false)}
            >
              Apply
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
