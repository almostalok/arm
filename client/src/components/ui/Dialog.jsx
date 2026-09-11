import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * High-motion modal dialog with Framer Motion spring physics.
 */
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={cn(
              "relative z-10 w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-indigo-950/60 max-h-[90vh] overflow-y-auto no-scrollbar",
              className
            )}
          >
            {(title || onClose) && (
              <div className="flex items-start justify-between gap-4 p-6 pb-2 border-b border-slate-800/60">
                <div>
                  {title && <h3 className="text-base font-semibold text-white font-display">{title}</h3>}
                  {description && (
                    <p className="text-xs text-slate-400 mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/**
 * High-motion right slide-over drawer with spring physics.
 */
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className={cn(
              "fixed right-0 top-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl shadow-indigo-950/80 overflow-y-auto no-scrollbar z-10",
              className
            )}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white font-display">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
