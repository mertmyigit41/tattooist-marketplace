"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Check, Crown, Globe2, Infinity as InfinityIcon, Percent } from "lucide-react";
import { useState } from "react";
import { Button, Modal } from "./ui";

const PERKS = [
  { icon: Percent, text: "0% commission on every booking — keep 100% of your price" },
  { icon: Globe2, text: "Unlimited access to high-budget international tattoo tourists" },
  { icon: BadgeCheck, text: "Verified Pro badge & priority ranking in the live feed" },
  { icon: InfinityIcon, text: "Unlimited quotes, portfolio uploads and perks listings" },
];

export function ProUpsell() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-950 paper p-6 sm:p-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <div className="mb-2"><span className="stamp text-xs text-red-500">For studios</span></div>
            <h2 className="text-2xl font-bold sm:text-3xl">Run a studio? Stop paying 20% commission.</h2>
            <p className="mt-2 text-zinc-300">
              Inqfy Pro is $250/year flat. 0% commission, priority in the feed, and clients who already budgeted for the flight.
            </p>
          </div>
          <Button variant="outline" size="lg" onClick={() => setOpen(true)} className="shrink-0">
            <Crown className="h-5 w-5" /> Join Inqfy Pro
          </Button>
        </div>
      </motion.div>

      <Modal open={open} onClose={() => setOpen(false)} title={<span className="flex items-center gap-2"><Crown className="h-5 w-5 text-red-500" /> Inqfy Pro Studio Membership</span>}>
        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Welcome to Inqfy Pro (demo)</h3>
            <p className="mt-2 text-sm text-zinc-400">Your studio would now appear with a Verified Pro badge and priority placement in the live feed.</p>
            <Button className="mt-6" onClick={() => setOpen(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-700 bg-zinc-950 p-5 text-center">
              <div className="text-5xl font-black">$250<span className="text-lg font-semibold text-zinc-400">/year</span></div>
              <div className="mt-1 text-sm text-zinc-400">vs. 15–20% commission on comparable marketplaces</div>
            </div>
            <ul className="space-y-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-200">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-zinc-400">
              Example ROI: one international full-sleeve booking at €750 covers 3 years of membership.
            </div>
            <Button variant="violet" size="lg" className="w-full" onClick={() => setDone(true)}>
              Start Pro Membership (simulated)
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
