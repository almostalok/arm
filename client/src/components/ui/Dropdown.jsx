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
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute z-40 mt-1.5 min-w-[12rem] rounded-lg border border-zinc-750 bg-zinc-900 p-1 shadow-xl shadow-zinc-950/80",
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
        "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer select-none text-left",
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
    <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">
      {children}
    </p>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-zinc-800" />;
}
