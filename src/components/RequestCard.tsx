"use client";

import { motion } from "framer-motion";
import { Gavel } from "lucide-react";
import Link from "next/link";
import { useNow } from "@/lib/hooks";
import type { TattooRequest } from "@/lib/types";
import { cn, formatDuration, isAcceptingQuotes, TRAVEL_MODE_META } from "@/lib/utils";
import { Badge, Button, Card } from "./ui";

export function travelText(request: TattooRequest) {
  const meta = TRAVEL_MODE_META[request.travelMode];
  return request.travelMode === "specific_destination" && request.targetDestination
    ? `Trip · ${request.targetDestination}`
    : request.travelMode === "local_only"
      ? `Near me · ${request.clientCity}`
      : meta.short;
}

export function TravelBadge({ request, className }: { request: TattooRequest; className?: string }) {
  return <Badge className={cn(TRAVEL_MODE_META[request.travelMode].className, className)}>{travelText(request)}</Badge>;
}

export function RequestCard({ request, bidCount, isArtist, isApprovedArtist = true, onBid }: {
  request: TattooRequest;
  bidCount: number;
  bumped?: boolean;
  isArtist: boolean;
  isApprovedArtist?: boolean;
  onBid?: (request: TattooRequest) => void;
}) {
  const now = useNow();
  const accepting = isAcceptingQuotes(request, now);
  const closeText = request.status === "closed"
    ? "Closed"
    : !request.closesAt || request.closesAt <= now
      ? "Quotes closed"
      : `closes in ${formatDuration(request.closesAt - now)}`;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="h-full">
      <Card className="flex h-full flex-col overflow-hidden">
        <Link href={`/requests/${request.id}`} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={request.conceptImageUrl} alt={request.title} className="aspect-[4/3] w-full object-cover" />
        </Link>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/requests/${request.id}`} className="line-clamp-1 text-[15px] font-medium hover:underline">{request.title}</Link>
              <div className="mt-1 text-[13px] text-fg-2">{request.clientName} · {request.clientCity} · {travelText(request)}</div>
              <div className="text-xs text-fg-3">{request.bodyPart} · {request.style}</div>
            </div>
            {request.status === "booked" ? <Badge className="border-positive/30 bg-positive/10 text-positive">Booked</Badge> : request.status === "closed" ? <Badge className="border-line bg-transparent text-fg-3">Closed</Badge> : null}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 font-mono text-xs tabular-nums text-fg-3">
            <span>{bidCount ? `${bidCount} ${bidCount === 1 ? "quote" : "quotes"}` : "No quotes yet"}</span>
            <span>{closeText}</span>
          </div>
          <div className="mt-4">
            {isArtist && !isApprovedArtist ? (
              <div className="rounded-lg border border-line bg-raised px-3 py-2 text-center text-xs text-fg-2">Your studio is pending approval</div>
            ) : isArtist ? (
              <Button size="sm" onClick={() => onBid?.(request)} disabled={!accepting} className="w-full"><Gavel className="h-4 w-4" />{accepting ? "Send a quote" : "Window closed"}</Button>
            ) : (
              <Link href={`/requests/${request.id}`}><Button variant="secondary" size="sm" className="w-full">See quotes</Button></Link>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
