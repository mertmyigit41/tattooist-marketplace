# InkBid

Reverse marketplace and global price-arbitrage platform for tattoos — "Thumbtack meets global tattoo tourism".
Clients post a design, artists worldwide send fixed-price quotes, and the client compares
**tattoo price + estimated flight** against the local baseline, live.

Stack: Next.js (App Router, static export), TypeScript, Tailwind CSS, Framer Motion, Lucide, Firebase Firestore (modular SDK).

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Firebase web config
npm run dev                  # http://localhost:3000
```

To develop against the Firestore emulator instead of production, set
`NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=127.0.0.1:8080` in `.env.local` and run
`npx firebase emulators:start --only firestore --project inkbid-demo`.

The app auto-seeds demo data (6 studios, 4 open requests, flagship bids) into an empty database.
"Reset Demo Data" in the navbar re-seeds at any time.

## Firestore setup (one-time)

1. Firebase console → Build → Firestore Database → Create database.
2. Rules tab → paste `firestore.rules` → Publish. (The demo has no auth, so the three demo
   collections are world read/write — tighten before real users.)

## Deploy

The build is a fully static export (`npm run build` → `out/`), so any static host works.

### Cloudflare Pages (custom domain on Cloudflare)

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.
2. Build settings: framework preset **Next.js (Static HTML Export)**, build command `npm run build`,
   output directory `out`.
3. Environment variables (Production *and* Preview): every `NEXT_PUBLIC_FIREBASE_*` key from
   `.env.example`, plus `NODE_VERSION=22`.
4. Deploy, then Custom domains → add your domain (Cloudflare creates the DNS record for you).

`public/_redirects` maps `/requests/*` and `/artists/*` to the static placeholder pages so request
and artist ids created at runtime work on hard reload; `public/_headers` sets cache headers.

### Firebase Hosting

`firebase.json` is also configured (public dir `out`, same rewrites): `npm run build && npx firebase deploy`.

## Image credits

Tattoo photography in `public/img` is from Wikimedia Commons under free licenses; see
`public/img/CREDITS.md`.
