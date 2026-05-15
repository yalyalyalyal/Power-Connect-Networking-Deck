import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const COMPANY_TYPES = ["Startup", "Corporate", "Investor", "NGO", "Government"] as const;
export const DEPARTMENTS = ["Finance", "Engineering", "Sales", "Product", "Policy"] as const;

export type Filters = {
  companyTypes: string[];
  departments: string[];
};

export const emptyFilters: Filters = { companyTypes: [], departments: [] };

export function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const toggle = (key: keyof Filters, value: string) => {
    const arr = filters[key];
    onChange({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    });
  };

  const Chip = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
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
          <div className="space-y-6 px-4 pb-4">
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
                    onClick={() => toggle("companyTypes", t)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Department
              </h4>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((d) => (
                  <Chip
                    key={d}
                    label={d}
                    active={filters.departments.includes(d)}
                    onClick={() => toggle("departments", d)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DrawerFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onChange(emptyFilters)}>
              Clear
            </Button>
            <Button className="flex-1 gradient-primary border-0" onClick={() => onOpenChange(false)}>
              Apply
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
