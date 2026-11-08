"use client";

import { ArrowLeft, BadgeCheck, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouteId } from "@/lib/useRouteId";
import { useState } from "react";
import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { Lightbox } from "@/components/Lightbox";
import { Badge, Button, Card, CountryTag, Spinner, Stars } from "@/components/ui";
import { useProfile } from "@/lib/hooks";
import { FALLBACK_PROFILE_AVAILABILITY } from "@/lib/seed";
import { eur } from "@/lib/utils";

export function ArtistView() {
  const id = useRouteId();
  const p = useProfile(id);
  const [index, setIndex] = useState<number | null>(null);

  if (p === undefined) return <div className="flex items-center justify-center gap-2 py-24 text-fg-3"><Spinner /> Loading…</div>;
  if (p === null) return <div className="py-24 text-center text-fg-2">Studio not found</div>;
  const fallback = FALLBACK_PROFILE_AVAILABILITY[p.id];

  return (
    <div className="space-y-6">
      <Link href="/artists" className="inline-flex items-center gap-1 text-sm text-fg-2 hover:text-fg"><ArrowLeft className="h-4 w-4" /> Directory</Link>
      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.avatarUrl} alt="" className="h-24 w-24 rounded-2xl object-cover" />
        <div className="flex-1">
          <h1 className="flex items-center gap-2 font-display text-3xl sm:text-4xl">
            {p.name} {p.isPro && <BadgeCheck className="h-4 w-4 text-fg-3" aria-label="Verified studio" />}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-2">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {p.city}, {p.country} <CountryTag flag={p.countryFlag} /></span>
            <Stars rating={p.rating} /> <span>{p.reviewCount} reviews</span>
            {p.hourlyRateEur && <span>· {eur(p.hourlyRateEur)}/hr</span>}
          </div>
          <p className="mt-2 text-fg-2">{p.tagline}</p>
          <div className="mt-3">
            <AvailabilityBadges
              responseHours={p.responseHours ?? fallback?.responseHours}
              nextOpening={p.nextOpening ?? fallback?.nextOpening}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">{p.styles.map((s) => <Badge key={s}>{s}</Badge>)}</div>
        </div>
        <a href={`https://wa.me/${p.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
          <Button><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
        </a>
      </Card>

      <section>
        <h2 className="mb-3 text-xl font-medium">Portfolio</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {p.portfolioUrls.map((u, i) => (
            <button key={u} onClick={() => setIndex(i)} className="group aspect-square overflow-hidden rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>
      <Lightbox images={p.portfolioUrls} index={index} onClose={() => setIndex(null)} onIndex={setIndex} caption={p.name} />
    </div>
  );
}
