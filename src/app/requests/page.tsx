"use client";

import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { MyQuotes } from "@/components/MyQuotes";
import { RequestCard } from "@/components/RequestCard";
import { Button, CountryTag, Spinner } from "@/components/ui";
import { useBidCounts, useRequests } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import { LiveRoleGate } from "@/components/LiveRoleGate";

export default function MyRequestsPage() {
  return (
    <LiveRoleGate>
      <RequestsForRole />
    </LiveRoleGate>
  );
}

function RequestsForRole() {
  const { isArtist } = usePersona();
  return isArtist ? <MyQuotes /> : <MyRequestsContent />;
}

function MyRequestsContent() {
  const { requests, loading } = useRequests();
  const { counts, bumped } = useBidCounts();
  const { persona } = usePersona();

  const mine = useMemo(() => requests.filter((r) => r.clientId === persona.id), [requests, persona.id]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">My requests</h1>
          <p className="mt-2 text-fg-2">
            Requests posted by <span className="text-fg">{persona.name}</span> <CountryTag flag={persona.flag} />. Quote counts update live
          </p>
        </div>
        <Link href="/create">
          <Button><Plus className="h-4 w-4" /> New request</Button>
        </Link>
      </header>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-fg-3"><Spinner /> Loading…</div>
      ) : mine.length === 0 ? (
        <div className="rounded-2xl border border-line py-16 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-fg-3" />
          <p className="text-fg-2">You haven&apos;t posted a request yet</p>
          <Link href="/create" className="mt-4 inline-block">
            <Button variant="secondary">Create your first design</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {mine.map((r) => (
            <RequestCard key={r.id} request={r} bidCount={counts[r.id] ?? 0} bumped={bumped.has(r.id)} isArtist={false} />
          ))}
        </div>
      )}
    </div>
  );
}
