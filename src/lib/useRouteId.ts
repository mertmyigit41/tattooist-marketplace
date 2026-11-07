"use client";

import { useParams, usePathname } from "next/navigation";

/**
 * Resolves the dynamic `[id]` segment from the live URL. In the static export
 * (Firebase Hosting) unknown ids are served from a placeholder page, so the
 * route param alone would be the placeholder; the pathname is authoritative.
 */
export function useRouteId(): string {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const fromPath = pathname?.split("/").filter(Boolean).pop();
  return fromPath && fromPath !== id ? decodeURIComponent(fromPath) : id;
}
