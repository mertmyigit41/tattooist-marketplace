"use client";

import { motion } from "framer-motion";
import { Check, ExternalLink, MessageCircle, PartyPopper } from "lucide-react";
import { useState } from "react";
import { markBooked } from "@/lib/actions";
import { useProfile } from "@/lib/hooks";
import type { Bid, TattooRequest } from "@/lib/types";
import { eur, stripEmoji } from "@/lib/utils";
import { bidTotal } from "./QuoteCard";
import { Button, Modal, Spinner } from "./ui";

export function AcceptModal({ bid, request, onClose }: { bid: Bid | null; request: TattooRequest; onClose: () => void }) {
  const artist = useProfile(bid?.artistId);
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!bid) return <Modal open={false} onClose={onClose}>{null}</Modal>;

  const total = bidTotal(bid);
  const savings = request.estimatedLocalPriceEur - total;
  const text = encodeURIComponent(
    `Hi ${bid.artistName}! I'm ${request.clientName} from ${request.clientCity} — I'm accepting your Inqfy quote of ${eur(bid.priceEur)} for "${request.title}" (${stripEmoji(bid.sessionPlan)}, from ${bid.availableDate}). Let's lock in the dates!`,
  );
  const wa = `https://wa.me/${(artist?.whatsapp ?? "").replace(/\D/g, "")}?text=${text}`;

  async function confirm() {
    const selectedBid = bid;
    if (!selectedBid) return;
    setBusy(true);
    setError(null);
    try {
      await markBooked(request.id, selectedBid.id);
      setConfirmed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not accept this quote");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={!!bid}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[#25D366]" /> Accept Quote
        </span>
      }
    >
      {confirmed ? (
        <div className="py-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <PartyPopper className="h-8 w-8" />
          </motion.div>
          <h3 className="text-xl font-bold">Quote accepted!</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Your request is now marked <b className="text-emerald-300">booked</b>. Continue the conversation with {bid.artistName} on WhatsApp.
          </p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-6 block">
            <Button variant="whatsapp" size="lg" className="w-full">
              <MessageCircle className="h-5 w-5" /> Open WhatsApp Chat <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          <Button variant="ghost" className="mt-2 w-full" onClick={onClose}>Close</Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-zinc-100 font-display text-xl text-zinc-950">
              {bid.artistName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold">{bid.artistName}</div>
              <div className="text-xs text-zinc-400">{bid.artistCity}, {bid.artistCountry} · {stripEmoji(bid.sessionPlan)} · from {bid.availableDate}</div>
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-zinc-400">Fixed tattoo price</span><b>{eur(bid.priceEur)}</b></li>
            <li className="flex justify-between"><span className="text-zinc-400">Est. roundtrip flight</span><b>{eur(bid.estimatedRoundtripFlightEur)}</b></li>
            <li className="flex justify-between border-t border-zinc-800 pt-2"><span className="text-zinc-200">Total landed cost</span><b className="text-lg">{eur(total)}</b></li>
            {savings > 0 && (
              <li className="flex justify-between rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-300"><span>You save vs. {request.clientCity}</span><b>{eur(savings)}</b></li>
            )}
          </ul>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-xs text-zinc-400">
            <Check className="mr-1 inline h-3.5 w-3.5 text-emerald-400" /> Fixed price locked. No surprise consultation fees.
            <br />
            <Check className="mr-1 inline h-3.5 w-3.5 text-emerald-400" /> Payment is made directly to the studio — Inqfy takes 0% commission.
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button variant="whatsapp" onClick={confirm} disabled={busy} className="flex-[2]">
              {busy ? <Spinner className="border-zinc-900" /> : <MessageCircle className="h-4 w-4" />} Confirm & Open WhatsApp
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
