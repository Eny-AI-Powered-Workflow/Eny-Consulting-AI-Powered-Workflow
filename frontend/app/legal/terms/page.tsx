// /home/obed/Documents/Eny_consulting/frontend/app/legal/terms/page.tsx
import { PLATFORM_NAME } from "@/lib/constants";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">Legal</p>
        <h1 className="mt-2 text-2xl font-medium text-ink">Terms of Service</h1>
        <p className="mt-4 text-sm text-slate">
          This page is a placeholder. I will still rplace it with {PLATFORM_NAME}&apos;s
          actual Terms of Service -- reviewed by counsel -- before this
          platform is used by real accounts.
        </p>
      </div>
    </main>
  );
}