import React from "react";
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatusPill, Button, NumberTicker } from "../ui";

export function LeadScoringCard({
  score = 88,
  buyingStage = "Evaluation",
  signals = [
    "Executive sponsor engaged during pricing call",
    "Security & compliance review packet delivered",
    "3 platform trial users active in the last 48 hours",
  ],
  risks = [
    "Proposal has been in review for 12 days (SLA: 14 days)",
  ],
  nextAction = "Schedule executive closing review with VP Sales",
  onActionClick,
  className = "",
}) {
  const getHealthTone = (s) => {
    if (s >= 75) return { variant: "emerald", label: "High Velocity" };
    if (s >= 50) return { variant: "amber", label: "Moderate Pace" };
    return { variant: "rose", label: "At Risk" };
  };

  const health = getHealthTone(score);

  return (
    <Card className={`border-slate-800/80 bg-slate-900/60 backdrop-blur-xl ${className}`}>
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Deal Radar & Health Scoring</CardTitle>
              <p className="text-xs text-slate-400">Quantitative conversion & velocity analytics</p>
            </div>
          </div>
          <StatusPill variant={health.variant} size="sm">
            {health.label}
          </StatusPill>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1 space-y-4">
        {/* Score Metric Row */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Health Score
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <NumberTicker value={score} className="text-2xl text-white font-display" />
              <span className="text-xs text-slate-500 font-mono">/100</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Buying Stage
            </span>
            <div className="text-sm font-semibold text-indigo-300 mt-1">
              {buyingStage}
            </div>
          </div>
        </div>

        {/* Buying Signals */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Positive Signals
          </span>
          <div className="space-y-1.5">
            {signals.map((sig, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        {risks.length > 0 && (
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Risk Radar
            </span>
            <div className="space-y-1.5">
              {risks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-300/90">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Recommended Playbook Action */}
        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
              Recommended Next Step
            </span>
            <p className="text-xs text-slate-200 font-medium mt-0.5">{nextAction}</p>
          </div>
          {onActionClick && (
            <Button
              size="xs"
              variant="primary"
              onClick={onActionClick}
              className="shrink-0"
            >
              Take Action
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
