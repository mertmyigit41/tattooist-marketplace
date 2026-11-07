"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { IS_LIVE } from "@/lib/mode";
import type { Role } from "@/lib/types";
import { Spinner } from "./ui";

export function LiveRoleGate({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!IS_LIVE || loading) return;
    if (!user) router.replace("/login");
    else if (!profile) router.replace("/onboarding");
  }, [loading, profile, router, user]);

  if (!IS_LIVE) return children;
  if (loading) return <div className="py-24 text-center text-zinc-500"><Spinner /> Loading account…</div>;
  if (!user || !profile) return <div className="py-24 text-center text-zinc-500">Redirecting…</div>;
  if (profile.role !== role) {
    return (
      <div className="py-24 text-center text-zinc-400">
        This page is for {role === "client" ? "clients" : "studios"}.
      </div>
    );
  }
  return children;
}
