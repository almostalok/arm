/* Shared domain constants kept in one place so UI + filters stay in sync
   with the backend enums. */

export const LEAD_STAGES = ["New", "Qualified", "Proposal", "Won", "Lost"];

export const PIPELINE_STAGES = ["New", "Qualified", "Proposal", "Won", "Lost"];

export const LEAD_PRIORITIES = ["Low", "Medium", "High"];

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Cold Outreach",
  "Social",
  "Event",
  "Other",
];

export const TASK_STATUSES = ["Pending", "In Progress", "Completed"];
export const TASK_PRIORITIES = ["Low", "Medium", "High"];

/** Tailwind class tokens for each lead stage (dark zinc enterprise theme). */
export const STAGE_STYLES = {
  New: {
    dot: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    bar: "bg-blue-500",
  },
  Qualified: {
    dot: "bg-cyan-500",
    badge: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    bar: "bg-cyan-500",
  },
  Proposal: {
    dot: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    bar: "bg-amber-500",
  },
  Won: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    bar: "bg-emerald-500",
  },
  Lost: {
    dot: "bg-rose-500",
    badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    bar: "bg-rose-500",
  },
};

export const PRIORITY_STYLES = {
  Low: "bg-zinc-800 text-zinc-300 border border-zinc-700/60",
  Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  High: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
};

export const TASK_STATUS_STYLES = {
  Pending: "bg-zinc-800 text-zinc-300 border border-zinc-700/60",
  "In Progress": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};
