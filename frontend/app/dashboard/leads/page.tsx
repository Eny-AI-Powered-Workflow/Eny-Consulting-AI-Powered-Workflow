// /home/obed/Documents/Eny_consulting/frontend/app/dashboard/leads/page.tsx
import { getAccessToken } from "@/lib/session";

type Contact = { id: string; name: string; email: string; tags: string[] };

export default async function LeadsPage() {
  const token = await getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/leads`, {
    headers: { Authorization: `Bearer ${token ?? ""}` },
    cache: "no-store",
  });

  if (res.status === 403) {
    return (
      <div className="max-w-md rounded-lg border border-signal-red/30 bg-signal-red/5 p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-signal-red">
          Access denied
        </p>
        <p className="mt-1 text-sm text-ink">
          Your access badge doesn&apos;t include leads:read.
        </p>
      </div>
    );
  }

  const data: { contacts: Contact[]; meta?: { mock?: boolean } } = await res.json();

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">Leads</p>
      <h1 className="mt-2 text-2xl font-medium text-ink">Pipeline contacts</h1>

      {data.meta?.mock && (
        <div className="mt-4 rounded-lg border border-dashed border-brass/40 bg-brass/5 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-brass">
            Sample data
          </p>
          <p className="mt-1 text-sm text-slate">
            GoHighLevel isn&apos;t connected yet -- this is fixture data so the
            RBAC layer can be tested end to end. Set GHL_API_KEY to switch to
            live leads.
          </p>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-slate/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate/15 text-slate">
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider">
                Tags
              </th>
            </tr>
          </thead>
          <tbody>
            {data.contacts?.map((c) => (
              <tr key={c.id} className="border-b border-slate/10 last:border-0">
                <td className="px-4 py-3 text-ink">{c.name}</td>
                <td className="px-4 py-3 text-slate">{c.email}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-slate/20 px-1.5 py-0.5 font-mono text-[10px] text-slate"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}