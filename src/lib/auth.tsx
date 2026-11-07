"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAuthClient, getDb } from "./firebase";
import { col, IS_LIVE } from "./mode";
import type { Profile } from "./types";

type AuthState = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(IS_LIVE);

  useEffect(() => {
    if (!IS_LIVE) return;

    let unsubscribeProfile: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(getAuthClient(), (nextUser) => {
      unsubscribeProfile?.();
      unsubscribeProfile = undefined;
      setUser(nextUser);
      setProfile(null);
      if (!nextUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      unsubscribeProfile = onSnapshot(
        doc(getDb(), col("profiles"), nextUser.uid),
        (snapshot) => {
          if (!snapshot.exists()) {
            setProfile(null);
          } else {
            const data = snapshot.data();
            setProfile({
              ...data,
              id: snapshot.id,
              isPro: data.isPro ?? false,
              rating: data.rating ?? 0,
              reviewCount: data.reviewCount ?? 0,
            } as Profile);
          }
          setLoading(false);
        },
        () => {
          setProfile(null);
          setLoading(false);
        },
      );
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo(() => ({ user, profile, loading }), [user, profile, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function signInWithGoogle() {
  return signInWithPopup(getAuthClient(), new GoogleAuthProvider());
}

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getAuthClient(), email, password);
}

export function createWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(getAuthClient(), email, password);
}

export function signOutUser() {
  return signOut(getAuthClient());
}
