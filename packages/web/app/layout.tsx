import type { Metadata } from "next"
import { Inter, Poppins, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { Providers } from "./providers"

// Fonturile mărcii FutureMinds — latin-ext pentru diacriticele românești (ă, î, ș, ț).
// Poppins = titluri / display (inclusiv italicul accentuat); Inter = text & UI.
const inter = Inter({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})
const poppins = Poppins({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
})
const plexMono = IBM_Plex_Mono({
  subsets: ["latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "FutureMinds: burse integrale pentru studii de IT și inginerie",
    template: "%s · FutureMinds",
  },
  description:
    "FutureMinds duce tineri talentați din medii defavorizate spre studii universitare de IT și inginerie, finanțate integral. Un proiect Nova Power&Gas & Rotaract Cluj-Napoca.",
  icons: { icon: "/futureminds-icon-cerc-bleumarin.svg" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${inter.variable} ${poppins.variable} ${plexMono.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
