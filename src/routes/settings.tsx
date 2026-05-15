import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Download, RotateCcw, LogOut, Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  useBookmarks,
  useProfiles,
  useResetRejections,
  useRejections,
} from "@/hooks/useNetworking";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: () => (
    <AppShell>
      <Settings />
    </AppShell>
  ),
});

function Settings() {
  const { user, signOut } = useAuth();
  const { data: bookmarks = [] } = useBookmarks();
  const { data: rejections = [] } = useRejections();
  const { data: profiles = [] } = useProfiles();
  const resetRejections = useResetRejections();

  const savedProfiles = useMemo(() => {
    const set = new Set(bookmarks.map((b) => b.profile_id));
    return profiles.filter((p) => set.has(p.id));
  }, [bookmarks, profiles]);

  const exportCsv = () => {
    if (savedProfiles.length === 0) {
      toast("No saved profiles to export.");
      return;
    }
    const headers = ["Name", "Role", "Company", "Company Type", "Department", "LinkedIn"];
    const escape = (v: string | null | undefined) => {
      const s = (v ?? "").replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const rows = savedProfiles.map((p) =>
      [p.name, p.role, p.company, p.company_type, p.department, p.linkedin_url]
        .map(escape)
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `etw-connect-contacts-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${savedProfiles.length} contact${savedProfiles.length === 1 ? "" : "s"}.`);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-md px-4 py-3 flex items-center justify-between">
          <Logo className="h-7" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-glow">
            Settings
          </span>
        </div>
      </header>

      <main className="flex-1 space-y-6 px-4 pt-6">
        <section className="rounded-2xl border border-border/60 bg-card p-5 card-shadow">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary glow">
              <Mail className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Signed in as
              </p>
              <p className="truncate font-bold">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <Stat label="Saved" value={bookmarks.length} />
            <Stat label="Passed" value={rejections.length} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Deck
          </h2>
          <SettingRow
            icon={<RotateCcw className="h-5 w-5" />}
            title="Reset deck"
            description="Bring back profiles you previously passed on."
            actionLabel={resetRejections.isPending ? "Resetting..." : "Reset"}
            onAction={() =>
              resetRejections.mutate(undefined, {
                onSuccess: () => toast("Your deck has been reset."),
              })
            }
            disabled={rejections.length === 0 || resetRejections.isPending}
          />
          <SettingRow
            icon={<Download className="h-5 w-5" />}
            title="Export contact list"
            description="Download your saved profiles as a CSV."
            actionLabel="Export"
            onAction={exportCsv}
            disabled={savedProfiles.length === 0}
          />
        </section>

        <section className="space-y-3">
          <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Account
          </h2>
          <SettingRow
            icon={<LogOut className="h-5 w-5" />}
            title="Log out"
            description="End your session on this device."
            actionLabel="Log out"
            onAction={() => signOut()}
            destructive
          />
        </section>

        <p className="px-2 pt-4 text-center text-[11px] text-muted-foreground">
          ETW-Connect · Energy Tech Week 2026
        </p>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/40 py-3">
      <p className="text-2xl font-extrabold text-glow text-primary">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function SettingRow({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  disabled,
  destructive,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 card-shadow">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button
        size="sm"
        variant={destructive ? "destructive" : "outline"}
        onClick={onAction}
        disabled={disabled}
        className="shrink-0"
      >
        {actionLabel}
      </Button>
    </div>
  );
}
