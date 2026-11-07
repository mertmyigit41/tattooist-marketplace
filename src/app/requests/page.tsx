"use client";

import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { RequestCard } from "@/components/RequestCard";
import { Button, CountryTag, Spinner } from "@/components/ui";
import { useBidCounts, useRequests } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import { LiveRoleGate } from "@/components/LiveRoleGate";

export default function MyRequestsPage() {
  return <LiveRoleGate role="client"><MyRequestsContent /></LiveRoleGate>;
}

function MyRequestsContent() {
  const { requests, loading } = useRequests();
  const { counts, bumped } = useBidCounts();
  const { persona, isArtist } = usePersona();

  const mine = useMemo(() => requests.filter((r) => r.clientId === persona.id), [requests, persona.id]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black sm:text-4xl">My Requests</h1>
          <p className="mt-1 text-zinc-400">
            Requests posted by <b className="text-zinc-200">{persona.name}</b> <CountryTag flag={persona.flag} />. Quote counts update live.
          </p>
        </div>
        <Link href="/create">
          <Button variant="violet"><Plus className="h-4 w-4" /> New Request</Button>
        </Link>
      </header>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-24 text-zinc-500"><Spinner /> Loading…</div>
      ) : mine.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 py-20 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <p className="text-zinc-400">
            {isArtist ? "Artist personas don't post requests. Switch to Client Mode (Mert) to see yours, or browse the live feed to bid." : "You haven't posted a request yet."}
          </p>
          <Link href={isArtist ? "/feed" : "/create"} className="mt-4 inline-block">
            <Button variant="outline">{isArtist ? "Go to Live Feed" : "Create your first design"}</Button>
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
