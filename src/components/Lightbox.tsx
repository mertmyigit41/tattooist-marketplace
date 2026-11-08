"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
  caption,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  caption?: string;
}) {
  const open = index !== null;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index !== null) onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft" && index !== null) onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button className="absolute right-4 top-4 rounded-lg bg-card p-2 text-fg-2 hover:bg-raised" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-lg bg-card p-2 text-fg-2 hover:bg-raised"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex((index - 1 + images.length) % images.length);
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-card p-2 text-fg-2 hover:bg-raised"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndex((index + 1) % images.length);
                }}
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <motion.img
            key={images[index]}
            src={images[index]}
            alt="Portfolio"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-card px-3 py-1 text-xs text-fg-2">
            {caption ? `${caption} · ` : ""}
            {index + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
