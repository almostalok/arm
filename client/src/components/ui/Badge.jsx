import React from "react";
import { cn } from "../../lib/utils";

const toneMap = {
  default: "bg-zinc-800 text-zinc-300 border-zinc-700/60",
  zinc: "bg-zinc-800 text-zinc-300 border-zinc-700/60",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cobalt: "bg-blue-600/15 text-blue-300 border-blue-500/30",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  // backwards compatibility mappings
  indigo: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  violet: "bg-zinc-800 text-zinc-300 border-zinc-700/60",
};

export function Badge({ className, tone = "default", dot, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium tracking-normal select-none",
        toneMap[tone] || toneMap.default,
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dot)} />}
      {children}
    </span>
  );
}
