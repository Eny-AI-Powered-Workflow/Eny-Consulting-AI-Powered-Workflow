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

// Maps each dashboard module to the permission that unlocks it.
// Add a row here whenever a new module ships -- nothing else changes.
export const MODULES = [
  { key: "leads", label: "Leads", permission: "leads:read" },
  { key: "pipeline", label: "Pipeline", permission: "pipeline:read" },
  { key: "agents", label: "Agents", permission: "agents:trigger" },
] as const;
