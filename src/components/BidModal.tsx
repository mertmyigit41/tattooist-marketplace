"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Euro,
  Send,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { submitBid } from "@/lib/actions";
import { useProfile } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import { IS_LIVE } from "@/lib/mode";
import type { TattooRequest } from "@/lib/types";
import {
  cn,
  SESSION_PLANS,
} from "@/lib/utils";
import { Button, CountryTag, Modal, Pill, Spinner } from "./ui";

const MIN_NOTE_CHARS = 40;

const QUICK_DATES = [
  { label: "Next Week", value: () => fmt(addDays(7)) },
  { label: "Nov 15, 2026", value: () => "Nov 15, 2026" },
  { label: "Dec 1, 2026", value: () => "Dec 1, 2026" },
  { label: "Jan 10, 2027", value: () => "Jan 10, 2027" },
];

function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
function fmt(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type BidModalProps = {
  request: TattooRequest | null;
  open: boolean;
  onClose: () => void;
  onSubmitted?: (bidId: string) => void;
};

export function BidModal(props: BidModalProps) {
  const { persona, isApprovedArtist } = usePersona();
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      wide
      title={
        <span className="flex items-center gap-2">
          Send your quote
          <span className="hidden text-sm font-normal text-fg-3 sm:inline">
            · as {persona.name} <CountryTag flag={persona.flag} />
          </span>
        </span>
      }
    >
      {props.open && props.request && (
        IS_LIVE && persona.role === "artist" && !isApprovedArtist
          ? <div className="py-10 text-center text-fg-2">Your studio is pending approval</div>
          : <BidForm
              key={props.request.id + persona.id}
              {...props}
              request={props.request}
            />
      )}
    </Modal>
  );
}

