"use client";

import { motion } from "framer-motion";
import { BadgeCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { ProUpsell } from "@/components/ProUpsell";
import { Badge, Card, CountryTag, Spinner, Stars } from "@/components/ui";
import { useProfiles } from "@/lib/hooks";
import { FALLBACK_PROFILE_AVAILABILITY } from "@/lib/seed";
import { eur } from "@/lib/utils";
import { IS_LIVE } from "@/lib/mode";

export default function ArtistsPage() {
  const { profiles, loading } = useProfiles("artist");
  const sorted = profiles
    .filter((profile) => !IS_LIVE || profile.approved === true)
    .sort((a, b) => Number(b.isPro) - Number(a.isPro) || b.rating - a.rating);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Studios</h1>
        <p className="mt-2 text-fg-2">
          {loading
            ? "Studios that reply to posted requests."
            : `Studios across ${new Set(sorted.map((profile) => profile.country)).size} countries that reply to posted requests.`}
        </p>
      </header>

      <ProUpsell />

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-fg-3"><Spinner /> Loading studios…</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((p, i) => {
            const fallback = FALLBACK_PROFILE_AVAILABILITY[p.id];
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i < 6 ? i * 0.05 : 0, ease: [0.22, 1, 0.36, 1] }}>
              <Link href={`/artists/${p.id}`}>
                <Card className="group h-full overflow-hidden transition-colors hover:border-line-strong">
                  <div className="grid grid-cols-3 gap-0.5">
                    {p.portfolioUrls.slice(0, 3).map((u) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={u} src={u} alt="" className="aspect-square w-full object-cover" />
                    ))}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="flex items-center gap-2 font-medium">
                          {p.name}
                          {p.isPro && <BadgeCheck className="h-4 w-4 text-fg-3" aria-label="Verified studio" />}
                        </h3>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-fg-2"><MapPin className="h-3 w-3 text-fg-3" /> {p.city}, {p.country} <CountryTag flag={p.countryFlag} /></div>
                      </div>
                      <div className="text-right">
                        <Stars rating={p.rating} />
                        <div className="text-xs text-fg-3">{p.reviewCount} reviews</div>
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-fg-2">{p.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.styles.map((s) => <Badge key={s}>{s}</Badge>)}
                    </div>
                    <div className="mt-3">
                      <AvailabilityBadges
                        responseHours={p.responseHours ?? fallback?.responseHours}
                        nextOpening={p.nextOpening ?? fallback?.nextOpening}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
                      <span className="text-fg-2">Rate</span>
                      <span className="font-mono font-medium tabular-nums">{p.hourlyRateEur ? `${eur(p.hourlyRateEur)}/hr` : "—"}</span>
                    </div>
                  </div>
                </Card>
              </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
