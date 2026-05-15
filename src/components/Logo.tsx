import logoUrl from "@/assets/etw-logo.svg";

export function Logo({ className = "h-8" }: { className?: string }) {
  return <img src={logoUrl} alt="Energy Tech Week 2026" className={className} />;
}
