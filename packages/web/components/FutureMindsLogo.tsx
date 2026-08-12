import type { CSSProperties } from "react"

/**
 * FutureMinds logo (varianta 1C — puncte în progresie).
 *
 * Fonturile mărcii sunt legate la variabilele next/font declarate în layout.tsx
 * (--font-outfit / --font-plex-mono), conform recomandării din brand kit.
 */

export type FutureMindsLogoProps = {
  /** lockup orizontal (marcă + text pe un rând), vertical (marcă deasupra) sau doar marca */
  variant?: "horizontal" | "stacked" | "mark"
  /** înălțimea mărcii în px; restul scalează proporțional */
  size?: number
  /** paletă: pe fundal deschis, pe fundal închis, sau monocrom (currentColor) */
  theme?: "light" | "dark" | "mono"
  /** afișează tagline-ul sub wordmark */
  tagline?: string | false
  className?: string
  style?: CSSProperties
  /** text pentru accesibilitate (implicit "FutureMinds") */
  title?: string
}

const PALETTES = {
  light: {
    dots: ["#B9CDF5", "#6D9BEF", "#1650C8", "#0B2F7A"],
    word: "#0B2F7A",
    accent: "#0B2F7A",
    tagline: "#7B89A3",
  },
  dark: {
    dots: ["#5B87D8", "#9FC0FF", "#C7DBFF", "#FFFFFF"],
    word: "#FFFFFF",
    accent: "#FFFFFF",
    tagline: "#8FA2C4",
  },
  mono: {
    dots: ["currentColor", "currentColor", "currentColor", "currentColor"],
    word: "currentColor",
    accent: "currentColor",
    tagline: "currentColor",
  },
} as const

const SANS = 'var(--font-outfit), "Outfit", ui-sans-serif, system-ui, sans-serif'
const MONO = 'var(--font-plex-mono), "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace'

function Mark({ size, dots, opacityRamp }: { size: number; dots: readonly string[]; opacityRamp: boolean }) {
  const circles = [
    { cx: 7, cy: 37, r: 7 },
    { cx: 32, cy: 35, r: 9 },
    { cx: 63, cy: 31, r: 13 },
    { cx: 107, cy: 22, r: 22 },
  ]
  return (
    <svg
      viewBox="0 0 129 44"
      height={size}
      width={(size * 129) / 44}
      fill="none"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={dots[i]} opacity={opacityRamp ? 0.35 + i * 0.22 : 1} />
      ))}
    </svg>
  )
}

function Wordmark({
  size,
  word,
  accent,
  tagline,
  taglineColor,
  align,
}: {
  size: number
  word: string
  accent: string
  tagline: string | false
  taglineColor: string
  align: "left" | "center"
}) {
  return (
    <span
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        lineHeight: 1,
      }}
    >
      <span
        style={{
          fontFamily: SANS,
          fontSize: size * 0.9,
          fontWeight: 300,
          letterSpacing: "-0.03em",
          color: word,
          whiteSpace: "nowrap",
        }}
      >
        Future<span style={{ fontWeight: 600, color: accent }}>Minds</span>
      </span>
      {tagline ? (
        <span
          style={{
            fontFamily: MONO,
            fontSize: Math.max(9, size * 0.24),
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: taglineColor,
            marginTop: size * 0.23,
            whiteSpace: "nowrap",
          }}
        >
          {tagline}
        </span>
      ) : null}
    </span>
  )
}

export default function FutureMindsLogo({
  variant = "horizontal",
  size = 44,
  theme = "light",
  tagline = "educație · acces · viitor",
  className,
  style,
  title = "FutureMinds",
}: FutureMindsLogoProps) {
  const p = PALETTES[theme]
  const mono = theme === "mono"

  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: variant === "stacked" ? "center" : "flex-end",
    flexDirection: variant === "stacked" ? "column" : "row",
    gap: variant === "stacked" ? size * 0.45 : size * 0.42,
    ...style,
  }

  return (
    <span role="img" aria-label={title} className={className} style={base}>
      <Mark size={variant === "mark" ? size : size * 0.85} dots={p.dots} opacityRamp={mono} />
      {variant !== "mark" ? (
        <Wordmark
          size={size}
          word={p.word}
          accent={p.accent}
          tagline={tagline}
          taglineColor={p.tagline}
          align={variant === "stacked" ? "center" : "left"}
        />
      ) : null}
    </span>
  )
}
