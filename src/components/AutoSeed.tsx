"use client";

import { useEffect } from "react";
import { seedDemoData } from "@/lib/seed";
import { IS_LIVE } from "@/lib/mode";

/** Populates Firestore with demo data on first load when the database is empty. */
export function AutoSeed() {
  useEffect(() => {
    if (IS_LIVE) return;
    seedDemoData().catch((e) => console.error("Auto-seed failed", e));
  }, []);
  return null;
}
