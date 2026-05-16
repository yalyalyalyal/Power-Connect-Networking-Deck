import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles } from "lucide-react";

export function LoginScreen() {
  const { signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error, test } = await signInWithMagicLink(email.trim().toLowerCase());
    setLoading(false);
    if (error) setError(error);
    else if (test) {
      // Test bypass — AppShell will swap to the deck on next render.
      return;
    } else setSent(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo className="h-10" />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-glow text-slate-50">ETW-Connect</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The networking deck for Energy Tech Week 2026 attendees. Brought to you by Ignite the Spark.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-primary/40 bg-card p-6 text-center card-shadow">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full gradient-primary glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-bold">Check your inbox</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a magic link to <span className="font-semibold text-foreground">{email}</span>.
              Please open it in your preferred device browser to stay connected.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-4 text-xs font-semibold text-primary hover:underline"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 card-shadow">
            <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="h-12 rounded-xl bg-secondary/50 pl-9"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button
              type="submit"
              disabled={loading || !email}
              className="h-12 w-full gradient-primary border-0 text-base font-bold glow"
            >
              {loading ? "Sending magic link..." : "Send magic link"}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              No password needed. We'll email you a secure sign-in link.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
