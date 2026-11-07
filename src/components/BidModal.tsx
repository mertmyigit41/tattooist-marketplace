"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  Euro,
  Plane,
  Send,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { submitBid } from "@/lib/actions";
import { useProfile } from "@/lib/hooks";
import { usePersona } from "@/lib/persona";
import type { TattooRequest } from "@/lib/types";
import {
  cn,
  eur,
  flightEstimate,
  SESSION_PLANS,
  TOURIST_PERKS,
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
  const { persona } = usePersona();
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      wide
      title={
        <span className="flex items-center gap-2">
          Quote a fixed price
          <span className="hidden text-sm font-normal text-zinc-500 sm:inline">
            · as {persona.name} <CountryTag flag={persona.flag} />
          </span>
        </span>
      }
    >
      {props.open && props.request && (
        <BidForm
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
  const [perks, setPerks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const flight = useMemo(
    () => flightEstimate(request.clientCountry, persona.country),
    [request.clientCountry, persona.country],
  );
  const priceNum = Number(price) || 0;
  const total = priceNum + flight;
  const savings = request.estimatedLocalPriceEur - total;

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
        estimatedRoundtripFlightEur: flight,
        touristPerks: perks,
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
      <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={request.conceptImageUrl}
          alt=""
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{request.title}</div>
          <div className="text-xs text-zinc-400">
            {request.clientName} · {request.clientCity}, {request.clientCountry}{" "}
            <CountryTag flag={request.clientFlag} /> · {request.bodyPart} · {request.style}
          </div>
          <div className="mt-1 text-xs text-zinc-400">
            Client&apos;s local baseline:{" "}
            <span className="font-semibold text-zinc-200">
              {eur(request.estimatedLocalPriceEur)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200/90">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        Power stays with the client: quotes must include a fixed price, a
        concrete session plan, a date and 3 portfolio pieces. &quot;DM me / come
        in for a consultation&quot; pitches are rejected.
      </div>

      <Field label="Fixed Price (€)" icon={<Euro className="h-4 w-4" />}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-zinc-500">
              €
            </span>
            <input
              type="number"
              min={1}
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="750"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-9 pr-4 text-2xl font-bold outline-none focus:border-emerald-500"
            />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-400 sm:w-64">
            <div className="flex items-center gap-1.5">
              <Plane className="h-3.5 w-3.5" /> Est. flight {request.clientCity}{" "}
              ↔ {persona.city}: <b className="text-zinc-200">{eur(flight)}</b>
            </div>
            {priceNum > 0 && (
              <div
                className={cn(
                  "mt-1 font-semibold",
                  savings > 0 ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {savings > 0
                  ? `Client saves ${eur(savings)} vs local`
                  : `${eur(-savings)} above local baseline`}
              </div>
            )}
          </div>
        </div>
      </Field>

      <Field label="Session Execution Plan">
        <div className="flex flex-wrap gap-2">
          {SESSION_PLANS.map((p) => (
            <Pill
              key={p}
              active={plan === p}
              accent="amber"
              onClick={() => setPlan(p)}
            >
              {p}
            </Pill>
          ))}
        </div>
      </Field>

      <Field
        label="Earliest Available Date"
        icon={<CalendarDays className="h-4 w-4" />}
      >
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_DATES.map((q) => {
            const v = q.value();
            return (
              <Pill
                key={q.label}
                active={date === v}
                accent="amber"
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
            className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-amber-500"
          />
          <span className="text-xs text-zinc-500">
            Selected: <b className="text-zinc-300">{date}</b>
          </span>
        </div>
      </Field>

      <Field label="Tourist Perks (optional)">
        <div className="flex flex-wrap gap-2">
          {TOURIST_PERKS.map((p) => {
            const on = perks.includes(p);
            return (
              <Pill
                key={p}
                active={on}
                accent="emerald"
                onClick={() =>
                  setPerks((s) => (on ? s.filter((x) => x !== p) : [...s, p]))
                }
              >
                {on && <Check className="mr-1 inline h-3 w-3" />}
                {p}
              </Pill>
            );
          })}
        </div>
      </Field>

      <Field
        label={
          <span>
            Select 3 Matching Portfolio Pieces{" "}
            <span
              className={cn(
                "ml-1 rounded-full px-2 py-0.5 text-[11px]",
                selected.length === 3
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-zinc-800 text-zinc-400",
              )}
            >
              {selected.length}/3
            </span>
          </span>
        }
      >
        {!profile ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
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
                    "relative aspect-square overflow-hidden rounded-xl border-2 transition",
                    on
                      ? "border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.45)]"
                      : "border-transparent opacity-80 hover:opacity-100",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {on && (
                    <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-zinc-950">
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
            "w-full rounded-xl border bg-zinc-900 p-3 text-sm outline-none",
            vague
              ? "border-rose-500 focus:border-rose-500"
              : "border-zinc-800 focus:border-amber-500",
          )}
        />
        {vague ? (
          <p className="mt-1 text-xs text-rose-400">
            Vague &quot;DM me / consultation&quot; pitches are not allowed. Give
            a concrete fixed-price plan.
          </p>
        ) : noteTooShort ? (
          <p className="mt-1 text-xs text-zinc-500">
            {MIN_NOTE_CHARS - message.trim().length} more characters — describe
            technique, experience and what each session covers.
          </p>
        ) : null}
      </Field>

      {attempted && !valid && (
        <p role="alert" className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          {missing.length
            ? `Almost there — ${missing.join(", ")}.`
            : "Studio profile is still loading, try again in a second."}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-5">
        <div className="text-sm text-zinc-400">
          {priceNum > 0 && (
            <div>
              Client total incl. flight:{" "}
              <b className="text-zinc-100">{eur(total)}</b>
            </div>
          )}
          {missing.length > 0 && (
            <div className="mt-0.5 text-xs text-amber-300/90">
              To submit: {missing.join(" · ")}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="emerald"
            size="lg"
            disabled={busy}
            aria-disabled={!valid}
            className={cn(!valid && "opacity-60")}
            onClick={handleSubmit}
          >
            {busy ? (
              <Spinner className="border-zinc-900" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Submit Quote
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
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-200">
        {icon && <span className="text-zinc-500">{icon}</span>}
        {label}
      </div>
      {children}
    </div>
  );
}
