"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react"
import { useRankingResults } from "@/app/network/admin"
import { cn } from "@/lib/utils"
import type { ScoredApplication } from "@fm/shared"

function fmtIncome(v: number | null): string {
  if (v === null) return "-"
  return `${v.toLocaleString("ro-RO", { maximumFractionDigits: 0 })} RON`
}

export function ResultsPanel({ source }: { source: "draft" | "active" }) {
  const { data, isLoading, error } = useRankingResults(source)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (isLoading) return <p className="text-muted-foreground">Se calculează clasamentul…</p>
  if (error) {
    return (
      <p className="text-destructive">
        {source === "active"
          ? "Nu există o versiune de ranking publicată încă. Publică una sau folosește previzualizarea."
          : "Nu am putut calcula clasamentul."}
      </p>
    )
  }

  const results = data?.results ?? []
  if (results.length === 0) {
    return <p className="text-muted-foreground">Niciun candidat de clasat (nu există aplicații trimise).</p>
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Candidat</th>
              <th className="px-4 py-3 font-medium">Scor</th>
              <th className="px-4 py-3 font-medium">Venit/membru</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {results.map((r) => {
              const isOpen = expanded === r.applicationId
              return (
                <RowGroup key={r.applicationId} r={r} isOpen={isOpen} onToggle={() => setExpanded(isOpen ? null : r.applicationId)} />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RowGroup({ r, isOpen, onToggle }: { r: ScoredApplication; isOpen: boolean; onToggle: () => void }) {
  return (
    <>
      <tr className={cn("transition-colors hover:bg-secondary/40", !r.eligible && "bg-red-50/40 dark:bg-red-500/5")}>
        <td className="px-4 py-3">
          {r.rank ? (
            <span className="font-mono font-semibold">{r.rank}</span>
          ) : (
            <span className="text-muted-foreground" title="Neeligibil">
              -
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <Link href={`/admin/candidati/${r.applicationId}`} className="font-medium hover:underline">
            {r.fullName}
          </Link>
          <span className="block text-xs text-muted-foreground">{r.email ?? "-"}</span>
          {!r.eligible && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-destructive">
              <AlertTriangle className="size-3" /> {r.failedRules.join("; ")}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, r.percent)}%` }} />
            </div>
            <span className="font-mono text-xs tabular-nums">{r.percent.toFixed(1)}%</span>
          </div>
          <span className="text-xs text-muted-foreground">total {r.total.toFixed(2)}</span>
        </td>
        <td className="px-4 py-3 tabular-nums text-muted-foreground">{fmtIncome(r.incomePerMember)}</td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            Detalii
          </button>
        </td>
      </tr>
      {isOpen && (
        <tr className="bg-secondary/20">
          <td colSpan={5} className="px-4 py-3">
            <div className="grid gap-1.5 sm:grid-cols-2">
              {r.breakdown.map((b) => (
                <div key={b.criterionId} className="flex items-center justify-between gap-3 rounded-md bg-card px-3 py-1.5">
                  <span className="min-w-0 truncate text-sm">{b.label}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {b.normalized.toFixed(2)} × {b.weight} ={" "}
                    <span className="font-semibold text-foreground">{b.contribution.toFixed(2)}</span>
                  </span>
                </div>
              ))}
              {r.breakdown.length === 0 && <p className="text-sm text-muted-foreground">Niciun criteriu activ.</p>}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
