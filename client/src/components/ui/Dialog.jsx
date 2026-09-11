import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export function Dialog({ open, onClose, title, description, children, className }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className={cn(
              "relative z-10 w-full max-w-lg rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-zinc-950/90 max-h-[90vh] overflow-y-auto no-scrollbar",
              className
            )}
          >
            {(title || onClose) && (
              <div className="flex items-start justify-between gap-4 p-5 pb-3 border-b border-zinc-800">
                <div>
                  {title && <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>}
                  {description && (
                    <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-zinc-100 rounded-md p-1 hover:bg-zinc-800 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function Drawer({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className={cn(
              "fixed right-0 top-0 h-full w-full max-w-lg bg-zinc-900 border-l border-zinc-800 shadow-2xl shadow-zinc-950/90 overflow-y-auto no-scrollbar z-10",
              className
            )}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-zinc-900/95 backdrop-blur-md px-5 py-3.5 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-100 rounded-md p-1 hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
