import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/utils";

export function Card({ className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-900/70 shadow-sm transition-colors duration-150",
        hover && "hover:border-zinc-700 hover:bg-zinc-900/90",
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
      className={cn("text-sm font-semibold tracking-tight text-zinc-100", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-xs text-zinc-400 mt-0.5", className)} {...props} />
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
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60 shrink-0">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
          {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
        </div>
      </div>
      {action ??
        (to ? (
          <Link
            to={to}
            aria-label="Open"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ) : null)}
    </div>
  );
}
