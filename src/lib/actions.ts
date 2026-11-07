import { doc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { getDb } from "./firebase";
import { col, IS_LIVE } from "./mode";
import type { Bid, TattooRequest } from "./types";
import { uid } from "./utils";

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
  if (IS_LIVE) {
    if (!bidId) throw new Error("A bid is required to accept a live quote.");
    const batch = writeBatch(db);
    batch.update(doc(db, col("requests"), requestId), { status: "booked" });
    batch.update(doc(db, col("bids"), bidId), { status: "accepted" });
    await batch.commit();
    return;
  }
  await updateDoc(doc(db, col("requests"), requestId), { status: "booked" });
}
