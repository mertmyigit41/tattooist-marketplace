"use client";

import { Database, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { isEmulator } from "@/lib/firebase";
import { IS_LIVE } from "@/lib/mode";
import { seedDemoData } from "@/lib/seed";

export function Footer() {
  const [busy, setBusy] = useState(false);
  return (
    <footer className="mt-16 border-t border-zinc-800/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:px-6 lg:px-8">
        <span>
          <span className="font-display text-base tracking-[0.08em] text-zinc-300">INQ<span className="text-red-500">FY</span></span>
          <span className="ml-3">© {new Date().getFullYear()} · Istanbul · Dublin · Bangkok · Bali. The ink is permanent, the price is fixed.</span>
          {isEmulator && <span className="ml-2 rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-400">Firestore emulator</span>}
        </span>
        {IS_LIVE ? (
          <Link href="https://demo.inqfy.app" className="flex items-center gap-1.5 hover:text-zinc-300">
            <ExternalLink className="h-3.5 w-3.5" /> Demo
          </Link>
        ) : (
          <div className="flex flex-wrap items-center gap-4">
            <Link href="https://inqfy.app" className="text-zinc-400 hover:text-zinc-200">
              This is the demo — real app at inqfy.app
            </Link>
            <button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await seedDemoData({ reset: true });
                } finally {
                  setBusy(false);
                }
              }}
              className="flex items-center gap-1.5 hover:text-zinc-300 disabled:opacity-50"
            >
              <Database className="h-3.5 w-3.5" /> {busy ? "Seeding…" : "Reset / Seed Demo Data"}
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
