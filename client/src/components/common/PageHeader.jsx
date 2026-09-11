import React from "react";

export function PageHeader({ title, subtitle, badge, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 ${className}`}>
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-100 font-sans">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="mt-0.5 text-xs text-zinc-400 max-w-xl">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}
