"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useBidCounts, useNow, useRequests } from "@/lib/hooks";
import { isAcceptingQuotes } from "@/lib/utils";
import { RequestCard } from "./RequestCard";

const LOADING_GRACE_MS = 6000;

export function LiveRequestsTeaser() {
  const { requests, loading } = useRequests();
  const { counts, bumped } = useBidCounts();
  const now = useNow();
  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setGaveUp(true), LOADING_GRACE_MS);
    return () => clearTimeout(id);
  }, []);
  const items = requests
    .filter((request) => isAcceptingQuotes(request, now))
    .slice(0, 3);

  // Hide the section when Firestore is unreachable (no config) or when nothing is open.
  if ((loading && gaveUp) || (!loading && items.length === 0)) return null;

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-3">
        <h2 className="font-display text-3xl">Open right now</h2>
        <Link
          href="/feed"
          className="border-b border-line-strong text-sm text-fg-2 transition-colors hover:text-fg"
        >
          All requests
        </Link>
      </div>
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="aspect-[4/3] animate-pulse rounded-2xl bg-card"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              bidCount={counts[request.id] ?? 0}
              bumped={bumped.has(request.id)}
              isArtist={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
