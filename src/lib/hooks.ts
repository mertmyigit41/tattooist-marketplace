"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDb } from "./firebase";
import { col, IS_LIVE } from "./mode";
import { FLAGSHIP_REQUEST_ID } from "./seed";
import type { Bid, Profile, TattooRequest } from "./types";
import { isAcceptingQuotes } from "./utils";

/** Re-renders every `intervalMs` with the current epoch ms; use instead of Date.now() in render. */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function useRequests() {
  const [requests, setRequests] = useState<TattooRequest[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(getDb(), col("requests")), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setRequests(snap.docs.map((d) => ({ ...(d.data() as TattooRequest), id: d.id })));
      setLoading(false);
    });
  }, []);
  return { requests, loading };
}

/** Where the landing's "see a live request" should go: the demo flagship in demo mode, the newest open live request (or the feed) in live mode. */
export function useShowcaseHref() {
  const { requests } = useRequests();
  if (!IS_LIVE) return `/requests/${FLAGSHIP_REQUEST_ID}`;
  const request =
    requests.find((item) => isAcceptingQuotes(item)) ?? requests[0];
  return request ? `/requests/${request.id}` : "/feed";
}

export function useRequest(id: string | undefined) {
  const [request, setRequest] = useState<TattooRequest | null | undefined>(undefined);
  useEffect(() => {
    if (!id) return;
    return onSnapshot(doc(getDb(), col("requests"), id), (snap) => {
      setRequest(snap.exists() ? ({ ...(snap.data() as TattooRequest), id: snap.id }) : null);
    });
  }, [id]);
  return request;
}

export function useBids(requestId: string | undefined) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!requestId) return;
    let first = true;
    const q = query(collection(getDb(), col("bids")), where("requestId", "==", requestId));
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ ...(d.data() as Bid), id: d.id }));
      list.sort((a, b) => b.createdAt - a.createdAt);
      setBids(list);
      setLoading(false);
      if (!first) {
        const added = snap
          .docChanges()
          .filter((c) => c.type === "added")
          .map((c) => c.doc.id);
        if (added.length) {
          setNewIds((prev) => new Set([...prev, ...added]));
          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev);
              added.forEach((id) => next.delete(id));
              return next;
            });
          }, 6000);
        }
      }
      first = false;
    });
  }, [requestId]);
  return { bids, newIds, loading };
}

export function useBidsByArtist(artistId: string | undefined) {
  const [snapshot, setSnapshot] = useState<{
    artistId: string;
    bids: Bid[];
  } | null>(null);
  useEffect(() => {
    if (!artistId) return;
    const q = query(
      collection(getDb(), col("bids")),
      where("artistId", "==", artistId),
    );
    return onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        ...(d.data() as Bid),
        id: d.id,
      }));
      list.sort((a, b) => b.createdAt - a.createdAt);
      setSnapshot({ artistId, bids: list });
    });
  }, [artistId]);
  const bids =
    snapshot && snapshot.artistId === artistId ? snapshot.bids : [];
  return {
    bids,
    loading: !!artistId && snapshot?.artistId !== artistId,
  };
}

/** Live map of requestId -> bid count across all bids. */
export function useBidCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [bumped, setBumped] = useState<Set<string>>(new Set());
  useEffect(() => {
    let first = true;
    return onSnapshot(collection(getDb(), col("bids")), (snap) => {
      const next: Record<string, number> = {};
      snap.docs.forEach((d) => {
        const rid = (d.data() as Bid).requestId;
        next[rid] = (next[rid] ?? 0) + 1;
      });
      setCounts(next);
      if (!first) {
        const changed = snap
          .docChanges()
          .filter((c) => c.type === "added")
          .map((c) => (c.doc.data() as Bid).requestId);
        if (changed.length) {
          setBumped((p) => new Set([...p, ...changed]));
          setTimeout(() => setBumped((p) => {
            const n = new Set(p);
            changed.forEach((id) => n.delete(id));
            return n;
          }), 4000);
        }
      }
      first = false;
    });
  }, []);
  return { counts, bumped };
}

export function useProfiles(role?: "artist" | "client") {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const base = collection(getDb(), col("profiles"));
    const q = role ? query(base, where("role", "==", role)) : base;
    return onSnapshot(q, (snap) => {
      setProfiles(snap.docs.map((d) => ({ ...(d.data() as Profile), id: d.id })));
      setLoading(false);
    });
  }, [role]);
  return { profiles, loading };
}

export function useProfile(id: string | undefined) {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  useEffect(() => {
    if (!id) return;
    return onSnapshot(doc(getDb(), col("profiles"), id), (snap) => {
      setProfile(snap.exists() ? ({ ...(snap.data() as Profile), id: snap.id }) : null);
    });
  }, [id]);
  return profile;
}
