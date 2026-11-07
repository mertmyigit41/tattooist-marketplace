"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { useAuth } from "./auth";
import { IS_LIVE } from "./mode";
import { PERSONAS } from "./personas";
import type { Persona } from "./types";

const KEY = "inqfy.persona";

interface PersonaCtx {
  persona: Persona;
  setPersonaId: (id: string) => void;
  isArtist: boolean;
  isApprovedArtist: boolean;
  authenticated: boolean;
  hydrated: boolean;
}

const Ctx = createContext<PersonaCtx | null>(null);

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot() {
  const saved = window.localStorage.getItem(KEY);
  return saved && PERSONAS.some((p) => p.id === saved) ? saved : PERSONAS[0].id;
}

const getServerSnapshot = () => "";

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  if (IS_LIVE) return <LivePersonaProvider>{children}</LivePersonaProvider>;
  return <DemoPersonaProvider>{children}</DemoPersonaProvider>;
}

function DemoPersonaProvider({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = stored !== "";
  const id = hydrated ? stored : PERSONAS[0].id;

  const setPersonaId = useCallback((next: string) => {
    window.localStorage.setItem(KEY, next);
    listeners.forEach((l) => l());
  }, []);

  const value = useMemo<PersonaCtx>(() => {
    const persona = PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
    return {
      persona,
      setPersonaId,
      isArtist: persona.role === "artist",
      isApprovedArtist: true,
      authenticated: true,
      hydrated,
    };
  }, [id, setPersonaId, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function LivePersonaProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const setPersonaId = useCallback(() => {}, []);
  const persona = useMemo(
    () => profile
      ? {
          id: profile.id,
          role: profile.role,
          name: profile.name,
          city: profile.city,
          country: profile.country,
          flag: profile.countryFlag,
          label: profile.role === "artist" ? "Studio" : "Client",
        }
      : { ...PERSONAS[0], label: user ? "Setup required" : "Guest" },
    [profile, user],
  );
  const value = useMemo<PersonaCtx>(
    () => ({
      persona,
      setPersonaId,
      isArtist: profile?.role === "artist",
      isApprovedArtist: profile?.role === "artist" && profile.approved === true,
      authenticated: !!user && !!profile,
      hydrated: !loading,
    }),
    [persona, setPersonaId, profile, user, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePersona() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
}
