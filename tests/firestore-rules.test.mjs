import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, before, beforeEach, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

const projectId = "demo-inqfy-rules";
let environment;

before(async () => {
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST ?? "127.0.0.1:8081").split(":");
  environment = await initializeTestEnvironment({
    projectId,
    firestore: {
      host,
      port: Number(port),
      rules: await readFile(new URL("../firestore.rules", import.meta.url), "utf8"),
    },
  });
});

beforeEach(async () => environment.clearFirestore());
after(async () => environment?.cleanup());

async function seedLiveData() {
  await environment.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "live_profiles", "approved-artist"), {
      role: "artist",
      approved: true,
    });
    await setDoc(doc(db, "live_profiles", "pending-artist"), {
      role: "artist",
      approved: false,
    });
    await setDoc(doc(db, "live_requests", "request-1"), {
      clientId: "request-owner",
      status: "open",
    });
    await setDoc(doc(db, "live_bids", "bid-1"), {
      artistId: "approved-artist",
      requestId: "request-1",
      status: "pending",
    });
  });
}

test("anonymous users can read live requests", async () => {
  await seedLiveData();
  const db = environment.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, "live_requests", "request-1")));
});

test("clients can create only requests they own", async () => {
  const db = environment.authenticatedContext("client-1").firestore();
  await assertSucceeds(setDoc(doc(db, "live_requests", "own"), {
    clientId: "client-1",
    status: "open",
  }));
  await assertFails(setDoc(doc(db, "live_requests", "other"), {
    clientId: "client-2",
    status: "open",
  }));
});

test("clients cannot write protected profile fields", async () => {
  const db = environment.authenticatedContext("client-1").firestore();
  await assertSucceeds(setDoc(doc(db, "live_profiles", "client-1"), {
    role: "client",
    name: "Client",
  }));
  await assertFails(setDoc(doc(db, "live_profiles", "client-2"), {
    role: "client",
  }));
  await assertFails(setDoc(doc(db, "live_profiles", "client-3"), {
    role: "client",
    approved: true,
  }));
});

test("unapproved studios cannot create bids", async () => {
  await seedLiveData();
  const db = environment.authenticatedContext("pending-artist").firestore();
  await assertFails(setDoc(doc(db, "live_bids", "pending-bid"), {
    artistId: "pending-artist",
    requestId: "request-1",
  }));
});

test("approved studios can bid only as themselves", async () => {
  await seedLiveData();
  const db = environment.authenticatedContext("approved-artist").firestore();
  await assertSucceeds(setDoc(doc(db, "live_bids", "approved-bid"), {
    artistId: "approved-artist",
    requestId: "request-1",
  }));
  await assertFails(setDoc(doc(db, "live_bids", "forged-bid"), {
    artistId: "another-artist",
    requestId: "request-1",
  }));
});

test("only the request owner can accept a bid", async () => {
  await seedLiveData();
  const db = environment.authenticatedContext("outsider").firestore();
  const batch = writeBatch(db);
  batch.update(doc(db, "live_requests", "request-1"), { status: "booked" });
  batch.update(doc(db, "live_bids", "bid-1"), { status: "accepted" });
  await assertFails(batch.commit());
});

test("the request owner can accept a bid", async () => {
  await seedLiveData();
  const db = environment.authenticatedContext("request-owner").firestore();
  const batch = writeBatch(db);
  batch.update(doc(db, "live_requests", "request-1"), { status: "booked" });
  batch.update(doc(db, "live_bids", "bid-1"), { status: "accepted" });
  await assertSucceeds(batch.commit());
});

test("verified admins can approve artist profiles", async () => {
  await seedLiveData();
  const db = environment.authenticatedContext("admin", {
    email: "mertmyigit@gmail.com",
    email_verified: true,
  }).firestore();
  await assertSucceeds(updateDoc(doc(db, "live_profiles", "pending-artist"), {
    approved: true,
  }));
  assert.equal(
    (await getDoc(doc(db, "live_profiles", "pending-artist"))).data().approved,
    true,
  );
});

test("admins cannot change profile fields other than approval", async () => {
  await seedLiveData();
  const db = environment.authenticatedContext("admin", {
    email: "mertmyigit@gmail.com",
    email_verified: true,
  }).firestore();
  await assertFails(updateDoc(doc(db, "live_profiles", "pending-artist"), {
    approved: true,
    name: "Changed name",
  }));
  await assertFails(updateDoc(doc(db, "live_profiles", "pending-artist"), {
    name: "Changed name",
  }));
});

test("an unverified admin email cannot approve profiles or delete them", async () => {
  await seedLiveData();
  const db = environment.authenticatedContext("unverified-admin", {
    email: "mertmyigit@gmail.com",
    email_verified: false,
  }).firestore();
  await assertFails(updateDoc(doc(db, "live_profiles", "pending-artist"), {
    approved: true,
  }));
  await assertFails(deleteDoc(doc(db, "live_profiles", "pending-artist")));
});

test("verified admins can delete live profiles, requests, and bids", async () => {
  await seedLiveData();
  const db = environment.authenticatedContext("admin", {
    email: "mertmyigit@gmail.com",
    email_verified: true,
  }).firestore();
  await assertSucceeds(deleteDoc(doc(db, "live_profiles", "pending-artist")));
  await assertSucceeds(deleteDoc(doc(db, "live_requests", "request-1")));
  await assertSucceeds(deleteDoc(doc(db, "live_bids", "bid-1")));
});

test("demo collections remain open to anonymous reads and writes", async () => {
  const db = environment.unauthenticatedContext().firestore();
  for (const name of ["profiles", "requests", "bids"]) {
    await assertSucceeds(setDoc(doc(collection(db, name), `${name}-demo`), { demo: true }));
    await assertSucceeds(getDoc(doc(db, name, `${name}-demo`)));
  }
});
