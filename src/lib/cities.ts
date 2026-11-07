import { IMG } from "./images";
import { FLIGHT_FROM_DUBLIN_EUR, PLACEMENTS } from "./utils";

export type CityPlacementKey = "sleeve" | "backpiece" | "forearm" | "chest" | "micro";

export type TattooCity = {
  slug: string;
  name: string;
  country: string;
  flag: string;
  heroImage: string;
  flightFromDublinEur: number;
  prices: Record<CityPlacementKey, number>;
  blurb: string;
  studioIds: string[];
};

function dublinPrice(id: string) {
  const placement = PLACEMENTS.find((candidate) => candidate.id === id);
  if (!placement) throw new Error(`Unknown placement: ${id}`);
  return placement.price;
}

export const CITY_PRICE_ROWS: {
  key: CityPlacementKey;
  label: string;
  dublinPrice: number;
}[] = [
  { key: "sleeve", label: "Full sleeve", dublinPrice: dublinPrice("Full Sleeve") },
  { key: "backpiece", label: "Backpiece", dublinPrice: dublinPrice("Backpiece") },
  { key: "forearm", label: "Forearm", dublinPrice: dublinPrice("Forearm") },
  { key: "chest", label: "Chest", dublinPrice: dublinPrice("Chest") },
  { key: "micro", label: "Micro", dublinPrice: dublinPrice("Micro") },
];

export const CITIES: TattooCity[] = [
  {
    slug: "dublin",
    name: "Dublin",
    country: "Ireland",
    flag: "🇮🇪",
    heroImage: IMG.koi,
    flightFromDublinEur: FLIGHT_FROM_DUBLIN_EUR.Ireland,
    prices: {
      sleeve: dublinPrice("Full Sleeve"),
      backpiece: dublinPrice("Backpiece"),
      forearm: dublinPrice("Forearm"),
      chest: dublinPrice("Chest"),
      micro: dublinPrice("Micro"),
    },
    blurb: "Compare local studio prices against destination quotes without adding a flight. The Dublin baseline uses the same placements as every city table.",
    studioIds: ["artist-templebar"],
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    flag: "🇹🇷",
    heroImage: IMG.realism,
    flightFromDublinEur: FLIGHT_FROM_DUBLIN_EUR.Turkey,
    prices: { sleeve: 950, backpiece: 1400, forearm: 250, chest: 450, micro: 80 },
    blurb: "Fine-line and realism studios in Karaköy price custom work below Dublin rates. A return flight is included in every comparison.",
    studioIds: ["artist-karakoy"],
  },
  {
    slug: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    heroImage: IMG.dragonSleeve,
    flightFromDublinEur: FLIGHT_FROM_DUBLIN_EUR.Thailand,
    prices: { sleeve: 750, backpiece: 1100, forearm: 200, chest: 380, micro: 60 },
    blurb: "Irezumi and realism specialists can complete large work in concentrated sessions. Totals include the estimated return flight from Dublin.",
    studioIds: ["artist-sakura"],
  },
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    heroImage: IMG.blackwork,
    flightFromDublinEur: FLIGHT_FROM_DUBLIN_EUR.Indonesia,
    prices: { sleeve: 800, backpiece: 1200, forearm: 220, chest: 400, micro: 70 },
    blurb: "Blackwork and geometric studios pair large-scale pieces with back-to-back sessions. Compare the tattoo and estimated Dublin flight in one total.",
    studioIds: ["artist-canggu"],
  },
  {
    slug: "warsaw",
    name: "Warsaw",
    country: "Poland",
    flag: "🇵🇱",
    heroImage: IMG.dark,
    flightFromDublinEur: FLIGHT_FROM_DUBLIN_EUR.Poland,
    prices: { sleeve: 1300, backpiece: 1900, forearm: 350, chest: 600, micro: 100 },
    blurb: "Dark realism and neo-traditional studios offer custom work across large and small placements. Totals add the estimated return flight from Dublin.",
    studioIds: ["artist-warsaw"],
  },
];

export function cityForSlug(slug: string) {
  return CITIES.find((city) => city.slug === slug);
}
