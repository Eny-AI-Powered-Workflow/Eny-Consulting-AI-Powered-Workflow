// /home/obed/Documents/Eny_consulting/frontend/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import { Checkbox } from "@/components/Checkbox";
import { PLATFORM_NAME, LEGAL_LINKS } from "@/lib/constants";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedCcpa, setAgreedCcpa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const canSubmitSignup = agreedTerms && agreedPrivacy && agreedCcpa;

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmitSignup) return;
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSignupSuccess(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4">
      {/* Soft brass glow behind the card gives it a "popup" feel without a real overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(169,121,58,0.08),transparent_60%)]" />

      <div className="relative w-full max-w-sm">
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-paper/50">
          {PLATFORM_NAME}
        </p>

        <div className="mt-6 rounded-xl border border-white/10 bg-ink-soft p-6 shadow-2xl shadow-black/40">
          <div className="flex gap-1 rounded-lg bg-ink p-1">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
                mode === "signin" ? "bg-brass text-ink" : "text-paper/50 hover:text-paper"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
                mode === "signup" ? "bg-brass text-ink" : "text-paper/50 hover:text-paper"
              }`}
            >
              Create account
            </button>
          </div>

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="mt-6 flex flex-col gap-3">
              <h1 className="sr-only">Sign in</h1>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded border border-white/10 bg-ink px-3 py-2 text-sm text-paper placeholder:text-paper/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded border border-white/10 bg-ink px-3 py-2 text-sm text-paper placeholder:text-paper/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded bg-brass px-3 py-2 text-sm font-medium text-ink transition hover:bg-brass/90 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          ) : signupSuccess ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-paper">Account created.</p>
              <p className="mt-2 text-xs text-paper/60">
                Check your email to confirm your address. An administrator will
                assign your access role before you can use the console.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="mt-6 flex flex-col gap-3">
              <h1 className="sr-only">Create account</h1>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded border border-white/10 bg-ink px-3 py-2 text-sm text-paper placeholder:text-paper/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded border border-white/10 bg-ink px-3 py-2 text-sm text-paper placeholder:text-paper/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="rounded border border-white/10 bg-ink px-3 py-2 text-sm text-paper placeholder:text-paper/30 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
              />

              <div className="mt-2 flex flex-col gap-2.5 rounded-lg border border-dashed border-white/10 p-3">
                <Checkbox checked={agreedTerms} onChange={setAgreedTerms}>
                  I agree to {PLATFORM_NAME}&apos;s{" "}
                  <a href={LEGAL_LINKS.terms} target="_blank" className="text-brass underline">
                    Terms of Service
                  </a>
                  , including the acceptable use policy and platform
                  guidelines for outreach and email communication.
                </Checkbox>
                <Checkbox checked={agreedPrivacy} onChange={setAgreedPrivacy}>
                  I acknowledge the{" "}
                  <a href={LEGAL_LINKS.privacy} target="_blank" className="text-brass underline">
                    Privacy Policy
                  </a>
                  , including how my data is collected, stored, and used to
                  provide platform services.
                </Checkbox>
                <Checkbox checked={agreedCcpa} onChange={setAgreedCcpa}>
                  I understand my rights under the{" "}
                  <a href={LEGAL_LINKS.ccpa} target="_blank" className="text-brass underline">
                    California Consumer Privacy Act
                  </a>
                  , including the right to access, delete, and opt out of the
                  sale of my personal information.
                </Checkbox>
              </div>

              <button
                type="submit"
                disabled={!canSubmitSignup || loading}
                className="mt-2 rounded bg-brass px-3 py-2 text-sm font-medium text-ink transition hover:bg-brass/90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}

          {error && <p className="mt-3 font-mono text-xs text-signal-red">{error}</p>}
        </div>
      </div>
    </main>
  );
}