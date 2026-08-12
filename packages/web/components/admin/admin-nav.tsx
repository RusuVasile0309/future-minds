"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin", label: "Panou", exact: true },
  { href: "/admin/candidati", label: "Candidați" },
  { href: "/admin/ranking", label: "Ranking" },
  { href: "/admin/utilizatori", label: "Utilizatori" },
  { href: "/admin/setari", label: "Setări" },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href)
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-secondary text-brand-deep dark:text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
