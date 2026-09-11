import React from "react";
import { ArrowUpRight } from "lucide-react";
import { SpotlightCard } from "../ui/SpotlightCard";
import { NumberTicker } from "../ui/NumberTicker";
import { Link } from "react-router-dom";

export function HeroCard({ value = 0, label = "Active Pipeline Volume", target = 1000000 }) {
  const percent = Math.min(100, Math.round((value / target) * 100));

  return (
    <SpotlightCard className="p-5 relative overflow-hidden bg-zinc-900/80 border-zinc-800">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
              REVENUE DESK
            </span>
            <span className="text-xs text-zinc-400">Q3 Target</span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-100 mt-1 font-sans">Enterprise Pipeline</h3>
        </div>

        <Link
          to="/pipeline"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-750 bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Surface */}
      <div className="relative mt-3.5 overflow-hidden rounded-lg p-4 text-zinc-100 bg-zinc-950 border border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-medium tracking-wider text-zinc-400">
            METRIC ENGINE
          </span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE PACING</span>
          </div>
        </div>

        <p className="mt-3 text-xs text-zinc-400">{label}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <NumberTicker
            value={value}
            prefix="$"
            className="text-2xl font-semibold text-zinc-100 font-sans tracking-tight"
          />
        </div>

        {/* Quota Progress Bar */}
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-zinc-400">Pacing: {percent}%</span>
            <span className="text-zinc-300 font-medium">Target: $1.0M</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
