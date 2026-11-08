import {
  arrayRemove,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getDb } from "./firebase";
import { col, IS_LIVE } from "./mode";
import type { Bid, TattooRequest } from "./types";
import { DAY_MS, uid } from "./utils";

export async function createRequest(data: Omit<TattooRequest, "id" | "createdAt" | "status">) {
  const id = uid("req-");
  const request: TattooRequest = { ...data, id, status: "open", createdAt: Date.now() };
  await setDoc(doc(getDb(), col("requests"), id), request);
  return id;
}

export async function submitBid(data: Omit<Bid, "id" | "createdAt">) {
  const id = uid("bid-");
  const bid: Bid = { ...data, id, createdAt: Date.now() };
  await setDoc(doc(getDb(), col("bids"), id), bid);
  return id;
}

export async function markBooked(requestId: string, bidId?: string) {
  const db = getDb();
  if (IS_LIVE && !bidId) {
    throw new Error("A bid is required to accept a live quote.");
  }
  const batch = writeBatch(db);
  batch.update(doc(db, col("requests"), requestId), { status: "booked" });
  if (bidId) {
    batch.update(doc(db, col("bids"), bidId), { status: "accepted" });
  }
  await batch.commit();
}

export async function setBidShortlisted(
  requestId: string,
  bidId: string,
  on: boolean,
) {
  await updateDoc(doc(getDb(), col("requests"), requestId), {
    shortlistedBidIds: on ? arrayUnion(bidId) : arrayRemove(bidId),
  });
}

export async function setBidHidden(
  requestId: string,
  bidId: string,
  on: boolean,
) {
  await updateDoc(doc(getDb(), col("requests"), requestId), {
    hiddenBidIds: on ? arrayUnion(bidId) : arrayRemove(bidId),
  });
}

export async function closeRequest(requestId: string) {
  await updateDoc(doc(getDb(), col("requests"), requestId), {
    status: "closed",
  });
}

export async function extendQuoteWindow(
  requestId: string,
  currentClosesAt: number | undefined,
  days: number,
) {
  await updateDoc(doc(getDb(), col("requests"), requestId), {
    closesAt:
      Math.max(Date.now(), currentClosesAt ?? Date.now()) + days * DAY_MS,
  });
}
