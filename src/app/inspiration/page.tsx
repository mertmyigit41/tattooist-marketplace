"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Pill } from "@/components/ui";
import { STYLE_CONCEPTS } from "@/lib/images";

const STYLES = Object.keys(STYLE_CONCEPTS);
const CONCEPTS = Object.entries(STYLE_CONCEPTS).flatMap(([style, images]) =>
  images.map((image, index) => ({ style, image, index })),
);

export default function InspirationPage() {
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const concepts = activeStyle
    ? CONCEPTS.filter((concept) => concept.style === activeStyle)
    : CONCEPTS;

  return (
    <div className="space-y-8">
      <header>
        <span className="stamp text-xs text-red-500">The gallery</span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Find a starting point.</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Pick a concept. Edit the brief, then get quotes from studios.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" aria-label="Filter inspiration by style">
        <Pill active={!activeStyle} accent="zinc" onClick={() => setActiveStyle(null)}>All styles</Pill>
        {STYLES.map((style) => (
          <Pill
            key={style}
            active={activeStyle === style}
            accent="zinc"
            onClick={() => setActiveStyle(style)}
          >
            {style}
          </Pill>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {concepts.map(({ style, image, index }) => (
          <Link
            key={`${style}-${index}`}
            href={`/create?style=${encodeURIComponent(style)}&img=${encodeURIComponent(image)}`}
            aria-label={`Post this ${style} design`}
            className="group relative overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${style} tattoo concept`}
              className="aspect-square w-full object-cover grayscale contrast-110 transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-3 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
              <span className="text-xs font-semibold text-zinc-100">{style}</span>
              <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-sm bg-red-600 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Post this design <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <span className="absolute left-2 top-2 rounded-sm border border-zinc-700 bg-zinc-950/90 px-2 py-1 text-[10px] text-zinc-300 sm:hidden">
              {style}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
