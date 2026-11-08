"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Database, Image as ImageIcon, LayoutList, MapPin, Radio, ShieldCheck, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isAdminUser } from "@/lib/admin";
import { signOutUser, useAuth } from "@/lib/auth";
import { IS_LIVE } from "@/lib/mode";
import { PERSONAS } from "@/lib/personas";
import { usePersona } from "@/lib/persona";
import { seedDemoData } from "@/lib/seed";
import { cn } from "@/lib/utils";
import { Button, CountryTag, LiveDot, Spinner } from "./ui";

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

const LINKS = [
  { href: "/create", label: "Design", icon: Sparkles },
  { href: "/feed", label: "Requests", icon: Radio },
  { href: "/requests", label: "My Requests", icon: LayoutList },
  { href: "/artists", label: "Studios", icon: Users },
  { href: "/inspiration", label: "Inspiration", icon: ImageIcon },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

export function Logo() {
  return <Link href="/" className="text-lg font-semibold tracking-tight text-fg">Inqfy</Link>;
}

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, loading: authLoading } = useAuth();
  const { persona, setPersonaId, hydrated, isArtist } = usePersona();
  const links = LINKS
    .filter(({ href }) => href !== "/admin" || (IS_LIVE && isAdminUser(user)))
    .map((link) =>
      link.href === "/requests" && isArtist
        ? { ...link, label: "My Quotes" }
        : link,
    );
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
    <header className="sticky top-0 z-40 border-b border-line bg-page">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                  active ? "bg-raised text-fg" : "text-fg-2 hover:bg-raised hover:text-fg",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!IS_LIVE && (
            <Button variant="ghost" size="sm" onClick={reseed} title="Reset demo data" className="hidden sm:flex">
              {seeding ? <Spinner className="h-3.5 w-3.5" /> : <Database className="h-3.5 w-3.5" />}
              {seeded ? "Seeded" : "Reset Demo Data"}
            </Button>
          )}

          {IS_LIVE ? (
            !user ? (
              <Link href="/login">
                <Button variant="secondary" size="sm">{authLoading ? "Loading…" : "Sign in"}</Button>
              </Link>
            ) : !profile ? (
              <Link href="/onboarding">
                <Button variant="secondary" size="sm">Complete setup</Button>
              </Link>
            ) : (
              <div ref={ref} className="relative">
                <button
                  onClick={() => setOpen((value) => !value)}
                  className="flex h-10 items-center gap-2 rounded-lg border border-line bg-card px-2.5 text-sm"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-raised text-xs font-medium text-fg-2">
                    {initials(profile.name)}
                  </span>
                  <span className="hidden text-left sm:block">
                    <span className="block text-xs text-fg-3">
                      {profile.role === "artist" ? "Studio" : "Client"}
                    </span>
                    <span className="block max-w-32 truncate font-medium">{profile.name}</span>
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-fg-2 transition-transform", open && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-line bg-card p-1.5"
                    >
                      <div className="px-3 py-2 text-xs text-fg-2">{profile.name}</div>
                      <div className="px-3 pb-2 text-xs text-fg-3">
                        {profile.role === "artist" ? "Studio account" : "Client account"}
                      </div>
                      <button
                        onClick={async () => {
                          setOpen(false);
                          await signOutUser();
                        }}
                        className="h-auto w-full rounded-lg px-3 py-2 text-left text-sm text-fg-2 hover:bg-raised"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          ) : (
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className={cn(
                "flex h-10 items-center gap-2 rounded-lg border border-line bg-card px-2.5 text-sm transition-colors",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md bg-raised text-xs font-medium text-fg-2",
                )}
              >
                {initials(persona.name)}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs text-fg-3">
                  {hydrated ? persona.label : "Loading"}
                </span>
                <span className="block -mt-0.5 font-medium leading-tight">{persona.name}</span>
              </span>
              <ChevronDown className={cn("h-4 w-4 text-fg-2 transition-transform", open && "rotate-180")} />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-card p-1.5"
                >
                  <div className="px-3 py-2 text-xs text-fg-3">
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
                          "flex h-auto w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                          active ? "bg-raised" : "hover:bg-raised",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-md bg-raised text-xs font-medium text-fg-2",
                          )}
                        >
                          {initials(p.name)}
                        </span>
                        <span className="flex-1">
                          <span className="block text-xs text-fg-3">{p.label}</span>
                          <span className="block font-medium">{p.name}</span>
                          <span className="block text-xs text-fg-2">
                            <MapPin className="mr-1 inline h-3 w-3" /> {p.city}, {p.country} <CountryTag flag={p.flag} />
                          </span>
                        </span>
                        {active && <LiveDot />}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setOpen(false);
                      reseed();
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-fg-2 hover:bg-raised hover:text-fg sm:hidden"
                  >
                    <Database className="h-3.5 w-3.5" /> Reset / Seed Demo Data
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          )}
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 lg:hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm font-medium",
                active ? "bg-raised text-fg" : "text-fg-2",
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
