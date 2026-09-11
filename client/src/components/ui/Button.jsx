import React from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm border border-zinc-200/20 font-medium",
        cobalt:
          "bg-blue-600 text-white hover:bg-blue-500 shadow-sm border border-blue-500/30",
        secondary:
          "bg-zinc-800/90 text-zinc-200 hover:bg-zinc-700 hover:text-white border border-zinc-700/80 shadow-sm",
        outline:
          "border border-zinc-700 bg-zinc-900/50 text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-600",
        ghost: "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60",
        danger:
          "bg-rose-600 text-white hover:bg-rose-500 shadow-sm border border-rose-500/30",
        emerald:
          "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm border border-emerald-500/30",
        subtle:
          "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-700/60",
        glass:
          "bg-zinc-800/40 hover:bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 backdrop-blur-sm",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-md",
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-9 px-3.5 text-sm rounded-lg",
        lg: "h-10 px-4 text-sm rounded-lg",
        icon: "h-9 w-9 p-0 rounded-lg",
        "icon-sm": "h-7.5 w-7.5 p-0 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
      {children}
    </button>
  );
}

export { buttonVariants };
