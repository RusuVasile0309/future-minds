"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, ChevronsUpDown, ChevronUp, Paperclip, Search } from "lucide-react"
import { useCandidates, useRankingResults } from "@/app/network/admin"
import { StatusBadge } from "@/components/apply/status-badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ApplicationStatus, ScoredApplication } from "@fm/shared"

type Filter = ApplicationStatus | "all"
type SortKey = "name" | "status" | "submittedAt" | "fileCount" | "score"
type SortDir = "asc" | "desc"

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Toate" },
  { value: "submitted", label: "Trimise" },
  { value: "under_review", label: "În evaluare" },
  { value: "accepted", label: "Acceptate" },
  { value: "waitlist", label: "Așteptare" },
  { value: "rejected", label: "Respinse" },
]

// Ordine logică pentru sortarea pe status.
const STATUS_ORDER: ApplicationStatus[] = ["submitted", "under_review", "waitlist", "accepted", "rejected", "draft"]

function formatDate(d: Date | string | null): string {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("ro-RO", { day: "2-digit", month: "short", year: "numeric" })
}

function ts(d: Date | string | null): number {
  return d ? new Date(d).getTime() : 0
}

export function CandidateTable() {
  const { data, isLoading, error } = useCandidates()
  // Scorul de ranking din config-ul de lucru curent (previzualizare).
  const results = useRankingResults("draft")
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "submittedAt", dir: "desc" })

  // Map applicationId → scor calculat.
  const scoreById = useMemo(() => {
    const m = new Map<string, ScoredApplication>()
    for (const r of results.data?.results ?? []) m.set(r.applicationId, r)
    return m
  }, [results.data])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: data?.length ?? 0 }
    for (const a of data ?? []) c[a.status] = (c[a.status] ?? 0) + 1
    return c
  }, [data])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = (data ?? []).filter((a) => {
      if (filter !== "all" && a.status !== filter) return false
      if (!q) return true
      return a.fullName.toLowerCase().includes(q) || (a.applicant.email ?? "").toLowerCase().includes(q)
    })

    // Scorul folosit la sortare: procentul doar dacă e eligibil, altfel „lipsă" (la coadă).
    const scoreOf = (id: string): number | null => {
      const s = scoreById.get(id)
      return s && s.eligible ? s.percent : null
    }
    const mul = sort.dir === "asc" ? 1 : -1
    return [...filtered].sort((a, b) => {
      switch (sort.key) {
        case "name":
          return mul * a.fullName.localeCompare(b.fullName, "ro")
        case "status":
          return mul * (STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
        case "submittedAt":
          return mul * (ts(a.submittedAt) - ts(b.submittedAt))
        case "fileCount":
          return mul * (a.fileCount - b.fileCount)
        case "score": {
          const sa = scoreOf(a.id)
          const sb = scoreOf(b.id)
          if (sa === null && sb === null) return 0
          if (sa === null) return 1 // fără scor mereu la coadă
          if (sb === null) return -1
          return mul * (sa - sb)
        }
      }
    })
  }, [data, query, filter, sort, scoreById])

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" || key === "status" ? "asc" : "desc" }
    )
  }

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
                <SortHeader label="Candidat" sortKey="name" sort={sort} onSort={toggleSort} />
                <SortHeader label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                <SortHeader label="Trimisă" sortKey="submittedAt" sort={sort} onSort={toggleSort} />
                <SortHeader label="Fișiere" sortKey="fileCount" sort={sort} onSort={toggleSort} />
                <SortHeader label="Scor ranking" sortKey="score" sort={sort} onSort={toggleSort} />
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
                  <td className="px-5 py-4">
                    <ScoreCell scored={scoreById.get(a.id)} loading={results.isLoading} error={!!results.error} />
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

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string
  sortKey: SortKey
  sort: { key: SortKey; dir: SortDir }
  onSort: (key: SortKey) => void
}) {
  const active = sort.key === sortKey
  return (
    <th className="px-5 py-3 font-medium">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-foreground",
          active && "text-foreground"
        )}
      >
        {label}
        {active ? (
          sort.dir === "asc" ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )
        ) : (
          <ChevronsUpDown className="size-3.5 opacity-40" />
        )}
      </button>
    </th>
  )
}

// Celula de scor: procent + rang dacă e eligibil; altfel motivul pentru care lipsește.
function ScoreCell({ scored, loading, error }: { scored?: ScoredApplication; loading: boolean; error: boolean }) {
  if (loading) return <span className="text-xs text-muted-foreground">Se calculează…</span>
  if (error) return <NoScore reason="Scorul nu s-a putut încărca" />
  if (!scored) return <NoScore reason="Aplicația nu e inclusă în calcul" />
  if (!scored.eligible) {
    const why = scored.failedRules.length ? scored.failedRules.join(", ") : "criterii de eligibilitate nedeplinite"
    return <NoScore reason={`Neeligibil: ${why}`} label="Neeligibil" />
  }
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-semibold text-foreground">{scored.percent.toFixed(1)}%</span>
      {scored.rank != null ? <span className="text-xs text-muted-foreground">#{scored.rank}</span> : null}
    </span>
  )
}

function NoScore({ reason, label = "—" }: { reason: string; label?: string }) {
  return (
    <span className="inline-flex flex-col" title={reason}>
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="max-w-[220px] truncate text-xs text-muted-foreground/80">{reason}</span>
    </span>
  )
}
