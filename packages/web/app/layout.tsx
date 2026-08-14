import type { Metadata } from "next"
import { Outfit, IBM_Plex_Mono, Spectral } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { Providers } from "./providers"

// Fonturile mărcii — latin-ext pentru diacriticele românești (ă, î, ș, ț)
const outfit = Outfit({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
})
const plexMono = IBM_Plex_Mono({
  subsets: ["latin-ext"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
})
// Serif rafinat pentru titluri (înlocuiește Iowan/Palatino local cu un web font consistent)
const spectral = Spectral({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "FutureMinds: burse integrale pentru studii de IT și inginerie",
    template: "%s · FutureMinds",
  },
  description:
    "FutureMinds duce tineri talentați din medii defavorizate spre studii universitare de IT și inginerie, finanțate integral. Un proiect Nova Power&Gas & Rotaract Cluj-Napoca.",
  icons: { icon: "/futureminds-icon.svg" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${outfit.variable} ${plexMono.variable} ${spectral.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
