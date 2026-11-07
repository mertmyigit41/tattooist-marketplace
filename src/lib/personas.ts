import type { Persona } from "./types";

export const PERSONAS: Persona[] = [
  {
    id: "client-mert",
    role: "client",
    name: "Mert",
    city: "Dublin",
    country: "Ireland",
    flag: "🇮🇪",
    label: "Client Mode",
  },
  {
    id: "artist-sakura",
    role: "artist",
    name: "Sakura Ink Master",
    city: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    label: "Artist Mode (Global)",
  },
  {
    id: "artist-templebar",
    role: "artist",
    name: "Temple Bar Ink",
    city: "Dublin",
    country: "Ireland",
    flag: "🇮🇪",
    label: "Artist Mode (Local)",
  },
];
