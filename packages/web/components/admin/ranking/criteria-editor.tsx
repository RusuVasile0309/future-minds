"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { RankingCriterion, Direction } from "@fm/shared"

export function CriteriaEditor({
  criteria,
  onChange,
}: {
  criteria: RankingCriterion[]
  onChange: (next: RankingCriterion[]) => void
}) {
  function update(id: string, patch: Partial<RankingCriterion>) {
    onChange(criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  if (criteria.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
        Niciun criteriu. Marchează câmpuri drept „scorabile” în constructorul de formular, apoi regenerează
        configurarea.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {criteria.map((c) => (
        <div
          key={c.id}
          className={cn(
            "rounded-xl border p-4 transition-colors",
            c.enabled ? "border-border bg-card" : "border-border/60 bg-secondary/20 opacity-70"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={c.enabled}
                onChange={(e) => update(c.id, { enabled: e.target.checked })}
                className="size-4 accent-[var(--brand-primary,#1650C8)]"
              />
              <span className="font-medium">{c.label}</span>
              <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                {c.kind === "income" ? "calculat" : c.fieldKey}
              </span>
            </label>

            <div className="flex items-center gap-2">
              <Label htmlFor={`w-${c.id}`} className="text-xs text-muted-foreground">
                Pondere
              </Label>
              <Input
                id={`w-${c.id}`}
                type="number"
                min={0}
                step={0.5}
                value={c.weight}
                onChange={(e) => update(c.id, { weight: Number(e.target.value) })}
                className="h-9 w-20"
              />
            </div>
          </div>

          {/* Controale specifice tipului */}
          {(c.kind === "numeric" || c.kind === "income") && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs text-muted-foreground">Direcție</Label>
                <select
                  value={c.direction ?? "higher"}
                  onChange={(e) => update(c.id, { direction: e.target.value as Direction })}
                  className="mt-1 h-9 w-full rounded-lg border border-input bg-background px-2 text-sm"
                >
                  <option value="higher">Mai mare = mai bine</option>
                  <option value="lower">Mai mic = mai bine</option>
                </select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Minim</Label>
                <Input
                  type="number"
                  value={c.min ?? 0}
                  onChange={(e) => update(c.id, { min: Number(e.target.value) })}
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Maxim</Label>
                <Input
                  type="number"
                  value={c.max ?? 0}
                  onChange={(e) => update(c.id, { max: Number(e.target.value) })}
                  className="mt-1 h-9"
                />
              </div>
            </div>
          )}

          {c.kind === "option" && (
            <div className="mt-3">
              <Label className="text-xs text-muted-foreground">Puncte per opțiune</Label>
              <div className="mt-1.5 space-y-1.5">
                {Object.keys(c.optionScores ?? {}).length === 0 ? (
                  <p className="text-xs text-muted-foreground">Câmpul nu are opțiuni definite.</p>
                ) : (
                  Object.entries(c.optionScores ?? {}).map(([value, score]) => (
                    <div key={value} className="flex items-center gap-3">
                      <span className="min-w-0 flex-1 truncate text-sm">{value}</span>
                      <Input
                        type="number"
                        step={0.5}
                        value={score}
                        onChange={(e) =>
                          update(c.id, {
                            optionScores: { ...(c.optionScores ?? {}), [value]: Number(e.target.value) },
                          })
                        }
                        className="h-9 w-24"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {c.kind === "boolean" && (
            <p className="mt-2 text-xs text-muted-foreground">
              Bonus la bifare, mărimea influenței e dată de pondere.
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
