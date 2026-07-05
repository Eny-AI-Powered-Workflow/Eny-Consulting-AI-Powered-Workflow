// /home/obed/Documents/Eny_consulting/frontend/app/dashboard/pipeline/page.tsx
import { getAccessToken } from "@/lib/session";

type Stage = { name: string; count: number; value: number };

export default async function PipelinePage() {
  const token = await getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipeline`, {
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
          Your access badge doesn&apos;t include pipeline:read.
        </p>
      </div>
    );
  }

  const data: { stages: Stage[]; meta?: { mock?: boolean } } = await res.json();
  const maxCount = Math.max(...data.stages.map((s) => s.count), 1);

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">Pipeline</p>
      <h1 className="mt-2 text-2xl font-medium text-ink">Stage breakdown</h1>

      {data.meta?.mock && (
        <div className="mt-4 rounded-lg border border-dashed border-brass/40 bg-brass/5 px-4 py-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-brass">
            Sample data
          </p>
          <p className="mt-1 text-sm text-slate">
            GoHighLevel isn&apos;t connected yet -- showing fixture pipeline stages.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {data.stages.map((stage) => (
          <div key={stage.name} className="rounded-lg border border-slate/15 bg-white p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium text-ink">{stage.name}</p>
              <p className="font-mono text-xs text-slate">
                {stage.count} &middot; ${stage.value.toLocaleString()}
              </p>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-paper">
              <div
                className="h-1.5 rounded-full bg-brass"
                style={{ width: `${(stage.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}