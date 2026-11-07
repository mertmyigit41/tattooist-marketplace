"use client";

import { ArrowLeft, BadgeCheck, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouteId } from "@/lib/useRouteId";
import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";
import { Badge, Button, Card, Spinner, Stars } from "@/components/ui";
import { useProfile } from "@/lib/hooks";
import { eur } from "@/lib/utils";

export function ArtistView() {
  const id = useRouteId();
  const p = useProfile(id);
  const [index, setIndex] = useState<number | null>(null);

  if (p === undefined) return <div className="flex items-center justify-center gap-2 py-24 text-zinc-500"><Spinner /> Loading…</div>;
  if (p === null) return <div className="py-24 text-center text-zinc-400">Studio not found.</div>;

  return (
    <div className="space-y-6">
      <Link href="/artists" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Directory</Link>
      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.avatarUrl} alt="" className="h-24 w-24 rounded-2xl object-cover" />
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-3xl font-black">
            {p.name} {p.isPro && <Badge className="border-sky-500/40 bg-sky-500/10 text-sky-300"><BadgeCheck className="h-3.5 w-3.5" /> Verified Pro</Badge>}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {p.city}, {p.country} {p.countryFlag}</span>
            <Stars rating={p.rating} /> <span>{p.reviewCount} reviews</span>
            {p.hourlyRateEur && <span>· {eur(p.hourlyRateEur)}/hr</span>}
          </div>
          <p className="mt-2 text-zinc-300">{p.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">{p.styles.map((s) => <Badge key={s}>{s}</Badge>)}</div>
        </div>
        <a href={`https://wa.me/${p.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
          <Button variant="whatsapp"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
        </a>
      </Card>

      <section>
        <h2 className="mb-3 text-xl font-bold">Portfolio</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {p.portfolioUrls.map((u, i) => (
            <button key={u} onClick={() => setIndex(i)} className="group aspect-square overflow-hidden rounded-2xl border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </button>
          ))}
        </div>
      </section>
      <Lightbox images={p.portfolioUrls} index={index} onClose={() => setIndex(null)} onIndex={setIndex} caption={p.name} />
    </div>
  );
}
