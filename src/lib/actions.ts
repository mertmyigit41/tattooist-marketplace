import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDb } from "./firebase";
import type { Bid, TattooRequest } from "./types";
import { uid } from "./utils";

export async function createRequest(data: Omit<TattooRequest, "id" | "createdAt" | "status">) {
  const id = uid("req-");
  const request: TattooRequest = { ...data, id, status: "open", createdAt: Date.now() };
  await setDoc(doc(getDb(), "requests", id), request);
  return id;
}

export async function submitBid(data: Omit<Bid, "id" | "createdAt">) {
  const id = uid("bid-");
  const bid: Bid = { ...data, id, createdAt: Date.now() };
  await setDoc(doc(getDb(), "bids", id), bid);
  return id;
}

export async function markBooked(requestId: string) {
  await updateDoc(doc(getDb(), "requests", requestId), { status: "booked" });
}
