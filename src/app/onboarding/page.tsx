"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button, Card, Pill, Spinner } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { getDb } from "@/lib/firebase";
import { IMG } from "@/lib/images";
import { col, IS_LIVE } from "@/lib/mode";
import { STYLES } from "@/lib/utils";
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

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
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
    return <div className="py-16 text-center text-zinc-400">Account setup is available on the live app.</div>;
  }
  if (loading || !user || profile) {
    return <div className="py-24 text-center text-zinc-500"><Spinner /> Loading account…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <span className="stamp text-xs text-red-500">Set up your profile</span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Who are you here as?</h1>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <button onClick={() => setRole("client")} className={`rounded-md border p-5 text-left ${role === "client" ? "border-red-500 bg-red-500/10" : "border-zinc-800 bg-zinc-950"}`}>
          <span className="font-display text-2xl">I want a tattoo</span>
          <span className="mt-1 block text-sm text-zinc-400">Post a design and compare studio quotes.</span>
        </button>
        <button onClick={() => setRole("artist")} className={`rounded-md border p-5 text-left ${role === "artist" ? "border-red-500 bg-red-500/10" : "border-zinc-800 bg-zinc-950"}`}>
          <span className="font-display text-2xl">I run a studio</span>
          <span className="mt-1 block text-sm text-zinc-400">Build a studio profile and quote requests.</span>
        </button>
      </div>

      {role && (
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm text-zinc-300">
              {role === "artist" ? "Studio name" : "Your name"}
              <input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-red-500" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-zinc-300">
                City
                <input required value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-red-500" />
              </label>
              <label className="block text-sm text-zinc-300">
                Country
                <select value={country} onChange={(event) => setCountry(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-red-500">
                  {COUNTRIES.map((entry) => <option key={entry.name}>{entry.name}</option>)}
                </select>
              </label>
            </div>

            {role === "artist" && (
              <>
                <label className="block text-sm text-zinc-300">
                  Hourly rate (€)
                  <input required type="number" min="1" value={rate} onChange={(event) => setRate(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-red-500" />
                </label>
                <label className="block text-sm text-zinc-300">
                  Studio bio
                  <textarea required rows={3} value={bio} onChange={(event) => setBio(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-red-500" />
                </label>
                <div>
                  <div className="mb-2 text-sm text-zinc-300">Styles</div>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map((style) => <Pill key={style} active={styles.includes(style)} accent="zinc" onClick={() => toggleStyle(style)}>{style}</Pill>)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-zinc-300">Portfolio image URLs (up to 6)</div>
                  {urls.map((url, index) => (
                    <input
                      key={index}
                      type="url"
                      value={url}
                      onChange={(event) => setUrls((current) => current.map((value, i) => i === index ? event.target.value : value))}
                      placeholder="https://…"
                      aria-label={`Portfolio image URL ${index + 1}`}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-red-500"
                    />
                  ))}
                  {urls.length < 6 && <Button type="button" variant="ghost" size="sm" onClick={() => setUrls((current) => [...current, ""])}>Add image URL</Button>}
                </div>
                <p className="text-xs text-zinc-500">New studio profiles are reviewed before quoting is enabled.</p>
              </>
            )}

            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
            <Button type="submit" variant="violet" disabled={busy || (role === "artist" && styles.length === 0)} className="w-full sm:w-auto">
              {busy ? <Spinner className="border-white" /> : null} Save profile
            </Button>
          </form>
        </Card>
      )}
      <Link href="/" className="text-xs text-zinc-500 underline">Return to feed</Link>
    </div>
  );
}
