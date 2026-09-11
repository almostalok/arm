import React from "react";
import { Inbox } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3.5 text-sm font-semibold text-white font-display">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
