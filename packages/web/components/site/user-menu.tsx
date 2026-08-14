"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react"
import { signOutAction } from "@/app/auth/actions"

// Inițialele din nume (max 2 litere) — fallback când nu există avatar.
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  const first = parts[0][0] ?? ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : ""
  return (first + last).toUpperCase()
}

export function UserMenu({
  name,
  email,
  image,
  isAdmin,
}: {
  name: string
  email: string
  image: string | null
  isAdmin: boolean
}) {
  const [open, setOpen] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

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

  const avatar =
    image && imgOk ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setImgOk(false)}
        className="size-8 rounded-full object-cover"
      />
    ) : (
      <span className="flex size-8 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
        {initials(name)}
      </span>
    )

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border/70 py-1 pl-1 pr-2 text-sm transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:pr-2.5"
      >
        {avatar}
        <span className="hidden max-w-[10rem] truncate font-medium text-foreground sm:inline">{name}</span>
        <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg animate-step-in-right motion-reduce:animate-none"
        >
          <div className="border-b border-border/60 px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>

          <Link
            href="/contul-meu"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            <User className="size-4 text-muted-foreground" /> Contul meu
          </Link>

          {isAdmin ? (
            <Link
              href="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <LayoutDashboard className="size-4 text-muted-foreground" /> Portal admin
            </Link>
          ) : null}

          <form action={signOutAction} className="border-t border-border/60">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <LogOut className="size-4 text-muted-foreground" /> Deconectare
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}
