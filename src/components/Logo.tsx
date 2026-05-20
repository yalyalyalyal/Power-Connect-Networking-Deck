import logoUrl from "@/assets/etw-logo.svg";

export function Logo({ className = "h-8" }: { className?: string }) {
  return <img src={logoUrl} alt="Power Connect" className={className} />;
}
