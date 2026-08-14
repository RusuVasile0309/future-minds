"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Buton „Aplică" care se MUTĂ din poziția statică din pagină în colțul din
 * dreapta-jos atunci când butonul static (marcat `data-apply-cta`) e pe cale să
 * iasă din câmpul vizual, și se întoarce la locul lui când acesta reintră în
 * câmpul vizual. Nu apare un al doilea buton: același buton alunecă în ambele
 * sensuri, preluând eticheta butonului static pentru continuitate.
 *
 * Întoarcerea urmărește poziția LIVE a butonului static (rAF), nu una capturată
 * o singură dată — altfel, cât timp pagina e derulată în timpul animației,
 * butonul ar ateriza lângă locul de unde a plecat, nu unde ajunge ținta.
 *
 * Se randează doar dacă utilizatorul nu a aplicat deja (vezi FloatingApplyGate).
 */
const DURATION = 1000
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function FloatingApply({ href = "/aplica" }: { href?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("Vreau bursă")
  const [active, setActive] = useState(false)

  useEffect(() => {
    const anchor = document.querySelector<HTMLElement>("[data-apply-cta]")
    const wrap = wrapRef.current
    if (!wrap) return

    // Fără buton static pe pagină → afișează permanent flotantul în colț.
    if (!anchor) {
      wrap.style.transition = "opacity 300ms ease"
      wrap.style.opacity = "1"
      setActive(true)
      return
    }

    const text = anchor.textContent?.trim()
    if (text) setLabel(text)

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let floating = false
    let cleanup: (() => void) | null = null
    const clear = () => {
      cleanup?.()
      cleanup = null
    }

    // Aliniază centrul flotantului pe centrul poziției țintă.
    const centerDelta = (from: DOMRect, to: DOMRect) => ({
      dx: from.left - to.left + (from.width - to.width) / 2,
      dy: from.top - to.top + (from.height - to.height) / 2,
    })

    // ── Ducere în colț (din poziția statică, dacă e încă vizibilă) ──────────────
    const fly = () => {
      clear()
      floating = true
      const from = anchor.getBoundingClientRect()
      const nearViewport = from.bottom > 0 && from.top < window.innerHeight
      anchor.style.visibility = "hidden"
      setActive(true)

      if (prefersReduced) {
        wrap.style.transition = "none"
        wrap.style.opacity = "1"
        wrap.style.transform = "translate(0px, 0px)"
        return
      }

      requestAnimationFrame(() => {
        if (!nearViewport) {
          wrap.style.transition = "none"
          wrap.style.opacity = "0"
          wrap.style.transform = "translateY(16px)"
          void wrap.offsetHeight
          wrap.style.transition = "opacity 400ms ease, transform 400ms ease"
          wrap.style.opacity = "1"
          wrap.style.transform = "translateY(0px)"
          return
        }
        const to = wrap.getBoundingClientRect()
        const { dx, dy } = centerDelta(from, to)
        wrap.style.transition = "none"
        wrap.style.opacity = "1"
        wrap.style.transform = `translate(${dx}px, ${dy}px)`
        void wrap.offsetHeight // reflow → punctul de plecare al animației
        wrap.style.transition = `transform ${DURATION}ms ${EASE}`
        wrap.style.transform = "translate(0px, 0px)"
      })
    }

    // ── Întoarcere la poziția statică (urmărind ținta LIVE, cadru cu cadru) ──────
    const dock = () => {
      clear()
      floating = false
      setActive(false)

      const settle = () => {
        anchor.style.visibility = "" // butonul static reapare exact unde a ajuns
        wrap.style.opacity = "0"
        wrap.style.transform = "translate(0px, 0px)"
      }

      if (prefersReduced) {
        settle()
        return
      }

      // Colțul (poziția de repaus, netransformată) — plecăm de aici.
      wrap.style.transition = "none"
      wrap.style.transform = "translate(0px, 0px)"
      const corner = wrap.getBoundingClientRect()

      const start = performance.now()
      let raf = 0
      const step = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1)
        const e = easeOut(t)
        const a = anchor.getBoundingClientRect() // poziția LIVE (se mișcă la scroll)
        const dx = (a.left - corner.left + (a.width - corner.width) / 2) * e
        const dy = (a.top - corner.top + (a.height - corner.height) / 2) * e
        wrap.style.transform = `translate(${dx}px, ${dy}px)`
        if (t < 1) {
          raf = requestAnimationFrame(step)
        } else {
          cleanup = null
          settle()
        }
      }
      raf = requestAnimationFrame(step)
      cleanup = () => cancelAnimationFrame(raf)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (floating) dock()
        } else if (!floating) {
          fly()
        }
      },
      { threshold: 0, rootMargin: "-120px 0px -120px 0px" }
    )
    io.observe(anchor)

    return () => {
      io.disconnect()
      clear()
      anchor.style.visibility = ""
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-6 right-6 z-40 opacity-0 will-change-transform"
      aria-hidden={!active}
    >
      <Button asChild size="lg" className="shadow-lg shadow-primary/25">
        <Link href={href} tabIndex={active ? undefined : -1}>
          {label} <GraduationCap className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
