"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Dezvăluie conținutul cu un fade-rise când intră în viewport (o singură dată).
 * Folosește `motion-safe:` pentru starea inițială ascunsă → la „reduced motion"
 * conținutul e vizibil imediat, fără mișcare. Poate fi întârziat (`delay`) pentru
 * efecte de tip cascadă pe grile de carduri.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  /** Întârziere (ms) — util pentru stagger pe elemente succesive. */
  delay?: number
  as?: "div" | "section" | "li"
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      style={shown && delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]",
        shown ? "opacity-100 translate-y-0" : "motion-safe:translate-y-4 motion-safe:opacity-0",
        className
      )}
    >
      {children}
    </Tag>
  )
}
