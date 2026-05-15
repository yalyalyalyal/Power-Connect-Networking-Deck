import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoginScreen } from "./LoginScreen";
import { BottomNav } from "./BottomNav";
import { Logo } from "./Logo";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Logo className="h-10 animate-pulse" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
