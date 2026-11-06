import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

// Imaginea de previzualizare socială (OpenGraph + Twitter), generată la build.
export const alt =
  "FutureMinds — burse integrale pentru studii de IT și inginerie la Cluj-Napoca"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Poppins (titluri brand) — TTF de la repo-ul Google Fonts, pentru diacritice RO.
const fontUrl =
  "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf"
const fontBodyUrl =
  "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf"

export default async function OpenGraphImage() {
  const [fontSemiBold, fontRegular, logo] = await Promise.all([
    fetch(fontUrl).then((r) => r.arrayBuffer()),
    fetch(fontBodyUrl).then((r) => r.arrayBuffer()),
    readFile(join(process.cwd(), "public/futureminds-logo-alb.png")),
  ])
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #16222F 0%, #1E2F40 55%, #2A4157 100%)",
          color: "#ffffff",
          fontFamily: "Poppins",
        }}
      >
        {/* glow accent */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(169, 194, 217, 0.18)",
            filter: "blur(40px)",
          }}
        />
        {/* logo FutureMinds */}
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="FutureMinds" width={462} height={80} />
        </div>

        {/* headline + descriere scurtă (RO) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", width: 72, height: 6, borderRadius: 6, background: "#F2B544" }} />
          <div
            style={{
              display: "flex",
              fontSize: 66,
              lineHeight: 1.08,
              maxWidth: 960,
              letterSpacing: -1.5,
            }}
          >
            Burse integrale pentru studii de IT și inginerie.
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Poppins-Regular",
              fontSize: 30,
              color: "#A9C2D9",
              maxWidth: 880,
              lineHeight: 1.35,
            }}
          >
            Finanțăm integral studiile universitare la Cluj-Napoca pentru tineri
            talentați din medii defavorizate.
          </div>
        </div>

        {/* parteneri */}
        <div
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 2,
          }}
        >
          Un proiect Nova Power&Gas · Rotaract Cluj-Napoca SAMVS
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Poppins", data: fontSemiBold, weight: 600, style: "normal" },
        { name: "Poppins-Regular", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  )
}
