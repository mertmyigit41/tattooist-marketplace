"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, SegmentedControl } from "@/components/ui";
import { createWithEmail, signInWithEmail, signInWithGoogle, useAuth } from "@/lib/auth";
import { IS_LIVE } from "@/lib/mode";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState<"sign-in" | "create">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!IS_LIVE || loading || !user) return;
    router.replace(profile ? "/" : "/onboarding");
  }, [loading, profile, router, user]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (tab === "create") await createWithEmail(email, password);
      else await signInWithEmail(email, password);
      router.replace("/onboarding");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
      router.replace("/onboarding");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Google sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  if (!IS_LIVE) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-fg-2">
        Sign-in is available on the live app. <Link href="/" className="text-fg underline">Return home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card className="p-6 sm:p-8">
        <h1 className="font-display text-3xl sm:text-4xl">{tab === "create" ? "Create an account" : "Sign in"}</h1>
        <div className="mt-5"><SegmentedControl value={tab} onChange={(value) => setTab(value as "sign-in" | "create")} ariaLabel="Account action" options={[{ value: "sign-in", label: "Sign in" }, { value: "create", label: "Create account" }]} /></div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-fg">
            Email
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 h-11 w-full rounded-[10px] border border-line bg-raised px-4 text-[15px] outline-none focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" />
          </label>
          <label className="block text-sm font-medium text-fg">
            Password
            <input required minLength={6} type="password" autoComplete={tab === "create" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 h-11 w-full rounded-[10px] border border-line bg-raised px-4 text-[15px] outline-none focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" />
          </label>
          {error && <p role="alert" className="text-sm text-negative">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {tab === "create" ? "Create account" : "Sign in"}
          </Button>
        </form>
        <div className="my-4 flex items-center gap-3 text-xs text-fg-3"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
        <Button variant="secondary" disabled={busy} onClick={google} className="w-full">Continue with Google</Button>
      </Card>
    </div>
  );
}
