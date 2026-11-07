import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PersonaProvider } from "@/lib/persona";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AutoSeed } from "@/components/AutoSeed";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InkBid — Global Tattoo Price Arbitrage",
  description:
    "Post your tattoo idea once, get fixed-price quotes from studios worldwide, and see exactly how much you save even after flights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <PersonaProvider>
          <AutoSeed />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
          <Footer />
        </PersonaProvider>
      </body>
    </html>
  );
}
