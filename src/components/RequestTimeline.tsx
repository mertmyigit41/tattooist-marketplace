"use client";

import { useNow, useProfiles } from "@/lib/hooks";
import { studioReach } from "@/lib/reach";
import type { Bid, TattooRequest } from "@/lib/types";
import {
  cn,
  formatDuration,
  isAcceptingQuotes,
  timeAgo,
} from "@/lib/utils";
import { Card } from "./ui";

type TimelineState = "done" | "active" | "pending";

export function RequestTimeline({
  request,
  bids,
}: {
  request: TattooRequest;
  bids: Bid[];
}) {
  const now = useNow();
  const { profiles } = useProfiles("artist");
  const { count } = studioReach(profiles, request.style);
  const firstBid = [...bids].sort((a, b) => a.createdAt - b.createdAt)[0];
  const acceptedBid = bids.find((bid) => bid.status === "accepted");
  const accepting = isAcceptingQuotes(request, now);

  const steps: {
    title: string;
    sub: string;
    state: TimelineState;
  }[] = [
    {
      title: "Posted",
      sub: timeAgo(request.createdAt),
      state: "done",
    },
    {
      title: "Reaching studios",
      sub: count > 0 ? `${count} studios in ${request.style}` : "live feed",
      state: "done",
    },
    {
      title: "First quote",
      sub: firstBid
        ? `${formatDuration(firstBid.createdAt - request.createdAt)} after posting`
        : "waiting",
      state: firstBid ? "done" : accepting ? "active" : "pending",
    },
    {
      title: "Quotes",
      sub: bids.length ? `${bids.length} received` : "—",
      state: bids.length ? "done" : "pending",
    },
    request.status === "booked"
      ? {
          title: "Booked",
          sub: `with ${acceptedBid?.artistName ?? "a studio"}`,
          state: "done",
        }
      : request.status === "closed"
        ? {
            title: "Closed",
            sub: "without booking",
            state: "done",
          }
        : {
            title: "Booked",
            sub: "pick a quote",
            state: bids.length > 0 ? "active" : "pending",
          },
  ];

  return (
    <Card className="p-5">
      <ol className="grid gap-4 sm:grid-cols-5">
        {steps.map((step, index) => {
          const closedStep =
            request.status === "closed" && index === steps.length - 1;
          return (
            <li key={`${index}-${step.title}`}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 rounded-full",
                    step.state === "done" && (closedStep ? "bg-fg-3" : "bg-fg"),
                    step.state === "active" && "bg-accent",
                    step.state === "pending" && "bg-line-strong",
                  )}
                />
                {index < steps.length - 1 && (
                  <span className="flex-1 border-t border-line" />
                )}
              </div>
              <div
                className={cn(
                  "text-sm font-medium",
                  (step.state === "pending" || closedStep) && "text-fg-3",
                )}
              >
                {step.title}
              </div>
              <div className="text-xs text-fg-3">{step.sub}</div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
