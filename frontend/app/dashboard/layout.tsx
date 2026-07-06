// /home/obed/Documents/Eny_consulting/frontend/app/dashboard/layout.tsx
import { MODULES, type DashboardModule, type UserContext } from "@/lib/permissions";
import { getAccessToken } from "@/lib/session";
import DashboardShell from "@/components/DashboardShell";

async function fetchCurrentUser(token: string | null): Promise<UserContext | null> {
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
  const modules: DashboardModule[] = user?.roles.includes("ceo")
    ? MODULES
    : MODULES.filter((module) => module.key !== "assign-role");

  return <DashboardShell user={user} modules={modules}>{children}</DashboardShell>;
}
