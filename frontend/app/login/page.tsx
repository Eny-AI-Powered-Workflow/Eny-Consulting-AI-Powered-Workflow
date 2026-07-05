// /home/obed/Documents/Eny_consulting/frontend/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-paper/50">
          Eny / Ops
        </p>

        <div className="mt-6 rounded-lg border border-dashed border-white/10 bg-ink-soft p-6">
          <h1 className="text-lg font-medium text-paper">Sign in to your console</h1>
          <p className="mt-1 text-sm text-paper/50">
            What you see next is scoped to your role.
          </p>

          <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-3">
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
              className="mt-2 rounded bg-brass px-3 py-2 text-sm font-medium text-ink transition hover:bg-brass/90"
            >
              Sign in
            </button>
          </form>

          {error && <p className="mt-3 font-mono text-xs text-signal-red">{error}</p>}
        </div>
      </div>
    </main>
  );
}