"use client";

import { useState } from "react";
import { HeroQuoteStack } from "@/components/HeroQuoteStack";
import { QuoteCard } from "@/components/QuoteCard";
import { QuoteSummary } from "@/components/QuoteSummary";
import { QuoteTable } from "@/components/QuoteTable";
import { RequestCard } from "@/components/RequestCard";
import { RequestTimeline } from "@/components/RequestTimeline";
import { Badge, Button, Card, Pill, SegmentedControl } from "@/components/ui";
import { IS_LIVE } from "@/lib/mode";
import { FLAGSHIP_REQUEST_ID, SEED_BIDS, SEED_REQUESTS } from "@/lib/seed";

const flagship = SEED_REQUESTS.find((request) => request.id === FLAGSHIP_REQUEST_ID);
const bids = SEED_BIDS.filter((bid) => bid.requestId === FLAGSHIP_REQUEST_ID);

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return <section className="space-y-4"><div className="text-xs text-fg-3">{label}</div>{children}</section>;
}

export default function DevStyleguidePage() {
  const [pill, setPill] = useState("active");
  const [segment, setSegment] = useState("cards");
  if (IS_LIVE || !flagship) return null;
  const noop = () => {};

  return (
    <div className="space-y-12">
      <header><h1 className="font-display text-3xl sm:text-4xl">Ink &amp; lamp styleguide</h1><p className="mt-2 text-fg-2">Demo-only component states</p></header>
      <Section label="Buttons">
        <div className="flex flex-wrap items-end gap-3">
          {(["primary", "secondary", "ghost"] as const).flatMap((variant) =>
            (["sm", "md", "lg"] as const).map((size) => <Button key={`${variant}-${size}`} variant={variant} size={size}>{variant} {size}</Button>),
          )}
        </div>
      </Section>
      <Section label="Pills and segmented control">
        <div className="flex flex-wrap gap-3"><Pill active={pill === "active"} onClick={() => setPill("active")}>Active</Pill><Pill active={pill === "inactive"} onClick={() => setPill("inactive")}>Inactive</Pill><SegmentedControl value={segment} onChange={setSegment} ariaLabel="Layout" options={[{ value: "cards", label: "Cards" }, { value: "table", label: "Table" }]} /></div>
      </Section>
      <Section label="Badges">
        <div className="flex flex-wrap gap-2"><Badge>Default</Badge><Badge className="border-positive/30 bg-positive/10 text-positive">Booked</Badge><Badge className="border-line bg-transparent text-fg-3">Closed</Badge><Badge className="border-accent/40 text-accent">Shortlisted</Badge></div>
      </Section>
      <Section label="Inputs">
        <Card className="grid gap-4 p-5 sm:grid-cols-2"><input placeholder="Tattoo idea" className="h-11 rounded-[10px] border border-line bg-raised px-4 text-[15px] outline-none placeholder:text-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" /><textarea placeholder="Brief" className="min-h-24 rounded-[10px] border border-line bg-raised px-4 py-3 text-[15px] outline-none placeholder:text-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" /></Card>
      </Section>
      <Section label="Request cards">
        <div className="grid gap-5 md:grid-cols-3"><RequestCard request={SEED_REQUESTS[0]} bidCount={1} isArtist={false} /><RequestCard request={SEED_REQUESTS[1]} bidCount={0} isArtist /><RequestCard request={SEED_REQUESTS[2]} bidCount={2} isArtist={false} /></div>
      </Section>
      <Section label="Quote cards">
        <div className="space-y-4"><QuoteCard bid={bids[0]} request={flagship} shortlisted canAccept onShortlist={noop} onHide={noop} onAccept={noop} onZoom={noop} /><QuoteCard bid={bids[1]} request={flagship} isNew canAccept onShortlist={noop} onHide={noop} onAccept={noop} onZoom={noop} /></div>
      </Section>
      <Section label="Quote table"><QuoteTable bids={bids} request={flagship} canAccept shortlisted={new Set([bids[1]?.id])} onAccept={noop} onShortlist={noop} /></Section>
      <Section label="Request progress"><RequestTimeline request={flagship} bids={bids} /><QuoteSummary bids={bids} /></Section>
      <Section label="Hero preview"><HeroQuoteStack /></Section>
    </div>
  );
}
