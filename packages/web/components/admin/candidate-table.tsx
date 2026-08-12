"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Paperclip, Search } from "lucide-react"
import { useCandidates } from "@/app/network/admin"
import { StatusBadge } from "@/components/apply/status-badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@fm/shared"

type Filter = ApplicationStatus | "all"

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Toate" },
  { value: "submitted", label: "Trimise" },
  { value: "under_review", label: "În evaluare" },
  { value: "accepted", label: "Acceptate" },
  { value: "waitlist", label: "Așteptare" },
  { value: "rejected", label: "Respinse" },
]

function formatDate(d: Date | string | null): string {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("ro-RO", { day: "2-digit", month: "short", year: "numeric" })
}

export function CandidateTable() {
  const { data, isLoading, error } = useCandidates()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data?.length ?? 0 }
    for (const a of data ?? []) c[a.status] = (c[a.status] ?? 0) + 1
    return c
  }, [data])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter((a) => {
      if (filter !== "all" && a.status !== filter) return false
      if (!q) return true
      return a.fullName.toLowerCase().includes(q) || (a.applicant.email ?? "").toLowerCase().includes(q)
    })
  }, [data, query, filter])

  if (isLoading) return <p className="text-muted-foreground">Se încarcă candidații…</p>
  if (error) return <p className="text-destructive">Nu am putut încărca candidații. Încearcă din nou.</p>

  if ((data ?? []).length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        Nu există încă aplicații trimise pentru cohorta curentă.
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-brand-deep text-white dark:bg-primary dark:text-brand-deep"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              {counts[f.value] ? <span className="ml-1.5 opacity-70">{counts[f.value]}</span> : null}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută nume sau email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Candidat</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Trimisă</th>
                <th className="px-5 py-3 font-medium">Fișiere</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((a) => (
                <tr key={a.id} className="group transition-colors hover:bg-secondary/40">
                  <td className="px-5 py-4">
                    <Link href={`/admin/candidati/${a.id}`} className="block">
                      <span className="font-medium text-foreground">{a.fullName}</span>
                      <span className="block text-xs text-muted-foreground">{a.applicant.email ?? "—"}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(a.submittedAt)}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Paperclip className="size-3.5" />
                      {a.fileCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/candidati/${a.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      Vezi <ArrowRight className="size-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Niciun candidat nu se potrivește filtrului.</p>
        ) : null}
      </div>
    </div>
  )
}
