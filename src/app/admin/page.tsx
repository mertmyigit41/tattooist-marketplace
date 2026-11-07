"use client";

import { useState } from "react";
import { Check, ShieldCheck, Trash2 } from "lucide-react";
import { Badge, Button, Card, CountryTag, Spinner } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin";
import { col, IS_LIVE } from "@/lib/mode";
import { getDb } from "@/lib/firebase";
import { useProfiles } from "@/lib/hooks";
import type { Profile } from "@/lib/types";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

type StudioApprovalRowProps = {
  profile: Profile;
  action: "approve" | "revoke";
  busy: boolean;
  error?: string;
  onApproval: (profile: Profile, approved: boolean) => void;
  onDelete: (profile: Profile) => void;
};

function StudioApprovalRow({
  profile,
  action,
  busy,
  error,
  onApproval,
  onDelete,
}: StudioApprovalRowProps) {
  const portfolioUrls = Array.isArray(profile.portfolioUrls) ? profile.portfolioUrls.slice(0, 6) : [];
  const styles = Array.isArray(profile.styles) ? profile.styles : [];

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold">{profile.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">
              {profile.city}, {profile.country} <CountryTag flag={profile.countryFlag ?? ""} />
              <span className="mx-2 text-zinc-700">·</span>
              Created {typeof profile.createdAt === "number"
                ? new Date(profile.createdAt).toLocaleDateString()
                : "date unavailable"}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {styles.map((style) => <Badge key={style}>{style}</Badge>)}
          </div>
          {portfolioUrls.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {portfolioUrls.map((url, index) => (
                <div key={`${url}-${index}`} className="h-20 w-20 overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`${profile.name} portfolio piece ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500">No portfolio images provided.</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            size="sm"
            variant={action === "approve" ? "violet" : "outline"}
            disabled={busy}
            onClick={() => onApproval(profile, action === "approve")}
          >
            {action === "approve" ? <Check className="h-3.5 w-3.5" /> : null}
            {action === "approve" ? "Approve" : "Revoke"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300"
            disabled={busy}
            onClick={() => onDelete(profile)}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
    </Card>
  );
}

function AdminDashboard() {
  const { profiles, loading } = useProfiles("artist");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const pending = profiles.filter((profile) => profile.approved === false);
  const approved = profiles.filter((profile) => profile.approved === true);

  async function setApproval(profile: Profile, approvedValue: boolean) {
    setBusyId(profile.id);
    setErrors((current) => ({ ...current, [profile.id]: "" }));
    try {
      await updateDoc(doc(getDb(), col("profiles"), profile.id), { approved: approvedValue });
    } catch (cause) {
      setErrors((current) => ({
        ...current,
        [profile.id]: cause instanceof Error ? cause.message : "Could not update studio approval.",
      }));
    } finally {
      setBusyId(null);
    }
  }

  async function removeProfile(profile: Profile) {
    if (!window.confirm(`Delete the profile for ${profile.name}?`)) return;
    setBusyId(profile.id);
    setErrors((current) => ({ ...current, [profile.id]: "" }));
    try {
      await deleteDoc(doc(getDb(), col("profiles"), profile.id));
    } catch (cause) {
      setErrors((current) => ({
        ...current,
        [profile.id]: cause instanceof Error ? cause.message : "Could not delete studio profile.",
      }));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center gap-2 py-24 text-zinc-500"><Spinner /> Loading studios…</div>;
  }

  return (
    <div className="space-y-10">
      <header>
        <span className="stamp text-xs text-red-500">Admin</span>
        <h1 className="mt-3 flex items-center gap-2 text-4xl sm:text-5xl">
          <ShieldCheck className="h-8 w-8 text-red-500" /> Studio approvals
        </h1>
        <p className="mt-2 text-zinc-400">Review studio profiles before they can quote client requests.</p>
      </header>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-2xl">Pending approval</h2>
          <span className="font-mono text-xs text-zinc-500">{pending.length} studios</span>
        </div>
        {pending.length === 0 ? (
          <p className="rounded-md border border-dashed border-zinc-800 p-6 text-sm text-zinc-500">No studios are waiting for approval.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((profile) => (
              <StudioApprovalRow
                key={profile.id}
                profile={profile}
                action="approve"
                busy={busyId !== null}
                error={errors[profile.id]}
                onApproval={setApproval}
                onDelete={removeProfile}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-2xl">Approved studios</h2>
          <span className="font-mono text-xs text-zinc-500">{approved.length} studios</span>
        </div>
        {approved.length === 0 ? (
          <p className="rounded-md border border-dashed border-zinc-800 p-6 text-sm text-zinc-500">No studios have been approved yet.</p>
        ) : (
          <div className="space-y-3">
            {approved.map((profile) => (
              <StudioApprovalRow
                key={profile.id}
                profile={profile}
                action="revoke"
                busy={busyId !== null}
                error={errors[profile.id]}
                onApproval={setApproval}
                onDelete={removeProfile}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (!IS_LIVE) {
    return <div className="py-20 text-center text-zinc-400">Not available in the demo</div>;
  }
  if (loading) {
    return <div className="flex items-center justify-center gap-2 py-24 text-zinc-500"><Spinner /> Checking admin access…</div>;
  }
  if (!isAdminUser(user)) {
    return <div className="py-20 text-center text-zinc-400">Admins only</div>;
  }

  return <AdminDashboard />;
}
