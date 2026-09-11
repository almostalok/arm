import React from "react";

const variants = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    glow: "bg-emerald-400/30",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    dot: "bg-indigo-400",
    glow: "bg-indigo-400/30",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
    glow: "bg-amber-400/30",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
    glow: "bg-rose-400/30",
  },
  sky: {
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
    dot: "bg-sky-400",
    glow: "bg-sky-400/30",
  },
  slate: {
    bg: "bg-slate-800/60",
    text: "text-slate-300",
    border: "border-slate-700/60",
    dot: "bg-slate-400",
    glow: "bg-slate-400/20",
  },
};

export function StatusPill({
  children,
  variant = "indigo",
  pulse = true,
  size = "sm",
  className = "",
}) {
  const v = variants[variant] || variants.indigo;
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${v.bg} ${v.text} ${v.border} ${
        isSm ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${v.glow}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${v.dot}`} />
      </span>
      <span>{children}</span>
    </span>
  );
}
