"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button, Card, LiveDot, Pill, Spinner } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { getDb } from "@/lib/firebase";
import { IMG } from "@/lib/images";
import { useRequests } from "@/lib/hooks";
import { col, IS_LIVE } from "@/lib/mode";
import { isAcceptingQuotes, STYLES } from "@/lib/utils";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

const COUNTRIES = [
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Other", flag: "" },
];
const INPUT_CLASS = "mt-1 h-11 w-full rounded-[10px] border border-line bg-raised px-4 text-[15px] text-fg outline-none placeholder:text-fg-3 focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { requests } = useRequests();
  const [role, setRole] = useState<"client" | "artist" | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0].name);
  const [styles, setStyles] = useState<string[]>([]);
  const [rate, setRate] = useState("");
  const [bio, setBio] = useState("");
  const [urls, setUrls] = useState<string[]>([""]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const matchingRequestCount = requests.filter(
    (request) =>
      isAcceptingQuotes(request) && styles.includes(request.style),
  ).length;

  useEffect(() => {
    if (!IS_LIVE || loading) return;
    if (!user) router.replace("/login");
    else if (profile) router.replace("/");
  }, [loading, profile, router, user]);

  function toggleStyle(style: string) {
    setStyles((current) => current.includes(style)
      ? current.filter((value) => value !== style)
      : [...current, style]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !role) return;
    setBusy(true);
    setError(null);
    const flag = COUNTRIES.find((entry) => entry.name === country)?.flag ?? "";
    const portfolioUrls = role === "artist" ? urls.map((url) => url.trim()).filter(Boolean).slice(0, 6) : [];
    const profileData = {
      createdAt: Date.now(),
      role,
      name: name.trim(),
      city: city.trim(),
      country,
      countryFlag: flag,
      avatarUrl: role === "artist" ? portfolioUrls[0] ?? IMG.artist : "",
      styles: role === "artist" ? styles : [],
      portfolioUrls,
      whatsapp: "",
      ...(role === "artist" ? {
        hourlyRateEur: Number(rate) || 0,
        tagline: bio.trim(),
        approved: false,
        isPro: false,
        rating: 0,
        reviewCount: 0,
      } : {}),
    };
    try {
      await setDoc(doc(getDb(), col("profiles"), user.uid), profileData);
      router.replace("/");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your profile.");
      setBusy(false);
    }
  }

  if (!IS_LIVE) {
    return <div className="py-16 text-center text-fg-2">Account setup is available on the live app</div>;
  }
  if (loading || !user || profile) {
    return <div className="py-24 text-center text-fg-3"><Spinner /> Loading account…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-3xl sm:text-4xl">Who are you here as?</h1>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <button onClick={() => setRole("client")} className={`rounded-2xl border p-5 text-left transition-colors ${role === "client" ? "border-fg bg-fg text-ink" : "border-line bg-card"}`}>
          <span className="text-xl font-medium">I want a tattoo</span>
          <span className={`mt-1 block text-sm ${role === "client" ? "text-ink/70" : "text-fg-2"}`}>Post a design and compare studio quotes</span>
        </button>
        <button onClick={() => setRole("artist")} className={`rounded-2xl border p-5 text-left transition-colors ${role === "artist" ? "border-fg bg-fg text-ink" : "border-line bg-card"}`}>
          <span className="text-xl font-medium">I run a studio</span>
          <span className={`mt-1 block text-sm ${role === "artist" ? "text-ink/70" : "text-fg-2"}`}>Build a studio profile and quote requests</span>
        </button>
      </div>

      {role && (
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-medium text-fg">
              {role === "artist" ? "Studio name" : "Your name"}
              <input required value={name} onChange={(event) => setName(event.target.value)} className={INPUT_CLASS} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-fg">
                City
                <input required value={city} onChange={(event) => setCity(event.target.value)} className={INPUT_CLASS} />
              </label>
              <label className="block text-sm font-medium text-fg">
                Country
                <select value={country} onChange={(event) => setCountry(event.target.value)} className={INPUT_CLASS}>
                  {COUNTRIES.map((entry) => <option key={entry.name}>{entry.name}</option>)}
                </select>
              </label>
            </div>

            {role === "artist" && (
              <>
                <label className="block text-sm font-medium text-fg">
                  Hourly rate (€)
                  <input required type="number" min="1" value={rate} onChange={(event) => setRate(event.target.value)} className={INPUT_CLASS} />
                </label>
                <label className="block text-sm font-medium text-fg">
                  Studio bio
                  <textarea required rows={3} value={bio} onChange={(event) => setBio(event.target.value)} className="mt-1 min-h-24 w-full rounded-[10px] border border-line bg-raised px-4 py-3 text-[15px] text-fg outline-none focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" />
                </label>
                <div>
                  <div className="mb-2 text-sm font-medium text-fg">Styles</div>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map((style) => <Pill key={style} active={styles.includes(style)} onClick={() => toggleStyle(style)}>{style}</Pill>)}
                  </div>
                  {styles.length > 0 && (
                    <p className="mt-2 text-xs text-fg-2">
                      <LiveDot />{" "}
                      {matchingRequestCount} open request{matchingRequestCount === 1 ? "" : "s"} in these styles right now
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-fg">Portfolio image URLs (up to 6)</div>
                  {urls.map((url, index) => (
                    <input
                      key={index}
                      type="url"
                      value={url}
                      onChange={(event) => setUrls((current) => current.map((value, i) => i === index ? event.target.value : value))}
                      placeholder="https://…"
                      aria-label={`Portfolio image URL ${index + 1}`}
                      className={INPUT_CLASS}
                    />
                  ))}
                  {urls.length < 6 && <Button type="button" variant="ghost" size="sm" onClick={() => setUrls((current) => [...current, ""])}>Add image URL</Button>}
                </div>
                <p className="text-xs text-fg-3">New studio profiles are reviewed before quoting is enabled</p>
              </>
            )}

            {error && <p role="alert" className="text-sm text-negative">{error}</p>}
            <Button type="submit" disabled={busy || (role === "artist" && styles.length === 0)} className="w-full sm:w-auto">
              {busy ? <Spinner className="border-ink" /> : null} Save profile
            </Button>
          </form>
        </Card>
      )}
      <Link href="/" className="text-xs text-fg-3 underline">Return to feed</Link>
    </div>
  );
}
