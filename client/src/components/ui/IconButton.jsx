import React from "react";
import { cn } from "../../lib/utils";

export function IconButton({ className, variant = "outline", size = "md", children, ...props }) {
  const variants = {
    outline:
      "border border-zinc-750 bg-zinc-900/80 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800 shadow-sm",
    ghost: "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80",
    solid: "bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm",
    cobalt: "bg-blue-600 text-white hover:bg-blue-500 shadow-sm",
    muted: "bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-zinc-700/60",
    glass: "bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60",
  };

  const sizes = {
    xs: "h-6 w-6 rounded-md",
    sm: "h-7.5 w-7.5 rounded-md",
    md: "h-8.5 w-8.5 rounded-lg",
    lg: "h-9.5 w-9.5 rounded-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 cursor-pointer select-none",
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
