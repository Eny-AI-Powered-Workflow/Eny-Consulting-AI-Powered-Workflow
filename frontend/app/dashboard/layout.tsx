// /home/obed/Documents/Eny_consulting/frontend/app/dashboard/layout.tsx
import { MODULES, can, type UserContext } from "@/lib/permissions";
import { getAccessToken } from "@/lib/session";
import { AccessBadge } from "@/components/AccessBadge";

async function fetchCurrentUser(token: string | null): Promise<UserContext | null> {
  // Calls the FastAPI gateway's /auth/me, which returns roles + permissions
  // derived from the RBAC tables. The frontend never decides permissions itself.
  if (!token) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = await getAccessToken();
  const user = await fetchCurrentUser(token);
  const visibleModules = MODULES.filter((m) => can(user, m.permission));

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col justify-between bg-ink px-5 py-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
            Eny / Ops
          </p>

          {user && (
            <div className="mt-4">
              <AccessBadge user={user} />
            </div>
          )}

          <nav className="mt-8 flex flex-col gap-1">
            {visibleModules.map((m) => (
              <a
                key={m.key}
                href={`/dashboard/${m.key}`}
                className="group flex items-center justify-between rounded px-2 py-2 text-sm text-paper/80 transition hover:bg-ink-soft hover:text-paper"
              >
                <span>{m.label}</span>
                <span className="font-mono text-[10px] text-paper/30 transition group-hover:text-brass">
                  {m.permission}
                </span>
              </a>
            ))}
          </nav>
        </div>

        <a
          href="/dashboard"
          className="font-mono text-[10px] uppercase tracking-wider text-paper/30 transition hover:text-paper/60"
        >
          Overview
        </a>
      </aside>

      <main className="flex-1 bg-paper px-10 py-8">{children}</main>
    </div>
  );
}