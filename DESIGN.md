# Inqfy design system — "Ink & lamp"

Direction
- Product: someone who wants a tattoo posts one brief; studios reply with complete fixed-price quotes.
- Character: calm, candid, handmade.
- World: a studio's consultation desk at night — black ink, paper, a stencil on skin, one warm lamp.
- Moments: (1) the request preview in the hero (stencil on paper next to the incoming quotes); (2) the quote comparison on a request page. Everything else is quiet.
- Signature: the live dot. One amber dot marks what is live or current (live indicator, the current timeline step, the shortlisted quote). Nothing else is amber.

## Tokens (Tailwind v4 `@theme` in `src/app/globals.css`)

Colors (utilities: `bg-page`, `text-fg-2`, `border-line`, `bg-accent/10` …)

| Token | Value | Use |
| --- | --- | --- |
| `--color-deep` | `#12110f` | deepest surface (modal backdrop panels, code blocks) |
| `--color-page` | `#161513` | page background |
| `--color-card` | `#1c1a18` | cards, nav, panels |
| `--color-raised` | `#262421` | inputs, active rows, avatars, inner panels |
| `--color-line` | `rgba(239,233,222,.08)` | hairline borders, dividers |
| `--color-line-strong` | `rgba(239,233,222,.14)` | secondary button border, emphasised rules |
| `--color-fg` | `#efe9de` | primary text, primary button fill |
| `--color-fg-2` | `#aaa398` | secondary text, body on cards |
| `--color-fg-3` | `#8a847a` | muted text, meta, icons |
| `--color-ink` | `#1f1b16` | dark text on light fills (primary button, paper) |
| `--color-accent` | `#e3a53f` | the live dot, current step, shortlisted mark, focus ring |
| `--color-accent-hover` | `#d6973a` | hover for accent-filled elements (rare) |
| `--color-paper` | `#f3eee4` | stencil panel background |
| `--color-stencil` | `#4a3a63` | stencil ink (behind the screen-blended stencil image) |
| `--color-positive` | `#4cc38a` | booked / won / accepted |
| `--color-negative` | `#e5484d` | errors, blocked input |

Fonts (next/font, self-hosted)
- Interface: Geist → `font-sans` (default on body)
- Figures and meta: Geist Mono → `font-mono`, always with `tabular-nums`
- Display: Fraunces 400 → `.font-display` (page titles and landing headings only; never labels or buttons)
- Bebas Neue is removed.

Type scale
- Hero headline: `text-[clamp(2.5rem,5vw,4rem)] leading-[1.04] tracking-[-0.02em] font-display`
- Landing section heading: `font-display text-3xl` (32/1.15)
- Page title: `font-display text-3xl sm:text-4xl`
- Card heading: `text-base font-medium` (16/22) or `text-xl font-medium` (20/26)
- Body: `text-[15px] leading-[22px]` (body default), secondary `text-sm` (14/20)
- Meta: `text-xs` (12/16), mono where it is a figure, time or count
- Big figures (prices, counts): `font-mono text-2xl sm:text-3xl font-medium tabular-nums`
- Weights 400 and 500 only; 600 only for the wordmark. No `font-bold`/`font-black`.
- Sentence case everywhere. No `uppercase`, no `tracking-wide*` on small text, no text under 12px.

Radius
- Tags, small buttons, avatars: `rounded-md` (6)
- Inputs, buttons, pills: `rounded-lg` (8) / `rounded-[10px]`
- Cards, panels: `rounded-2xl` (16); inner panels in a 16px/20px-padded card: `rounded-xl` (12) → image inside a padded card: `rounded-md`
- Modal: `rounded-2xl`

Depth
- Dark theme: surface steps + hairlines only. No colored shadows, no glows, no grain overlay, no paper texture.
- Primary button carries `shadow-[inset_0_1px_0_rgba(255,255,255,.12)]`.

Spacing
- 4px grid (Tailwind scale). Card padding 20–24, page edges 16/24/32, landing sections `space-y-24` (96).
- Lists: one row height per list (quote rows 56, nav rows 36, studio list rows 44), hairline between rows.

Icons
- lucide only, `h-[18px] w-[18px]` in content, `h-4 w-4` inline with 14px text, stroke 1.5, color of the text role (`text-fg-3` or `text-fg-2`). Icons never carry their own color.

Motion
- One curve: `[0.22,1,0.36,1]`. Hover 150ms colors only (`transition-colors`); never `transition-all`.
- Entrances: one fade+rise (`opacity 0→1`, `y 8→0`, 350ms) per screen, stagger ≤ 50ms, ≤ 6 items. No springs, no fly-ins from the side, no `hover:scale`.
- `animate-pulse` only on loading skeletons. No `animate-ping`. The live dot is static.

## Components (`src/components/ui.tsx`)

Button — `variant: "primary" | "secondary" | "ghost"`, `size: "sm" | "md" | "lg"`
- base: `inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`
- sm `h-9 px-3.5 text-sm rounded-lg` · md `h-11 px-5 text-[15px] rounded-[10px]` · lg `h-12 px-6 text-base rounded-[10px]`
- primary `bg-fg text-ink hover:bg-white shadow-[inset_0_1px_0_rgba(255,255,255,.12)]`
- secondary `bg-raised text-fg border border-line-strong hover:border-fg-3`
- ghost `text-fg-2 hover:bg-raised hover:text-fg`
- Old variants map: violet/emerald/whatsapp/primary → primary; outline → secondary; ghost → ghost. WhatsApp green is gone; the WhatsApp action is a primary button with the MessageCircle icon.

Pill (filter / choice chip) — no `accent` prop
- `inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium transition-colors whitespace-nowrap`
- inactive `border-line bg-card text-fg-2 hover:text-fg hover:border-line-strong` · active `border-fg bg-fg text-ink`

Segmented control (sort / view / layout toggles)
- shell `inline-flex rounded-lg border border-line bg-card p-1` · item `rounded-md px-3 h-8 text-xs font-medium text-fg-2 hover:text-fg` · active `bg-raised text-fg`

Badge — `inline-flex h-6 items-center gap-1 rounded-md border px-2 text-xs font-medium`
- default `border-line bg-raised text-fg-2`
- booked / won: `border-positive/30 bg-positive/10 text-positive` · closed: `border-line text-fg-3` · shortlisted: `border-accent/40 text-accent`

Card — `rounded-2xl border border-line bg-card`

Input / textarea / select — `h-11 w-full rounded-[10px] border border-line bg-raised px-4 text-[15px] text-fg placeholder:text-fg-3 outline-none focus:border-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent` (textarea: `py-3 min-h-24`)

Stat cell — label `text-xs text-fg-3` · value `mt-1 font-mono text-2xl font-medium tabular-nums text-fg` (text values keep `font-sans text-xl font-medium`)

Live dot — `inline-block h-2 w-2 rounded-full bg-accent` + optional `text-xs text-fg-3` label. Static.

Avatar (initials) — `flex h-9 w-9 items-center justify-center rounded-md bg-raised text-xs font-medium text-fg-2`

Stencil image — wrapper `bg-stencil overflow-hidden`, image `.stencil` = `filter: grayscale(1) contrast(2.2) brightness(1.3); mix-blend-mode: screen;` (black ink → stencil plum, skin → white)

Logo — wordmark `Inqfy` in `text-lg font-semibold tracking-tight text-fg`. No tile, no icon.

Modal — panel `rounded-2xl border border-line bg-card`, header hairline, backdrop `bg-black/60`; enter: fade + rise 8px, 250ms, no spring.
