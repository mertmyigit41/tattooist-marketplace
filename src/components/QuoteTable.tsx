"use client";

import { BadgeCheck, Star } from "lucide-react";
import Link from "next/link";
import { useProfiles } from "@/lib/hooks";
import { FALLBACK_PROFILE_AVAILABILITY } from "@/lib/seed";
import type { Bid, TattooRequest } from "@/lib/types";
import { cn, eur, stripEmoji } from "@/lib/utils";
import { Button, CountryTag, Stars } from "./ui";

export function QuoteTable({
  bids,
  request,
  canAccept,
  shortlisted,
  onAccept,
  onShortlist,
}: {
  bids: Bid[];
  request: TattooRequest;
  canAccept: boolean;
  shortlisted: Set<string>;
  onAccept: (b: Bid) => void;
  onShortlist?: (b: Bid) => void;
}) {
  const { profiles } = useProfiles("artist");
  const profilesById = new Map(
    profiles.map((profile) => [profile.id, profile]),
  );
  const lowestPrice = Math.min(...bids.map((bid) => bid.priceEur));
  const validStartTimes = bids
    .map((bid) => new Date(bid.availableDate).getTime())
    .filter((value) => !Number.isNaN(value));
  const earliestStart = validStartTimes.length
    ? Math.min(...validStartTimes)
    : null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-card">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-xs text-fg-3">
          <tr className="border-b border-line">
            <th className="px-4 py-3 font-medium">Studio</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Starts</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Replies in</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => {
            const startTime = new Date(bid.availableDate).getTime();
            const isEarliest =
              earliestStart !== null &&
              !Number.isNaN(startTime) &&
              startTime === earliestStart;
            const responseHours =
              profilesById.get(bid.artistId)?.responseHours ??
              FALLBACK_PROFILE_AVAILABILITY[bid.artistId]?.responseHours;

            return (
              <tr
                key={bid.id}
                className={cn("border-b border-line last:border-0", shortlisted.has(bid.id) && "bg-accent/5")}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-medium text-fg">
                    {bid.artistName}
                    <BadgeCheck className="h-4 w-4 text-fg-3" aria-label="Verified studio" />
                  </div>
                  <div className="mt-0.5 text-xs text-fg-3">
                    {bid.artistCity}, {bid.artistCountry}{" "}
                    <CountryTag flag={bid.artistFlag} />
                  </div>
                </td>
                <td className="px-4 py-3"><Stars rating={bid.artistRating} /></td>
                <td
                  className={cn(
                    "px-4 py-3 font-mono tabular-nums text-fg-2",
                    bid.priceEur === lowestPrice && "font-medium text-fg",
                  )}
                >
                  {eur(bid.priceEur)}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-fg-2",
                    isEarliest && "font-medium text-fg",
                  )}
                >
                  {bid.availableDate}
                </td>
                <td className="px-4 py-3 text-fg-2">{stripEmoji(bid.sessionPlan)}</td>
                <td className="px-4 py-3 text-fg-2">
                  {responseHours === undefined ? "—" : `~${responseHours}h`}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {onShortlist && (
                      <button
                        type="button"
                        onClick={() => onShortlist(bid)}
                        aria-label={
                          shortlisted.has(bid.id)
                            ? "Remove from shortlist"
                            : "Shortlist"
                        }
                        className={cn(
                          "rounded-md border border-line p-1.5 text-fg-3 hover:text-fg",
                          shortlisted.has(bid.id) && "text-accent",
                        )}
                      >
                        <Star className={cn("h-4 w-4", shortlisted.has(bid.id) && "fill-current")} />
                      </button>
                    )}
                    {canAccept && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={request.status !== "open"}
                        onClick={() => onAccept(bid)}
                      >
                        Accept
                      </Button>
                    )}
                    <Link
                      href={`/artists/${bid.artistId}`}
                      className="text-xs text-fg-2 underline underline-offset-2 hover:text-fg"
                    >
                      Profile
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
