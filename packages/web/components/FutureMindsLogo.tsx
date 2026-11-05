import Image from "next/image"
import type { CSSProperties } from "react"

/**
 * FutureMinds logo — folosește asset-urile oficiale ale mărcii din /public
 * (wordmark „FutureMinds" cu M = tocă + fulger, simbolul și icon-ul în cerc).
 *
 * `size` = înălțimea redată în px; lățimea scalează după proporția asset-ului.
 */

export type FutureMindsLogoProps = {
  /** wordmark complet (orizontal/stacked) sau doar simbolul (mark) */
  variant?: "horizontal" | "stacked" | "mark"
  /** înălțimea redată în px */
  size?: number
  /** paletă: pe fundal deschis (bleumarin) sau pe fundal închis (alb) */
  theme?: "light" | "dark" | "mono"
  /** tagline opțional sub wordmark */
  tagline?: string | false
  className?: string
  style?: CSSProperties
  /** text pentru accesibilitate (implicit "FutureMinds") */
  title?: string
}

const WORDMARK = {
  light: "/futureminds-logo-bleumarin.svg",
  dark: "/futureminds-logo-alb.svg",
  ratio: 931.21 / 161.11, // ≈ 5.78
}
const SYMBOL = {
  light: "/futureminds-simbol-bleumarin.svg",
  dark: "/futureminds-simbol-alb.svg",
  ratio: 140.68 / 127.68, // ≈ 1.10
}

const MONO = 'var(--font-mono), "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace'

export default function FutureMindsLogo({
  variant = "horizontal",
  size = 30,
  theme = "light",
  tagline = false,
  className,
  style,
  title = "FutureMinds",
}: FutureMindsLogoProps) {
  const tone: "light" | "dark" = theme === "dark" ? "dark" : "light"
  const taglineColor = tone === "dark" ? "#A9C2D9" : "#56697C"

  if (variant === "mark") {
    const w = Math.round(size * SYMBOL.ratio)
    return (
      <span className={className} style={{ display: "inline-flex", ...style }}>
        <Image
          src={SYMBOL[tone]}
          alt={title}
          width={w}
          height={size}
          priority
          style={{ height: size, width: "auto", display: "block" }}
        />
      </span>
    )
  }

  const w = Math.round(size * WORDMARK.ratio)
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: variant === "stacked" ? "center" : "flex-start",
        gap: size * 0.3,
        ...style,
      }}
    >
      <Image
        src={WORDMARK[tone]}
        alt={title}
        width={w}
        height={size}
        priority
        style={{ height: size, width: "auto", display: "block" }}
      />
      {tagline ? (
        <span
          style={{
            fontFamily: MONO,
            fontSize: Math.max(9, size * 0.3),
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: taglineColor,
            whiteSpace: "nowrap",
          }}
        >
          {tagline}
        </span>
      ) : null}
    </span>
  )
}
