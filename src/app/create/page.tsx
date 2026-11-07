"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe2, MapPin, Plane, Rocket, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ImageToggle, StencilImage } from "@/components/ImageToggle";
import { Button, Card, Pill, Spinner } from "@/components/ui";
import { createRequest } from "@/lib/actions";
import { STYLE_CONCEPTS } from "@/lib/images";
import { usePersona } from "@/lib/persona";
import type { TravelMode } from "@/lib/types";
import { cn, eur, localPriceFor, PLACEMENTS, sizeFor, STYLES } from "@/lib/utils";

const EXAMPLE = "Japanese Irezumi dragon coiling around cherry blossoms and waves";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export default function CreatePage() {
  const router = useRouter();
  const { persona } = usePersona();
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string>(STYLES[0]);
  const [placement, setPlacement] = useState<string>(PLACEMENTS[0].id);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ concept: string; stencil: string; source: string } | null>(null);
  const [view, setView] = useState<"concept" | "stencil">("concept");

  const [travelMode, setTravelMode] = useState<TravelMode>("open_worldwide");
  const [destination, setDestination] = useState("Thailand - Nov 2026");
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localPrice = localPriceFor(placement);
  const title = useMemo(() => {
    const p = prompt.trim();
    if (!p) return "";
    const short = p.length > 48 ? p.slice(0, 48).replace(/\s+\S*$/, "") + "…" : p;
    return `${placement} ${short.charAt(0).toUpperCase() + short.slice(1)}`;
  }, [prompt, placement]);

  async function generate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, placement }),
      });
      const data = (await res.json()) as { concept?: string; source?: string };
      const pool = STYLE_CONCEPTS[style] ?? STYLE_CONCEPTS["Irezumi / Japanese"];
      const concept = data.concept ?? pool[hash(prompt + placement) % pool.length];
      await new Promise((r) => setTimeout(r, data.source === "ai" ? 0 : 1400));
      setResult({ concept, stencil: concept, source: data.source ?? "curated" });
      setView("concept");
    } finally {
      setGenerating(false);
    }
  }

  async function launch() {
    if (!result) return;
    setLaunching(true);
    setError(null);
    try {
      const id = await createRequest({
        clientId: persona.id,
        clientName: persona.name,
        clientCity: persona.city,
        clientCountry: persona.country,
        clientFlag: persona.flag,
        title,
        prompt: prompt.trim(),
        style,
        bodyPart: placement,
        size: sizeFor(placement),
        conceptImageUrl: result.concept,
        stencilImageUrl: result.stencil,
        travelMode,
        targetDestination: travelMode === "specific_destination" ? destination : "",
        estimatedLocalPriceEur: localPrice,
      });
      router.push(`/requests/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to launch request");
      setLaunching(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
          <Sparkles className="h-3.5 w-3.5" /> AI Tattoo & Stencil Studio
        </div>
        <h1 className="text-3xl font-black sm:text-4xl">Design it. Stencil it. Put the world&apos;s studios to work.</h1>
        <p className="mt-2 text-zinc-400">Step 1 generates concept art + an artist-ready stencil. Step 2 launches your request to the global marketplace.</p>
      </header>

      <Card className="p-6 sm:p-8">
        <StepLabel n={1} title="Design Generator" accent="violet" />
        <label className="mt-5 block text-sm font-semibold text-zinc-200">Your tattoo idea</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder={`e.g. "${EXAMPLE}"`}
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-violet-500"
          />
          <Button variant="ghost" size="sm" onClick={() => setPrompt(EXAMPLE)} className="shrink-0 text-violet-300">
            <Wand2 className="h-4 w-4" /> Use example
          </Button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-semibold text-zinc-200">Style</div>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <Pill key={s} active={style === s} accent="violet" onClick={() => setStyle(s)}>{s}</Pill>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-zinc-200">Body Placement & Scale</div>
            <div className="flex flex-wrap gap-2">
              {PLACEMENTS.map((p) => (
                <Pill key={p.id} active={placement === p.id} accent="amber" onClick={() => setPlacement(p.id)}>
                  {p.label}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="violet" size="lg" onClick={generate} disabled={!prompt.trim() || generating} className="w-full sm:w-auto">
            {generating ? <Spinner className="border-white" /> : <Sparkles className="h-5 w-5" />}
            {generating ? "Generating concept & stencil…" : "Generate Tattoo & Stencil"}
          </Button>
        </div>

        <AnimatePresence>
          {generating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 grid gap-4 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800" />
              ))}
            </motion.div>
          )}
          {result && !generating && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex rounded-full border border-zinc-800 bg-zinc-950 p-1 text-sm">
                  <button onClick={() => setView("concept")} className={cn("rounded-full px-4 py-1.5 font-medium transition", view === "concept" ? "bg-violet-500 text-white" : "text-zinc-400")}>Tattoo Concept Art</button>
                  <button onClick={() => setView("stencil")} className={cn("rounded-full px-4 py-1.5 font-medium transition", view === "stencil" ? "bg-white text-zinc-950" : "text-zinc-400")}>Artist-Ready Stencil</button>
                </div>
                <span className="text-xs text-zinc-500">
                  {result.source === "ai" ? "Generated with AI image model" : "Curated concept + high-contrast stencil filter (no API key configured)"}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className={cn("overflow-hidden rounded-2xl border transition", view === "concept" ? "border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.3)]" : "border-zinc-800 opacity-70")}>
                  <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-violet-300">Concept Art <span className="text-zinc-500">{style}</span></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.concept} alt="Concept" className="aspect-square w-full object-cover" />
                </div>
                <div className={cn("overflow-hidden rounded-2xl border transition", view === "stencil" ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.15)]" : "border-zinc-800 opacity-70")}>
                  <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300">Stencil · B&W Line Art <span className="text-zinc-500">{placement}</span></div>
                  <StencilImage src={result.stencil} alt="Stencil" className="aspect-square w-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <AnimatePresence>
        {result && !generating && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 sm:p-8">
              <StepLabel n={2} title="Post to Global Marketplace" accent="emerald" />

              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-zinc-200">Location & Travel Mode</div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <ModeCard
                        active={travelMode === "local_only"}
                        onClick={() => setTravelMode("local_only")}
                        icon={<MapPin className="h-5 w-5" />}
                        title={`Local Only`}
                        text={`${persona.city}, ${persona.country} ${persona.flag}`}
                        accent="zinc"
                      />
                      <ModeCard
                        active={travelMode === "specific_destination"}
                        onClick={() => setTravelMode("specific_destination")}
                        icon={<Plane className="h-5 w-5" />}
                        title="Planned Trip"
                        text="Specify destination & dates"
                        accent="sky"
                      />
                      <ModeCard
                        active={travelMode === "open_worldwide"}
                        onClick={() => setTravelMode("open_worldwide")}
                        icon={<Globe2 className="h-5 w-5" />}
                        title="Global Arbitrage Mode"
                        text="I'll fly anywhere if price & portfolio beat local rates"
                        accent="emerald"
                      />
                    </div>
                    {travelMode === "specific_destination" && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder='e.g. "Thailand - Nov 2026"'
                        className="mt-3 w-full rounded-xl border border-sky-500/40 bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
                      />
                    )}
                  </div>

                  <div>
                    <div className="mb-1 text-sm font-semibold text-zinc-200">Request title</div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300">{title}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                  <ImageToggle concept={result.concept} stencil={result.stencil} alt={title} size="sm" className="aspect-square w-full" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500">Estimated local price in {persona.country}</div>
                    <div className="text-3xl font-black">{eur(localPrice)}</div>
                    <div className="text-xs text-zinc-500">{placement} · {sizeFor(placement)} · {style}</div>
                  </div>
                  <Button variant="emerald" size="lg" onClick={launch} disabled={launching} className="mt-auto w-full">
                    {launching ? <Spinner className="border-zinc-900" /> : <Rocket className="h-5 w-5" />}
                    Launch Request & Get Quotes <ArrowRight className="h-4 w-4" />
                  </Button>
                  {error && <p className="text-xs text-rose-400">{error}</p>}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepLabel({ n, title, accent }: { n: number; title: string; accent: "violet" | "emerald" }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-black", accent === "violet" ? "bg-violet-500 text-white" : "bg-emerald-500 text-zinc-950")}>{n}</span>
      <h2 className="text-xl font-bold">Step {n} · {title}</h2>
    </div>
  );
}

function ModeCard({ active, onClick, icon, title, text, accent }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; text: string; accent: "zinc" | "sky" | "emerald" }) {
  const activeCls = {
    zinc: "border-zinc-300 bg-zinc-100/10",
    sky: "border-sky-400 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.25)]",
    emerald: "border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  }[accent];
  return (
    <button type="button" onClick={onClick} className={cn("rounded-xl border p-3 text-left transition", active ? activeCls : "border-zinc-800 bg-zinc-950 hover:border-zinc-600")}>
      <div className={cn("mb-1", active ? (accent === "emerald" ? "text-emerald-300" : accent === "sky" ? "text-sky-300" : "text-zinc-100") : "text-zinc-500")}>{icon}</div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-zinc-400">{text}</div>
    </button>
  );
}
