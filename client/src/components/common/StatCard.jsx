import React from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { SpotlightCard } from "../ui/SpotlightCard";
import { NumberTicker } from "../ui/NumberTicker";
import { cn } from "../../lib/utils";

export function StatCard({ label, value, numericValue, prefix = "", suffix = "", icon: Icon, trend, accent = false, className = "" }) {
  const positive = trend == null || trend >= 0;

  return (
    <SpotlightCard
      className={cn(
        "p-5 transition-all duration-300 relative overflow-hidden group",
        accent
          ? "bg-gradient-to-br from-indigo-900/80 via-slate-900/90 to-violet-950/80 border-indigo-500/40 shadow-indigo-950/50"
          : "bg-slate-900/60 border-slate-800/80",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border shadow-inner transition-transform duration-200 group-hover:scale-105",
            accent
              ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
              : "bg-slate-800/80 text-indigo-400 border-slate-700/60"
          )}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        {trend != null && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
              positive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {positive ? "+" : ""}{trend}%
          </span>
        )}
      </div>

      <div className="mt-4">
        {numericValue !== undefined ? (
          <NumberTicker
            value={numericValue}
            prefix={prefix}
            suffix={suffix}
            className={cn(
              "text-2xl font-bold tracking-tight font-display",
              accent ? "text-white drop-shadow-sm" : "text-white"
            )}
          />
        ) : (
          <p
            className={cn(
              "text-2xl font-bold tracking-tight font-display",
              accent ? "text-white drop-shadow-sm" : "text-white"
            )}
          >
            {value}
          </p>
        )}
        <p className="mt-1 text-xs font-medium text-slate-400">
          {label}
        </p>
      </div>
    </SpotlightCard>
  );
}
