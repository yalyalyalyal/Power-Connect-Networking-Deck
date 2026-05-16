import { Linkedin, Bookmark } from "lucide-react";
import type { Profile } from "@/lib/profiles";
import { Badge } from "@/components/ui/badge";
import allStarBadge from "@/assets/all-star.svg";

export function ProfileDetail({
  profile,
  saved,
  variant = "full",
}: {
  profile: Profile;
  saved?: boolean;
  /** "full" = large hero image (used in Saved dialog). "card" = thumbnail top-left (used in deck card). */
  variant?: "full" | "card";
}) {
  if (variant === "card") {
    return (
      <div className="flex h-full flex-col p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-secondary ring-2 ring-primary/40 glow">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                {profile.name?.[0] ?? "?"}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-extrabold leading-tight tracking-tight text-foreground text-glow">
                {profile.name}
              </h2>
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="shrink-0 rounded-full p-1.5 transition-transform hover:scale-110"
                  style={{ background: "var(--linkedin)" }}
                  aria-label="Open LinkedIn profile"
                >
                  <Linkedin className="h-3.5 w-3.5 text-white" fill="white" />
                </a>
              )}
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">{profile.role ?? "—"}</p>
            <p className="text-sm text-primary font-semibold truncate">{profile.company ?? ""}</p>
          </div>
        </div>

        {profile.all_star && (
          <div className="mt-3">
            <img src={allStarBadge} alt="All Star" className="h-5 w-auto" />
          </div>
        )}

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto no-scrollbar">
          {profile.looking_for && (
            <div className="rounded-xl border border-border/60 bg-secondary/50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Looking for
              </p>
              <p className="mt-1 text-sm leading-snug text-foreground">{profile.looking_for}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {profile.category && (
              <Badge className="gradient-primary border-0 text-primary-foreground">
                {profile.category}
              </Badge>
            )}
            {profile.tags?.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="border-primary/40 bg-primary/10 text-foreground"
              >
                {t}
              </Badge>
            ))}
          </div>

          {(profile.company_type || profile.department) && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {profile.company_type && (
                <span>
                  <span className="font-bold text-foreground/80">Type:</span> {profile.company_type}
                </span>
              )}
              {profile.department && (
                <span>
                  <span className="font-bold text-foreground/80">Dept:</span> {profile.department}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[inherit] bg-secondary">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-muted-foreground">
            {profile.name?.[0] ?? "?"}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        {saved && (
          <div className="absolute top-3 right-3 rounded-full bg-primary/90 p-2 glow">
            <Bookmark className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground text-glow">
              {profile.name}
            </h2>
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="shrink-0 rounded-full p-2 transition-transform hover:scale-110"
                style={{ background: "var(--linkedin)" }}
                aria-label="Open LinkedIn profile"
              >
                <Linkedin className="h-4 w-4 text-white" fill="white" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-5 pb-6">
        <div>
          <p className="text-lg font-bold text-foreground">{profile.role ?? "—"}</p>
          <p className="text-base text-primary font-semibold">{profile.company ?? ""}</p>
          {profile.all_star && (
            <div className="mt-2">
              <img src={allStarBadge} alt="All Star" className="h-5 w-auto" />
            </div>
          )}
        </div>

        {profile.looking_for && (
          <div className="rounded-xl border border-border/60 bg-secondary/50 p-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Looking for
            </p>
            <p className="mt-1 text-sm leading-snug text-foreground">{profile.looking_for}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {profile.category && (
            <Badge variant="default" className="gradient-primary border-0 text-primary-foreground">
              {profile.category}
            </Badge>
          )}
          {profile.tags?.map((t) => (
            <Badge
              key={t}
              variant="outline"
              className="border-primary/40 bg-primary/10 text-foreground"
            >
              {t}
            </Badge>
          ))}
        </div>

        {(profile.company_type || profile.department) && (
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {profile.company_type && (
              <span>
                <span className="font-bold text-foreground/80">Type:</span> {profile.company_type}
              </span>
            )}
            {profile.department && (
              <span>
                <span className="font-bold text-foreground/80">Dept:</span> {profile.department}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
