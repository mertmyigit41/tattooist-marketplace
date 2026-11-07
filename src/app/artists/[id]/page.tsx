import { SEED_PROFILES } from "@/lib/seed";
import { ArtistView } from "./ArtistView";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...SEED_PROFILES.map((p) => ({ id: p.id })), { id: "_" }];
}

export default function ArtistPage() {
  return <ArtistView />;
}
