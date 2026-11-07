import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "./ui";

export function AvailabilityBadges({
  responseHours,
  nextOpening,
}: {
  responseHours?: number;
  nextOpening?: string;
}) {
  if (responseHours === undefined && !nextOpening) return null;
  const opening = nextOpening?.toLowerCase();
  const openingLabel = opening
    ? opening === "this week"
      ? `Free ${opening}`
      : `Opens ${/^\d/.test(opening) ? "in " : ""}${opening}`
    : null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {responseHours !== undefined && (
        <Badge className="border-zinc-700 bg-zinc-900 text-zinc-300">
          <Clock className="h-3 w-3" /> Replies in ~{responseHours}h
        </Badge>
      )}
      {openingLabel && (
        <Badge className="border-zinc-700 bg-zinc-900 text-zinc-300">
          <CalendarDays className="h-3 w-3" /> {openingLabel}
        </Badge>
      )}
    </div>
  );
}
