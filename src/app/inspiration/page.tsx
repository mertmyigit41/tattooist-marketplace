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
        <h1 className="font-display text-3xl sm:text-4xl">Find a starting point</h1>
        <p className="mt-2 max-w-2xl text-fg-2">
          Pick a concept. Edit the brief, then get quotes from studios.
        </p>
      </header>

      <div className="flex flex-wrap gap-2" aria-label="Filter inspiration by style">
        <Pill active={!activeStyle} onClick={() => setActiveStyle(null)}>All styles</Pill>
        {STYLES.map((style) => (
          <Pill
            key={style}
            active={activeStyle === style}
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
            className="group relative overflow-hidden rounded-2xl border border-line bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={`${style} tattoo concept`}
              className="aspect-square w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-deep/70 p-3 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
              <span className="text-xs font-medium text-fg">{style}</span>
              <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-md bg-fg px-2.5 py-1.5 text-xs font-medium text-ink">
                Post this design <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <span className="absolute left-2 top-2 rounded-md border border-line bg-card px-2 py-1 text-xs text-fg-2 sm:hidden">
              {style}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
