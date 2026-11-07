import { ArrowLeft, Plane } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { AvailabilityBadges } from "@/components/AvailabilityBadges";
import { Badge, Button, Card, CountryTag } from "@/components/ui";
import { cityForSlug, CITIES, CITY_PRICE_ROWS } from "@/lib/cities";
import { FALLBACK_PROFILE_AVAILABILITY, SEED_PROFILES } from "@/lib/seed";
import { eur } from "@/lib/utils";
import { IS_LIVE } from "@/lib/mode";
import { LiveCityStudios } from "@/components/LiveCityStudios";

export const dynamicParams = false;

export function generateStaticParams() {
  return CITIES.map(({ slug }) => ({ slug }));
}

export default async function CityPricePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = cityForSlug(slug);
  if (!city) return <div className="py-24 text-center text-zinc-400">City not found.</div>;

  const studios = city.studioIds
    .map((id) => SEED_PROFILES.find((profile) => profile.id === id))
    .filter((profile): profile is Profile => profile !== undefined);

  return (
    <div className="space-y-10">
      <Link href="/cities" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All cities
      </Link>

      <section className="grid items-center gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <span className="stamp text-xs text-red-500">Prices by city</span>
          <h1 className="mt-4 text-4xl sm:text-6xl">
            Tattoo prices in {city.name} <CountryTag flag={city.flag} />
          </h1>
          <p className="mt-4 max-w-xl text-zinc-400">{city.blurb}</p>
          <div className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-zinc-500">
            <Plane className="h-3.5 w-3.5" /> Return flight from Dublin: {eur(city.flightFromDublinEur)}
          </div>
        </div>
        <Card className="overflow-hidden p-2">
          <div className="relative aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={city.heroImage} alt={`${city.name} tattoo`} className="h-full w-full object-cover grayscale contrast-125" />
            <span className="absolute left-3 top-3 stamp text-xs text-zinc-100">{city.name}</span>
          </div>
        </Card>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-3xl">Typical studio prices</h2>
          <p className="mt-1 text-xs text-zinc-500">Estimated return airfare is added to every studio price.</p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 paper">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Placement</th>
                <th className="px-4 py-3 font-medium">Studio price</th>
                <th className="px-4 py-3 font-medium">+ flight</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">vs Dublin</th>
              </tr>
            </thead>
            <tbody>
              {CITY_PRICE_ROWS.map((row) => {
                const studioPrice = city.prices[row.key];
                const total = studioPrice + city.flightFromDublinEur;
                const savings = row.dublinPrice - total;
                const comparison =
                  city.slug === "dublin"
                    ? "Baseline"
                    : savings > 0
                      ? `Save ${eur(savings)}`
                      : savings < 0
                        ? `${eur(-savings)} more`
                        : "Same price";
                return (
                  <tr key={row.key} className="border-b border-zinc-800/70 last:border-0">
                    <th className="px-4 py-3 font-medium text-zinc-200">{row.label}</th>
                    <td className="px-4 py-3 font-mono text-zinc-300">{eur(studioPrice)}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{eur(city.flightFromDublinEur)}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-zinc-50">{eur(total)}</td>
                    <td className={`px-4 py-3 font-mono ${savings > 0 && city.slug !== "dublin" ? "text-red-400" : "text-zinc-500"}`}>
                      {comparison}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {IS_LIVE ? (
        <LiveCityStudios cityName={city.name} citySlug={city.slug} />
      ) : (
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl">Studios in {city.name}</h2>
          <p className="mt-1 text-sm text-zinc-500">Profiles from the seeded demo directory.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {studios.map((studio) => {
            const fallback = FALLBACK_PROFILE_AVAILABILITY[studio.id];
            return (
              <Link key={studio.id} href={`/artists/${studio.id}`}>
                <Card className="h-full p-4 transition hover:border-zinc-600">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{studio.name}</h3>
                      <div className="mt-1 text-xs text-zinc-400">
                        {studio.city}, {studio.country} <CountryTag flag={studio.countryFlag} />
                      </div>
                    </div>
                    <Badge>{studio.styles[0]}</Badge>
                  </div>
                  <div className="mt-3">
                    <AvailabilityBadges
                      responseHours={studio.responseHours ?? fallback?.responseHours}
                      nextOpening={studio.nextOpening ?? fallback?.nextOpening}
                    />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
      )}

      <Card className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
        <div>
          <span className="stamp text-xs text-red-500">Ready to compare?</span>
          <p className="mt-3 text-zinc-300">Post your design and let studios quote the full price.</p>
        </div>
        <Link href="/create">
          <Button variant="violet"><span>Post a design</span></Button>
        </Link>
      </Card>
    </div>
  );
}
