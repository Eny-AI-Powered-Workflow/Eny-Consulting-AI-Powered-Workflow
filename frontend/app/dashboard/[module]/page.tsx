// /home/obed/Documents/Eny_consulting/frontend/app/dashboard/[module]/page.tsx
import { notFound } from "next/navigation";
import { MODULES } from "@/lib/permissions";

export default function DashboardModulePage({ params }: { params: { module: string } }) {
  const moduleMeta = MODULES.find((m) => m.key === params.module);

  if (!moduleMeta) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
        {moduleMeta.label}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">{moduleMeta.label}</h1>
      <div className="mt-6 rounded-3xl border border-slate/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate">
          This section is the placeholder for the {moduleMeta.label} module. It will
          render the approved content for your role and show contextual guidance for the
          selected dashboard item.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate/10 bg-paper p-4">
            <p className="font-semibold text-ink">What you can do here</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate">
              <li>View and manage {moduleMeta.label.toLowerCase()} items.</li>
              <li>Use your access badge permission to unlock module actions.</li>
              <li>See data that reflects your role in the platform.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate/10 bg-paper p-4">
            <p className="font-semibold text-ink">Next step</p>
            <p className="mt-3 text-sm text-slate">
              Complete the module setup and return to the Dashboard to see your overall
              pipeline, leads, and tasks in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
