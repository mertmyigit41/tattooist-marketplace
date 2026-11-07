import { SEED_REQUESTS } from "@/lib/seed";
import { RequestView } from "./RequestView";

export const dynamicParams = false;

/** Pre-render seeded requests; `_` is the Firebase Hosting fallback for ids created at runtime. */
export function generateStaticParams() {
  return [...SEED_REQUESTS.map((r) => ({ id: r.id })), { id: "_" }];
}

export default function RequestPage() {
  return <RequestView />;
}
