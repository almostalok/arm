import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export function Dropdown({ trigger, children, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-40 mt-2 min-w-[13rem] rounded-xl border border-slate-700/80 bg-slate-900/95 p-1.5 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl",
              align === "right" ? "right-0" : "left-0",
              className
            )}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ className, danger, children, ...props }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer select-none text-left",
        danger && "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownLabel({ children }) {
  return (
    <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-slate-800" />;
}
