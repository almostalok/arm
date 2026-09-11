import React from "react";
import { AlertTriangle, CheckCircle2, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatusPill, Button, NumberTicker } from "../ui";

export function LeadScoringCard({
  score = 88,
  buyingStage = "Evaluation",
  signals = [
    "Executive sponsor engaged during pricing review",
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
    <Card className={`border-zinc-800 bg-zinc-900/70 ${className}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Deal Radar & Qualification</CardTitle>
              <p className="text-xs text-zinc-400">Quantitative velocity & health indicators</p>
            </div>
          </div>
          <StatusPill variant={health.variant} size="sm">
            {health.label}
          </StatusPill>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-3.5">
        {/* Score Metric Row */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Health Score
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <NumberTicker value={score} className="text-xl font-semibold text-zinc-100 font-sans" />
              <span className="text-xs text-zinc-500 font-mono">/100</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
              Buying Stage
            </span>
            <div className="text-sm font-medium text-blue-400 mt-0.5">
              {buyingStage}
            </div>
          </div>
        </div>

        {/* Buying Signals */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono block mb-1.5">
            Positive Signals
          </span>
          <div className="space-y-1">
            {signals.map((sig, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{sig}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        {risks.length > 0 && (
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono block mb-1.5">
              Risk Radar
            </span>
            <div className="space-y-1">
              {risks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-300/90">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Recommended Action */}
        <div className="p-3 rounded-lg bg-zinc-800/80 border border-zinc-700/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
              Recommended Next Step
            </span>
            <p className="text-xs text-zinc-200 font-medium mt-0.5">{nextAction}</p>
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
