import React from "react";
import { cn, initials } from "../../lib/utils";

const palette = [
  "bg-zinc-800 text-zinc-200 border-zinc-700",
  "bg-blue-950/80 text-blue-200 border-blue-800/60",
  "bg-emerald-950/80 text-emerald-200 border-emerald-800/60",
  "bg-amber-950/80 text-amber-200 border-amber-800/60",
  "bg-slate-800 text-slate-200 border-slate-700",
  "bg-zinc-800 text-zinc-300 border-zinc-700",
];

function colorFor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7.5 w-7.5 text-xs",
  md: "h-8.5 w-8.5 text-xs font-medium",
  lg: "h-10 w-10 text-sm font-semibold",
  xl: "h-12 w-12 text-base font-semibold",
};

export function Avatar({ name = "", src, size = "md", status, className }) {
  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-lg overflow-hidden shrink-0 shadow-sm border select-none font-sans",
          sizes[size],
          !src && colorFor(name),
          className
        )}
        title={name}
      >
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          initials(name) || "?"
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-zinc-950",
            status === "online" && "bg-emerald-500",
            status === "busy" && "bg-rose-500",
            status === "away" && "bg-amber-500"
          )}
        />
      )}
    </div>
  );
}
