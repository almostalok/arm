import React from "react";
import { cn } from "../../lib/utils";

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-zinc-900 border border-zinc-800 p-1 select-none",
        className
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              active
                ? "bg-zinc-800 text-zinc-100 border border-zinc-750 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
