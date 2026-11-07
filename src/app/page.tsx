"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe2, Radio, Sparkles, TrendingDown } from "lucide-react";
import Link from "next/link";
import { FLAGSHIP_REQUEST_ID } from "@/lib/seed";
import { Button, Card } from "@/components/ui";

const STEPS = [
  { icon: Sparkles, title: "Generate your design", text: "Describe the tattoo, pick a style and placement. Get concept art + an artist-ready stencil in seconds.", color: "text-violet-400" },
  { icon: Radio, title: "Studios bid live", text: "Verified studios from Dublin to Bangkok send fixed-price quotes with session plans and matching portfolio pieces.", color: "text-amber-400" },
  { icon: TrendingDown, title: "See the real arbitrage", text: "We add estimated flights so you compare total landed cost against your local baseline — then connect on WhatsApp.", color: "text-emerald-400" },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 px-6 py-16 text-center sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Globe2 className="h-3.5 w-3.5" /> Reverse marketplace · Global tattoo price arbitrage
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
            Post once. Get fixed-price quotes from studios{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">worldwide</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-400">
            A €3,800 Dublin sleeve is €750 in Bangkok. Inqfy shows you exactly what you save — even after flights — and lets artists compete for your design.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/create">
              <Button variant="violet" size="lg"><Sparkles className="h-5 w-5" /> Open AI Tattoo Studio</Button>
            </Link>
            <Link href={`/requests/${FLAGSHIP_REQUEST_ID}`}>
              <Button variant="outline" size="lg">See the arbitrage demo <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text, color }, i) => (
          <motion.div key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
            <Card className="h-full p-6">
              <Icon className={`mb-4 h-8 w-8 ${color}`} />
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Step {i + 1}</div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{text}</p>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
