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
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col">
      <div className="flex flex-1 flex-col overflow-y-auto pb-20">{children}</div>
      <BottomNav />
    </div>
  );
}
