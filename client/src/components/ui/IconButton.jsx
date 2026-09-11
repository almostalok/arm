import React from "react";
import { cn } from "../../lib/utils";

export function IconButton({ className, variant = "outline", size = "md", children, ...props }) {
  const variants = {
    outline:
      "border border-slate-700/80 bg-slate-900/80 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800 shadow-sm",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/80",
    solid: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30",
    muted: "bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60",
    glass: "bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 backdrop-blur-md",
  };

  const sizes = {
    xs: "h-7 w-7 rounded-lg",
    sm: "h-8.5 w-8.5 rounded-lg",
    md: "h-9.5 w-9.5 rounded-xl",
    lg: "h-11 w-11 rounded-xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 cursor-pointer select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
