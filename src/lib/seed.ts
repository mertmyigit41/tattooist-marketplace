import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  writeBatch,
} from "firebase/firestore";
import { getDb } from "./firebase";
import { AVATAR, IMG } from "./images";
import { col, type CollectionName, IS_LIVE } from "./mode";
import type { Bid, Profile, TattooRequest } from "./types";

const now = Date.now();
const h = 3600_000;

export const FALLBACK_PROFILE_AVAILABILITY: Record<
  string,
  { responseHours: number; nextOpening: string }
> = {
  "artist-templebar": { responseHours: 24, nextOpening: "2–3 months" },
  "artist-sakura": { responseHours: 6, nextOpening: "Next week" },
  "artist-canggu": { responseHours: 12, nextOpening: "Next month" },
  "artist-karakoy": { responseHours: 2, nextOpening: "This week" },
  "artist-warsaw": { responseHours: 8, nextOpening: "This week" },
  "artist-soho": { responseHours: 48, nextOpening: "2–3 months" },
};

export const SEED_PROFILES: Profile[] = [
  {
    id: "client-mert",
    role: "client",
    name: "Mert",
    city: "Dublin",
    country: "Ireland",
    countryFlag: "🇮🇪",
    avatarUrl: AVATAR.mert,
    styles: [],
    portfolioUrls: [],
    rating: 0,
    reviewCount: 0,
    isPro: false,
    whatsapp: "+353851234567",
  },
  {
    id: "artist-templebar",
    ...FALLBACK_PROFILE_AVAILABILITY["artist-templebar"],
    role: "artist",
    name: "Temple Bar Ink",
    city: "Dublin",
    country: "Ireland",
    countryFlag: "🇮🇪",
    avatarUrl: AVATAR.templeBar,
    styles: ["Irezumi / Japanese", "Neo-Traditional", "Realism"],
    portfolioUrls: [IMG.sleeve2, IMG.neoTrad, IMG.arm, IMG.shoulder, IMG.chest, IMG.koi],
    rating: 4.8,
    reviewCount: 212,
    isPro: true,
    whatsapp: "+35315550101",
    hourlyRateEur: 180,
    tagline: "Dublin's premium custom studio since 2009. €180/hr.",
  },
  {
    id: "artist-sakura",
    ...FALLBACK_PROFILE_AVAILABILITY["artist-sakura"],
    role: "artist",
    name: "Sakura Ink Master",
    city: "Bangkok",
    country: "Thailand",
    countryFlag: "🇹🇭",
    avatarUrl: AVATAR.sakura,
    styles: ["Irezumi / Japanese", "Realism"],
    portfolioUrls: [IMG.dragonSleeve, IMG.koi, IMG.wave, IMG.tiger, IMG.neck, IMG.realism],
    rating: 4.9,
    reviewCount: 487,
    isPro: true,
    whatsapp: "+66812345678",
    hourlyRateEur: 45,
    tagline: "Irezumi & realism specialist. Full sleeves in 3 consecutive days.",
  },
  {
    id: "artist-canggu",
    ...FALLBACK_PROFILE_AVAILABILITY["artist-canggu"],
    role: "artist",
    name: "Canggu Blackwork Collective",
    city: "Bali",
    country: "Indonesia",
    countryFlag: "🇮🇩",
    avatarUrl: AVATAR.canggu,
    styles: ["Blackwork", "Geometric"],
    portfolioUrls: [IMG.blackwork, IMG.geometric, IMG.dark, IMG.mandala, IMG.minimal, IMG.ornamental],
    rating: 4.7,
    reviewCount: 156,
    isPro: true,
    whatsapp: "+6281234567890",
    hourlyRateEur: 40,
    tagline: "Blackwork & sacred geometry, 5 minutes from the beach.",
  },
  {
    id: "artist-karakoy",
    ...FALLBACK_PROFILE_AVAILABILITY["artist-karakoy"],
    role: "artist",
    name: "Karaköy Fine Line Studio",
    city: "Istanbul",
    country: "Turkey",
    countryFlag: "🇹🇷",
    avatarUrl: AVATAR.karakoy,
    styles: ["Realism", "Fine Line", "Micro"],
    portfolioUrls: [IMG.fineLine, IMG.realism, IMG.portrait, IMG.minimal, IMG.line, IMG.micro],
    rating: 4.9,
    reviewCount: 329,
    isPro: true,
    whatsapp: "+905321234567",
    hourlyRateEur: 55,
    tagline: "Realism & micro fine line. Europe's best value for large work.",
  },
  {
    id: "artist-warsaw",
    ...FALLBACK_PROFILE_AVAILABILITY["artist-warsaw"],
    role: "artist",
    name: "Warsaw Dark Art",
    city: "Warsaw",
    country: "Poland",
    countryFlag: "🇵🇱",
    avatarUrl: AVATAR.warsaw,
    styles: ["Realism", "Neo-Traditional"],
    portfolioUrls: [IMG.dark, IMG.arm, IMG.neoTrad, IMG.portrait, IMG.chest, IMG.floral],
    rating: 4.6,
    reviewCount: 98,
    isPro: false,
    whatsapp: "+48501234567",
    hourlyRateEur: 70,
    tagline: "Dark realism & neo-traditional specialist.",
  },
  {
    id: "artist-soho",
    ...FALLBACK_PROFILE_AVAILABILITY["artist-soho"],
    role: "artist",
    name: "SoHo Ink NYC",
    city: "New York",
    country: "USA",
    countryFlag: "🇺🇸",
    avatarUrl: AVATAR.soho,
    styles: ["Fine Line", "Realism", "Blackwork"],
    portfolioUrls: [IMG.script, IMG.hand, IMG.ink, IMG.neck, IMG.minimal, IMG.line],
    rating: 4.8,
    reviewCount: 640,
    isPro: true,
    whatsapp: "+12125551234",
    hourlyRateEur: 250,
    tagline: "Celebrity fine-line studio in Manhattan.",
  },
];

