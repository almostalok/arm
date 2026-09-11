import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function Card({ className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-950/40 transition-all duration-200",
        hover && "hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-950/20 hover:-translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 p-5 pb-0", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-sm font-semibold tracking-tight text-white font-display", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-xs text-slate-400 mt-0.5", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  to,
  action,
  className,
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/90 text-indigo-400 border border-slate-700/60 shadow-inner">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-white font-display">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {action ??
        (to ? (
          <Link
            to={to}
            aria-label="Open"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white active:scale-95"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null)}
    </div>
  );
}
