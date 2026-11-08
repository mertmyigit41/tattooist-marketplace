"use client";

import { motion } from "framer-motion";
import { Check, ExternalLink, MessageCircle, PartyPopper } from "lucide-react";
import { useState } from "react";
import { markBooked } from "@/lib/actions";
import { useProfile } from "@/lib/hooks";
import type { Bid, TattooRequest } from "@/lib/types";
import { eur, stripEmoji } from "@/lib/utils";
import { Button, Modal, Spinner } from "./ui";

export function AcceptModal({ bid, request, onClose }: { bid: Bid | null; request: TattooRequest; onClose: () => void }) {
  const artist = useProfile(bid?.artistId);
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!bid) return <Modal open={false} onClose={onClose}>{null}</Modal>;

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
          <MessageCircle className="h-5 w-5" /> Accept quote
        </span>
      }
    >
      {confirmed ? (
        <div className="py-4 text-center">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive/10 text-positive">
            <PartyPopper className="h-8 w-8" />
          </motion.div>
          <h3 className="text-xl font-medium">Quote accepted</h3>
          <p className="mt-2 text-sm text-fg-2">
            Your request is now marked <span className="text-positive">booked</span>. Continue the conversation with {bid.artistName} on WhatsApp
          </p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-6 block">
            <Button size="lg" className="w-full">
              <MessageCircle className="h-5 w-5" /> Open WhatsApp chat <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          <Button variant="ghost" className="mt-2 w-full" onClick={onClose}>Close</Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl border border-line bg-raised p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-raised text-xs font-medium text-fg-2">
              {bid.artistName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{bid.artistName}</div>
              <div className="text-xs text-fg-2">{bid.artistCity}, {bid.artistCountry} · {stripEmoji(bid.sessionPlan)} · from {bid.availableDate}</div>
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-fg-2">Fixed tattoo price</span><span className="font-mono font-medium tabular-nums">{eur(bid.priceEur)}</span></li>
            <li className="flex justify-between gap-4"><span className="text-fg-2">Session plan</span><span className="text-right font-medium">{stripEmoji(bid.sessionPlan)}</span></li>
            <li className="flex justify-between"><span className="text-fg-2">Starts</span><span className="font-medium">{bid.availableDate}</span></li>
          </ul>

          <div className="rounded-xl border border-line bg-raised p-3 text-xs text-fg-2">
            <Check className="mr-1 inline h-3.5 w-3.5 text-positive" /> Fixed price locked. No surprise consultation fees
            <br />
            <Check className="mr-1 inline h-3.5 w-3.5 text-positive" /> Payment is made directly to the studio — Inqfy takes 0% commission
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-negative/40 bg-negative/10 px-3 py-2 text-sm text-negative">{error}</p>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={confirm} disabled={busy} className="flex-[2]">
              {busy ? <Spinner className="border-ink" /> : <MessageCircle className="h-4 w-4" />} Confirm and open WhatsApp
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
