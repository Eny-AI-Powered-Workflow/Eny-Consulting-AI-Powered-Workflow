// /home/obed/Documents/Eny_consulting/frontend/lib/permissions.ts
export type UserContext = {
  user_id: string;
  email: string | null;
  roles: string[];
  permissions: string[];
};

export function can(user: UserContext | null, scope: string): boolean {
  return !!user?.permissions.includes(scope);
}

export type DashboardModule = {
  key: string;
  label: string;
  permission: string;
  href: string;
  icon: string;
};

// Maps each dashboard module to the permission that unlocks it.
// The sidebar still renders every module for navigation, while the
// dashboard home and role checks can still use permissions for metrics.
export const MODULES: DashboardModule[] = [
  { key: "dashboard", label: "Dashboard", permission: "dashboard:view", href: "/dashboard", icon: "🏠" },
  { key: "pipeline", label: "Pipeline", permission: "pipeline:read", href: "/dashboard/pipeline", icon: "🗂" },
  { key: "leads", label: "Leads", permission: "leads:read", href: "/dashboard/leads", icon: "📇" },
  { key: "lists", label: "Lists", permission: "lists:read", href: "/dashboard/lists", icon: "📋" },
  { key: "sequences", label: "Sequences", permission: "sequences:read", href: "/dashboard/sequences", icon: "🔄" },
  { key: "pitch-drafter", label: "Pitch Drafter", permission: "pitch_drafter:use", href: "/dashboard/pitch-drafter", icon: "✍️" },
  { key: "templates", label: "Templates", permission: "templates:read", href: "/dashboard/templates", icon: "📄" },
  { key: "tasks", label: "Tasks", permission: "tasks:read", href: "/dashboard/tasks", icon: "🗓" },
  { key: "inbox", label: "Inbox", permission: "inbox:read", href: "/dashboard/inbox", icon: "📥" },
  { key: "settings", label: "Settings", permission: "settings:read", href: "/dashboard/settings", icon: "⚙️" },
  { key: "tutorials", label: "Tutorials", permission: "tutorials:read", href: "/dashboard/tutorials", icon: "🎓" },
  { key: "faq", label: "FAQ", permission: "faq:read", href: "/dashboard/faq", icon: "❓" },
  { key: "assign-role", label: "Assign Role", permission: "roles:assign", href: "/dashboard/assign-role", icon: "👥" },
];
