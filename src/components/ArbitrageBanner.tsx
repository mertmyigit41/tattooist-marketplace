"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Bid, TattooRequest } from "@/lib/types";
import { eur } from "@/lib/utils";
import { bidTotal } from "./QuoteCard";
import { CountryTag } from "./ui";

export function ArbitrageBanner({ bids, request }: { bids: Bid[]; request: TattooRequest }) {
  const international = bids.filter((b) => b.artistCountry !== request.clientCountry);
  const best = [...international].sort((a, b) => bidTotal(a) - bidTotal(b))[0];
  const local = bids.filter((b) => b.artistCountry === request.clientCountry).sort((a, b) => a.priceEur - b.priceEur)[0];
  const baseline = request.estimatedLocalPriceEur;

  if (!best) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-800 p-5 font-mono text-sm text-zinc-400">
        Waiting for the first quote from abroad. Local baseline {eur(baseline)}.
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
        className="rounded-lg border border-zinc-800 bg-zinc-950 paper p-5 sm:p-6"
      >
        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-1">
              <span className="stamp text-xs text-red-500">The math</span>
            </div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Best abroad: {best.artistName}, {best.artistCity} <CountryTag flag={best.artistFlag} />
            </h2>
            <div className="mt-3 font-mono text-sm text-zinc-300">
              {eur(best.priceEur)} tattoo + {eur(best.estimatedRoundtripFlightEur)} flight = {eur(total)} vs{" "}
              <s className="decoration-red-600">{eur(baseline)}</s> {request.clientCity}
            </div>
            {vsLocalQuote !== null && vsLocalQuote > 0 && (
              <p className="mt-2 text-xs text-zinc-500">
                Also {eur(vsLocalQuote)} cheaper than the lowest local quote ({local!.artistName} at {eur(local!.priceEur)}).
              </p>
            )}
          </div>

          <motion.div
            key={savings}
            className="text-left lg:text-right"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">You keep</div>
            <div className="font-display text-6xl text-red-500">{eur(Math.max(savings, 0))}</div>
            <div className="text-xs text-zinc-400">{pct}% less · flight included</div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