function BidForm({
  request,
  onClose,
  onSubmitted,
}: BidModalProps & { request: TattooRequest }) {
  const { persona } = usePersona();
  const profile = useProfile(
    persona.role === "artist" ? persona.id : undefined,
  );

  const [price, setPrice] = useState("");
  const [plan, setPlan] = useState(SESSION_PLANS[0]);
  const [date, setDate] = useState("Nov 15, 2026");
  const [customDate, setCustomDate] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const priceNum = Number(price) || 0;

  const vague =
    /\b(dm me|consultation|come to (the )?studio|message me|call me)\b/i.test(
      message,
    );
  const noteTooShort = message.trim().length < MIN_NOTE_CHARS;
  const missing = [
    priceNum <= 0 && "enter a fixed price",
    !plan && "pick a session plan",
    !date && "pick an available date",
    selected.length !== 3 &&
      `select ${3 - selected.length} more portfolio piece${3 - selected.length === 1 ? "" : "s"}`,
    vague && "remove the vague \"DM me / consultation\" wording",
    !vague &&
      noteTooShort &&
      `write ${MIN_NOTE_CHARS - message.trim().length} more characters in the pitch note`,
    profile === null && "switch to an artist persona with a studio profile",
  ].filter(Boolean) as string[];
  const valid = missing.length === 0 && !!profile;

  async function handleSubmit() {
    if (!valid || !profile) {
      setAttempted(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const id = await submitBid({
        requestId: request.id,
        artistId: profile.id,
        artistName: profile.name,
        artistCity: profile.city,
        artistCountry: profile.country,
        artistFlag: profile.countryFlag,
        artistRating: profile.rating,
        priceEur: priceNum,
        sessionPlan: plan,
        availableDate: date,
        message: message.trim(),
        selectedPortfolioUrls: selected,
      });
      onSubmitted?.(id);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to submit bid");
    } finally {
      setBusy(false);
    }
  }

  function togglePortfolio(url: string) {
    setSelected((s) =>
      s.includes(url)
        ? s.filter((u) => u !== url)
        : s.length < 3
          ? [...s, url]
          : s,
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-4 rounded-xl border border-line bg-raised p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={request.conceptImageUrl}
          alt=""
          className="h-16 w-16 rounded-lg object-cover"
        />
        {request.referenceImageUrls?.map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={url} src={url} alt="" className="h-12 w-12 rounded-md object-cover" />
        ))}
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{request.title}</div>
          <div className="text-xs text-fg-2">
            {request.clientName} · {request.clientCity}, {request.clientCountry}{" "}
            <CountryTag flag={request.clientFlag} /> · {request.bodyPart} · {request.style}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-line bg-raised p-3 text-sm text-fg-2">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-fg-3" />
        Clients only see complete quotes: a fixed price, a concrete session plan,
        a start date and 3 portfolio pieces. &quot;DM me / come in for a
        consultation&quot; pitches are rejected.
      </div>

      <Field label="Fixed Price (€)" icon={<Euro className="h-4 w-4" />}>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-fg-3">
            €
          </span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="750"
            className="h-12 w-full rounded-[10px] border border-line bg-raised pl-9 pr-4 font-mono text-2xl font-medium tabular-nums outline-none focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </Field>

      <Field label="Session plan">
        <div className="flex flex-wrap gap-2">
          {SESSION_PLANS.map((p) => (
            <Pill
              key={p}
              active={plan === p}
              onClick={() => setPlan(p)}
            >
              {p}
            </Pill>
          ))}
        </div>
      </Field>

      <Field
        label="Earliest start date"
        icon={<CalendarDays className="h-4 w-4" />}
      >
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_DATES.map((q) => {
            const v = q.value();
            return (
              <Pill
                key={q.label}
                active={date === v}
                onClick={() => {
                  setDate(v);
                  setCustomDate("");
                }}
              >
                {q.label}
              </Pill>
            );
          })}
          <input
            type="date"
            value={customDate}
            onChange={(e) => {
              setCustomDate(e.target.value);
              if (e.target.value)
                setDate(fmt(new Date(e.target.value + "T12:00:00")));
            }}
            className="h-11 rounded-[10px] border border-line bg-raised px-4 text-[15px] text-fg outline-none focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
          <span className="text-xs text-fg-3">
            Selected: <span className="text-fg-2">{date}</span>
          </span>
        </div>
      </Field>

      <Field
        label={
          <span>
            Select 3 Matching Portfolio Pieces{" "}
            <span
              className={cn(
                "ml-1 rounded-md px-2 py-0.5 text-xs",
                selected.length === 3
                  ? "border border-positive/30 bg-positive/10 text-positive"
                  : "bg-raised text-fg-2",
              )}
            >
              {selected.length}/3
            </span>
          </span>
        }
      >
        {!profile ? (
          <div className="flex items-center gap-2 text-sm text-fg-3">
            <Spinner /> Loading portfolio…
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {profile.portfolioUrls.map((url) => {
              const idx = selected.indexOf(url);
              const on = idx >= 0;
              return (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  key={url}
                  onClick={() => togglePortfolio(url)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md transition-colors",
                    on
                      ? "ring-2 ring-fg ring-offset-2 ring-offset-card"
                      : "opacity-80 hover:opacity-100",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {on && (
                    <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-fg text-xs font-medium text-ink">
                      {idx + 1}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </Field>

      <Field label={`Short Pitch Note (min ${MIN_NOTE_CHARS} characters)`}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Why you're the right artist for this piece — technique, experience with this style, what the client can expect each day…"
          className={cn(
            "min-h-24 w-full rounded-[10px] border bg-raised px-4 py-3 text-[15px] text-fg outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            vague
              ? "border-negative focus:border-negative"
              : "border-line focus:border-fg-3",
          )}
        />
        {vague ? (
          <p className="mt-1 text-xs text-negative">
            Vague &quot;DM me / consultation&quot; pitches are not allowed. Give
            a concrete fixed-price plan.
          </p>
        ) : noteTooShort ? (
          <p className="mt-1 text-xs text-fg-3">
            {MIN_NOTE_CHARS - message.trim().length} more characters — describe
            technique, experience and what each session covers.
          </p>
        ) : null}
      </Field>

      {attempted && !valid && (
        <p role="alert" className="rounded-lg border border-negative/40 bg-negative/10 px-3 py-2 text-sm text-negative">
          {missing.length
            ? `Almost there — ${missing.join(", ")}.`
            : "Studio profile is still loading, try again in a second."}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-lg border border-negative/40 bg-negative/10 px-3 py-2 text-sm text-negative">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
        <div className="text-sm text-fg-2">
          {missing.length > 0 && (
            <div className="mt-0.5 text-xs text-negative">
              To submit: {missing.join(" · ")}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="lg"
            disabled={busy}
            aria-disabled={!valid}
            className={cn(!valid && "opacity-60")}
            onClick={handleSubmit}
          >
            {busy ? (
              <Spinner className="border-ink" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit quote
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-fg">
        {icon && <span className="text-fg-3">{icon}</span>}
        {label}
      </div>
      {children}
    </div>
  );
}
