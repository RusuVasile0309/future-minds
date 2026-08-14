"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Shell-ul header-ului care se „strânge" la scroll (înălțime mai mică + umbră +
 * fundal mai opac). Primește conținutul (logo/nav/acțiuni) ca `children` din
 * componenta server `SiteHeader`. Nu folosește transform → `sticky` rămâne valid.
 */
export function StickyHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur transition-[background-color,box-shadow,border-color] duration-300",
        scrolled ? "border-border bg-background/90 shadow-sm" : "border-border/70 bg-background/80"
      )}
    >
      <div
        className={cn(
          "container flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-14" : "h-16"
        )}
      >
        {children}
      </div>
    </header>
  )
}
