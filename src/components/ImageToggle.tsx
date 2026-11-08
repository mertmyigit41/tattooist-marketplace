"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, PenTool } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StencilImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-stencil", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="stencil h-full w-full object-cover" draggable={false} />
    </div>
  );
}

export function ImageToggle({
  concept,
  stencil,
  alt,
  className,
  initial = "concept",
  onClick,
  size = "md",
}: {
  concept: string;
  stencil: string;
  alt: string;
  className?: string;
  initial?: "concept" | "stencil";
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  const [view, setView] = useState<"concept" | "stencil">(initial);
  return (
    <div className={cn("group relative overflow-hidden rounded-xl bg-raised", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={cn("absolute inset-0", onClick && "cursor-zoom-in")}
          onClick={onClick}
        >
          {view === "concept" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={concept} alt={alt} className="h-full w-full object-cover" draggable={false} />
          ) : (
            <StencilImage src={stencil} alt={`${alt} stencil`} className="h-full w-full" />
          )}
        </motion.div>
      </AnimatePresence>

      <div
        className={cn(
          "absolute left-2 top-2 z-10 flex rounded-lg border border-line bg-card p-1",
          size === "sm" ? "text-xs" : "text-sm",
        )}
      >
        {(["concept", "stencil"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setView(v);
            }}
            className={cn(
              "flex h-8 items-center gap-1 rounded-md px-2.5 font-medium capitalize transition-colors",
              view === v ? "bg-raised text-fg" : "text-fg-2 hover:text-fg",
            )}
          >
            {v === "concept" ? <ImageIcon className="h-3 w-3" /> : <PenTool className="h-3 w-3" />}
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
