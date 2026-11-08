"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import { LiveDot, CountryTag } from "@/components/ui";
import { useNow, useShowcaseHref } from "@/lib/hooks";
import { FLAGSHIP_REQUEST_ID, SEED_BIDS, SEED_REQUESTS } from "@/lib/seed";
import { eur, formatDuration } from "@/lib/utils";

const request = SEED_REQUESTS.find((item) => item.id === FLAGSHIP_REQUEST_ID);
const bids = SEED_BIDS.filter((bid) => bid.requestId === FLAGSHIP_REQUEST_ID)
  .sort((a, b) => a.createdAt - b.createdAt);

function startDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

export function HeroQuoteStack() {
  const now = useNow();
  const showcaseHref = useShowcaseHref();
  if (!request) return null;
  const closes = request.closesAt ? formatDuration(request.closesAt - now) : "—";

  return (
    <Link href={showcaseHref} className="block">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-5 rounded-2xl border border-line bg-card p-5 sm:grid-cols-[200px_1fr]"
      >
        <div className="grid grid-cols-[96px_1fr] items-start gap-4 sm:block">
          <div className="h-[116px] w-24 overflow-hidden rounded-md border border-line bg-stencil sm:h-[240px] sm:w-[200px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={request.conceptImageUrl} alt="Stencil of Sisyphus pushing a boulder, ringed by a Latin motto" className="stencil h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-[15px] font-medium leading-5 sm:mt-3">Forearm · Sisyphus &amp; a Latin motto</div>
            <div className="mt-1 text-xs text-fg-3">Mert, Dublin · Open to travel</div>
            <div className="text-xs text-fg-3">Demo quotes</div>
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <span className="text-sm font-medium">{bids.length} quotes</span>
            <span className="font-mono text-xs tabular-nums text-fg-3">closes in {closes}</span>
          </div>
          {bids.map((bid) => {
            const shortlisted = bid.id === "bid-karakoy-sisyphus";
            return (
              <div key={bid.id} className="relative grid h-14 grid-cols-[32px_1fr_auto] items-center gap-3 border-b border-line last:border-0">
                {shortlisted && <span className="absolute inset-y-3 -left-5 w-0.5 rounded-full bg-accent" />}
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-raised text-xs font-medium text-fg-2">
                  {bid.artistName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="truncate">{bid.artistName}</span>
                    {shortlisted && <Star className="h-3.5 w-3.5 shrink-0 fill-accent text-accent" />}
                  </div>
                  <div className="text-xs text-fg-3">{bid.artistCity} <CountryTag flag={bid.artistFlag} /></div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[15px] font-medium tabular-nums">{eur(bid.priceEur)}</div>
                  <div className="text-xs text-fg-3">starts {startDate(bid.availableDate)}</div>
                </div>
              </div>
            );
          })}
          <div className="flex justify-between border-t border-line pt-3 text-sm text-fg-2">
            <span>{bids.length} studios replied · you pick</span>
            <LiveDot label="live" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
