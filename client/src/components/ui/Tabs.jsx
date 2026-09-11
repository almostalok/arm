import React from "react";
import { cn } from "../../lib/utils";

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl bg-slate-900/90 border border-slate-800 p-1 select-none",
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
              "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              active
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
