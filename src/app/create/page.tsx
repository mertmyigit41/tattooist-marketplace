"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe2, MapPin, Plane, Sparkles, Wand2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ImageToggle, StencilImage } from "@/components/ImageToggle";
import { LiveRoleGate } from "@/components/LiveRoleGate";
import { ReachPreview } from "@/components/ReachPreview";
import { Button, Card, Pill, SegmentedControl, Spinner } from "@/components/ui";
import { createRequest } from "@/lib/actions";
import { STYLE_CONCEPTS } from "@/lib/images";
import { usePersona } from "@/lib/persona";
import type { TravelMode } from "@/lib/types";
import {
  cn,
  DAY_MS,
  PLACEMENTS,
  QUOTE_WINDOWS,
  sizeFor,
  STYLES,
  TRAVEL_MODE_META,
} from "@/lib/utils";

const EXAMPLE = "Japanese Irezumi dragon coiling around cherry blossoms and waves";

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function parseReferenceUrls(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.startsWith("/img/") || url.startsWith("https://"))
    .slice(0, 3);
}

export default function CreatePage() {
  return (
    <LiveRoleGate role="client">
      <Suspense fallback={<div className="py-24 text-center text-fg-3"><Spinner /> Loading design studio…</div>}>
        <CreateContent />
      </Suspense>
    </LiveRoleGate>
  );
}

function CreateContent() {
  const searchParams = useSearchParams();
  const queryStyle = searchParams.get("style");
  const imageParam = searchParams.get("img");
  const promptParam = searchParams.get("prompt");
  const placementParam = searchParams.get("placement");
  const travelParam = searchParams.get("travel");
  const windowParam = searchParams.get("window");
  const refsParam = searchParams.get("refs");
  const initialStyle =
    queryStyle && STYLES.some((candidate) => candidate === queryStyle)
      ? queryStyle
      : STYLES[0];
  const initialPrompt = promptParam?.trim()
    ? promptParam
    : queryStyle || imageParam
      ? `Like this ${initialStyle} piece`
      : "";
  const initialPlacement = PLACEMENTS.some((placement) => placement.id === placementParam)
    ? placementParam!
    : PLACEMENTS[0].id;
  const initialTravelMode: TravelMode =
    travelParam === "local_only" ||
    travelParam === "specific_destination" ||
    travelParam === "open_worldwide"
      ? travelParam
      : "open_worldwide";
  const initialWindowDays =
    windowParam === "3" || windowParam === "7" || windowParam === "14"
      ? Number(windowParam)
      : 7;
  const initialReferenceUrls = parseReferenceUrls(refsParam);

  return (
    <CreateForm
      key={[queryStyle, imageParam, promptParam, placementParam, travelParam, windowParam, refsParam].map((value) => value ?? "").join("|")}
      initialStyle={initialStyle}
      initialPrompt={initialPrompt}
      initialPlacement={initialPlacement}
      initialTravelMode={initialTravelMode}
      initialWindowDays={initialWindowDays}
      initialReferenceUrls={initialReferenceUrls}
      imageParam={imageParam}
    />
  );
}

