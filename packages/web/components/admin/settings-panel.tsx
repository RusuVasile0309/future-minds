"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { useSettings, useUpdateSettings } from "@/app/network/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function SettingsPanel({ canEdit }: { canEdit: boolean }) {
  const { data, isLoading, error } = useSettings()
  const update = useUpdateSettings()

  const [cohort, setCohort] = useState("")
  const [cohortSaved, setCohortSaved] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [cohortDirty, setCohortDirty] = useState(false)

  useEffect(() => {
    if (data && !cohortDirty) setCohort(data.currentCohort ?? "")
  }, [data, cohortDirty])

  if (isLoading) return <p className="text-muted-foreground">Se încarcă setările…</p>
  if (error || !data) return <p className="text-destructive">Nu am putut încărca setările.</p>

  async function toggleOpen(open: boolean) {
    setActionError(null)
    const res = await update.mutateAsync({ applicationsOpen: open })
    if (!res.success) setActionError(res.error)
  }

  async function saveCohort() {
    setActionError(null)
    setCohortSaved(false)
    const res = await update.mutateAsync({ currentCohort: cohort.trim() })
    if (res.success) {
      setCohortDirty(false)
      setCohortSaved(true)
    } else {
      setActionError(res.error)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {actionError ? <p className="text-sm text-destructive">{actionError}</p> : null}

      {/* Fereastra de înscriere */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="font-serif text-lg font-medium">Fereastra de înscriere</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Când e deschisă, candidații pot trimite aplicații. Închide-o pentru a opri primirea de noi aplicații.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={data.applicationsOpen}
            disabled={!canEdit || update.isPending}
            onClick={() => toggleOpen(!data.applicationsOpen)}
            className={cn(
              "relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
              data.applicationsOpen ? "bg-primary" : "bg-secondary"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                data.applicationsOpen ? "translate-x-[22px]" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
        <p className="mt-4 text-sm">
          Status:{" "}
          <span className={cn("font-semibold", data.applicationsOpen ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
            {data.applicationsOpen ? "Deschis" : "Închis"}
          </span>
        </p>
      </section>

      {/* Cohorta curentă */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-lg font-medium">Cohorta curentă</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Țintește formularul, aplicațiile și ranking-ul. Schimb-o la începutul unei noi ediții (ex. „2027”).
        </p>
        <div className="mt-4 flex items-end gap-3">
          <div className="flex-1 sm:max-w-[200px]">
            <Label htmlFor="cohort">Cohortă</Label>
            <Input
              id="cohort"
              value={cohort}
              disabled={!canEdit}
              onChange={(e) => {
                setCohort(e.target.value)
                setCohortDirty(true)
                setCohortSaved(false)
              }}
              placeholder="2026"
              className="mt-1.5"
            />
          </div>
          {canEdit ? (
            <Button onClick={saveCohort} disabled={update.isPending || !cohortDirty || cohort.trim() === ""}>
              {update.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Salvează
            </Button>
          ) : null}
          {cohortSaved ? (
            <span className="mb-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Check className="size-4 text-emerald-500" /> Salvat
            </span>
          ) : null}
        </div>
      </section>

      {!canEdit ? (
        <p className="text-sm text-muted-foreground">
          Doar un <strong>Super user</strong> poate modifica aceste setări.
        </p>
      ) : null}
    </div>
  )
}
