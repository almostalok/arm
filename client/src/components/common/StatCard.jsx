import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { SpotlightCard } from "../ui/SpotlightCard";
import { NumberTicker } from "../ui/NumberTicker";
import { cn } from "../../lib/utils";

export function StatCard({ label, value, numericValue, prefix = "", suffix = "", icon: Icon, trend, accent = false, className = "" }) {
  const positive = trend == null || trend >= 0;

  return (
    <SpotlightCard
      className={cn(
        "p-4 transition-colors relative overflow-hidden group",
        accent
          ? "bg-zinc-900 border-zinc-700/80 shadow-md"
          : "bg-zinc-900/70 border-zinc-800",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border",
            accent
              ? "bg-blue-600/15 text-blue-400 border-blue-500/30"
              : "bg-zinc-800 text-zinc-300 border-zinc-700/60"
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
        </div>
        {trend != null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-medium border",
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

      <div className="mt-3">
        {numericValue !== undefined ? (
          <NumberTicker
            value={numericValue}
            prefix={prefix}
            suffix={suffix}
            className="text-xl font-semibold tracking-tight text-zinc-100 font-sans"
          />
        ) : (
          <p className="text-xl font-semibold tracking-tight text-zinc-100 font-sans">
            {value}
          </p>
        )}
        <p className="mt-0.5 text-xs font-normal text-zinc-400">
          {label}
        </p>
      </div>
    </SpotlightCard>
  );
}
