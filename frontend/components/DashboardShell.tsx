// /home/obed/Documents/Eny_consulting/frontend/components/DashboardShell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { UserContext } from "@/lib/permissions";

type DashboardModule = {
  key: string;
  label: string;
  permission: string;
  href: string;
  icon: string;
};

type HelpCard = {
  title: string;
  bullets: string[];
};

const HELP_CARDS: Record<string, HelpCard> = {
  dashboard: {
    title: "Welcome to Your Dashboard",
    bullets: [
      "1.📊 Your Dashboard shows your pipeline value, hot leads, pitches sent, and meetings booked this week.",
      "2.✅ \"Today's Actions\" lists tasks due today — check them off as you go.",
      "3.🔥 \"Leads Heating Up\" shows contacts who are engaging with your outreach.",
    ],
  },
  pipeline: {
    title: "How to Use Your Pipeline",
    bullets: [
      "1.🗂 The Pipeline is a Kanban board — drag leads across stages as deals progress.",
      "2.📌 Each card shows the lead name, company, and deal size estimate.",
      "3.🎯 Move a lead forward when you complete an action (e.g., sent a proposal → \"Proposal Sent\").",
      "4.💰 Your pipeline value updates automatically based on leads in proposal stages.",
    ],
  },
  leads: {
    title: "How to Use Leads",
    bullets: [
      "1.➕ Click \"Add Lead\" to manually add a new contact to your CRM.",
      "2.📤 Use \"Import CSV\" to bulk upload leads from Apollo or another source.",
      "3.🇪🇺 Check \"Remove EU Leads\" during CSV upload to filter out GDPR-protected regions.",
      "4.🔍 Search and filter by stage, vertical, or temperature to find the right contacts.",
      "5.👆 Click any lead row to open their full profile and manage your relationship.",
    ],
  },
  lists: {
    title: "How to Use Lists",
    bullets: [
      "1.📋 Lists let you group leads into segments (e.g., \"Hot Corporate Leads\", \"Podcast Targets\").",
      "2.➕ Create a new list and give it a name and color.",
      "3.✅ Go to the Leads page, select contacts, and add them to a list.",
      "4.🎯 Use lists to organize bulk outreach campaigns.",
    ],
  },
  sequences: {
    title: "How to Use Sequences",
    bullets: [
      "1.🔄 Sequences are automated email campaigns that send follow-ups at scheduled intervals.",
      "2.⚠️ You must add your mailing address in Settings first — CAN-SPAM law requires it on every automated email.",
      "3.➕ Create a sequence by defining steps: Cold Email → Follow Up 1 → Follow Up 2, etc.",
      "4.📅 Set wait days between steps (e.g., 3 days after cold email, send first follow-up).",
      "5.👥 Enroll leads into sequences from the Leads page — they'll receive emails automatically.",
      "6.⏸ Pause or stop sequences anytime if a lead replies or wants to opt out.",
    ],
  },
  "pitch-drafter": {
    title: "How to Use Pitch Drafter",
    bullets: [
      "1.⚠️ First, add your mailing address in Settings — it's required by CAN-SPAM law before you can send any emails.",
      "2.✍️ Select a lead and Penny (your AI coach) will research them from the web.",
      "3.🎨 Choose a pitch type and framework — Penny drafts a personalized email.",
      "4.📝 Review the coaching notes and personalization score before sending.",
      "5.📧 Click \"Send Email\" to deliver directly, or save as a draft to edit first.",
    ],
  },
  templates: {
    title: "How to Use Templates",
    bullets: [
      "1.📄 Templates are reusable email frameworks you can apply to any lead.",
      "2.➕ Create templates for cold outreach, follow-ups, proposals, and more.",
      "3.🔖 Use {variables} like {first_name} and {company} for personalization.",
      "4.📊 Track open rates over time to see which templates perform best.",
    ],
  },
  tasks: {
    title: "How to Use Tasks",
    bullets: [
      "1.✅ Tasks let you capture follow-up work, calls, and deliverables in one place.",
      "2.🗓 Add due dates so your high-priority actions stay visible all week.",
      "3.📌 Link tasks to specific leads or deals so nothing slips between conversations.",
      "4.🔔 Mark tasks complete when you're done, and use the Dashboard to stay on top of today's workload.",
    ],
  },
  inbox: {
    title: "How to Use Inbox",
    bullets: [
      "1.📥 Inbox collects messages and replies from prospects in one central place.",
      "2.📨 Use filters to surface unread, star, or follow-up messages.",
      "3.⚡ Reply directly from the CRM so your outreach stays in context.",
      "4.🧭 Link inbox items to leads and sequences for faster handoffs.",
    ],
  },
  settings: {
    title: "How to Use Settings",
    bullets: [
      "1.👤 Add your speaker profile so we can personalize pitches for you.",
      "2.🏠 Add your physical mailing address — required by CAN-SPAM law for every commercial email you send.",
      "3.📧 Connect your email provider (Resend or Gmail) to send pitches directly from the CRM.",
      "4.🔑 API Keys tab: Add your Perplexity API key (required for Speaking Scout). Add your Apollo API key (optional — unlocks unlimited searches + auto-finds contact emails).",
      "5.🔔 Configure SMS notifications via Twilio to get alerts on hot leads.",
    ],
  },
  tutorials: {
    title: "How to Use Tutorials",
    bullets: [
      "1.🎓 Tutorials walk you through every part of the platform step by step.",
      "2.📌 Follow the quick start guides to set up leads, sequences, and pitch campaigns.",
      "3.🧠 Return anytime to refresh on best practices or new features.",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    bullets: [
      "1.❓ Find quick answers to common platform questions.",
      "2.🛠 Check the FAQ before reaching out for support.",
      "3.📘 Use the glossary to understand terms like pipeline, sequence, and ROI.",
    ],
  },
  "assign-role": {
    title: "How to Use Assign Role",
    bullets: [
      "1.👑 Assign roles to staff members from the existing role list.",
      "2.🔄 Unassign a role to remove access in real time.",
      "3.🧑‍💼 A role change updates the individual's dashboard modules and permissions.",
      "4.🛡 Use this page only when you are sure the staff member needs additional access.",
    ],
  },
};

const DashboardShell = ({
  user,
  modules,
  children,
}: {
  user: UserContext | null;
  modules: DashboardModule[];
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const currentKey = useMemo(() => {
    const exact = modules.find((module) => module.href === pathname);
    if (exact) return exact.key;
    if (pathname === "/dashboard") return "dashboard";
    const prefix = modules.find((module) => pathname.startsWith(module.href + "/"));
    return exact?.key ?? prefix?.key ?? "dashboard";
  }, [modules, pathname]);

  const selectedModule = modules.find((module) => module.key === currentKey) ?? modules[0];
  const helpCard = HELP_CARDS[selectedModule.key];

  useEffect(() => {
    setDismissed(false);
  }, [currentKey]);

  return (
    <div className="flex min-h-screen bg-paper text-slate">
      <aside
        className={`flex flex-col border-r border-white/10 bg-ink/95 text-paper transition-all duration-200 ${
          expanded ? "w-72 px-5 py-6" : "w-20 px-2 py-5"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brass/10 text-base text-brass">
              ⚡
            </div>
            {expanded && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60">
                  ENY
                </p>
                <p className="mt-1 text-sm font-semibold text-paper">Platform</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-paper transition hover:bg-white/10"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? "←" : "→"}
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          {modules.map((module) => {
            const isActive = pathname === module.href;
            return (
              <Link
                key={module.key}
                href={module.href}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition hover:bg-white/10 hover:text-white ${
                  isActive ? "bg-white/10 text-white shadow-sm" : "text-white/80"
                }`}
                aria-label={module.label}
              >
                <span className="inline-flex h-9 w-9 min-w-[36px] items-center justify-center rounded-2xl bg-white/5 text-base">
                  {module.icon}
                </span>
                {expanded && <span className="truncate">{module.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/80">
            <p className="truncate font-medium text-white">{user?.email ?? "No user signed in"}</p>
            <p className="mt-1 uppercase tracking-[0.18em] text-white/60">
              {user?.roles[0]?.replace("_", " ") ?? "No role"}
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 px-10 py-8">
        {helpCard && !dismissed && (
          <div className="mb-6 rounded-3xl border border-slate/20 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate/500">
                  Quick start
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-ink">{helpCard.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="rounded-full bg-ink px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-ink-dark"
              >
                Got it! Let&apos;s go
              </button>
            </div>

            <ol className="mt-5 space-y-3 text-sm leading-6 text-slate">
              {helpCard.bullets.map((bullet, index) => (
                <li key={index} className="flex gap-3 rounded-2xl border border-slate/10 bg-paper/80 p-3">
                  <span className="font-mono text-sm text-brass">{bullet.slice(0, 2)}</span>
                  <span>{bullet.slice(2)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {children}
      </main>
    </div>
  );
};

export default DashboardShell;
