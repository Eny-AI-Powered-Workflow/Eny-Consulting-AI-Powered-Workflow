// /home/obed/Documents/Eny_consulting/frontend/app/dashboard/page.tsx
import { AccessBadge } from "@/components/AccessBadge";
import { getAccessToken } from "@/lib/session";
import type { UserContext } from "@/lib/permissions";

async function fetchCurrentUser(token: string | null): Promise<UserContext | null> {
  if (!token) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardHome() {
  const token = await getAccessToken();
  const user = await fetchCurrentUser(token);

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">Overview</p>
      <h1 className="mt-2 text-2xl font-medium text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-slate">
        This console renders only the modules your access badge permits.
      </p>

      {user && (
        <div className="mt-6 max-w-sm">
          <AccessBadge user={user} expanded />
        </div>
      )}
    </div>
  );
}