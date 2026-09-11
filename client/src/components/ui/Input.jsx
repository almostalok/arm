import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

const baseField =
  "w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-3.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:border-indigo-500/80 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50";

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(baseField, "h-10", className)} {...props} />;
});

export const Textarea = forwardRef(function Textarea(
  { className, rows = 4, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(baseField, "py-2.5 resize-none leading-relaxed", className)}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { className, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(baseField, "h-10 appearance-none bg-no-repeat pr-9 cursor-pointer", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 0.75rem center",
      }}
      {...props}
    >
      {children}
    </select>
  );
});

export function Label({ className, children, ...props }) {
  return (
    <label
      className={cn("block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function Field({ label, error, children, className }) {
  return (
    <div className={className}>
      {label && <Label>{label}</Label>}
      {children}
      {error && <p className="mt-1 text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
