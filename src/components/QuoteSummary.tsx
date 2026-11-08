import type { Bid } from "@/lib/types";
import { eur } from "@/lib/utils";
import { Card } from "./ui";

function dateValue(value: string) {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

export function QuoteSummary({ bids }: { bids: Bid[] }) {
  if (bids.length === 0) return null;

  const earliest =
    [...bids].sort((a, b) => dateValue(a.availableDate) - dateValue(b.availableDate))[0] ??
    bids[0];
  const prices = bids.map((bid) => bid.priceEur);
  const minimum = Math.min(...prices);
  const maximum = Math.max(...prices);

  return (
    <Card className="p-5 sm:p-6">
      <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Stat label="Studios replied" value={String(bids.length)} />
        <Stat label="Earliest start" value={earliest.availableDate} />
        <Stat
          label="Price range"
          value={minimum === maximum ? eur(minimum) : `${eur(minimum)}–${eur(maximum)}`}
        />
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <div className="text-xs text-fg-3">{label}</div>
      <div className="mt-1 font-mono text-2xl font-medium tabular-nums text-fg">{value}</div>
    </div>
  );
}
