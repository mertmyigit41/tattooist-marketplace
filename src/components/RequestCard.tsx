"use client";

import { motion } from "framer-motion";
import { Gavel, MessageSquareQuote, Plane } from "lucide-react";
import Link from "next/link";
import type { TattooRequest } from "@/lib/types";
import { cn, eur, timeAgo, TRAVEL_MODE_META } from "@/lib/utils";
import { ImageToggle } from "./ImageToggle";
import { Badge, Button, Card } from "./ui";

export function TravelBadge({ request, className }: { request: TattooRequest; className?: string }) {
  const meta = TRAVEL_MODE_META[request.travelMode];
  const text =
    request.travelMode === "specific_destination" && request.targetDestination
      ? `Planned Trip: ${request.targetDestination}`
      : request.travelMode === "local_only"
        ? `Local Only (${request.clientCity})`
        : meta.short;
  return (
    <Badge className={cn(meta.className, className)}>
      {meta.emoji} {text}
    </Badge>
  );
}

export function RequestCard({
  request,
  bidCount,
  bumped,
  isArtist,
  onBid,
}: {
  request: TattooRequest;
  bidCount: number;
  bumped?: boolean;
  isArtist: boolean;
  onBid?: (r: TattooRequest) => void;
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="group flex h-full flex-col overflow-hidden transition hover:border-zinc-700">
        <Link href={`/requests/${request.id}`} className="block">
          <ImageToggle
            concept={request.conceptImageUrl}
            stencil={request.stencilImageUrl}
            alt={request.title}
            size="sm"
            className="aspect-[4/3] w-full rounded-none"
          />
        </Link>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/requests/${request.id}`} className="line-clamp-1 font-semibold hover:underline">
                {request.title}
              </Link>
              <div className="mt-0.5 text-xs text-zinc-400">
                {request.clientName} · 📍 {request.clientCity}, {request.clientCountry} {request.clientFlag} · {timeAgo(request.createdAt)}
              </div>
            </div>
            {request.status === "booked" && <Badge className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">Booked</Badge>}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <TravelBadge request={request} />
            <Badge>{request.bodyPart}</Badge>
            <Badge className="border-red-500/30 bg-red-500/10 text-red-200">{request.style}</Badge>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-zinc-800 pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">Local baseline</div>
              <div className="font-semibold">{eur(request.estimatedLocalPriceEur)}</div>
            </div>
            <motion.div
              key={bidCount}
              initial={bumped ? { scale: 1.4, color: "#34d399" } : false}
              animate={{ scale: 1, color: bumped ? "#34d399" : "#d4d4d8" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <MessageSquareQuote className="h-4 w-4" />
              {bidCount} {bidCount === 1 ? "quote" : "quotes"}
            </motion.div>
          </div>

          {isArtist ? (
            <Button variant="emerald" onClick={() => onBid?.(request)} disabled={request.status === "booked"} className="w-full">
              <Gavel className="h-4 w-4" /> Submit Quote (Bid)
            </Button>
          ) : (
            <Link href={`/requests/${request.id}`}>
              <Button variant="outline" className="w-full">
                <Plane className="h-4 w-4" /> View Quotes & Arbitrage
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
