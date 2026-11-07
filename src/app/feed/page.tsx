"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Filter, Radio } from "lucide-react";
import { useMemo, useState } from "react";
import { BidModal } from "@/components/BidModal";
import { RequestCard } from "@/components/RequestCard";
import { Pill, Spinner } from "@/components/ui";
import { useBidCounts, useRequests } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import type { TattooRequest } from "@/lib/types";
import { STYLES } from "@/lib/utils";

type Quick = "all" | "worldwide" | "high";

export default function FeedPage() {
  const { requests, loading } = useRequests();
  const { counts, bumped } = useBidCounts();
  const { isArtist, persona } = usePersona();
  const [quick, setQuick] = useState<Quick>("all");
  const [style, setStyle] = useState<string | null>(null);
  const [bidTarget, setBidTarget] = useState<TattooRequest | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        if (r.status !== "open") return false;
        if (quick === "worldwide" && r.travelMode !== "open_worldwide") return false;
        if (quick === "high" && !["Full Sleeve", "Backpiece"].includes(r.bodyPart)) return false;
        if (style && r.style !== style) return false;
        return true;
      }),
    [requests, quick, style],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            Live · Firestore real-time
          </div>
          <h1 className="text-3xl font-black sm:text-4xl">Live Open Requests</h1>
          <p className="mt-1 text-zinc-400">
            {isArtist ? (
              <>Viewing as <b className="text-amber-300">{persona.name}</b> {persona.flag} — submit fixed-price quotes on any request.</>
            ) : (
              <>Clients worldwide posting designs. Switch to an Artist persona to bid.</>
            )}
          </p>
        </div>
        <div className="text-sm text-zinc-500">{filtered.length} open request{filtered.length === 1 ? "" : "s"}</div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Pill accent="zinc" active={quick === "all"} onClick={() => setQuick("all")}>All Requests</Pill>
          <Pill accent="emerald" active={quick === "worldwide"} onClick={() => setQuick("worldwide")}>🌍 Open Worldwide (Tattoo Tourism)</Pill>
          <Pill accent="amber" active={quick === "high"} onClick={() => setQuick("high")}>💰 High Budget (Full Sleeve / Back)</Pill>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={style ?? ""}
            onChange={(e) => setStyle(e.target.value || null)}
            className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-red-500"
          >
            <option value="">All styles</option>
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-zinc-500"><Spinner /> Connecting to live feed…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 py-24 text-center text-zinc-500">
          <Radio className="mx-auto mb-3 h-8 w-8" /> No open requests match these filters.
        </div>
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((r) => (
              <RequestCard key={r.id} request={r} bidCount={counts[r.id] ?? 0} bumped={bumped.has(r.id)} isArtist={isArtist} onBid={setBidTarget} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <BidModal
        request={bidTarget}
        open={!!bidTarget}
        onClose={() => setBidTarget(null)}
        onSubmitted={() => {
          setToast("Quote submitted — the client sees it live.");
          setTimeout(() => setToast(null), 3500);
        }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-emerald-500/50 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
          >
            ✅ {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
