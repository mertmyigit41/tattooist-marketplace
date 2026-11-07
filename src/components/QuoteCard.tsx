"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays, MapPin, MessageCircle, UserRound, ZoomIn } from "lucide-react";
import Link from "next/link";
import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { FALLBACK_PROFILE_AVAILABILITY } from "@/lib/seed";
import type { Bid, TattooRequest } from "@/lib/types";
import { cn, eur, stripEmoji, timeAgo } from "@/lib/utils";
import { Badge, Button, Card, CountryTag, Stars } from "./ui";

export function bidTotal(b: Bid) {
  return b.priceEur + b.estimatedRoundtripFlightEur;
}

export function QuoteCard({
  bid,
  request,
  isNew,
  isBest,
  canAccept = true,
  onAccept,
  onZoom,
}: {
  bid: Bid;
  request: TattooRequest;
  isNew?: boolean;
  isBest?: boolean;
  canAccept?: boolean;
  onAccept: (b: Bid) => void;
  onZoom: (urls: string[], index: number) => void;
}) {
  const abroad = bid.artistCountry !== request.clientCountry;
  const total = bidTotal(bid);
  const savings = request.estimatedLocalPriceEur - total;
  const saves = savings > 0;
  const availability = FALLBACK_PROFILE_AVAILABILITY[bid.artistId];

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
          "relative overflow-hidden",
          isNew && "border-red-500",
        )}
      >
        {isNew && (
          <span className="absolute left-0 top-0 z-10 rounded-sm bg-red-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
            New quote
          </span>
        )}
        {isBest && (
          <span className="stamp absolute right-4 top-4 z-10 text-xs text-emerald-400">
            Best total
          </span>
        )}

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-zinc-100 font-display text-xl text-zinc-950">
                {bid.artistName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold leading-tight">{bid.artistName}</h3>
                  <BadgeCheck className="h-4 w-4 text-red-500" aria-label="Verified studio" />
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {bid.artistCity}, {bid.artistCountry} <CountryTag flag={bid.artistFlag} /></span>
                  <Stars rating={bid.artistRating} />
                  <span className="text-xs text-zinc-500">{timeAgo(bid.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge>{stripEmoji(bid.sessionPlan)}</Badge>
              <Badge>
                <CalendarDays className="h-3 w-3" /> From {bid.availableDate}
              </Badge>
              {bid.touristPerks.map((p) => (
                <Badge key={p}>
                  {stripEmoji(p)}
                </Badge>
              ))}
            </div>
            <AvailabilityBadges
              responseHours={availability?.responseHours}
              nextOpening={availability?.nextOpening}
            />

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

          <div className="flex flex-col gap-3 rounded-md border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-400">tattoo</span>
              <span>{eur(bid.priceEur)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-zinc-400">
                {abroad ? `flight ${request.clientCity}–${bid.artistCity}` : "flight — local"}
              </span>
              <span>{eur(bid.estimatedRoundtripFlightEur)}</span>
            </div>
            <div className="border-t border-dashed border-zinc-700" />
            <div className="flex items-end justify-between gap-2">
              <span className="text-zinc-400">total</span>
              <span className="font-display text-4xl text-zinc-50 not-mono">{eur(total)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-zinc-500">
              <s className="decoration-red-600">{request.clientCity} local</s>
              <s className="decoration-red-600">{eur(request.estimatedLocalPriceEur)}</s>
            </div>

            {saves ? (
              <div className="stamp text-2xl text-red-500">Saves {eur(savings)}</div>
            ) : (
              <div className="font-mono text-xs text-zinc-500">
                {eur(-savings)} above local
              </div>
            )}
            {saves && abroad && <div className="font-mono text-xs text-zinc-500">flight included</div>}

            <div className="mt-auto flex flex-col gap-2 pt-1">
              {canAccept && (
                <Button variant="whatsapp" onClick={() => onAccept(bid)} disabled={request.status === "booked"}>
                  <MessageCircle className="h-4 w-4" /> Accept · WhatsApp
                </Button>
              )}
              <Link href={`/artists/${bid.artistId}`}>
                <Button variant="outline" className="w-full">
                  <UserRound className="h-4 w-4" /> Studio profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
