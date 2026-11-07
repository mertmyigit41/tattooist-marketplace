export const IS_LIVE = process.env.NEXT_PUBLIC_APP_MODE === "live";

export type CollectionName = "profiles" | "requests" | "bids";

export function col(name: CollectionName) {
  return IS_LIVE ? `live_${name}` : name;
}
