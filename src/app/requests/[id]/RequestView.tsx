"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Gavel, LayoutGrid, Link2, MapPin, Ruler, Table2 } from "lucide-react";
import Link from "next/link";
import { useRouteId } from "@/lib/useRouteId";
import { useMemo, useState } from "react";
import { AcceptModal } from "@/components/AcceptModal";
import { BidModal } from "@/components/BidModal";
import { ImageToggle } from "@/components/ImageToggle";
import { Lightbox } from "@/components/Lightbox";
import { QuoteCard } from "@/components/QuoteCard";
import { QuoteSummary } from "@/components/QuoteSummary";
import { QuoteTable } from "@/components/QuoteTable";
import { RequestTimeline } from "@/components/RequestTimeline";
import { TravelBadge } from "@/components/RequestCard";
import { Badge, Button, Card, CountryTag, LiveDot, SegmentedControl, Spinner } from "@/components/ui";
import {
  closeRequest,
  extendQuoteWindow,
  setBidHidden,
  setBidShortlisted,
} from "@/lib/actions";
import { useBids, useNow, useRequest } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import { IS_LIVE } from "@/lib/mode";
import type { Bid } from "@/lib/types";
import { formatDuration, isAcceptingQuotes, timeAgo } from "@/lib/utils";

type Sort = "newest" | "earliest" | "price";
type View = "all" | "shortlist";
type Layout = "cards" | "table";

