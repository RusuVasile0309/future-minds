import type { Metadata } from "next"
import { Inter, Poppins, IBM_Plex_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { Providers } from "./providers"
import { JsonLd } from "@/components/seo/json-ld"
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo"

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

// Paginile publice citesc starea live „fereastra de înscriere" din DB (prin
// FloatingApplyGate / ApplyCta), iar clientul Neon rulează fiecare query cu
// `no-store` (vezi db.ts — evită citiri de settings învechite). O citire la
// request-time face randarea dinamică; o declarăm explicit ca să nu se încerce
// prerender static (ar arunca DYNAMIC_SERVER_USAGE la build).
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FutureMinds: burse integrale pentru studii de IT și inginerie",
    template: "%s · FutureMinds",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "burse IT",
    "burse inginerie",
    "burse studenți Cluj-Napoca",
    "bursă integrală studii",
    "burse medii defavorizate",
    "FutureMinds",
    "Nova Power&Gas",
    "Rotaract Cluj-Napoca",
    "burse UBB",
    "burse UTCN",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/futureminds-icon-cerc-bleumarin.svg", type: "image/svg+xml" },
      { url: "/futureminds-icon-cerc-bleumarin.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/futureminds-icon-cerc-bleumarin.png",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "FutureMinds: burse integrale pentru studii de IT și inginerie",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "FutureMinds: burse integrale pentru studii de IT și inginerie",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={`${inter.variable} ${poppins.variable} ${plexMono.variable}`}>
      <body className="min-h-screen antialiased">
        {/* Decide ÎNAINTE de primul paint dacă rulează animația de intro (o dată
            per sesiune, doar pe pagina principală), ca overlay-ul din HTML să fie
            vizibil imediat — fără ca pagina să apară o clipă înaintea animației. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement;if(location.pathname==='/'&&!sessionStorage.getItem('fm:splash-seen')){sessionStorage.setItem('fm:splash-seen','1');d.setAttribute('data-splash','show');setTimeout(function(){d.removeAttribute('data-splash')},4000);}}catch(e){}})();",
          }}
        />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
