"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Check, Crown, Globe2, Infinity as InfinityIcon, Percent } from "lucide-react";
import { useState } from "react";
import { Button, Modal } from "./ui";

const PERKS = [
  { icon: Percent, text: "0% commission on every booking — keep 100% of your price" },
  { icon: Globe2, text: "Clients who already posted a brief, style, placement and location — no cold leads" },
  { icon: BadgeCheck, text: "Verified Pro badge & priority ranking in the live feed" },
  { icon: InfinityIcon, text: "Unlimited quotes and portfolio uploads" },
];

export function ProUpsell() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-line bg-card p-6 sm:p-8"
      >
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-medium sm:text-3xl">Run a studio? Stop paying 20% commission</h2>
            <p className="mt-2 text-fg-2">
              Inqfy Pro is $250/year flat. 0% commission, priority in the feed, and clients who have already written the brief.
            </p>
          </div>
          <Button variant="secondary" size="lg" onClick={() => setOpen(true)} className="shrink-0">
            <Crown className="h-5 w-5" /> Join Inqfy Pro
          </Button>
        </div>
      </motion.div>

      <Modal open={open} onClose={() => setOpen(false)} title={<span className="flex items-center gap-2"><Crown className="h-5 w-5 text-fg-3" /> Inqfy Pro studio membership</span>}>
        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-positive/10 text-positive">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-medium">Welcome to Inqfy Pro (demo)</h3>
            <p className="mt-2 text-sm text-fg-2">Your studio would now appear with a verified Pro badge and priority placement in the live feed</p>
            <Button className="mt-6" onClick={() => setOpen(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-raised p-5 text-center">
              <div className="font-mono text-4xl font-medium tabular-nums">$250/year</div>
              <div className="mt-1 text-sm text-fg-2">vs. 15–20% commission on comparable marketplaces</div>
            </div>
            <ul className="space-y-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-raised text-fg-3">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-line bg-raised p-4 text-xs text-fg-2">
              Example: a single sleeve booking covers several years of membership
            </div>
            <Button size="lg" className="w-full" onClick={() => setDone(true)}>
              Start Pro Membership (simulated)
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
