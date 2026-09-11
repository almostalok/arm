import React from "react";
import { cn, initials } from "../../lib/utils";

const palette = [
  "from-indigo-600 to-violet-700 text-white border-indigo-400/30",
  "from-sky-600 to-blue-700 text-white border-sky-400/30",
  "from-emerald-600 to-teal-700 text-white border-emerald-400/30",
  "from-amber-600 to-orange-700 text-white border-amber-400/30",
  "from-rose-600 to-pink-700 text-white border-rose-400/30",
  "from-violet-600 to-fuchsia-700 text-white border-violet-400/30",
  "from-cyan-600 to-teal-700 text-white border-cyan-400/30",
];

function colorFor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-xs font-semibold",
  lg: "h-11 w-11 text-sm font-bold",
  xl: "h-14 w-14 text-base font-bold",
};

export function Avatar({ name = "", src, size = "md", status, className }) {
  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-display overflow-hidden shrink-0 shadow-sm border",
          sizes[size],
          !src && `bg-gradient-to-br ${colorFor(name)}`,
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
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-slate-950",
            status === "online" && "bg-emerald-400",
            status === "busy" && "bg-rose-400",
            status === "away" && "bg-amber-400"
          )}
        />
      )}
    </div>
  );
}
