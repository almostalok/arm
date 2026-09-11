import React from "react";
import { cn } from "../../lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-800/80 border border-slate-700/30",
        className
      )}
      {...props}
    />
  );
}
