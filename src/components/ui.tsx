"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn, countryCode } from "@/lib/utils";

export function CountryTag({ flag }: { flag: string }) {
  const code = countryCode(flag);
  if (!code) return null;
  return <span className="inline-block rounded-sm border border-line px-1 font-mono text-xs leading-4 text-fg-3">{code}</span>;
}

export function Button({ className, variant = "primary", size = "md", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
      size === "sm" && "h-9 rounded-lg px-3.5 text-sm",
      size === "md" && "h-11 rounded-[10px] px-5 text-[15px]",
      size === "lg" && "h-12 rounded-[10px] px-6 text-base",
      variant === "primary" && "bg-fg text-ink shadow-[inset_0_1px_0_rgba(255,255,255,.12)] hover:bg-white",
      variant === "secondary" && "border border-line-strong bg-raised text-fg hover:border-fg-3",
      variant === "ghost" && "text-fg-2 hover:bg-raised hover:text-fg",
      className,
    )} {...props} />
  );
}

export function Pill({ active, className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button type="button" className={cn(
      "inline-flex h-9 items-center whitespace-nowrap rounded-lg border px-3 text-sm font-medium transition-colors",
      active ? "border-fg bg-fg text-ink" : "border-line bg-card text-fg-2 hover:border-line-strong hover:text-fg",
      className,
    )} {...props}>{children}</button>
  );
}

export function SegmentedControl({ value, onChange, options, ariaLabel }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  ariaLabel: string;
}) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-card p-1" aria-label={ariaLabel}>
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => onChange(option.value)} className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-fg-2 transition-colors hover:text-fg",
          value === option.value && "bg-raised text-fg",
        )}>{option.icon}{option.label}</button>
      ))}
    </div>
  );
}

export function LiveDot({ label }: { label?: string }) {
  return <span className="inline-flex items-center gap-1.5 text-xs text-fg-3"><span className="inline-block h-2 w-2 rounded-full bg-accent" />{label}</span>;
}

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("inline-flex h-6 items-center gap-1 rounded-md border border-line bg-raised px-2 text-xs font-medium text-fg-2", className)}>{children}</span>;
}

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-line bg-card", className)} {...props}>{children}</div>;
}

export function Modal({ open, onClose, title, children, wide }: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
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
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div role="dialog" aria-modal initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className={cn(
            "relative max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-line bg-card",
            wide ? "sm:max-w-3xl" : "sm:max-w-xl",
          )}>
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-card px-6 py-4">
              <div className="text-lg font-medium">{title}</div>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-fg-2 transition-colors hover:bg-raised hover:text-fg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Stars({ rating }: { rating: number }) {
  return <span className="inline-flex items-center gap-1"><svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current text-fg-3"><path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L10 14.9l-5.3 2.8 1.1-5.9L1.5 7.7l5.9-.8z" /></svg><span className="text-xs text-fg-2">{rating.toFixed(1)}</span></span>;
}

export function Spinner({ className }: { className?: string }) {
  return <span className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-fg-3 border-t-transparent", className)} />;
}