export const FLAGSHIP_REQUEST_ID = "req-cyber-irezumi-dragon";

export const SEED_REQUESTS: TattooRequest[] = [
  {
    id: FLAGSHIP_REQUEST_ID,
    clientId: "client-mert",
    clientName: "Mert",
    clientCity: "Dublin",
    clientCountry: "Ireland",
    clientFlag: "🇮🇪",
    title: "Full Sleeve Cyber-Irezumi Dragon & Koi",
    prompt:
      "Japanese Irezumi dragon coiling around cherry blossoms and waves, with subtle cyberpunk circuitry woven into the scales. Koi fish swimming up the inner forearm.",
    style: "Irezumi / Japanese",
    bodyPart: "Full Sleeve",
    size: "Large (XL)",
    conceptImageUrl: IMG.dragonSleeve,
    stencilImageUrl: IMG.dragonSleeve,
    travelMode: "open_worldwide",
    targetDestination: "",
    closesAt: now + 4 * 24 * h,
    status: "open",
    createdAt: now - 26 * h,
  },
  {
    id: "req-geometric-forearm",
    clientId: "client-aoife",
    clientName: "Aoife",
    clientCity: "Cork",
    clientCountry: "Ireland",
    clientFlag: "🇮🇪",
    title: "Geometric Wolf Forearm Piece",
    prompt: "Geometric low-poly wolf head with sacred geometry mandala background on the outer forearm.",
    style: "Geometric",
    bodyPart: "Forearm",
    size: "Medium",
    conceptImageUrl: IMG.geometric,
    stencilImageUrl: IMG.geometric,
    travelMode: "local_only",
    targetDestination: "",
    closesAt: now + 6 * 24 * h,
    status: "open",
    createdAt: now - 9 * h,
  },
  {
    id: "req-blackwork-back",
    clientId: "client-lukas",
    clientName: "Lukas",
    clientCity: "Berlin",
    clientCountry: "Germany",
    clientFlag: "🇩🇪",
    title: "Full Backpiece Blackwork Phoenix",
    prompt: "Heavy blackwork phoenix rising with ornamental dotwork flames covering the entire back.",
    style: "Blackwork",
    bodyPart: "Backpiece",
    size: "Extra Large",
    conceptImageUrl: IMG.blackwork,
    stencilImageUrl: IMG.blackwork,
    travelMode: "specific_destination",
    targetDestination: "Bali, Indonesia — Jan 2027",
    closesAt: now + 12 * 24 * h,
    status: "open",
    createdAt: now - 48 * h,
  },
  {
    id: "req-fineline-micro",
    clientId: "client-sofia",
    clientName: "Sofia",
    clientCity: "Lisbon",
    clientCountry: "Portugal",
    clientFlag: "🇵🇹",
    title: "Micro Fine Line Constellation Set",
    prompt: "Three micro fine-line constellations (Orion, Lyra, Cassiopeia) along the collarbone.",
    style: "Fine Line",
    bodyPart: "Micro",
    size: "Small",
    conceptImageUrl: IMG.fineLine,
    stencilImageUrl: IMG.fineLine,
    travelMode: "open_worldwide",
    targetDestination: "",
    closesAt: now + 2 * 24 * h,
    status: "open",
    createdAt: now - 3 * h,
  },
];

