"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { LayoutDashboard, LogOut, User } from "lucide-react"
import { signOutAction } from "@/app/auth/actions"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string }

export type NavAccount = {
  name: string
  email: string
  image: string | null
  isAdmin: boolean
}

// Inițialele din nume (max 2 litere) — fallback când nu există avatar.
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0][0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : ""
  return (first + last).toUpperCase()
}

/**
 * Meniul de navigare pentru MOBIL, declanșat printr-un buton burger (pe desktop
 * rutele și contul se afișează inline — vezi `SiteHeader`). Iconul burger se
 * transformă în „X" când meniul e deschis. Panoul conține rutele și, când
 * utilizatorul e autentificat, secțiunea de cont (avatar, nume, acțiuni).
 */
export function NavMenu({
  items,
  account,
  className,
}: {
  items: NavItem[]
  account: NavAccount | null
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
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

  const itemClass =
    "rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"

  return (
    <div className={cn("relative", className)} ref={ref}>
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
          "absolute right-0 top-full mt-3 w-60 origin-top-right overflow-hidden rounded-2xl border border-border bg-background/95 shadow-lg backdrop-blur transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-95 opacity-0"
        )}
      >
        {/* Secțiunea de cont (avatar + nume), vizibilă pe mobil în locul header-ului. */}
        {account ? (
          <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
            {account.image && imgOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={account.image}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setImgOk(false)}
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
                {initials(account.name)}
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">{account.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{account.email}</span>
            </span>
          </div>
        ) : null}

        <nav className="flex flex-col p-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              {item.label}
            </Link>
          ))}

          {account ? (
            <>
              <span className="my-1 h-px bg-border" />
              <Link
                href="/contul-meu"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <User className="size-4 text-muted-foreground" /> Contul meu
              </Link>
              {account.isAdmin ? (
                <Link
                  href="/admin"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <LayoutDashboard className="size-4 text-muted-foreground" /> Portal admin
                </Link>
              ) : null}
              <form action={signOutAction}>
                <button
                  type="submit"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <LogOut className="size-4 text-muted-foreground" /> Deconectare
                </button>
              </form>
            </>
          ) : (
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
          )}
        </nav>
      </div>
    </div>
  )
}
