"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Database, Droplets, LayoutList, MapPin, Radio, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PERSONAS } from "@/lib/personas";
import { usePersona } from "@/lib/persona";
import { seedDemoData } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { CountryTag, Spinner } from "./ui";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

const LINKS = [
  { href: "/create", label: "Design Studio", icon: Sparkles },
  { href: "/feed", label: "Open Requests", icon: Radio },
  { href: "/requests", label: "My Requests", icon: LayoutList },
  { href: "/artists", label: "Studios", icon: Users },
];

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 items-center justify-center bg-red-600 text-zinc-950 shadow-[3px_3px_0_0_#f4f4f5] transition group-hover:shadow-[1px_1px_0_0_#f4f4f5] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
        <Droplets className="h-4.5 w-4.5" strokeWidth={2.5} />
      </span>
      <span className="font-display text-[26px] leading-none tracking-[0.06em] text-zinc-100">
        INQ<span className="text-red-500">FY</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { persona, setPersonaId, hydrated } = usePersona();
  const [open, setOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  async function reseed() {
    if (seeding) return;
    setSeeding(true);
    try {
      await seedDemoData({ reset: true });
      setSeeded(true);
      setTimeout(() => setSeeded(false), 2500);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                )}
              >
                <Icon className={cn("h-4 w-4", active && href === "/create" && "text-red-400", active && href === "/feed" && "text-emerald-400")} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={reseed}
            title="Reset / Seed Demo Data"
            className="hidden items-center gap-1.5 rounded-lg border border-zinc-800 px-2.5 py-2 text-xs text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 sm:flex"
          >
            {seeding ? <Spinner className="h-3.5 w-3.5" /> : <Database className="h-3.5 w-3.5" />}
            {seeded ? "Seeded" : "Reset Demo Data"}
          </button>

          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-all",
                persona.role === "artist"
                  ? "border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/15"
                  : "border-red-500/40 bg-red-500/10 hover:bg-red-500/15",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-sm bg-zinc-100 font-display text-sm text-zinc-950",
                )}
              >
                {initials(persona.name)}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-[10px] uppercase tracking-wider text-zinc-400">
                  {hydrated ? persona.label : "Loading"}
                </span>
                <span className="block -mt-0.5 font-semibold leading-tight">{persona.name}</span>
              </span>
              <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition", open && "rotate-180")} />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl"
                >
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                    Instant Persona Switcher
                  </div>
                  {PERSONAS.map((p) => {
                    const active = p.id === persona.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPersonaId(p.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                          active ? "bg-zinc-800" : "hover:bg-zinc-900",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-sm bg-zinc-100 font-display text-lg text-zinc-950",
                          )}
                        >
                          {initials(p.name)}
                        </span>
                        <span className="flex-1">
                          <span className="block text-[10px] uppercase tracking-wider text-zinc-500">{p.label}</span>
                          <span className="block font-semibold">{p.name}</span>
                          <span className="block text-xs text-zinc-400">
                            <MapPin className="mr-1 inline h-3 w-3" /> {p.city}, {p.country} <CountryTag flag={p.flag} />
                          </span>
                        </span>
                        {active && <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setOpen(false);
                      reseed();
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 sm:hidden"
                  >
                    <Database className="h-3.5 w-3.5" /> Reset / Seed Demo Data
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-zinc-800/60 px-3 py-2 lg:hidden">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                active ? "bg-zinc-800 text-white" : "text-zinc-400",
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
