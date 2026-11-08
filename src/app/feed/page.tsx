"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Filter, Radio } from "lucide-react";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BidModal } from "@/components/BidModal";
import { RequestCard } from "@/components/RequestCard";
import { CountryTag, LiveDot, Pill, Spinner } from "@/components/ui";
import { SearchBar } from "@/components/SearchBar";
import { useBidCounts, useProfile, useRequests } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import type { TattooRequest } from "@/lib/types";
import { isAcceptingQuotes, STYLES } from "@/lib/utils";

type Quick = "all" | "mine" | "worldwide" | "high";

export default function FeedPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-fg-3"><Spinner /> Loading requests…</div>}>
      <FeedContent />
    </Suspense>
  );
}

function FeedContent() {
  const { requests, loading } = useRequests();
  const { counts, bumped } = useBidCounts();
  const { isArtist, isApprovedArtist, persona } = usePersona();
  const profile = useProfile(isArtist ? persona.id : undefined);
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const city = (searchParams.get("city") ?? "").trim();
  const [quickChoice, setQuickChoice] = useState<{ personaId: string; quick: Quick } | null>(null);
  const [style, setStyle] = useState<string | null>(null);
  const [bidTarget, setBidTarget] = useState<TattooRequest | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const hasStyles = isArtist && !!profile?.styles?.length;
  const quick: Quick =
    quickChoice?.personaId === persona.id ? quickChoice.quick : hasStyles ? "mine" : "all";

  function selectQuick(value: Quick) {
    setQuickChoice({ personaId: persona.id, quick: value });
  }

  const filtered = useMemo(
    () =>
      requests.filter((r) => {
        if (!isAcceptingQuotes(r)) return false;
        if (quick === "mine" && !profile?.styles.includes(r.style)) return false;
        if (quick === "worldwide" && r.travelMode !== "open_worldwide") return false;
        if (quick === "high" && !["Full Sleeve", "Backpiece"].includes(r.bodyPart)) return false;
        if (style && r.style !== style) return false;
        if (
          q &&
          ![r.title, r.prompt, r.style, r.bodyPart].some((value) =>
            value.toLowerCase().includes(q.toLowerCase()),
          )
        ) {
          return false;
        }
        if (
          city &&
          !r.clientCity.toLowerCase().includes(city.toLowerCase()) &&
          !r.targetDestination.toLowerCase().includes(city.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [requests, quick, profile, style, q, city],
  );

  return (
    <div className="space-y-6">
      <SearchBar key={`${q}-${city}`} query={q} city={city} />
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <LiveDot label="Live" />
          <h1 className="mt-2 font-display text-3xl sm:text-4xl">Open requests</h1>
          <p className="mt-2 text-fg-2">
            {isArtist ? (
              <>
                Quoting as {persona.name} <CountryTag flag={persona.flag} />. Fixed price, plan, date, three pieces.
                {quick === "mine" && " Showing requests in your styles."}
              </>
            ) : (
              <>People worldwide posting tattoo requests. Switch to an Artist persona to quote.</>
            )}
          </p>
        </div>
        <div className="text-sm text-fg-3">
          {q || city ? (
            <>
              {filtered.length} results for {q && <>“{q}”</>}{q && city && " in "}{city}
              {" · "}<Link href="/feed" className="text-fg-2 underline underline-offset-2">Clear</Link>
            </>
          ) : (
            <>{filtered.length} open request{filtered.length === 1 ? "" : "s"}</>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {hasStyles ? (
            <Pill active={quick === "mine"} onClick={() => selectQuick("mine")}>Matches my styles</Pill>
          ) : null}
          <Pill active={quick === "all"} onClick={() => selectQuick("all")}>All requests</Pill>
          <Pill active={quick === "worldwide"} onClick={() => selectQuick("worldwide")}>Open to travel</Pill>
          <Pill active={quick === "high"} onClick={() => selectQuick("high")}>Big pieces (sleeve / back)</Pill>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-fg-3" />
          <select
            value={style ?? ""}
            onChange={(e) => setStyle(e.target.value || null)}
            className="h-9 rounded-lg border border-line bg-raised px-3 text-sm text-fg outline-none focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <option value="">All styles</option>
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-fg-3"><Spinner /> Connecting to live feed…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-line py-16 text-center text-fg-3">
          <Radio className="mx-auto mb-3 h-8 w-8" />{" "}
          {quick === "mine"
            ? "No open requests in your styles right now. Try “All Requests”."
            : "No open requests match these filters."}
        </div>
      ) : (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((r) => (
              <RequestCard key={r.id} request={r} bidCount={counts[r.id] ?? 0} bumped={bumped.has(r.id)} isArtist={isArtist} isApprovedArtist={isApprovedArtist} onBid={setBidTarget} />
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-line bg-card px-4 py-2.5 text-sm text-fg"
          >
            <Check className="mr-1 inline h-4 w-4 text-positive" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
