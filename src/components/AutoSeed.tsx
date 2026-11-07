"use client";

import { useEffect } from "react";
import { seedDemoData } from "@/lib/seed";

/** Populates Firestore with demo data on first load when the database is empty. */
export function AutoSeed() {
  useEffect(() => {
    seedDemoData().catch((e) => console.error("Auto-seed failed", e));
  }, []);
  return null;
}
