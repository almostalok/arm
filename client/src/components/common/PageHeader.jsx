import React from "react";

export function PageHeader({ title, subtitle, badge, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 ${className}`}>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-400 max-w-xl">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2.5 flex-wrap">{children}</div>}
    </div>
  );
}
