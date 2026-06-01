import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Search } from "lucide-react";
import { Mail, KeyRound } from "lucide-react"; // Imported KeyRound icon to represent the passcode field

/* Hidden Welcome Screen trigger for testing
// Initial Welcome Screen (WelcomeScreen.tsx) to appear before Login screen
import { WelcomeScreen } from "./WelcomeScreen";
*/

export function LoginScreen() {
  /* Hidden Welcome Screen trigger for testing
   const [welcomed, setWelcomed] = useState(() =>
    sessionStorage.getItem("pc-welcomed") === "1"
  );
  */
  
  const { signInWithMagicLink, verifyOtpCode } = useAuth(); // Destructured verifyOtpCode from hook
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState(""); // Added state tracker for the 6-digit token text input
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false); // Added loading indicator state specifically for the verification step
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

   /* Hidden Welcome Screen trigger for testing
  if (!welcomed) {
    return (
      <WelcomeScreen
        onGetStarted={() => {
          sessionStorage.setItem("pc-welcomed", "1");
          setWelcomed(true);
        }}
      />
    );
  }
  */

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
  
// Added a separate submission handler for checking the typed 6-digit authorization code
  const onVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setVerifying(true);
    
    const { error } = await verifyOtpCode(email.trim().toLowerCase(), otpCode.trim());
    setVerifying(false);
    
    if (error) {
      setError("This code is incorrect or expired. Please try again.");
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo className="h-10" />
          <div>
            <h1 className="font-bold tracking-tight text-glow text-[2rem]">POWER CONNECT</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The Energy Tech networking deck for Power Connect 2026.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-primary/40 bg-card p-6 text-center card-shadow">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full gradient-primary glow">
              <Search className="h-6 w-6 text-primary-foreground text-slate-50" />
            </div>
            <h2 className="text-lg font-bold">Check your inbox</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a magic link to <span className="font-semibold text-foreground">{email}</span>.<br />
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
              className="h-12 w-full gradient-primary border-0 text-base font-bold glow text-slate-50"
            >
              {loading ? "Sending magic link..." : "Send magic link"}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              No password needed. We'll email you a secure login link.
            </p>
          </form>
        )}
        <p className="px-1 pt-1 text-center text-[11px] text-muted-foreground">
          Ignite The Spark 2026 <br />
          Built by <a href="https://www.linkedin.com/in/yalyal/" target="_blank">Eyal Ephrati</a>
        </p>
      </div>
    </div>
  );
}
