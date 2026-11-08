"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CalendarDays, Eye, EyeOff, MapPin, MessageCircle, Star, UserRound, ZoomIn } from "lucide-react";
import Link from "next/link";
import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { FALLBACK_PROFILE_AVAILABILITY } from "@/lib/seed";
import type { Bid, TattooRequest } from "@/lib/types";
import { cn, eur, stripEmoji, timeAgo } from "@/lib/utils";
import { Badge, Button, Card, CountryTag, Stars } from "./ui";

export function QuoteCard({ bid, request, isNew, canAccept = true, shortlisted, hidden, onShortlist, onHide, onAccept, onZoom }: {
  bid: Bid;
  request: TattooRequest;
  isNew?: boolean;
  canAccept?: boolean;
  shortlisted?: boolean;
  hidden?: boolean;
  onShortlist?: (bid: Bid) => void;
  onHide?: (bid: Bid) => void;
  onAccept: (bid: Bid) => void;
  onZoom: (urls: string[], index: number) => void;
}) {
  const availability = FALLBACK_PROFILE_AVAILABILITY[bid.artistId];
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      <Card className={cn("relative overflow-hidden", shortlisted && "border-accent/50")}>
        {isNew && <span className="absolute left-5 top-4 z-10 text-xs font-medium text-accent">New</span>}
        {canAccept && onShortlist && onHide && (
          <div className="absolute right-3 top-3 z-10 flex gap-1">
            <button type="button" onClick={() => onShortlist(bid)} aria-label={shortlisted ? "Remove from shortlist" : "Shortlist"} className={cn("rounded-md border border-line bg-card p-1.5 text-fg-3 transition-colors hover:text-fg", shortlisted && "text-accent")}>
              <Star className={cn("h-4 w-4", shortlisted && "fill-current")} />
            </button>
            <button type="button" onClick={() => onHide(bid)} aria-label={hidden ? "Show quote" : "Hide quote"} className="rounded-md border border-line bg-card p-1.5 text-fg-3 transition-colors hover:text-fg">
              {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        )}
        <div className={cn("grid gap-5 p-5 lg:grid-cols-[1fr_280px]", isNew && "pt-10")}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-raised text-xs font-medium text-fg-2">
                {bid.artistName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-medium">{bid.artistName}</h3><BadgeCheck className="h-4 w-4 text-fg-3" aria-label="Verified studio" /></div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-2">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-fg-3" />{bid.artistCity}, {bid.artistCountry} <CountryTag flag={bid.artistFlag} /></span>
                  <Stars rating={bid.artistRating} /><span className="text-xs text-fg-3">{timeAgo(bid.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5"><Badge>{stripEmoji(bid.sessionPlan)}</Badge><Badge><CalendarDays className="h-3 w-3" />From {bid.availableDate}</Badge></div>
            <AvailabilityBadges responseHours={availability?.responseHours} nextOpening={availability?.nextOpening} />
            <p className="text-sm leading-relaxed text-fg-2">{bid.message}</p>
            <div>
              <div className="mb-2 text-xs text-fg-3">Matching portfolio pieces</div>
              <div className="grid grid-cols-3 gap-2">
                {bid.selectedPortfolioUrls.map((url, index) => (
                  <button key={url + index} type="button" onClick={() => onZoom(bid.selectedPortfolioUrls, index)} className="group relative aspect-square overflow-hidden rounded-md border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100"><ZoomIn className="h-[18px] w-[18px] text-fg" /></span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-line bg-raised p-4">
            <div><div className="text-xs text-fg-3">Fixed price</div><div className="font-mono text-3xl font-medium tabular-nums">{eur(bid.priceEur)}</div></div>
            <div className="border-t border-line" />
            <div><div className="text-xs text-fg-3">Starts</div><div className="text-sm">{bid.availableDate}</div></div>
            <div><div className="text-xs text-fg-3">Plan</div><div className="text-sm">{stripEmoji(bid.sessionPlan)}</div></div>
            <div className="mt-auto flex flex-col gap-2 pt-1">
              {canAccept && <Button onClick={() => onAccept(bid)} disabled={request.status !== "open"}><MessageCircle className="h-4 w-4" />Accept on WhatsApp</Button>}
              <Link href={`/artists/${bid.artistId}`}><Button variant="secondary" className="w-full"><UserRound className="h-4 w-4" />Studio profile</Button></Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
