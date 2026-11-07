"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Gavel, MapPin, Radio, Ruler } from "lucide-react";
import Link from "next/link";
import { useRouteId } from "@/lib/useRouteId";
import { useMemo, useState } from "react";
import { AcceptModal } from "@/components/AcceptModal";
import { ArbitrageBanner } from "@/components/ArbitrageBanner";
import { BidModal } from "@/components/BidModal";
import { ImageToggle } from "@/components/ImageToggle";
import { Lightbox } from "@/components/Lightbox";
import { bidTotal, QuoteCard } from "@/components/QuoteCard";
import { TravelBadge } from "@/components/RequestCard";
import { Badge, Button, Card, CountryTag, Spinner } from "@/components/ui";
import { useBids, useRequest } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import { IS_LIVE } from "@/lib/mode";
import type { Bid } from "@/lib/types";
import { eur } from "@/lib/utils";

type Sort = "best" | "newest" | "price";

export function RequestView() {
  const id = useRouteId();
  const request = useRequest(id);
  const { bids, newIds, loading } = useBids(id);
  const { isArtist, isApprovedArtist, persona } = usePersona();
  const [sort, setSort] = useState<Sort>("best");
  const [accepting, setAccepting] = useState<Bid | null>(null);
  const [bidOpen, setBidOpen] = useState(false);
  const [lb, setLb] = useState<{ urls: string[]; index: number | null }>({ urls: [], index: null });

  const sorted = useMemo(() => {
    const list = [...bids];
    if (sort === "best") list.sort((a, b) => bidTotal(a) - bidTotal(b));
    if (sort === "price") list.sort((a, b) => a.priceEur - b.priceEur);
    if (sort === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }, [bids, sort]);
  const bestId = useMemo(() => [...bids].sort((a, b) => bidTotal(a) - bidTotal(b))[0]?.id, [bids]);

  if (request === undefined) return <div className="flex items-center justify-center gap-2 py-24 text-zinc-500"><Spinner /> Loading request…</div>;
  if (request === null)
    return (
      <div className="py-24 text-center text-zinc-400">
        Request not found. <Link href="/feed" className="text-red-300 underline">Back to feed</Link>
      </div>
    );
  const canAccept = !IS_LIVE || persona.id === request.clientId;

  return (
    <div className="space-y-8">
      <Link href="/feed" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Live feed</Link>

      <Card className="grid gap-6 p-5 lg:grid-cols-[360px_1fr] lg:p-6">
        <ImageToggle concept={request.conceptImageUrl} stencil={request.stencilImageUrl} alt={request.title} className="aspect-square w-full" onClick={() => setLb({ urls: [request.conceptImageUrl], index: 0 })} />
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TravelBadge request={request} />
              {request.status === "booked" && <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300"><Check className="h-3 w-3" /> Booked</Badge>}
            </div>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl">{request.title}</h1>
            <p className="mt-2 text-zinc-400">{request.prompt}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-zinc-500" /> {request.clientName} · {request.clientCity}, {request.clientCountry} <CountryTag flag={request.clientFlag} /></span>
            <span className="flex items-center gap-1.5"><Ruler className="h-4 w-4 text-zinc-500" /> {request.bodyPart} · {request.size}</span>
            <Badge className="border-red-500/30 bg-red-500/10 text-red-200">{request.style}</Badge>
          </div>

          <div className="mt-auto grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Local Baseline Price</div>
              <div className="text-3xl font-black">{eur(request.estimatedLocalPriceEur)}</div>
              <div className="text-xs text-zinc-500">Estimated {request.clientCity} studio price for a {request.bodyPart.toLowerCase()}</div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
                Live Quotes
              </div>
              <motion.div key={bids.length} initial={{ scale: 1.3, color: "#34d399" }} animate={{ scale: 1, color: "#fafafa" }} className="text-3xl font-black">
                {bids.length}
              </motion.div>
              <div className="text-xs text-zinc-500">{bids.filter((b) => b.artistCountry !== request.clientCountry).length} international · {bids.filter((b) => b.artistCountry === request.clientCountry).length} local</div>
            </div>
          </div>
          {IS_LIVE && isArtist && !isApprovedArtist && request.status === "open" ? (
            <p className="rounded-sm border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm text-amber-200">
              Your studio is pending approval
            </p>
          ) : isArtist && isApprovedArtist && request.status === "open" && (
            <Button variant="emerald" onClick={() => setBidOpen(true)}><Gavel className="h-4 w-4" /> Submit Quote (Bid) on this request</Button>
          )}
        </div>
      </Card>

      <ArbitrageBanner bids={bids} request={request} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Radio className="h-5 w-5 text-emerald-400" /> Quote Comparison ({bids.length})</h2>
          <div className="flex rounded-full border border-zinc-800 bg-zinc-950 p-1 text-xs">
            {([["best", "Best total value"], ["price", "Lowest tattoo price"], ["newest", "Newest"]] as [Sort, string][]).map(([k, label]) => (
              <button key={k} onClick={() => setSort(k)} className={`rounded-full px-3 py-1.5 font-medium transition ${sort === k ? "bg-zinc-100 text-zinc-950" : "text-zinc-400 hover:text-white"}`}>{label}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-12 text-zinc-500"><Spinner /> Listening for quotes…</div>
        ) : bids.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 py-16 text-center text-zinc-500">
            No quotes yet. Studios see this request in the live feed — quotes appear here instantly.
          </div>
        ) : (
          <motion.div layout className="grid gap-4">
            <AnimatePresence initial={false}>
              {sorted.map((b) => (
                <QuoteCard key={b.id} bid={b} request={request} canAccept={canAccept} isNew={newIds.has(b.id)} isBest={b.id === bestId} onAccept={setAccepting} onZoom={(urls, index) => setLb({ urls, index })} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <AcceptModal bid={accepting} request={request} onClose={() => setAccepting(null)} />
      <BidModal request={request} open={bidOpen} onClose={() => setBidOpen(false)} />
      <Lightbox images={lb.urls} index={lb.index} onClose={() => setLb((s) => ({ ...s, index: null }))} onIndex={(i) => setLb((s) => ({ ...s, index: i }))} />
    </div>
  );
}
