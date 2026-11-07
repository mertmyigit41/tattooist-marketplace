"use client";

import Link from "next/link";
import { Badge, Card, CountryTag, Spinner } from "@/components/ui";
import { useProfiles } from "@/lib/hooks";
import type { Profile } from "@/lib/types";

const CITY_PROFILE_NAMES: Record<string, string[]> = {
  dublin: ["dublin", "temple bar"],
  istanbul: ["istanbul", "karaköy"],
  bangkok: ["bangkok"],
  bali: ["bali", "canggu"],
  warsaw: ["warsaw"],
};

function normalizeCity(value: string) {
  return value.normalize("NFKD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
}

export function LiveCityStudios({ cityName, citySlug }: { cityName: string; citySlug: string }) {
  const { profiles, loading } = useProfiles("artist");
  const cityNames = (CITY_PROFILE_NAMES[citySlug] ?? [cityName]).map(normalizeCity);
  const studios = profiles.filter((profile) =>
    profile.approved === true
    && cityNames.includes(normalizeCity(profile.city)),
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-3xl">Approved studios in {cityName}</h2>
        <p className="mt-1 text-sm text-zinc-500">Only approved studio profiles appear in the live directory.</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-zinc-500"><Spinner /> Loading studios…</div>
      ) : studios.length === 0 ? (
        <p className="rounded-md border border-dashed border-zinc-800 p-6 text-sm text-zinc-500">
          No approved studios in {cityName} yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {studios.map((studio: Profile) => (
            <Link key={studio.id} href={`/artists/${studio.id}`}>
              <Card className="h-full p-4 transition hover:border-zinc-600">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{studio.name}</h3>
                    <div className="mt-1 text-xs text-zinc-400">
                      {studio.city}, {studio.country} <CountryTag flag={studio.countryFlag ?? ""} />
                    </div>
                  </div>
                  {studio.styles?.[0] && <Badge>{studio.styles[0]}</Badge>}
                </div>
                {studio.tagline && <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{studio.tagline}</p>}
                {studio.portfolioUrls?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={studio.portfolioUrls[0]} alt="" className="mt-3 aspect-[16/9] w-full rounded-sm object-cover" />
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
