import React from "react";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:brightness-110 border border-indigo-400/20",
        secondary:
          "bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 hover:text-white border border-slate-700/70 shadow-sm",
        outline:
          "border border-slate-700/80 bg-slate-900/50 text-slate-200 hover:bg-slate-800/80 hover:text-white hover:border-slate-600",
        ghost: "text-slate-400 hover:text-white hover:bg-slate-800/60",
        danger:
          "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-900/30 hover:bg-rose-500 border border-rose-500/20",
        emerald:
          "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 hover:brightness-110 border border-emerald-400/20",
        subtle:
          "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20",
        glass:
          "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 backdrop-blur-md",
      },
      size: {
        xs: "h-7 px-2.5 text-xs rounded-lg",
        sm: "h-8.5 px-3 text-xs rounded-lg",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-11.5 px-5 text-sm rounded-xl",
        icon: "h-9.5 w-9.5 p-0 rounded-xl",
        "icon-sm": "h-8 w-8 p-0 rounded-lg",
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
