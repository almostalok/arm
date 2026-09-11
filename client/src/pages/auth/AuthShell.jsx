import React from "react";
import { TrendingUp, ShieldCheck, Zap, Layers, BarChart3 } from "lucide-react";
import { Logo } from "../../components/ui";

export function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Brand / Marketing Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-12 text-white lg:flex border-r border-slate-800">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <Logo size="lg" />
        </div>

        <div className="relative max-w-lg">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            Next-Gen Revenue Stack
          </span>
          <h2 className="font-display text-3xl font-extrabold leading-tight mt-3 text-white">
            High-velocity deal pipeline & relationship management.
          </h2>
          <p className="mt-3 text-xs text-slate-400 leading-relaxed">
            ARM unifies your deals, decision makers, and outreach playbooks into a single high-performance workspace engineered for growth founders and sales leaders.
          </p>

          <div className="mt-8 space-y-3.5">
            {[
              { icon: Layers, text: "Drag-and-drop interactive deal pipeline & milestone tracking" },
              { icon: Zap, text: "Playbook outreach composer with dynamic merge tags" },
              { icon: BarChart3, text: "Quantitative lead scoring & account velocity analytics" },
              { icon: ShieldCheck, text: "Enterprise role permissions & encrypted session auth" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/80 text-indigo-400 border border-slate-700/60 shadow-inner">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-slate-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[11px] text-slate-500 font-mono">
          © {new Date().getFullYear()} ARM Technologies. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
