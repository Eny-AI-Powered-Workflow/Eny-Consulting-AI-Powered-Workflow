// /home/obed/Documents/Eny_consulting/frontend/app/dashboard/page.tsx
import { AccessBadge } from "@/components/AccessBadge";
import { getAccessToken } from "@/lib/session";
import { MODULES, can, type UserContext } from "@/lib/permissions";

type Contact = { id: string; name: string; email: string; tags: string[] };
type Stage = { name: string; count: number; value: number };
type AuditEntry = {
  permission_scope: string;
  granted: boolean;
  path: string;
  created_at: string;
};

async function apiGet<T>(path: string, token: string | null): Promise<T | null> {
  if (!token) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

const CHECKLIST = [
  { label: "Confirm your access badge role is correct", done: true },
  { label: "Review which modules your role can see", done: true },
  { label: "Read the platform's terms and privacy policy", done: false },
  { label: "Trigger your first AI agent", done: false },
];

export default async function DashboardHome() {
  const token = await getAccessToken();
  const user = await apiGet<UserContext>("/api/v1/auth/me", token);
  const leads = await apiGet<{ contacts: Contact[] }>("/api/v1/leads", token);
  const pipeline = await apiGet<{ stages: Stage[] }>("/api/v1/pipeline", token);
  const activity = await apiGet<AuditEntry[]>("/api/v1/audit/me?limit=6", token);

  const leadCount = leads?.contacts.length ?? 0;
  const pipelineValue = pipeline?.stages.reduce((sum, s) => sum + s.value, 0) ?? 0;
  const permissionCount = user?.permissions.length ?? 0;
  const modulesUnlocked = MODULES.filter((m) => can(user, m.permission)).length;
  const checklistDone = CHECKLIST.filter((c) => c.done).length;

  return (
    <div className="max-w-4xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">Overview</p>
      <h1 className="mt-2 text-2xl font-medium text-ink">
        Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}.
      </h1>
      <p className="mt-1 text-sm text-slate">
        This console renders only the modules your access badge permits.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Leads in view" value={String(leadCount)} />
        <StatCard label="Pipeline value" value={`$${pipelineValue.toLocaleString()}`} />
        <StatCard label="Permissions" value={String(permissionCount)} />
        <StatCard label="Modules unlocked" value={`${modulesUnlocked} / ${MODULES.length}`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-slate/15 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink">Getting started</h2>
            <span className="font-mono text-[11px] text-slate">
              {Math.round((checklistDone / CHECKLIST.length) * 100)}%
            </span>
          </div>
          <div className="mt-3 h-1 rounded-full bg-paper">
            <div
              className="h-1 rounded-full bg-brass"
              style={{ width: `${(checklistDone / CHECKLIST.length) * 100}%` }}
            />
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {CHECKLIST.map((item) => (
              <li key={item.label} className="flex items-start gap-2.5 text-sm">
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    item.done ? "border-signal-green bg-signal-green/10" : "border-slate/30"
                  }`}
                >
                  {item.done && (
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5 fill-none stroke-signal-green stroke-[2]"
                    >
                      <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={item.done ? "text-slate line-through" : "text-ink"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {user && <AccessBadge user={user} expanded />}
      </div>

      <div className="mt-6 rounded-lg border border-slate/15 bg-white p-5">
        <h2 className="text-sm font-medium text-ink">Recent activity</h2>
        <p className="text-xs text-slate">Your last permission checks, granted or denied.</p>
        <div className="mt-4 flex flex-col divide-y divide-slate/10">
          {activity && activity.length > 0 ? (
            activity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      a.granted ? "bg-signal-green" : "bg-signal-red"
                    }`}
                  />
                  <span className="font-mono text-xs text-slate">{a.permission_scope}</span>
                  <span className="text-xs text-slate/60">{a.path}</span>
                </div>
                <span className="font-mono text-[11px] text-slate/50">
                  {new Date(a.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <p className="py-2.5 text-sm text-slate/60">No activity yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate/15 bg-white p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate">{label}</p>
      <p className="mt-2 text-xl font-medium text-ink">{value}</p>
    </div>
  );
}