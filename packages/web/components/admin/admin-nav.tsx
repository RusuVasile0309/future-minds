"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin", label: "Panou", exact: true },
  { href: "/admin/candidati", label: "Candidați" },
  { href: "/admin/ranking", label: "Ranking" },
  { href: "/admin/utilizatori", label: "Utilizatori" },
  { href: "/admin/setari", label: "Setări" },
]

/**
 * Navigarea portalului admin. Pe desktop (md+) rutele apar inline; pe mobil
 * sunt strânse într-un meniu burger (același pattern ca `NavMenu` de pe site),
 * pentru că cele cinci rute depășeau lățimea ecranului.
 */
export function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isActive = (l: (typeof LINKS)[number]) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href)

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

  // Închide meniul când se schimbă ruta.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Bază comună pentru cele trei bare ale iconului burger.
  const bar =
    "absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out"

  return (
    <>
      {/* Desktop — rute inline */}
      <nav className="hidden items-center gap-1 md:flex">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive(l)
                ? "bg-secondary text-brand-deep dark:text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Mobil — meniu burger */}
      <div className="relative md:hidden" ref={ref}>
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
            <span className={cn(bar, open ? "bottom-1/2 translate-y-1/2 -rotate-45" : "bottom-0")} />
          </span>
        </button>

        <div
          role="menu"
          className={cn(
            "absolute left-0 top-full mt-3 w-56 origin-top-left overflow-hidden rounded-2xl border border-border bg-background/95 shadow-lg backdrop-blur transition-all duration-200 ease-out",
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-1 scale-95 opacity-0"
          )}
        >
          <nav className="flex flex-col p-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(l)
                    ? "bg-secondary text-brand-deep dark:text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            ))}

            <span className="my-1 h-px bg-border" />
            <Link
              href="/"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ExternalLink className="size-4 text-muted-foreground" /> Vezi site-ul
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
