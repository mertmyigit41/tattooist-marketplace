"use client";

import { CalendarDays, CalendarRange, Clock, Euro, Image as ImageIcon, Images, MapPin, Palette, Plus, Ruler } from "lucide-react";
import Link from "next/link";
import { HeroQuoteStack } from "@/components/HeroQuoteStack";
import { LiveRequestsTeaser } from "@/components/LiveRequestsTeaser";
import { Button, Card } from "@/components/ui";
import { useShowcaseHref } from "@/lib/hooks";

const STEPS = [
  { n: "01", title: "Post once", text: "Describe the piece, pick style and placement, get a concept and a clean stencil. One post instead of a dozen DMs." },
  { n: "02", title: "Studios come to you", text: "Studios that work in your style reply with a fixed price, a session plan, a start date and three matching pieces. No chasing, no “DM for price”." },
  { n: "03", title: "You pick, you talk", text: "Compare the quotes side by side, accept one and continue on WhatsApp. Inqfy takes 0% commission." },
];
const QUOTE_REQUIREMENTS = [
  { icon: Euro, title: "A fixed price", text: "A number, not “DM for price”" },
  { icon: CalendarRange, title: "A session plan", text: "How many sessions, how long, in what order" },
  { icon: CalendarDays, title: "A start date", text: "The earliest day they can take you" },
  { icon: Images, title: "Three matching pieces", text: "Work from their own portfolio in your style" },
];
const STUDIO_DETAILS = [
  { icon: Palette, text: "Style and placement" }, { icon: Ruler, text: "Size" },
  { icon: ImageIcon, text: "Concept and stencil" }, { icon: MapPin, text: "Where and when" },
  { icon: Clock, text: "Quote window" },
];
const FAQS = [
  ["Is Inqfy free for clients?", "Yes. Posting a request and receiving quotes is free, and Inqfy takes no commission on your tattoo — you pay the studio directly."],
  ["Do I have to accept a quote?", "No. Let the window close, extend it, or close the request whenever you like. Quotes you already received stay available to accept."],
  ["Will studios get my phone number?", "No. Studios only see your request. You open the WhatsApp chat yourself after accepting a quote."],
  ["What if a studio writes “DM me for the price”?", "It can't be sent. Every quote must include a fixed price, a session plan, a start date and three portfolio pieces — vague pitches are blocked before submission."],
  ["Can I get quotes from studios in another city?", "Yes. Choose “Near me”, “On a trip” or “Open to travel” when you post. Studios anywhere can reply; you decide."],
];

export default function Home() {
  const showcaseHref = useShowcaseHref();
  return (
    <div className="space-y-24">
      <section className="grid items-center gap-10 pt-8 lg:grid-cols-2 lg:gap-16 lg:pt-16">
        <div>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.04] tracking-[-0.02em]">
            Stop chasing tattoo studios. <span className="text-fg-2">Let them come to you.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-7 text-fg-2">Describe the piece once. Studios that work in your style reply with a fixed price, a session plan, a start date and three matching pieces of their work. You compare, you pick, you talk.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/create"><Button size="lg">Post your tattoo</Button></Link>
            <Link href={showcaseHref}><Button variant="secondary" size="lg">{showcaseHref === "/feed" ? "Browse open requests" : "See a live request"}</Button></Link>
          </div>
        </div>
        <HeroQuoteStack />
      </section>
      <LiveRequestsTeaser />
      <section>
        <h2 className="mb-6 font-display text-3xl">Every quote must include</h2>
        <div className="grid overflow-hidden rounded-2xl border border-line bg-card sm:grid-cols-2 lg:grid-cols-4">
          {QUOTE_REQUIREMENTS.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className={`p-6 ${index ? "border-t border-line sm:border-l sm:border-t-0" : ""} ${index === 2 ? "sm:border-l-0 lg:border-l" : ""}`}>
              <Icon className="h-[18px] w-[18px] text-fg-3" />
              <h3 className="mt-4 text-base font-medium">{title}</h3>
              <p className="mt-1 text-sm text-fg-2">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-fg-3">Vague “come in for a consultation” pitches are rejected before they reach you</p>
      </section>
      <section className="grid gap-8 md:grid-cols-3">
        {STEPS.map((step) => <div key={step.n} className="border-t border-line-strong pt-5"><div className="font-mono text-xs text-fg-3">{step.n}</div><h3 className="mt-3 text-xl font-medium">{step.title}</h3><p className="mt-2 text-sm text-fg-2">{step.text}</p></div>)}
      </section>
      <Card className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
        <div><div className="text-[13px] text-fg-3">Run a studio?</div><h2 className="mt-3 font-display text-3xl">Requests in your style, brief already written</h2><p className="mt-3 text-fg-2">Open a request and you already know the design, placement, size, where and when. Send a complete quote in two minutes. 0% commission — clients pay you directly.</p><div className="mt-6 flex flex-wrap items-center gap-5"><Link href="/feed"><Button variant="secondary">Browse open requests</Button></Link><Link href="/artists" className="border-b border-line-strong text-sm text-fg-2">Studio membership</Link></div></div>
        <div><div className="text-[13px] text-fg-3">What you see before quoting</div><ul className="mt-3">{STUDIO_DETAILS.map(({ icon: Icon, text }) => <li key={text} className="flex h-11 items-center gap-2.5 border-t border-line text-sm first:border-t-0"><Icon className="h-[18px] w-[18px] text-fg-3" />{text}</li>)}</ul></div>
      </Card>
      <section><h2 className="mb-4 font-display text-3xl">Questions</h2>{FAQS.map(([question, answer]) => <details key={question} className="group border-t border-line py-4 last:border-b"><summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium">{question}<Plus className="h-[18px] w-[18px] text-fg-3 transition-transform group-open:rotate-45" /></summary><p className="mt-2 max-w-[40rem] text-fg-2">{answer}</p></details>)}</section>
    </div>
  );
}
