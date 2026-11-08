"use client";

import Link from "next/link";
import { Button, Badge, Card, CountryTag, Spinner } from "@/components/ui";
import { useBidsByArtist, useRequests } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import type { Bid, TattooRequest } from "@/lib/types";
import { eur, stripEmoji, timeAgo } from "@/lib/utils";

type QuoteStatus = "open" | "won" | "closed" | "removed";

function quoteStatus(
  bid: Bid,
  request: TattooRequest | undefined,
): QuoteStatus {
  if (!request) return "removed";
  if (request.status === "booked" && bid.status === "accepted") return "won";
  if (request.status === "booked") return "closed";
  if (request.status === "closed") return "closed";
  return "open";
}

export function MyQuotes() {
  const { persona } = usePersona();
  const { bids, loading: bidsLoading } = useBidsByArtist(persona.id);
  const { requests, loading: requestsLoading } = useRequests();
  const requestsById = new Map(requests.map((request) => [request.id, request]));
  const rows = bids
    .map((bid) => {
      const request = requestsById.get(bid.requestId);
      return { bid, request, status: quoteStatus(bid, request) };
    })
    .sort((a, b) => {
      const order: Record<QuoteStatus, number> = {
        open: 0,
        won: 1,
        closed: 2,
        removed: 2,
      };
      return order[a.status] - order[b.status] || b.bid.createdAt - a.bid.createdAt;
    });
  const openCount = rows.filter((row) => row.status === "open").length;
  const wonCount = rows.filter((row) => row.status === "won").length;
  const closedCount = rows.filter(
    (row) => row.status === "closed" || row.status === "removed",
  ).length;
  const loading = bidsLoading || requestsLoading;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">My quotes</h1>
        <p className="mt-2 text-fg-2">
          Quotes sent by {persona.name} <CountryTag flag={persona.flag} />. Status updates live.
        </p>
      </header>

      <Card className="grid divide-y divide-line overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <SummaryCell label="Open" value={openCount} />
        <SummaryCell label="Won" value={wonCount} />
        <SummaryCell label="Closed" value={closedCount} />
      </Card>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-fg-3">
          <Spinner /> Loading quotes…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-line py-16 text-center">
          <p className="text-fg-2">
            You haven&apos;t sent a quote yet. Open requests in your styles are waiting in the feed.
          </p>
          <Link href="/feed" className="mt-4 inline-block">
            <Button variant="secondary">Go to the feed</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(({ bid, request, status }) => (
            <Card
              key={bid.id}
              className="grid gap-4 p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
            >
              <div className="flex min-w-0 items-center gap-4">
                {request && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={request.conceptImageUrl}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                  />
                )}
                <div className="min-w-0">
                  {request ? (
                    <>
                      <Link
                        href={`/requests/${request.id}`}
                        className="font-medium text-fg hover:underline"
                      >
                        {request.title}
                      </Link>
                      <div className="mt-1 text-xs text-fg-3">
                        {request.clientName} · {request.clientCity}, {request.clientCountry}{" "}
                        <CountryTag flag={request.clientFlag} />
                      </div>
                    </>
                  ) : (
                    <div className="font-medium text-fg-2">Request removed</div>
                  )}
                  <div className="mt-1 text-xs text-fg-3">{timeAgo(bid.createdAt)}</div>
                </div>
              </div>

              <div className="grid gap-x-6 gap-y-1 font-mono text-xs tabular-nums text-fg-2 sm:grid-cols-3 md:grid-cols-1">
                <div><span className="text-fg-3">your price </span><span className="text-fg">{eur(bid.priceEur)}</span></div>
                <div><span className="text-fg-3">starts </span><span className="text-fg-2">{bid.availableDate}</span></div>
                <div><span className="text-fg-3">plan </span><span className="text-fg-2">{stripEmoji(bid.sessionPlan)}</span></div>
              </div>

              <StatusBadge status={status} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4">
      <div className="text-xs text-fg-3">{label}</div>
      <div className="mt-1 font-mono text-2xl font-medium tabular-nums">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  if (status === "won") {
    return <Badge className="justify-self-start border-positive/30 bg-positive/10 text-positive">Won</Badge>;
  }
  if (status === "open") {
    return <Badge className="justify-self-start border-line-strong text-fg-2">Open</Badge>;
  }
  if (status === "removed") {
    return <Badge className="justify-self-start border-line text-fg-3">Removed</Badge>;
  }
  return <Badge className="justify-self-start border-line text-fg-3">Closed</Badge>;
}
