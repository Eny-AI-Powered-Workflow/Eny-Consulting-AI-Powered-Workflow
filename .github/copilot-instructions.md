<!-- /home/obed/Documents/Eny_consulting/.github/copilot-instructions.md -->
# ENY Consulting Platform — AI Agent Instructions

This file is context for any AI coding tool working in this repo (Claude Code,
GitHub Copilot, Cursor, etc). Read this before writing or editing any code.
A copy of this file lives at `.github/copilot-instructions.md` for tools that
look there instead — keep both in sync if you edit one.

## What this project is

A single, unified platform for ENY Consulting Inc. replacing the plan of
building 18+ separate apps/URLs (one per department/agent). Instead: one
login, one RBAC (role-based access control) layer, and every "tool" or
"agent" mounts as a permission-gated module inside one dashboard.

Full business context lives in the AI Transformation Developer Execution
Brief (department agent specs, naming convention, roadmap). If you need to
know *what* an agent should do, check that doc. This file tells you *how*
to build anything in this codebase correctly.

## Stack

- Backend: FastAPI (Python), SQLAlchemy 2.0, Postgres via Supabase
- Frontend: Next.js (App Router), TypeScript, Supabase Auth
- Orchestration: n8n (self-hosted) — runs multi-step agent workflows
- CRM / system of record for leads and pipeline: GoHighLevel (GHL) — external,
  never replicated locally
- AI: Claude API via `app/services/claude_service.py`

## Non-negotiable architectural rules

These are not style preferences. Violating any of these breaks the whole
point of the RBAC platform. If a task seems to require breaking one of
these, stop and flag it instead of working around it.

1. **RBAC is data, not code.** Every protected route must use
   `Depends(require_permission("scope:name"))` from `app/api/deps.py`.
   Never write an inline `if user.role == "ceo"` check in a route handler.
   New role or permission → insert a row in the Supabase migration, do not
   touch `deps.py`.

2. **GHL is the system of record for leads, contacts, and pipeline.** Never
   create a local table that duplicates what GHL already stores. All access
   goes through `app/services/ghl_service.py`. If a feature seems to need a
   "leads" table of its own, that's a signal to re-check this rule, not a
   green light to add one.

3. **n8n owns automation logic; FastAPI owns permission logic.** The gateway
   decides *who* can trigger a workflow. n8n decides *what happens* once
   triggered. Never put a permission check inside an n8n workflow, and never
   call an n8n webhook directly from the frontend — always go through
   `POST /api/v1/agents/trigger/{workflow_name}`.

4. **Every permission check writes an audit log row, pass or fail.** This is
   already handled inside `require_permission()` — do not add a new
   protected route that bypasses this dependency to "save a query."

5. **All Claude/AI calls go through `app/services/claude_service.py`,**
   scoped by `role_context` (the caller's department-filtered retrieval
   slice). Do not instantiate the Anthropic client directly inside a route
   or a script.

6. **Secrets only via environment variables.** Never hardcode an API key,
   token, or connection string, even temporarily "to test." Add new required
   secrets to both `.env.example` and `.env.local.example` with a placeholder
   value, and to `README.md` if setup steps change.

## Directory map

```
backend/app/core/     → settings + JWT verification (rarely edited)
backend/app/db/       → SQLAlchemy engine/session (rarely edited)
backend/app/models/   → RBAC + audit tables (edit only via a migration first)
backend/app/api/deps.py        → get_current_user, require_permission — the enforcement point
backend/app/api/v1/endpoints/  → one file per resource/module, thin route handlers only
backend/app/services/          → external system clients (GHL, n8n, Claude) — business logic lives here, not in routes
frontend/lib/permissions.ts    → MODULES array driving what nav items render per role
frontend/app/dashboard/        → the shell; new modules get a route here
supabase/migrations/           → source of truth for roles/permissions/RLS — edit before touching models
workflows/                     → exported n8n workflow JSON + webhook-path registry
```

## How to add a new module or agent (follow this order)

1. Add the permission scope to `supabase/migrations/000X_*.sql` (new
   migration file, don't edit `0001_init_rbac.sql` after it's applied) and
   assign it to the relevant role(s) in `role_permissions`.
2. Add the SQLAlchemy model if new data needs to live in Postgres (not if
   the data already lives in GHL — see rule 2).
3. Add the endpoint under `backend/app/api/v1/endpoints/`, protected with
   `Depends(require_permission("your:scope"))`. Keep the handler thin —
   delegate real work to a service.
4. Register the router in `backend/app/api/v1/router.py`.
5. If it needs multi-step automation, build the workflow in n8n, export the
   JSON into `/workflows`, and add a row to `workflows/README.md` with its
   webhook path.
6. Add a module entry to `frontend/lib/permissions.ts` `MODULES` array so
   the dashboard nav picks it up automatically — don't hand-write role
   checks in a component.
7. Name agents and workflows using the org's convention:
   `ENY-[DEPT]-[FUNCTION]` (e.g. `ENY-SALES-SCORE`).

## Coding standards

**Python**: type hints everywhere, SQLAlchemy 2.0 `Mapped[]` style (see
existing models for the pattern), `async def` for anything calling an
external service (GHL, n8n, Claude), docstrings on service methods stating
which external system they touch and why the boundary exists.

**TypeScript**: App Router, Server Components by default, `"use client"`
only where interactivity requires it. Client-side `can()` checks from
`lib/permissions.ts` are for UI rendering only — they are never the actual
security boundary. The backend's `require_permission` is the boundary;
never assume a hidden button means the route is actually protected.

## File header convention

Every file's first line is a comment with its full intended path, e.g.:

```python
# /home/obed/Documents/Eny_consulting/backend/app/main.py
```

Preserve this when editing a file. Add it to any new file you create,
matching the path it will actually live at in this repo.

## What NOT to do

- Don't build a new "leads" or "contacts" table — GHL already is one.
- Don't add a role check anywhere except through `require_permission`.
- Don't call n8n or Claude directly from a route handler — go through the
  matching service in `app/services/`.
- Don't skip the audit log on a new protected route.
- Don't invent a permission scope that isn't in the Supabase migration.
- Don't commit `.env` or `.env.local`.

## Local setup

See `README.md` at the repo root for the exact run commands (backend,
frontend, n8n, and applying the Supabase migration).
