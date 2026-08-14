"use client"

import { Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { EligibilityRule, TieBreaker, EligibilityOp, Direction } from "@fm/shared"

export interface FieldOption {
  value: string
  label: string
}

const OP_LABELS: Record<EligibilityOp, string> = {
  gte: "≥ (cel puțin)",
  lte: "≤ (cel mult)",
  eq: "= (egal cu)",
  is_true: "este bifat",
}

function selectCls() {
  return "h-9 rounded-lg border border-input bg-background px-2 text-sm"
}

export function EligibilityEditor({
  rules,
  fields,
  onChange,
}: {
  rules: EligibilityRule[]
  fields: FieldOption[]
  onChange: (next: EligibilityRule[]) => void
}) {
  function add() {
    const first = fields[0]
    onChange([
      ...rules,
      {
        id: `rule_${Date.now()}`,
        fieldKey: first?.value ?? "",
        op: "gte",
        value: 0,
        label: first ? `${first.label} ≥ 0` : "Regulă nouă",
      },
    ])
  }
  function update(id: string, patch: Partial<EligibilityRule>) {
    onChange(
      rules.map((r) => {
        if (r.id !== id) return r
        const next = { ...r, ...patch }
        const fieldLabel = fields.find((f) => f.value === next.fieldKey)?.label ?? next.fieldKey
        next.label =
          next.op === "is_true"
            ? `${fieldLabel} bifat`
            : `${fieldLabel} ${OP_LABELS[next.op].replace(/\s*\(.*\)/, "")} ${next.value ?? ""}`.trim()
        return next
      })
    )
  }

  return (
    <div>
      <div className="space-y-2">
        {rules.map((r) => (
          <div key={r.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2.5">
            <select value={r.fieldKey} onChange={(e) => update(r.id, { fieldKey: e.target.value })} className={selectCls()}>
              {fields.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              value={r.op}
              onChange={(e) => update(r.id, { op: e.target.value as EligibilityOp })}
              className={selectCls()}
            >
              {(Object.keys(OP_LABELS) as EligibilityOp[]).map((op) => (
                <option key={op} value={op}>
                  {OP_LABELS[op]}
                </option>
              ))}
            </select>
            {r.op !== "is_true" && (
              <Input
                value={String(r.value ?? "")}
                onChange={(e) => update(r.id, { value: e.target.value })}
                className="h-9 w-28"
                placeholder="valoare"
              />
            )}
            <button
              onClick={() => onChange(rules.filter((x) => x.id !== r.id))}
              className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label="Șterge regula"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {rules.length === 0 && (
          <p className="text-sm text-muted-foreground">Fără praguri, toți candidații sunt eligibili.</p>
        )}
      </div>
      <button
        onClick={add}
        disabled={fields.length === 0}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline disabled:opacity-50"
      >
        <Plus className="size-4" /> Adaugă prag de eligibilitate
      </button>
    </div>
  )
}

export function TieBreakerEditor({
  tieBreakers,
  fields,
  onChange,
}: {
  tieBreakers: TieBreaker[]
  fields: FieldOption[]
  onChange: (next: TieBreaker[]) => void
}) {
  function add() {
    onChange([...tieBreakers, { fieldKey: fields[0]?.value ?? "total_score", direction: "higher" }])
  }
  function update(i: number, patch: Partial<TieBreaker>) {
    onChange(tieBreakers.map((t, idx) => (idx === i ? { ...t, ...patch } : t)))
  }

  return (
    <div>
      <div className="space-y-2">
        {tieBreakers.map((t, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-2.5">
            <span className="font-mono text-xs text-muted-foreground">{i + 1}.</span>
            <select value={t.fieldKey} onChange={(e) => update(i, { fieldKey: e.target.value })} className={selectCls()}>
              {fields.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <select
              value={t.direction}
              onChange={(e) => update(i, { direction: e.target.value as Direction })}
              className={selectCls()}
            >
              <option value="higher">descrescător (mai mare întâi)</option>
              <option value="lower">crescător (mai mic întâi)</option>
            </select>
            <button
              onClick={() => onChange(tieBreakers.filter((_, idx) => idx !== i))}
              className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label="Șterge departajarea"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {tieBreakers.length === 0 && (
          <p className="text-sm text-muted-foreground">Fără departajări; la egalitate se folosește ordinea alfabetică.</p>
        )}
      </div>
      <button
        onClick={add}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Plus className="size-4" /> Adaugă departajare
      </button>
    </div>
  )
}
