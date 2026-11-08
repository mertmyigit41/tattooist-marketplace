"use client";

import { useProfiles } from "@/lib/hooks";
import { studioReach } from "@/lib/reach";
import { cn } from "@/lib/utils";
import { LiveDot } from "./ui";

export function ReachPreview({
  style,
  className,
}: {
  style: string;
  className?: string;
}) {
  const { profiles, loading } = useProfiles("artist");
  if (loading) return null;

  const { count, medianResponseHours } = studioReach(profiles, style);

  return (
    <div className={cn("flex items-center gap-1.5 text-xs text-fg-2", className)}>
      <LiveDot />
      <span>
        {count > 0 ? (
          <>
            Reaches {count} {count === 1 ? "studio" : "studios"} working in {style}
            {medianResponseHours !== null
              ? ` · typical first reply ~${medianResponseHours}h`
              : ""}
          </>
        ) : (
          <>No studios list {style} yet — your request still appears in the live feed.</>
        )}
      </span>
    </div>
  );
}
