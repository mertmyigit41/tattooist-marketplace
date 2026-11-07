"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays, Flame, MessageCircle, Plane, UserRound, ZoomIn } from "lucide-react";
import Link from "next/link";
import type { Bid, TattooRequest } from "@/lib/types";
import { cn, eur, timeAgo } from "@/lib/utils";
import { Badge, Button, Card, Stars } from "./ui";

export function bidTotal(b: Bid) {
  return b.priceEur + b.estimatedRoundtripFlightEur;
}

export function QuoteCard({
  bid,
  request,
  isNew,
  isBest,
  onAccept,
  onZoom,
}: {
  bid: Bid;
  request: TattooRequest;
  isNew?: boolean;
  isBest?: boolean;
  onAccept: (b: Bid) => void;
  onZoom: (urls: string[], index: number) => void;
}) {
  const abroad = bid.artistCountry !== request.clientCountry;
  const total = bidTotal(bid);
  const savings = request.estimatedLocalPriceEur - total;
  const saves = savings > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-700",
          isNew && "border-emerald-400 ring-2 ring-emerald-400/60 shadow-[0_0_40px_rgba(16,185,129,0.35)]",
          isBest && !isNew && "border-emerald-500/50",
        )}
      >
        {isNew && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-zinc-950 shadow-lg"
          >
            <span className="h-2 w-2 animate-ping rounded-full bg-zinc-950" /> NEW QUOTE · LIVE
          </motion.div>
        )}
        {isBest && !isNew && (
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Flame className="h-3.5 w-3.5" /> Best Value
          </div>
        )}

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-2xl">{bid.artistFlag}</div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold leading-tight">{bid.artistName}</h3>
                  <Badge className="border-sky-500/40 bg-sky-500/10 text-sky-300">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified Pro
                  </Badge>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
                  <span>📍 {bid.artistCity}, {bid.artistCountry} {bid.artistFlag}</span>
                  <Stars rating={bid.artistRating} />
                  <span className="text-xs text-zinc-500">{timeAgo(bid.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge className="border-amber-500/40 bg-amber-500/10 text-amber-200">{bid.sessionPlan}</Badge>
              <Badge>
                <CalendarDays className="h-3 w-3" /> From {bid.availableDate}
              </Badge>
              {bid.touristPerks.map((p) => (
                <Badge key={p} className="border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                  {p}
                </Badge>
              ))}
            </div>

            <p className="text-sm leading-relaxed text-zinc-300">{bid.message}</p>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Matching portfolio pieces</div>
              <div className="grid grid-cols-3 gap-2">
                {bid.selectedPortfolioUrls.map((url, i) => (
                  <button
                    key={url + i}
                    type="button"
                    onClick={() => onZoom(bid.selectedPortfolioUrls, i)}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-800"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                      <ZoomIn className="h-6 w-6 text-white" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500">Tattoo price</div>
              <div className="text-3xl font-black">{eur(bid.priceEur)}</div>
            </div>
            <div className="space-y-1 text-sm">
              <Row label={<span className="flex items-center gap-1"><Plane className="h-3.5 w-3.5" /> Est. roundtrip flight</span>} value={abroad ? eur(bid.estimatedRoundtripFlightEur) : "€0 (local)"} muted />
              <Row label={<span className="font-semibold text-zinc-200">Total landed cost</span>} value={<span className="font-bold">{eur(total)}</span>} />
              <Row label={`vs. ${request.clientCity} local`} value={eur(request.estimatedLocalPriceEur)} muted strike />
            </div>

            {saves ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                className="animate-pulse-glow rounded-xl border border-emerald-400/60 bg-emerald-500/15 p-3 text-center"
              >
                <div className="text-base font-black text-emerald-300 text-glow-emerald">
                  🔥 SAVE {eur(savings)}
                  {abroad ? " EVEN AFTER FLIGHTS!" : "!"}
                </div>
                <div className="mt-1 text-[11px] leading-snug text-emerald-200/80">
                  {abroad
                    ? `Tattoo ${eur(bid.priceEur)} + Est. ${request.clientCity}↔${bid.artistCity} Flight ${eur(bid.estimatedRoundtripFlightEur)} vs. ${eur(request.estimatedLocalPriceEur)} Local`
                    : `Tattoo ${eur(bid.priceEur)} vs. ${eur(request.estimatedLocalPriceEur)} ${request.clientCity} estimate`}
                </div>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 text-center text-sm text-zinc-300">
                {savings === 0 ? "Matches local baseline" : `${eur(-savings)} above local baseline`}
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2 pt-1">
              <Button variant="whatsapp" onClick={() => onAccept(bid)} disabled={request.status === "booked"}>
                <MessageCircle className="h-4 w-4" /> Accept Quote & Connect on WhatsApp
              </Button>
              <Link href={`/artists/${bid.artistId}`}>
                <Button variant="outline" className="w-full">
                  <UserRound className="h-4 w-4" /> View Full Studio Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Row({ label, value, muted, strike }: { label: React.ReactNode; value: React.ReactNode; muted?: boolean; strike?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-2", muted && "text-zinc-400")}>
      <span>{label}</span>
      <span className={cn(strike && "line-through decoration-rose-500/70")}>{value}</span>
    </div>
  );
}
