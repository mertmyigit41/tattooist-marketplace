"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, CalendarDays, CalendarRange, Euro, Images, Pause, Play, Plus } from "lucide-react";
import Link from "next/link";
import { useShowcaseHref } from "@/lib/hooks";

const VIDEOS = {
  hero: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4",
  mission: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4",
  solution: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4",
};
const STEPS = [
  ["01", "One brief", "Your idea, placement and references. Put it into words once, instead of starting the same conversation in a dozen inboxes."],
  ["02", "Studios reply", "Studios see your request and send a complete quote with matching work. No chasing. No ‘DM for price’."],
  ["03", "Your decision", "Compare the work, the plan and the price. Choose a studio when it feels right — or keep looking."],
];
const REQUIREMENTS = [
  { icon: Euro, title: "A fixed price", text: "Know the number before you start a conversation." },
  { icon: CalendarRange, title: "A session plan", text: "How many sessions, how long, and what to expect." },
  { icon: CalendarDays, title: "A start date", text: "A real opening, not another waiting list." },
  { icon: Images, title: "Matching work", text: "Three portfolio pieces to help you judge the fit." },
];
const FAQS = [
  ["Is it free to post?", "Yes. Posting a request and receiving quotes is free. Inqfy takes no commission on your tattoo; you pay the studio directly."],
  ["Do I have to accept a quote?", "No. You can extend the quote window, let it expire, or close your request. There is no obligation to book."],
  ["Will studios get my phone number?", "No. You open the WhatsApp conversation yourself after accepting a quote."],
  ["Can I include references?", "Yes. Add your concept and style references so studios can see both what you want and the kind of execution you like."],
];

function Film({ src, className = "", poster }: { src: string; className?: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !paused) void video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.1 });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, [paused, reduced]);
  return (
    <div className={`mind-film ${className}`}>
      {!reduced && !failed && <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-hidden="true" onError={() => setFailed(true)}><source src={src} type="video/mp4" /></video>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {(reduced || failed) && poster && <img src={poster} alt="" aria-hidden className="mind-film-poster" />}
      {!reduced && !failed && <button type="button" aria-label={paused ? "Play background video" : "Pause background video"} className="mind-film-control" onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>}
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay, ease: "easeOut" }}>{children}</motion.div>;
}

function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = "Your next tattoo deserves more than an unanswered message. Leave the idea here. Let the right studios find it. Then choose the hands you trust.".split(" ");
  return <p ref={ref} className="mind-manifesto">{words.map((word, i) => <Word key={i} word={word} progress={scrollYProgress} start={i / words.length} end={(i + 1) / words.length} />)}</p>;
}

function Word({ word, progress, start, end }: { word: string; progress: ReturnType<typeof useScroll>["scrollYProgress"]; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  const reduced = useReducedMotion();
  return <motion.span style={{ opacity: reduced ? 1 : opacity }}>{word}{" "}</motion.span>;
}

export default function Home() {
  const showcaseHref = useShowcaseHref();
  return (
    <div className="mindloop">
      <section className="mind-hero" id="home">
        <Film src={VIDEOS.hero} className="mind-hero-film" poster="/img/hero-poster.jpg" />
        <div className="mind-hero-shade" />
        <Reveal className="mind-hero-content">
          <p className="mind-kicker">One idea. Your next tattoo.</p>
          <h1>Let the right<br /><em>artists</em> come to you.</h1>
          <p className="mind-subtitle">Stop sending the same message to every studio. Post your tattoo once. Receive complete quotes. Find your fit.</p>
          <div className="mind-actions">
            <Link href="/create" className="mind-primary">Post your tattoo <ArrowUpRight size={18} /></Link>
          </div>
          <Link href={showcaseHref} className="mind-quiet">{showcaseHref === "/feed" ? "Explore open requests" : "See an open request"} <ArrowUpRight size={16} /></Link>
        </Reveal>
        <a href="#how-it-works" className="mind-scroll"><ArrowDown size={16} /><span>Less chasing. More creating.</span></a>
      </section>

      <section className="mind-section mind-how" id="how-it-works">
        <Reveal><h2>The search can <em>change.</em><br />Start with your idea.</h2><p className="mind-section-intro">You shouldn’t need a spreadsheet of studios and a week of unanswered DMs to find the person for your next piece.</p></Reveal>
        <div className="mind-steps">{STEPS.map(([n, title, text], i) => <Reveal key={n} delay={i * 0.08}><span className="mind-step-number">{n}</span><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
        <p className="mind-caption">One request instead of a dozen conversations.</p>
      </section>

      <section className="mind-section mind-philosophy" id="philosophy">
        <Film src={VIDEOS.mission} className="mind-orbit" />
        <Manifesto />
        <Reveal><p className="mind-section-intro">Not just a price. A style, an approach, a person. Inqfy puts the work and the plan in front of you, so the decision stays yours.</p></Reveal>
      </section>

      <section className="mind-section mind-solution" id="quotes">
        <Reveal><p className="mind-kicker">Clarity before commitment</p><h2>A little less guessing.<br /><em>A complete quote.</em></h2></Reveal>
        <Film src={VIDEOS.solution} className="mind-wide-film" />
        <div className="mind-features">{REQUIREMENTS.map(({ icon: Icon, title, text }, i) => <Reveal key={title} delay={i * 0.06}><Icon size={20} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
      </section>

      <section className="mind-section mind-real" id="the-first-request">
        <Reveal className="mind-real-grid">
          <div className="mind-concept liquid-glass">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/sisyphus-fiet.png" alt="Sisyphus pushing a ring of Latin lettering uphill — Mert’s tattoo concept" loading="lazy" />
          </div>
          <div><p className="mind-kicker">The idea behind Inqfy</p><h2>A real search.<br /><em>Mine, actually.</em></h2><p className="mind-real-copy">I’m looking for an artist for this Sisyphus piece. The ring of words is the boulder; the execution should feel like a loose ink drawing. Instead of sending another round of DMs, I built a place to leave the brief.</p><p className="mind-real-copy">The concept is real. The search is still open.</p><Link href={showcaseHref} className="mind-text-link">Explore requests <ArrowUpRight size={18} /></Link></div>
        </Reveal>
      </section>

      <section className="mind-section mind-faq"><Reveal><h2>Before you <em>begin.</em></h2></Reveal><div>{FAQS.map(([q, a]) => <details key={q}><summary>{q}<Plus size={18} /></summary><p>{a}</p></details>)}</div></section>

      <section className="mind-cta">
        <Film src={VIDEOS.hero} className="mind-cta-film" poster="/img/hero-poster.jpg" />
        <div className="mind-cta-shade" />
        <Reveal className="mind-cta-content"><span className="mind-circles" aria-hidden="true"><span /></span><h2>Your next piece<br /><em>starts here.</em></h2><p>Bring the idea. Let the conversation come to you.</p><div className="mind-cta-actions"><Link href="/create" className="mind-primary">Post your tattoo <ArrowUpRight size={18} /></Link><Link href="/feed" className="mind-secondary liquid-glass">I’m a tattoo artist</Link></div></Reveal>
      </section>
    </div>
  );
}
