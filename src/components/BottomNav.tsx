import { Link, useLocation } from "@tanstack/react-router";
import { Layers, Bookmark, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Discover", icon: Layers },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/80 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                data-tour={to === "/saved" ? "nav-saved" : to === "/settings" ? "nav-settings" : "nav-discover"}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 rounded-xl transition-colors",
                  active ? "text-primary text-glow" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[11px] font-semibold tracking-wide">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
