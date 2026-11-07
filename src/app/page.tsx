"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plane, Sparkles } from "lucide-react";
import Link from "next/link";
import { FLAGSHIP_REQUEST_ID } from "@/lib/seed";
import { Button } from "@/components/ui";

const STEPS = [
  { n: "01", title: "Post the design", text: "Describe it, pick style and placement, get a concept and a clean stencil. One post, no studio-hopping." },
  { n: "02", title: "Studios bid a fixed price", text: "Verified studios from Istanbul to Bangkok answer with a number, a session plan and three matching pieces. No “DM for price”." },
  { n: "03", title: "Count the flight, keep the change", text: "We add the roundtrip fare and compare the landed cost against your local baseline. Then you talk to the artist on WhatsApp." },
];

const CITIES = [
  { city: "Dublin", price: "€3,800", note: "local baseline" },
  { city: "Istanbul", price: "€1,170", note: "incl. €220 flight" },
  { city: "Bangkok", price: "€1,400", note: "incl. €650 flight" },
  { city: "Bali", price: "€1,550", note: "incl. €750 flight" },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="stamp text-red-500 text-sm">Reverse marketplace · est. 2026</span>
          <h1 className="mt-6 text-[clamp(2.8rem,6vw,5.75rem)] text-zinc-50">
            Your sleeve costs
            <br />
            <span className="text-zinc-500 line-through decoration-red-600 decoration-[6px]">€3,800</span> in Dublin.
            <br />
            <span className="text-red-500">€1,170</span> in Istanbul.
            <br />
            Flight included.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-zinc-400">
            Post the design once. Studios worldwide bid a fixed price. Inqfy adds the airfare and shows
            what you actually save — then gets out of the way.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/create">
              <Button variant="violet" size="lg"><Sparkles className="h-5 w-5" /> Post a design</Button>
            </Link>
            <Link href={`/requests/${FLAGSHIP_REQUEST_ID}`}>
              <Button variant="outline" size="lg">See a live bid war <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotate: -1.5, y: 20 }}
          animate={{ opacity: 1, rotate: -1.5, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm overflow-hidden rounded-sm border border-zinc-700 bg-[#121214] paper p-3 shadow-[8px_8px_0_0_#dc2626]"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="/img/sleeve-flickr-stiller-beobachter.jpg"
              alt="Full sleeve tattoo"
              className="h-full w-full object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent" />
            <span className="absolute left-3 top-3 stamp text-xs text-zinc-100">Flash No. 001</span>
          </div>
          <div className="mt-3 flex items-end justify-between px-1">
            <div>
              <div className="font-display text-2xl leading-none text-zinc-100">Cyber-Irezumi Dragon</div>
              <div className="text-xs text-zinc-500">Full sleeve · 4 live quotes</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500">you save</div>
              <div className="font-display text-3xl leading-none text-emerald-400">€2,630</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="rule-dashed pt-10">
        <div className="grid gap-px overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-4">
          {CITIES.map((c, i) => (
            <div key={c.city} className="paper bg-[#121214] p-5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-zinc-500">
                <span>{c.city}</span>
                {i > 0 && <Plane className="h-3.5 w-3.5" />}
              </div>
              <div className={`mt-2 font-display text-5xl leading-none ${i === 0 ? "text-zinc-500 line-through decoration-red-600 decoration-4" : "text-zinc-50"}`}>
                {c.price}
              </div>
              <div className="mt-1 text-xs text-zinc-500">{c.note}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">Seeded demo numbers from the live flagship request. Flights are estimated roundtrip economy fares.</p>
      </section>

      <section className="grid gap-10 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="border-t-2 border-zinc-200 pt-5">
            <div className="font-display text-5xl leading-none text-red-500">{s.n}</div>
            <h3 className="mt-3 font-display text-2xl tracking-wide text-zinc-50">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.text}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