export function RequestView() {
  const id = useRouteId();
  const request = useRequest(id);
  const { bids, newIds, loading } = useBids(id);
  const now = useNow();
  const { isArtist, isApprovedArtist, persona } = usePersona();
  const [sort, setSort] = useState<Sort>("newest");
  const [view, setView] = useState<View>("all");
  const [layout, setLayout] = useState<Layout>("cards");
  const [showHidden, setShowHidden] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [accepting, setAccepting] = useState<Bid | null>(null);
  const [bidOpen, setBidOpen] = useState(false);
  const [lb, setLb] = useState<{ urls: string[]; index: number | null }>({ urls: [], index: null });

  const sorted = useMemo(() => {
    const list = [...bids];
    if (sort === "price") list.sort((a, b) => a.priceEur - b.priceEur);
    if (sort === "newest") list.sort((a, b) => b.createdAt - a.createdAt);
    if (sort === "earliest") {
      list.sort((a, b) => {
        const aTime = new Date(a.availableDate).getTime();
        const bTime = new Date(b.availableDate).getTime();
        if (Number.isNaN(aTime)) return Number.isNaN(bTime) ? 0 : 1;
        if (Number.isNaN(bTime)) return -1;
        return aTime - bTime;
      });
    }
    return list;
  }, [bids, sort]);

  if (request === undefined) return <div className="flex items-center justify-center gap-2 py-24 text-fg-3"><Spinner /> Loading request…</div>;
  if (request === null)
    return (
      <div className="py-24 text-center text-fg-2">
        Request not found. <Link href="/feed" className="text-fg underline">Back to feed</Link>
      </div>
    );
  const canAccept = !IS_LIVE || persona.id === request.clientId;
  const acceptingQuotes = isAcceptingQuotes(request, now);
  const referenceImages = request.referenceImageUrls ?? [];
  const shortlisted = new Set(request.shortlistedBidIds ?? []);
  const hidden = new Set(request.hiddenBidIds ?? []);
  const ranked = canAccept
    ? [
        ...sorted.filter((bid) => shortlisted.has(bid.id)),
        ...sorted.filter((bid) => !shortlisted.has(bid.id)),
      ]
    : sorted;
  const visibleAll = canAccept
    ? ranked.filter((bid) => !hidden.has(bid.id))
    : ranked;
  const shortlistCount = visibleAll.filter((bid) =>
    shortlisted.has(bid.id),
  ).length;
  const visible =
    canAccept && view === "shortlist"
      ? visibleAll.filter((bid) => shortlisted.has(bid.id))
      : visibleAll;
  const hiddenList = canAccept
    ? ranked.filter((bid) => hidden.has(bid.id))
    : [];
  const where =
    request.travelMode === "specific_destination"
      ? request.targetDestination
      : request.travelMode === "local_only"
        ? request.clientCity
        : "Open to travel";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/feed" className="inline-flex items-center gap-1 text-sm text-fg-2 hover:text-fg"><ArrowLeft className="h-4 w-4" /> Live feed</Link>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm text-fg-2 hover:text-fg"
          onClick={async () => {
            await navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
          }}
        >
          {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {linkCopied ? "Link copied" : "Copy link"}
        </button>
      </div>

      <Card className="grid gap-6 p-5 lg:grid-cols-[360px_1fr] lg:p-6">
        <ImageToggle concept={request.conceptImageUrl} stencil={request.stencilImageUrl} alt={request.title} className="aspect-square w-full" onClick={() => setLb({ urls: [request.conceptImageUrl], index: 0 })} />
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TravelBadge request={request} />
              {request.status === "booked" ? (
                <Badge className="border-positive/30 bg-positive/10 text-positive"><Check className="h-3 w-3" /> Booked</Badge>
              ) : request.status === "closed" ? (
                <Badge className="border-line bg-transparent text-fg-3">Closed</Badge>
              ) : request.closesAt && request.closesAt <= now ? (
                <Badge className="border-line bg-transparent text-fg-3"><Clock className="h-3 w-3" /> Quotes closed</Badge>
              ) : request.closesAt ? (
                <Badge><Clock className="h-3 w-3" /> Closes in {formatDuration(request.closesAt - now)}</Badge>
              ) : null}
            </div>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl">{request.title}</h1>
            <p className="mt-2 text-fg-2">{request.prompt}</p>
            {referenceImages.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-xs text-fg-3">Style references</div>
                <div className="flex flex-wrap gap-2">
                  {referenceImages.map((url, index) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setLb({ urls: referenceImages, index })}
                      className="h-20 w-20 overflow-hidden rounded-md border border-line"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-2">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-fg-3" /> {request.clientName} · {request.clientCity}, {request.clientCountry} <CountryTag flag={request.clientFlag} /></span>
            <span className="flex items-center gap-1.5"><Ruler className="h-4 w-4 text-fg-3" /> {request.bodyPart} · {request.size}</span>
            <Badge>{request.style}</Badge>
          </div>

          <div className="mt-auto grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-raised p-4">
              <div className="text-xs text-fg-3">Where</div>
              <div className="mt-1 text-xl font-medium">{where}</div>
              <div className="text-xs text-fg-3">Posted {timeAgo(request.createdAt)}</div>
            </div>
            <div className="rounded-xl border border-line bg-raised p-4">
              <div className="flex items-center gap-2 text-xs text-fg-3">
                <LiveDot />
                Quotes
              </div>
              <div className="mt-1 font-mono text-2xl font-medium tabular-nums">{bids.length}</div>
              <div className="text-xs text-fg-3">
                {bids.length} {bids.length === 1 ? "studio has" : "studios have"} replied
              </div>
            </div>
          </div>
          {canAccept && request.status === "open" && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  void extendQuoteWindow(request.id, request.closesAt, 7);
                }}
              >
                <Clock className="h-4 w-4" /> Extend 7 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (
                    window.confirm(
                      "Close this request? Studios will no longer be able to quote. You can still accept quotes you already received.",
                    )
                  ) {
                    void closeRequest(request.id);
                  }
                }}
              >
                Close request
              </Button>
            </div>
          )}
          {IS_LIVE && isArtist && !isApprovedArtist && request.status === "open" ? (
            <p className="rounded-lg border border-line bg-raised px-3 py-2 text-sm text-fg-2">
              Your studio is pending approval
            </p>
          ) : isArtist && isApprovedArtist && acceptingQuotes ? (
            <Button onClick={() => setBidOpen(true)}><Gavel className="h-4 w-4" /> Send a quote</Button>
          ) : isArtist && request.status === "open" && !acceptingQuotes ? (
            <p className="text-sm text-fg-3">The quote window for this request has closed</p>
          ) : null}
        </div>
      </Card>

      <RequestTimeline request={request} bids={bids} />

      <QuoteSummary bids={bids} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-medium">Quotes ({bids.length})</h2>
          <div className="flex flex-wrap items-center gap-2">
            {canAccept && (
              <SegmentedControl value={view} onChange={(value) => setView(value as View)} ariaLabel="Quote view" options={[{ value: "all", label: `All (${visibleAll.length})` }, { value: "shortlist", label: `Shortlisted (${shortlistCount})` }]} />
            )}
            <SegmentedControl value={sort} onChange={(value) => setSort(value as Sort)} ariaLabel="Sort quotes" options={[{ value: "newest", label: "Newest" }, { value: "earliest", label: "Earliest start" }, { value: "price", label: "Lowest price" }]} />
            <SegmentedControl value={layout} onChange={(value) => setLayout(value as Layout)} ariaLabel="Quote layout" options={[{ value: "cards", label: "Cards", icon: <LayoutGrid className="h-4 w-4" /> }, { value: "table", label: "Table", icon: <Table2 className="h-4 w-4" /> }]} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-12 text-fg-3"><Spinner /> Listening for quotes…</div>
        ) : bids.length === 0 ? (
          null
        ) : canAccept && view === "shortlist" && visible.length === 0 ? (
          <div className="rounded-2xl border border-line p-8 text-center text-sm text-fg-3">
            Nothing shortlisted yet. Star the quotes you want to compare.
          </div>
        ) : layout === "table" ? (
          <QuoteTable
            bids={visible}
            request={request}
            canAccept={canAccept}
            shortlisted={shortlisted}
            onAccept={setAccepting}
            onShortlist={
              canAccept
                ? (bid) => {
                    void setBidShortlisted(
                      request.id,
                      bid.id,
                      !shortlisted.has(bid.id),
                    );
                  }
                : undefined
            }
          />
        ) : (
          <motion.div layout className="grid gap-4">
            <AnimatePresence initial={false}>
              {visible.map((b) => (
                <QuoteCard
                  key={b.id}
                  bid={b}
                  request={request}
                  canAccept={canAccept}
                  isNew={newIds.has(b.id)}
                  shortlisted={shortlisted.has(b.id)}
                  onShortlist={
                    canAccept
                      ? (bid) => {
                          void setBidShortlisted(
                            request.id,
                            bid.id,
                            !shortlisted.has(bid.id),
                          );
                        }
                      : undefined
                  }
                  onHide={
                    canAccept
                      ? (bid) => {
                          void setBidHidden(
                            request.id,
                            bid.id,
                            !hidden.has(bid.id),
                          );
                        }
                      : undefined
                  }
                  onAccept={setAccepting}
                  onZoom={(urls, index) => setLb({ urls, index })}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {canAccept && hiddenList.length > 0 && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowHidden((value) => !value)}
              className="text-xs text-fg-3 hover:text-fg-2"
            >
              {hiddenList.length} hidden quote{hiddenList.length === 1 ? "" : "s"} · {showHidden ? "hide" : "show"}
            </button>
            {showHidden && (
              <div className="grid gap-4 opacity-60">
                {hiddenList.map((bid) => (
                  <QuoteCard
                    key={bid.id}
                    bid={bid}
                    request={request}
                    canAccept={canAccept}
                    shortlisted={shortlisted.has(bid.id)}
                    hidden
                    onShortlist={(selectedBid) => {
                      void setBidShortlisted(
                        request.id,
                        selectedBid.id,
                        !shortlisted.has(selectedBid.id),
                      );
                    }}
                    onHide={(selectedBid) => {
                      void setBidHidden(request.id, selectedBid.id, false);
                    }}
                    onAccept={setAccepting}
                    onZoom={(urls, index) => setLb({ urls, index })}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <AcceptModal bid={accepting} request={request} onClose={() => setAccepting(null)} />
      <BidModal request={request} open={bidOpen} onClose={() => setBidOpen(false)} />
      <Lightbox images={lb.urls} index={lb.index} onClose={() => setLb((s) => ({ ...s, index: null }))} onIndex={(i) => setLb((s) => ({ ...s, index: i }))} />
    </div>
  );
}
