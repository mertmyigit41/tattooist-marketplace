import { Search } from "lucide-react";
import { Button } from "./ui";

const SEARCH_CITIES = [
  "Dublin",
  "Istanbul",
  "Bangkok",
  "Bali",
  "Warsaw",
  "New York",
  "Lisbon",
  "Cork",
  "Berlin",
];

export function SearchBar({ query = "", city = "" }: { query?: string; city?: string }) {
  return (
    <form action="/feed" method="get" className="flex w-full flex-col gap-2 rounded-md border border-zinc-700 bg-zinc-950 p-1.5 sm:flex-row">
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Dragon sleeve, fine line, Istanbul…"
        aria-label="Search tattoo requests"
        className="min-w-0 flex-1 rounded-sm bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
      />
      <select
        name="city"
        defaultValue={city}
        aria-label="Filter by city"
        className="rounded-sm border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 outline-none focus:border-zinc-500"
      >
        <option value="">All cities</option>
        {SEARCH_CITIES.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <Button type="submit" variant="violet" className="shrink-0">
        <Search className="h-4 w-4" /> Search
      </Button>
    </form>
  );
}
