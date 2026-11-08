import { Search } from "lucide-react";
import { Button } from "./ui";

const SEARCH_CITIES = [
  "Istanbul",
  "Bangkok",
  "Bali",
  "Warsaw",
  "New York",
  "Lisbon",
  "Cork",
  "Berlin",
  "Dublin",
];

export function SearchBar({ query = "", city = "" }: { query?: string; city?: string }) {
  return (
    <form action="/feed" method="get" className="flex w-full flex-col gap-2 rounded-2xl border border-line bg-card p-2 sm:flex-row">
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Dragon sleeve, fine line, Istanbul…"
        aria-label="Search tattoo requests"
        className="h-11 min-w-0 flex-1 rounded-[10px] bg-raised px-4 text-[15px] text-fg outline-none placeholder:text-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <select
        name="city"
        defaultValue={city}
        aria-label="Filter by city"
        className="h-11 rounded-[10px] border border-line bg-raised px-4 text-[15px] text-fg outline-none focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <option value="">Any city</option>
        {SEARCH_CITIES.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <Button type="submit" className="shrink-0">
        <Search className="h-4 w-4" /> Search
      </Button>
    </form>
  );
}
