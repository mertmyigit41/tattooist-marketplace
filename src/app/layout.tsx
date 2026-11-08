import type { Metadata } from "next";
import { Inter, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { IS_LIVE } from "@/lib/mode";
import { PersonaProvider } from "@/lib/persona";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AutoSeed } from "@/components/AutoSeed";

const geistSans = Inter({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Instrument_Serif({
  variable: "--font-fraunces",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://inqfy.app"),
  title: "Inqfy — Post your tattoo once. Studios come to you.",
  description: "Describe the piece once. Studios that fit your style reply with a fixed price, a session plan, a start date and matching work. Compare, pick, book.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Inqfy",
    title: "Inqfy — Post your tattoo once. Studios come to you.",
    description: "Describe the piece once. Studios that fit your style reply with a fixed price, a session plan, a start date and matching work. Compare, pick, book.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Inqfy — a tattoo request with four studio quotes" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inqfy — Post your tattoo once. Studios come to you.",
    description: "Describe the piece once. Studios that fit your style reply with a fixed price, a session plan, a start date and matching work. Compare, pick, book.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-page text-fg">
        <AuthProvider>
          <PersonaProvider>
            {!IS_LIVE && <AutoSeed />}
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
            <Footer />
          </PersonaProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
