"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "emerald" | "violet" | "ghost" | "outline" | "whatsapp";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3.5 text-base",
        variant === "primary" && "bg-zinc-100 text-zinc-950 hover:bg-white",
        variant === "emerald" &&
          "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.35)]",
        variant === "violet" &&
          "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 shadow-[0_0_28px_rgba(139,92,246,0.4)]",
        variant === "whatsapp" && "bg-[#25D366] text-zinc-950 hover:bg-[#3ae07a]",
        variant === "ghost" && "text-zinc-300 hover:bg-zinc-800 hover:text-white",
        variant === "outline" && "border border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900",
        className,
      )}
      {...props}
    />
  );
}

export function Pill({
  active,
  className,
  children,
  accent = "violet",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; accent?: "violet" | "emerald" | "amber" | "zinc" }) {
  const activeCls = {
    violet: "border-violet-500 bg-violet-500/15 text-violet-200 shadow-[0_0_16px_rgba(139,92,246,0.35)]",
    emerald: "border-emerald-500 bg-emerald-500/15 text-emerald-200 shadow-[0_0_16px_rgba(16,185,129,0.35)]",
    amber: "border-amber-500 bg-amber-500/15 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.35)]",
    zinc: "border-zinc-300 bg-zinc-100 text-zinc-950",
  }[accent];
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
        active ? activeCls : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-5",
        className ?? "border-zinc-700 bg-zinc-800/80 text-zinc-300",
      )}
    >
      {children}
    </span>
  );
}

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className={cn(
              "relative w-full max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl",
              wide ? "sm:max-w-3xl" : "sm:max-w-xl",
            )}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/90 px-6 py-4 backdrop-blur">
              <div className="text-lg font-semibold">{title}</div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-amber-400">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
        <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z" />
      </svg>
      <span className="text-xs font-semibold text-zinc-200">{rating.toFixed(1)}</span>
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent",
        className,
      )}
    />
  );
}
