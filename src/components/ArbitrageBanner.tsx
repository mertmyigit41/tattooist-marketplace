"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe2, Plane, TrendingDown } from "lucide-react";
import type { Bid, TattooRequest } from "@/lib/types";
import { eur } from "@/lib/utils";
import { bidTotal } from "./QuoteCard";

export function ArbitrageBanner({ bids, request }: { bids: Bid[]; request: TattooRequest }) {
  const international = bids.filter((b) => b.artistCountry !== request.clientCountry);
  const best = [...international].sort((a, b) => bidTotal(a) - bidTotal(b))[0];
  const local = bids.filter((b) => b.artistCountry === request.clientCountry).sort((a, b) => a.priceEur - b.priceEur)[0];
  const baseline = request.estimatedLocalPriceEur;

  if (!best) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 p-5 text-sm text-zinc-400">
        <Globe2 className="mr-2 inline h-4 w-4" />
        Global Arbitrage Calculator: waiting for the first international quote. Local baseline is {eur(baseline)}.
      </div>
    );
  }

  const total = bidTotal(best);
  const savings = baseline - total;
  const pct = Math.round((savings / baseline) * 100);
  const vsLocalQuote = local ? local.priceEur - total : null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={best.id + total}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-zinc-900 to-emerald-500/5 p-5 sm:p-6"
      >
        <div className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Globe2 className="h-4 w-4" /> Global Arbitrage Calculator
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Best international quote: <span className="text-emerald-300">{best.artistName}</span> {best.artistFlag}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-300">
              <Chip>Tattoo {eur(best.priceEur)}</Chip>
              <span className="text-zinc-500">+</span>
              <Chip>
                <Plane className="h-3.5 w-3.5" /> {request.clientCity}↔{best.artistCity} flight {eur(best.estimatedRoundtripFlightEur)}
              </Chip>
              <span className="text-zinc-500">=</span>
              <Chip strong>Total {eur(total)}</Chip>
              <span className="text-zinc-500">vs.</span>
              <Chip muted>
                <span className="line-through">{eur(baseline)}</span> {request.clientCity} local
              </Chip>
            </div>
            {vsLocalQuote !== null && vsLocalQuote > 0 && (
              <p className="mt-2 text-xs text-zinc-400">
                Also {eur(vsLocalQuote)} cheaper than the lowest local quote ({local!.artistName} at {eur(local!.priceEur)}).
              </p>
            )}
          </div>

          <motion.div
            key={savings}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
            className="animate-pulse-glow flex items-center gap-4 rounded-2xl border border-emerald-400/60 bg-emerald-500/15 px-5 py-4"
          >
            <TrendingDown className="h-10 w-10 text-emerald-300" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200/80">You save</div>
              <div className="text-3xl font-black text-emerald-300 text-glow-emerald sm:text-4xl">{eur(Math.max(savings, 0))}</div>
              <div className="text-xs text-emerald-200/80">{pct}% below local · after flights</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Chip({ children, strong, muted }: { children: React.ReactNode; strong?: boolean; muted?: boolean }) {
  return (
    <span
      className={
        strong
          ? "inline-flex items-center gap-1 rounded-lg border border-emerald-400/50 bg-emerald-500/20 px-2.5 py-1 font-bold text-emerald-200"
          : muted
            ? "inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-zinc-400"
            : "inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-zinc-200"
      }
    >
      {children}
    </span>
  );
}
