import type { Metadata } from "next";
import { Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { IS_LIVE } from "@/lib/mode";
import { PersonaProvider } from "@/lib/persona";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AutoSeed } from "@/components/AutoSeed";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bebas = Bebas_Neue({ variable: "--font-bebas", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inqfy — Fixed-price tattoo quotes from studios worldwide",
  description:
    "Post the design once. Studios from Istanbul to Bangkok bid a fixed price. We add the flight and show what you really save.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${bebas.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
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