export const SEED_BIDS: Bid[] = [
  {
    id: "bid-templebar-dragon",
    requestId: FLAGSHIP_REQUEST_ID,
    artistId: "artist-templebar",
    artistName: "Temple Bar Ink",
    artistCity: "Dublin",
    artistCountry: "Ireland",
    artistFlag: "🇮🇪",
    artistRating: 4.8,
    priceEur: 3600,
    sessionPlan: "5 Sessions over 3 Months",
    availableDate: "Dec 2, 2026",
    message:
      "We can start the outline in early December and heal each section properly between sessions. Walk-in friendly for touch-ups for life.",
    selectedPortfolioUrls: [IMG.sleeve2, IMG.neoTrad, IMG.arm],
    createdAt: now - 20 * h,
  },
  {
    id: "bid-sakura-dragon",
    requestId: FLAGSHIP_REQUEST_ID,
    artistId: "artist-sakura",
    artistName: "Sakura Ink Master",
    artistCity: "Bangkok",
    artistCountry: "Thailand",
    artistFlag: "🇹🇭",
    artistRating: 4.9,
    priceEur: 750,
    sessionPlan: "3 Consecutive Full Days",
    availableDate: "Nov 15, 2026",
    message:
      "Irezumi dragons are my life's work — 400+ sleeves completed. I'll hand-draw the cyber circuitry into the scales so it flows with the body. Three full days back-to-back and you leave with a finished sleeve.",
    selectedPortfolioUrls: [IMG.dragonSleeve, IMG.koi, IMG.wave],
    createdAt: now - 14 * h,
  },
  {
    id: "bid-karakoy-dragon",
    requestId: FLAGSHIP_REQUEST_ID,
    artistId: "artist-karakoy",
    artistName: "Karaköy Fine Line Studio",
    artistCity: "Istanbul",
    artistCountry: "Turkey",
    artistFlag: "🇹🇷",
    artistRating: 4.9,
    priceEur: 950,
    sessionPlan: "2 Consecutive Full Days",
    availableDate: "Nov 22, 2026",
    message:
      "Two long days in our Karaköy studio overlooking the Bosphorus. Realism-grade shading on the dragon with crisp fine-line blossoms.",
    selectedPortfolioUrls: [IMG.realism, IMG.portrait, IMG.fineLine],
    createdAt: now - 8 * h,
  },
  {
    id: "bid-canggu-dragon",
    requestId: FLAGSHIP_REQUEST_ID,
    artistId: "artist-canggu",
    artistName: "Canggu Blackwork Collective",
    artistCity: "Bali",
    artistCountry: "Indonesia",
    artistFlag: "🇮🇩",
    artistRating: 4.7,
    priceEur: 800,
    sessionPlan: "3 Consecutive Full Days",
    availableDate: "Dec 10, 2026",
    message:
      "We'd push the dragon toward bold blackwork with geometric circuitry accents — a very striking, graphic sleeve. Surf in the morning, tattoo in the afternoon.",
    selectedPortfolioUrls: [IMG.blackwork, IMG.geometric, IMG.dark],
    createdAt: now - 5 * h,
  },
  {
    id: "bid-templebar-wolf",
    requestId: "req-geometric-forearm",
    artistId: "artist-templebar",
    artistName: "Temple Bar Ink",
    artistCity: "Dublin",
    artistCountry: "Ireland",
    artistFlag: "🇮🇪",
    artistRating: 4.8,
    priceEur: 620,
    sessionPlan: "1 Session (4 Hours)",
    availableDate: "Nov 18, 2026",
    message: "Clean geometric work is our bread and butter. One 4-hour session, done.",
    selectedPortfolioUrls: [IMG.arm, IMG.sleeve2, IMG.shoulder],
    createdAt: now - 4 * h,
  },
  {
    id: "bid-canggu-phoenix",
    requestId: "req-blackwork-back",
    artistId: "artist-canggu",
    artistName: "Canggu Blackwork Collective",
    artistCity: "Bali",
    artistCountry: "Indonesia",
    artistFlag: "🇮🇩",
    artistRating: 4.7,
    priceEur: 1100,
    sessionPlan: "3 Consecutive Full Days",
    availableDate: "Jan 12, 2027",
    message: "Heavy blackwork backpieces are our signature. Three days, fully packed black, solid healing guidance.",
    selectedPortfolioUrls: [IMG.blackwork, IMG.dark, IMG.mandala],
    createdAt: now - 30 * h,
  },
];

export async function isSeeded(): Promise<boolean> {
  const snap = await getDocs(query(collection(getDb(), col("profiles")), limit(1)));
  return !snap.empty;
}

async function clearCollection(name: CollectionName) {
  const db = getDb();
  const snap = await getDocs(collection(db, col(name)));
  const chunks: typeof snap.docs[] = [];
  for (let i = 0; i < snap.docs.length; i += 400) chunks.push(snap.docs.slice(i, i + 400));
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

export async function seedDemoData({ reset = false }: { reset?: boolean } = {}) {
  if (IS_LIVE) return false;
  const db = getDb();
  if (reset) {
    const collections: CollectionName[] = ["bids", "requests", "profiles"];
    await Promise.all(collections.map(clearCollection));
  } else if (await isSeeded()) {
    return false;
  }
  const batch = writeBatch(db);
  SEED_PROFILES.forEach((p) => batch.set(doc(db, col("profiles"), p.id), p));
  SEED_REQUESTS.forEach((r) => batch.set(doc(db, col("requests"), r.id), r));
  SEED_BIDS.forEach((b) => batch.set(doc(db, col("bids"), b.id), b));
  await batch.commit();
  return true;
}
