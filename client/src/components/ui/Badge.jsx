import React from "react";
import { cn } from "../../lib/utils";

const toneMap = {
  default: "bg-slate-800/80 text-slate-300 border-slate-700/60",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export function Badge({ className, tone = "default", dot, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-xs font-medium tracking-tight select-none",
        toneMap[tone] || toneMap.default,
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      {children}
    </span>
  );
}
