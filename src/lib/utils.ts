import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TattooRequest, TravelMode } from "./types";

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
  { id: "Full Sleeve", label: "Full Sleeve", size: "Large (XL)" },
  { id: "Backpiece", label: "Backpiece", size: "Extra Large" },
  { id: "Forearm", label: "Forearm", size: "Medium" },
  { id: "Chest", label: "Chest", size: "Large" },
  { id: "Micro", label: "Micro", size: "Small" },
] as const;

export function sizeFor(placement: string) {
  return PLACEMENTS.find((p) => p.id === placement)?.size ?? "Medium";
}

export const TRAVEL_MODE_META: Record<
  TravelMode,
  { label: string; short: string; className: string }
> = {
  local_only: {
    label: "Near me",
    short: "Near me",
    className: "border-line text-fg-2",
  },
  specific_destination: {
    label: "On a trip",
    short: "On a trip",
    className: "border-line-strong text-fg",
  },
  open_worldwide: {
    label: "Open to travel",
    short: "Open to travel",
    className: "border-line text-fg-2",
  },
};

export const SESSION_PLANS = [
  "3 Consecutive Full Days",
  "2 Consecutive Full Days",
  "2 Full Days",
  "1 Session (4 Hours)",
  "5 Sessions over 3 Months",
];

export const QUOTE_WINDOWS = [
  { days: 3, label: "3 days" },
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days" },
] as const;

export const DAY_MS = 86_400_000;

export function isAcceptingQuotes(
  request: Pick<TattooRequest, "status" | "closesAt">,
  now = Date.now(),
) {
  return (
    request.status === "open" &&
    (request.closesAt === undefined || request.closesAt > now)
  );
}

/** "4d 6h" | "6h 12m" | "12m" | "0m" */
export function formatDuration(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

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
