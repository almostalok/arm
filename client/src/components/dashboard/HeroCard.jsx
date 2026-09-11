import React from "react";
import { ArrowUpRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { SpotlightCard } from "../ui/SpotlightCard";
import { NumberTicker } from "../ui/NumberTicker";
import { currency } from "../../lib/format";
import { Link } from "react-router-dom";

export function HeroCard({ value = 0, label = "Active Pipeline Volume", target = 1000000 }) {
  const percent = Math.min(100, Math.round((value / target) * 100));

  return (
    <SpotlightCard className="p-6 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
              REVENUE DESK
            </span>
            <span className="text-xs text-slate-400 font-medium">Q3 Target</span>
          </div>
          <h3 className="text-base font-bold text-white font-display mt-1">Enterprise Pipeline</h3>
        </div>

        <Link
          to="/pipeline"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-colors"
        >
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Titanium Card Surface */}
      <div className="relative mt-4 overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br from-indigo-900/90 via-slate-900/90 to-violet-950/90 border border-indigo-500/30 shadow-2xl shadow-indigo-950/60">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <span className="font-display text-sm font-extrabold tracking-wider text-indigo-200">
            ARM // METRIC ENGINE
          </span>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE PACING</span>
          </div>
        </div>

        <p className="relative mt-4 text-xs text-slate-400 font-medium">{label}</p>
        <div className="relative mt-1 flex items-baseline gap-2">
          <NumberTicker
            value={value}
            prefix="$"
            className="text-3xl font-extrabold text-white font-display tracking-tight"
          />
        </div>

        {/* Quota Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] font-mono">
            <span className="text-slate-400">Pacing: {percent}%</span>
            <span className="text-indigo-300">Target: $1.0M</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-950/80 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 transition-all duration-1000"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