function CreateForm({
  initialStyle,
  initialPrompt,
  initialPlacement,
  initialTravelMode,
  initialWindowDays,
  initialReferenceUrls,
  imageParam,
}: {
  initialStyle: string;
  initialPrompt: string;
  initialPlacement: string;
  initialTravelMode: TravelMode;
  initialWindowDays: number;
  initialReferenceUrls: string[];
  imageParam: string | null;
}) {
  const router = useRouter();
  const { persona } = usePersona();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState<string>(initialStyle);
  const [placement, setPlacement] = useState<string>(initialPlacement);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ concept: string; stencil: string; source: string } | null>(() =>
    imageParam ? { concept: imageParam, stencil: imageParam, source: "curated" } : null,
  );
  const [view, setView] = useState<"concept" | "stencil">("concept");

  const [travelMode, setTravelMode] = useState<TravelMode>(initialTravelMode);
  const [destination, setDestination] = useState("Thailand - Nov 2026");
  const [windowDays, setWindowDays] = useState(initialWindowDays);
  const [referenceUrls, setReferenceUrls] = useState(initialReferenceUrls);
  const [referenceInput, setReferenceInput] = useState("");
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    const p = prompt.trim();
    if (!p) return "";
    const short = p.length > 48 ? p.slice(0, 48).replace(/\s+\S*$/, "") + "…" : p;
    return `${placement} ${short.charAt(0).toUpperCase() + short.slice(1)}`;
  }, [prompt, placement]);

  function addReference() {
    const [url] = parseReferenceUrls(referenceInput);
    if (!url || referenceUrls.length >= 3 || referenceUrls.includes(url)) return;
    setReferenceUrls((current) => [...current, url]);
    setReferenceInput("");
  }

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
        ...(referenceUrls.length ? { referenceImageUrls: referenceUrls } : {}),
        travelMode,
        targetDestination: travelMode === "specific_destination" ? destination : "",
        closesAt: Date.now() + windowDays * DAY_MS,
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
        <h1 className="font-display text-3xl sm:text-4xl">Describe it once. Studios come to you</h1>
        <p className="mt-2 text-fg-2">Get a concept and a clean stencil, then post it. Studios reply with complete fixed-price quotes</p>
      </header>

      <Card className="p-6 sm:p-8">
        <StepLabel n={1} title="Draw the design" />
        <label className="mt-5 block text-sm font-medium text-fg">Your tattoo idea</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder={`e.g. "${EXAMPLE}"`}
            className="h-11 flex-1 rounded-[10px] border border-line bg-raised px-4 text-[15px] text-fg outline-none placeholder:text-fg-3 focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <Button variant="ghost" size="sm" onClick={() => setPrompt(EXAMPLE)} className="shrink-0">
            <Wand2 className="h-4 w-4" /> Use example
          </Button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 text-sm font-medium text-fg">Style</div>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <Pill key={s} active={style === s} onClick={() => setStyle(s)}>{s}</Pill>
              ))}
            </div>
            <ReachPreview style={style} className="mt-2" />
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-fg">Body placement and scale</div>
            <div className="flex flex-wrap gap-2">
              {PLACEMENTS.map((p) => (
                <Pill key={p.id} active={placement === p.id} onClick={() => setPlacement(p.id)}>
                  {p.label}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button size="lg" onClick={generate} disabled={!prompt.trim() || generating} className="w-full sm:w-auto">
            {generating ? <Spinner className="border-white" /> : <Sparkles className="h-5 w-5" />}
            {generating ? "Drawing…" : "Draw concept + stencil"}
          </Button>
        </div>

        <AnimatePresence>
          {generating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 grid gap-4 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-raised" />
              ))}
            </motion.div>
          )}
          {result && !generating && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <SegmentedControl
                  value={view}
                  onChange={(value) => setView(value as "concept" | "stencil")}
                  ariaLabel="Preview type"
                  options={[{ value: "concept", label: "Tattoo concept" }, { value: "stencil", label: "Artist-ready stencil" }]}
                />
                <span className="text-xs text-fg-3">Curated concept + stencil filter (demo)</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className={cn("overflow-hidden rounded-2xl border transition-colors", view === "concept" ? "border-fg" : "border-line opacity-70")}>
                  <div className="flex items-center justify-between px-4 py-2 text-xs font-medium text-fg-2">Concept art <span className="text-fg-3">{style}</span></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.concept} alt="Concept" className="aspect-square w-full object-cover" />
                </div>
                <div className={cn("overflow-hidden rounded-2xl border transition-colors", view === "stencil" ? "border-fg" : "border-line opacity-70")}>
                  <div className="flex items-center justify-between px-4 py-2 text-xs font-medium text-fg-2">Stencil · B&amp;W line art <span className="text-fg-3">{placement}</span></div>
                  <StencilImage src={result.stencil} alt="Stencil" className="aspect-square w-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <AnimatePresence>
        {result && !generating && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <Card className="p-6 sm:p-8">
              <StepLabel n={2} title="Post it to studios" />

              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 text-sm font-medium text-fg">Where do you want it done?</div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <ModeCard
                        active={travelMode === "local_only"}
                        onClick={() => setTravelMode("local_only")}
                        icon={<MapPin className="h-5 w-5" />}
                        title="Near me"
                        text={`${persona.city}, ${persona.country}`}
                      />
                      <ModeCard
                        active={travelMode === "specific_destination"}
                        onClick={() => setTravelMode("specific_destination")}
                        icon={<Plane className="h-5 w-5" />}
                        title="On a trip"
                        text="Tell studios where and when"
                      />
                      <ModeCard
                        active={travelMode === "open_worldwide"}
                        onClick={() => setTravelMode("open_worldwide")}
                        icon={<Globe2 className="h-5 w-5" />}
                        title="Anywhere"
                        text="Open to travelling for the right artist"
                      />
                    </div>
                    {travelMode === "specific_destination" && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder='e.g. "Thailand - Nov 2026"'
                        className="mt-3 h-11 w-full rounded-[10px] border border-line bg-raised px-4 text-[15px] text-fg outline-none placeholder:text-fg-3 focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      />
                    )}
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-medium text-fg">Style references (optional)</div>
                    <div className="flex gap-2">
                      <input
                        value={referenceInput}
                        onChange={(event) => setReferenceInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addReference();
                          }
                        }}
                        placeholder="Paste an image link"
                        className="h-10 min-w-0 flex-1 rounded-[10px] border border-line bg-raised px-3 text-sm text-fg outline-none placeholder:text-fg-3 focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      />
                      <Button variant="secondary" size="sm" onClick={addReference} disabled={referenceUrls.length >= 3}>Add</Button>
                    </div>
                    {referenceUrls.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {referenceUrls.map((url) => (
                          <div key={url} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="h-16 w-16 rounded-md border border-line object-cover" />
                            <button
                              type="button"
                              aria-label="Remove style reference"
                              onClick={() => setReferenceUrls((current) => current.filter((item) => item !== url))}
                              className="absolute -right-1.5 -top-1.5 rounded-md border border-line bg-card p-0.5 text-fg-2 hover:text-fg"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-medium text-fg">Accept quotes for</div>
                    <div className="flex flex-wrap gap-2">
                      {QUOTE_WINDOWS.map((option) => (
                        <Pill
                          key={option.days}
                          active={windowDays === option.days}
                          onClick={() => setWindowDays(option.days)}
                        >
                          {option.label}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 text-sm font-medium text-fg">Request title</div>
                    <div className="rounded-xl border border-line bg-raised px-4 py-2.5 text-sm text-fg-2">{title}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-line bg-raised p-4">
                  <ImageToggle concept={result.concept} stencil={result.stencil} alt={title} size="sm" className="aspect-square w-full" />
                  <div>
                    <div className="text-xs text-fg-3">Your request</div>
                    <div className="mt-1 text-sm font-medium text-fg">{placement} · {sizeFor(placement)}</div>
                    <div className="text-sm text-fg-2">{style}</div>
                    <div className="text-sm text-fg-2">{TRAVEL_MODE_META[travelMode].label}</div>
                    <div className="text-sm text-fg-2">
                      Quotes close in {QUOTE_WINDOWS.find((option) => option.days === windowDays)?.label}
                    </div>
                    <ReachPreview style={style} className="mt-1" />
                  </div>
                  <Button size="lg" onClick={launch} disabled={launching} className="mt-auto w-full">
                    {launching && <Spinner className="border-ink" />}
                    Post request — get quotes <ArrowRight className="h-4 w-4" />
                  </Button>
                  {error && <p className="text-xs text-negative">{error}</p>}
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
      <span className="font-mono text-xs text-fg-3">{String(n).padStart(2, "0")}</span>
      <h2 className="text-xl font-medium">{title}</h2>
    </div>
  );
}

function ModeCard({ active, onClick, icon, title, text }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; text: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("rounded-xl border border-line bg-raised p-3 text-left transition-colors", active ? "border-fg bg-fg text-ink" : "hover:border-line-strong")}>
      <div className="mb-1">{icon}</div>
      <div className="text-sm font-medium">{title}</div>
      <div className={cn("text-xs", active ? "text-ink/70" : "text-fg-2")}>{text}</div>
    </button>
  );
}
