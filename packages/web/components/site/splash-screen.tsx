"use client"

import { useEffect, useState, type CSSProperties } from "react"
import styles from "./splash-screen.module.css"

type SplashScreenProps = {
  /** Culoarea logo-ului (ink). */
  color?: string
  /** Fundalul overlay-ului. */
  background?: string
  /** Cât de sus se ridică toca, în unități SVG (logo-ul are 1500 lățime). */
  lift?: number
  /** 1 = normal, 2 = de două ori mai rapid. */
  speed?: number
  /** Timpul minim cât rămâne vizibil splash-ul, în ms (lasă intro-ul să ruleze). */
  minDuration?: number
  /** Afișează bara subțire de încărcare sub logo. */
  showBar?: boolean
  /**
   * Mod controlat: trimite `false` cât timp încarci date, `true` când e gata.
   * Dacă lipsește, splash-ul dispare după „load" + minDuration.
   */
  ready?: boolean
  /** Apelat după ce splash-ul s-a demontat complet. */
  onDone?: () => void
}

const FADE_MS = 400

export default function SplashScreen({
  color = "#1E2F40",
  background = "hsl(210 40% 98%)",
  lift = 110,
  speed = 1,
  minDuration = 1800,
  showBar = true,
  ready,
  onDone,
}: SplashScreenProps) {
  // „active" = splash-ul chiar trebuie redat (decizie luată înainte de paint de
  // scriptul inline din layout, prin atributul `data-splash="show"`). Markup-ul
  // se randează identic pe server și client (fără mismatch); `active` controlează
  // doar efectele, nu ieșirea randată.
  const [active] = useState(
    () => typeof document !== "undefined" && document.documentElement.getAttribute("data-splash") === "show"
  )
  const [minElapsed, setMinElapsed] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  // Dacă nu e activ (sesiune deja văzută / altă pagină), demontează imediat —
  // CSS-ul îl ține oricum ascuns (`display:none`), deci nu apare niciun flash.
  useEffect(() => {
    if (!active) setGone(true)
  }, [active])

  // Timp minim de afișare.
  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => setMinElapsed(true), minDuration)
    return () => clearTimeout(t)
  }, [active, minDuration])

  // Mod necontrolat: așteaptă evenimentul "load".
  useEffect(() => {
    if (!active || ready !== undefined) return
    if (document.readyState === "complete") {
      setPageLoaded(true)
      return
    }
    const onLoad = () => setPageLoaded(true)
    window.addEventListener("load", onLoad)
    return () => window.removeEventListener("load", onLoad)
  }, [active, ready])

  const isReady = ready ?? pageLoaded

  // Fade-out, apoi demontare.
  useEffect(() => {
    if (!active || !(isReady && minElapsed)) return
    setLeaving(true)
    const t = setTimeout(() => {
      setGone(true)
      onDone?.()
      try {
        document.documentElement.removeAttribute("data-splash")
      } catch {
        // ignore
      }
    }, FADE_MS)
    return () => clearTimeout(t)
  }, [active, isReady, minElapsed, onDone])

  // Blochează scroll-ul paginii cât timp splash-ul e vizibil.
  useEffect(() => {
    if (!active || gone) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [active, gone])

  if (gone) return null

  const vars = {
    "--ink": color,
    "--bg": background,
    "--lift": lift,
    "--k": 1 / speed,
    "--fade": `${FADE_MS}ms`,
  } as CSSProperties

  return (
    <div
      id="fm-splash-root"
      className={`${styles.root} ${leaving ? styles.leaving : ""}`}
      style={vars}
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
    >
      <svg className={styles.logo} viewBox="0 -200 1500 1560" aria-hidden="true" focusable="false">
        <g className={styles.mLetter}>
          <path d="M201 401 L440 493 L734 926 L1028 493 L1267 401 L1267 1288 L1107 1288 L1107 691 L808 1139 L660 1139 L361 691 L361 1288 L201 1288 Z" />
        </g>
        <g className={styles.capIntro}>
          <g className={styles.capFloat}>
            <g className={styles.tassel}>
              <path d="M1228 393 L1320 401 L1320 776 Q1320 797 1341 797 L1349 797 L1362 775 L1362 382 Q1362 362 1341 360 L1318 357 Z" />
              <path
                className={styles.bolt}
                d="M1374 755 L1395 755 L1352 873 L1426 873 L1310 1053 L1352 915 L1278 915 L1349 797 L1362 775 Z"
              />
            </g>
            <path d="M734 73 L1395 328 L1318 357 L1228 393 L734 584 L73 328 Z" />
          </g>
        </g>
      </svg>

      {showBar && (
        <div className={styles.bar}>
          <div className={styles.barFill} />
        </div>
      )}

      <span className={styles.srOnly}>Se încarcă…</span>
    </div>
  )
}
