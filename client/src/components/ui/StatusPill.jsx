import React from "react";

const variants = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
    glow: "bg-blue-400/30",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
    glow: "bg-emerald-400/30",
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
  slate: {
    bg: "bg-zinc-800",
    text: "text-zinc-300",
    border: "border-zinc-700/60",
    dot: "bg-zinc-400",
    glow: "bg-zinc-400/20",
  },
  // compatibility
  indigo: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
    glow: "bg-blue-400/30",
  },
};

export function StatusPill({
  children,
  variant = "blue",
  pulse = true,
  size = "sm",
  className = "",
}) {
  const v = variants[variant] || variants.blue;
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${v.bg} ${v.text} ${v.border} ${
        isSm ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${v.glow}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${v.dot}`} />
      </span>
      <span>{children}</span>
    </span>
  );
}
