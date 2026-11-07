"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe2, MapPin, Plane, Sparkles, Wand2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
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
  return (
    <Suspense fallback={<div className="py-24 text-center text-zinc-500"><Spinner /> Loading design studio…</div>}>
      <CreateContent />
    </Suspense>
  );
}

function CreateContent() {
  const searchParams = useSearchParams();
  const queryStyle = searchParams.get("style");
  const imageParam = searchParams.get("img");
  const initialStyle =
    queryStyle && STYLES.some((candidate) => candidate === queryStyle)
      ? queryStyle
      : STYLES[0];

  return (
    <CreateForm
      key={`${queryStyle ?? ""}|${imageParam ?? ""}`}
      initialStyle={initialStyle}
      hasPrefill={!!queryStyle || !!imageParam}
      imageParam={imageParam}
    />
  );
}

function CreateForm({
  initialStyle,
  hasPrefill,
  imageParam,
}: {
  initialStyle: string;
  hasPrefill: boolean;
  imageParam: string | null;
}) {
  const router = useRouter();
  const { persona } = usePersona();
  const [prompt, setPrompt] = useState(() => hasPrefill ? `Like this ${initialStyle} piece` : "");
  const [style, setStyle] = useState<string>(initialStyle);
  const [placement, setPlacement] = useState<string>(PLACEMENTS[0].id);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ concept: string; stencil: string; source: string } | null>(() =>
    imageParam ? { concept: imageParam, stencil: imageParam, source: "curated" } : null,
  );
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
      const pool = STYLE_CONCEPTS[style] ?? STYLE_CONCEPTS["Irezumi / Japanese"];
      const concept = pool[hash(prompt + placement) % pool.length];
      await new Promise((r) => setTimeout(r, 1400));
      setResult({ concept, stencil: concept, source: "curated" });
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
        <div className="mb-2"><span className="stamp text-sm text-red-500">Design studio</span></div>
        <h1 className="text-3xl font-black sm:text-4xl">Describe it. We draw it. Studios bid on it.</h1>
        <p className="mt-2 text-zinc-400">Get a concept and a clean stencil, then post it to studios worldwide.</p>
      </header>

      <Card className="p-6 sm:p-8">
        <StepLabel n={1} title="Draw the design" />
        <label className="mt-5 block text-sm font-semibold text-zinc-200">Your tattoo idea</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder={`e.g. "${EXAMPLE}"`}
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-red-500"
          />
          <Button variant="ghost" size="sm" onClick={() => setPrompt(EXAMPLE)} className="shrink-0 text-red-300">
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
                <Pill key={p.id} active={placement === p.id} accent="violet" onClick={() => setPlacement(p.id)}>
                  {p.label}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="violet" size="lg" onClick={generate} disabled={!prompt.trim() || generating} className="w-full sm:w-auto">
            {generating ? <Spinner className="border-white" /> : <Sparkles className="h-5 w-5" />}
            {generating ? "Drawing…" : "Draw concept + stencil"}
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
                  <button onClick={() => setView("concept")} className={cn("rounded-full px-4 py-1.5 font-medium transition", view === "concept" ? "bg-red-500 text-white" : "text-zinc-400")}>Tattoo Concept Art</button>
                  <button onClick={() => setView("stencil")} className={cn("rounded-full px-4 py-1.5 font-medium transition", view === "stencil" ? "bg-white text-zinc-950" : "text-zinc-400")}>Artist-Ready Stencil</button>
                </div>
                <span className="text-xs text-zinc-500">Curated concept + stencil filter (demo)</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className={cn("overflow-hidden rounded-2xl border transition", view === "concept" ? "border-zinc-100" : "border-zinc-800 opacity-70")}>
                  <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-red-300">Concept Art <span className="text-zinc-500">{style}</span></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.concept} alt="Concept" className="aspect-square w-full object-cover" />
                </div>
                <div className={cn("overflow-hidden rounded-2xl border transition", view === "stencil" ? "border-zinc-100" : "border-zinc-800 opacity-70")}>
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
              <StepLabel n={2} title="Post it to studios" />

              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-zinc-200">Location & Travel Mode</div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <ModeCard
                        active={travelMode === "local_only"}
                        onClick={() => setTravelMode("local_only")}
                        icon={<MapPin className="h-5 w-5" />}
                        title="Local only"
                        text={`${persona.city}, ${persona.country}`}
                      />
                      <ModeCard
                        active={travelMode === "specific_destination"}
                        onClick={() => setTravelMode("specific_destination")}
                        icon={<Plane className="h-5 w-5" />}
                        title="Planned trip"
                        text="Where and when"
                      />
                      <ModeCard
                        active={travelMode === "open_worldwide"}
                        onClick={() => setTravelMode("open_worldwide")}
                        icon={<Globe2 className="h-5 w-5" />}
                        title="Anywhere"
                        text="I'll fly if the total beats home"
                      />
                    </div>
                    {travelMode === "specific_destination" && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder='e.g. "Thailand - Nov 2026"'
                        className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 text-sm outline-none focus:border-zinc-300"
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
                  <Button variant="violet" size="lg" onClick={launch} disabled={launching} className="mt-auto w-full">
                    {launching && <Spinner className="border-white" />}
                    Post it — get quotes <ArrowRight className="h-4 w-4" />
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

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-display text-4xl text-red-500">{String(n).padStart(2, "0")}</span>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}

function ModeCard({ active, onClick, icon, title, text }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; text: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("rounded-xl border p-3 text-left transition", active ? "border-zinc-100 bg-zinc-100 text-zinc-950" : "border-zinc-800 bg-zinc-950 hover:border-zinc-600")}>
      <div className={cn("mb-1", active ? "text-zinc-950" : "text-zinc-500")}>{icon}</div>
      <div className="text-sm font-semibold">{title}</div>
      <div className={cn("text-xs", active ? "text-zinc-700" : "text-zinc-400")}>{text}</div>
    </button>
  );
}
