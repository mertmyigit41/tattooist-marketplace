"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
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
      <div className="mx-auto max-w-xl py-16 text-center text-zinc-400">
        Sign-in is available on the live app. <Link href="/" className="text-red-300 underline">Return home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card className="p-6 sm:p-8">
        <span className="stamp text-xs text-red-500">Your account</span>
        <h1 className="mt-3 text-4xl">{tab === "create" ? "Create an account" : "Sign in"}</h1>
        <div className="mt-5 flex gap-2 border-b border-zinc-800">
          <button className={`px-3 py-2 text-sm ${tab === "sign-in" ? "border-b-2 border-red-500 text-white" : "text-zinc-500"}`} onClick={() => setTab("sign-in")}>Sign in</button>
          <button className={`px-3 py-2 text-sm ${tab === "create" ? "border-b-2 border-red-500 text-white" : "text-zinc-500"}`} onClick={() => setTab("create")}>Create account</button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-sm text-zinc-300">
            Email
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-red-500" />
          </label>
          <label className="block text-sm text-zinc-300">
            Password
            <input required minLength={6} type="password" autoComplete={tab === "create" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-red-500" />
          </label>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <Button type="submit" variant="violet" disabled={busy} className="w-full">
            {tab === "create" ? "Create account" : "Sign in"}
          </Button>
        </form>
        <div className="my-4 flex items-center gap-3 text-xs text-zinc-600"><span className="h-px flex-1 bg-zinc-800" />OR<span className="h-px flex-1 bg-zinc-800" /></div>
        <Button variant="outline" disabled={busy} onClick={google} className="w-full">Continue with Google</Button>
      </Card>
    </div>
  );
}
