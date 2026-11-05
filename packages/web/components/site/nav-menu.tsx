"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string }

/**
 * Meniu principal de navigare declanșat printr-un buton burger.
 * Iconul burger se transformă în „X" când meniul e deschis — cele trei bare
 * se rotesc și se suprapun (bara din mijloc dispare) printr-o tranziție fluidă.
 * Panoul cu rute se deschide ancorat în dreapta, sub header.
 */
export function NavMenu({
  items,
  isLoggedIn,
}: {
  items: NavItem[]
  isLoggedIn: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Închide la click în afară și la Escape.
  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  // Bază comună pentru cele trei bare ale iconului.
  const bar =
    "absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out"

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={open ? "Închide meniul" : "Deschide meniul"}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="grid size-10 place-items-center rounded-xl text-primary transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="relative block h-3.5 w-6" aria-hidden="true">
          <span className={cn(bar, open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")} />
          <span
            className={cn(
              bar,
              "top-1/2 -translate-y-1/2",
              open ? "scale-x-0 opacity-0" : "opacity-100"
            )}
          />
          <span
            className={cn(bar, open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0")}
          />
        </span>
      </button>

      <div
        role="menu"
        className={cn(
          "absolute right-0 top-full mt-3 w-56 origin-top-right rounded-2xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        )}
      >
        <nav className="flex flex-col">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <span className="my-1 h-px bg-border" />
              <Link
                href="/autentificare/intra"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
              >
                Autentificare
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    </div>
  )
}
