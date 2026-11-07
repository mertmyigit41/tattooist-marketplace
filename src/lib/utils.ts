import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TravelMode } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countryCode(flag: string): string {
  const indicators = Array.from(flag, (character) => character.codePointAt(0)!);
  if (
    indicators.length !== 2 ||
    indicators.some((code) => code < 0x1f1e6 || code > 0x1f1ff)
  ) {
    return "";
  }
  return String.fromCharCode(...indicators.map((code) => code - 0x1f1e6 + 65));
}

export function stripEmoji(s: string): string {
  return s
    .replace(
      /^[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D\s]+|[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D\s]+$/gu,
      "",
    )
    .trim();
}

export function eur(n: number) {
  return `€${Math.round(n).toLocaleString("en-IE")}`;
}

export const STYLES = [
  "Irezumi / Japanese",
  "Fine Line",
  "Blackwork",
  "Realism",
  "Neo-Traditional",
  "Geometric",
] as const;

export const PLACEMENTS = [
  { id: "Full Sleeve", label: "Full Sleeve", price: 3800, size: "Large (XL)" },
  { id: "Backpiece", label: "Backpiece", price: 4200, size: "Extra Large" },
  { id: "Forearm", label: "Forearm", price: 650, size: "Medium" },
  { id: "Chest", label: "Chest", price: 1400, size: "Large" },
  { id: "Micro", label: "Micro", price: 180, size: "Small" },
] as const;

export function localPriceFor(placement: string) {
  return PLACEMENTS.find((p) => p.id === placement)?.price ?? 900;
}

export function sizeFor(placement: string) {
  return PLACEMENTS.find((p) => p.id === placement)?.size ?? "Medium";
}

/** Estimated round-trip economy flight from Dublin to the artist's country. */
export const FLIGHT_FROM_DUBLIN_EUR: Record<string, number> = {
  Ireland: 0,
  Thailand: 650,
  Indonesia: 750,
  Turkey: 220,
  Poland: 90,
  USA: 480,
  Colombia: 780,
  Spain: 120,
  Germany: 110,
};

export function flightEstimate(clientCountry: string, artistCountry: string) {
  if (clientCountry === artistCountry) return 0;
  return FLIGHT_FROM_DUBLIN_EUR[artistCountry] ?? 500;
}

export const TRAVEL_MODE_META: Record<
  TravelMode,
  { label: string; short: string; className: string }
> = {
  local_only: {
    label: "Local Only",
    short: "Local Only",
    className: "border-zinc-700 text-zinc-300",
  },
  specific_destination: {
    label: "Planned Trip",
    short: "Planned Trip",
    className: "border-zinc-500 text-zinc-100",
  },
  open_worldwide: {
    label: "Open Worldwide",
    short: "Will fly anywhere",
    className: "border-red-500/60 text-red-300",
  },
};

export const SESSION_PLANS = [
  "3 Consecutive Full Days (Tourist Friendly)",
  "2 Consecutive Full Days",
  "2 Full Days",
  "1 Session (4 Hours)",
  "5 Sessions over 3 Months",
];

export const TOURIST_PERKS = [
  "Free Airport Pickup",
  "Hotel Partner Discount",
  "Back-to-Back Sessions Guaranteed",
];

export function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function uid(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
