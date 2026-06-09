import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/supabase-singleton";

const TEST_EMAIL = "test@test.test";
const TEST_FLAG_KEY = "etw-test-mode";

const TEST_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: TEST_EMAIL,
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
} as unknown as User;

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isTestUser: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null; test?: boolean }>;
  verifyOtpCode: (email: string, token: string) => Promise<{ error: string | null }>; // Added OTP code verification function to the context type definition
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [testUser, setTestUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TEST_FLAG_KEY) === "1" ? TEST_USER : null;
  });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = async (email: string) => {
    if (email.trim().toLowerCase() === TEST_EMAIL) {
      localStorage.setItem(TEST_FLAG_KEY, "1");
      setTestUser(TEST_USER);
      return { error: null, test: true };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    return { error: error?.message ?? null };
  };

  /* Added new function to explicitly verify the 6-digit numerical OTP token submitted by the user */
  const verifyOtpCode = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email", // Tells Supabase this is a standard email token check
    });

    if (error) return { error: error.message };
    if (data.session) setSession(data.session);
    return { error: null };
  };
  const signOut = async () => {
    if (testUser) {
      localStorage.removeItem(TEST_FLAG_KEY);
      setTestUser(null);
    }
    await supabase.auth.signOut();
  };

  const user = session?.user ?? testUser;

  return (
    <Ctx.Provider
      value={{
        user,
        session,
        loading,
        isTestUser: !!testUser && !session,
        signInWithMagicLink,
        verifyOtpCode, // Passed the new function down into the Auth context provider
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
