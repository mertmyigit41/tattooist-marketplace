import Link from "next/link";
import { Card, CountryTag } from "@/components/ui";
import { CITIES } from "@/lib/cities";
import { eur } from "@/lib/utils";

export default function CitiesPage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="stamp text-xs text-red-500">The numbers</span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Prices by city</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Compare typical studio prices with an estimated return flight from Dublin.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((city) => (
          <Link key={city.slug} href={`/cities/${city.slug}`} className="group">
            <Card className="h-full overflow-hidden transition group-hover:border-zinc-600">
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={city.heroImage} alt={`${city.name} tattoo`} className="h-full w-full object-cover grayscale contrast-125 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <h2 className="font-display text-3xl text-white">{city.name}</h2>
                  <CountryTag flag={city.flag} />
                </div>
              </div>
              <div className="flex items-end justify-between gap-3 p-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">Full sleeve + flight</div>
                  <div className="font-display text-4xl text-zinc-100">
                    {eur(city.prices.sleeve + city.flightFromDublinEur)}
                  </div>
                </div>
                <span className="text-xs text-zinc-400 underline underline-offset-4">View prices</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
