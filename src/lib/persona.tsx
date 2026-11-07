"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { PERSONAS } from "./personas";
import type { Persona } from "./types";

const KEY = "inqfy.persona";

interface PersonaCtx {
  persona: Persona;
  setPersonaId: (id: string) => void;
  isArtist: boolean;
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
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = stored !== "";
  const id = hydrated ? stored : PERSONAS[0].id;

  const setPersonaId = useCallback((next: string) => {
    window.localStorage.setItem(KEY, next);
    listeners.forEach((l) => l());
  }, []);

  const value = useMemo<PersonaCtx>(() => {
    const persona = PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
    return { persona, setPersonaId, isArtist: persona.role === "artist", hydrated };
  }, [id, setPersonaId, hydrated]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePersona() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
}
