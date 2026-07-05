// /home/obed/Documents/Eny_consulting/frontend/components/AccessBadge.tsx
import type { UserContext } from "@/lib/permissions";

/**
 * The one recurring signature element in this design: a keycard-style badge
 * that makes the RBAC layer visible instead of invisible plumbing. Compact
 * in the sidebar (identity only), expanded on the dashboard home (full
 * permission list). Same component, same visual language, two densities.
 */
export function AccessBadge({
  user,
  expanded = false,
}: {
  user: UserContext;
  expanded?: boolean;
}) {
  const role = user.roles[0] ?? "unassigned";
  const isElevated = role === "ceo";

  return (
    <div
      className={
        expanded
          ? "rounded-lg border border-slate/15 bg-white p-5"
          : "rounded-md border border-white/10 bg-ink-soft p-3"
      }
    >
      <div className="flex items-center justify-between border-b border-dashed border-slate/25 pb-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${isElevated ? "bg-brass" : "bg-slate"}`}
        />
        <span
          className={`font-mono text-[10px] uppercase tracking-wider ${
            expanded ? "text-slate/70" : "text-paper/50"
          }`}
        >
          Access badge
        </span>
      </div>

      <p
        className={`mt-2 truncate font-mono text-sm ${
          expanded ? "text-ink" : "text-paper"
        }`}
      >
        {user.email}
      </p>
      <p
        className={`font-mono text-[11px] uppercase tracking-wider ${
          isElevated ? "text-brass" : "text-slate"
        }`}
      >
        {role.replace("_", " ")}
      </p>

      {expanded && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {user.permissions.map((p) => (
            <span
              key={p}
              className="rounded border border-slate/20 bg-paper px-1.5 py-0.5 font-mono text-[10px] text-slate"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}