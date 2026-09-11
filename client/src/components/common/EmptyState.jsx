import React from "react";
import { Inbox } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700/60 shadow-inner">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-100 font-sans">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-zinc-400 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
}
