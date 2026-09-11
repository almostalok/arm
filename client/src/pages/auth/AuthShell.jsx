import React from "react";
import { ShieldCheck, Mail, Layers, BarChart3 } from "lucide-react";
import { Logo } from "../../components/ui";

export function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-600/30 selection:text-blue-100 font-sans">
      {/* Brand / Marketing Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-zinc-900 p-12 text-zinc-100 lg:flex border-r border-zinc-800">
        <div className="relative">
          <Logo size="lg" />
        </div>

        <div className="relative max-w-md">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
            Enterprise Revenue Stack
          </span>
          <h2 className="text-2xl font-semibold leading-tight mt-3 text-zinc-100 font-sans tracking-tight">
            High-velocity deal pipeline & relationship management.
          </h2>
          <p className="mt-2.5 text-xs text-zinc-400 leading-relaxed">
            ARM unifies your deals, key stakeholders, and outreach playbooks into a single high-performance workspace engineered for growth founders and sales leaders.
          </p>

          <div className="mt-6 space-y-3">
            {[
              { icon: Layers, text: "Drag-and-drop interactive deal pipeline & milestone tracking" },
              { icon: Mail, text: "Playbook outreach composer with dynamic merge tags" },
              { icon: BarChart3, text: "Quantitative lead scoring & account velocity analytics" },
              { icon: ShieldCheck, text: "Enterprise role permissions & encrypted session auth" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/60 shrink-0">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs text-zinc-300 font-normal">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[11px] text-zinc-500 font-mono">
          © {new Date().getFullYear()} ARM Operations. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
