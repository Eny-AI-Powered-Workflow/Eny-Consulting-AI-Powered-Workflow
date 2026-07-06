// /home/obed/Documents/Eny_consulting/frontend/app/legal/privacy/page.tsx
import { PLATFORM_NAME } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">Legal</p>
        <h1 className="mt-2 text-2xl font-medium text-ink">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate">
          This page is a placeholder. I will replace it with {PLATFORM_NAME}&apos;s
          actual Privacy Policy -- reviewed by counsel -- describing what
          data is collected and how it is used.
        </p>
      </div>
    </main>
  );
}