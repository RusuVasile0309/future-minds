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
  const [fontSemiBold, fontRegular] = await Promise.all([
    fetch(fontUrl).then((r) => r.arrayBuffer()),
    fetch(fontBodyUrl).then((r) => r.arrayBuffer()),
  ])

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
        {/* wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{ display: "flex", gap: 7, alignItems: "flex-end", height: 30 }}
          >
            <div style={{ width: 11, height: 11, borderRadius: 11, background: "#A9C2D9" }} />
            <div style={{ width: 11, height: 17, borderRadius: 11, background: "#8AB0CF" }} />
            <div style={{ width: 11, height: 23, borderRadius: 11, background: "#6D9BEF" }} />
            <div style={{ width: 11, height: 30, borderRadius: 11, background: "#F2B544" }} />
          </div>
          <span style={{ fontSize: 30, letterSpacing: -0.5 }}>FutureMinds</span>
        </div>

        {/* headline */}
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

        {/* partners */}
        <div
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 22,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 2,
          }}
        >
          Un proiect Nova Power&Gas · Rotaract Cluj-Napoca
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
