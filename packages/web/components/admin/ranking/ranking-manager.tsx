"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Loader2, Save, UploadCloud, X } from "lucide-react"
import {
  useRankingConfig,
  useSaveRankingConfig,
  usePublishRanking,
} from "@/app/network/admin"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CriteriaEditor } from "./criteria-editor"
import { CriteriaDonut, DONUT_PALETTE, type DonutSlice } from "./criteria-donut"
import { EligibilityEditor, TieBreakerEditor, type FieldOption } from "./rules-editor"
import { ResultsPanel } from "./results-panel"
import type { RankingConfig, RankingCriterion, EligibilityRule, TieBreaker } from "@fm/shared"

const INCOME_KEY = "income_per_member"

type Tab = "config" | "results"

export function RankingManager() {
  const configQ = useRankingConfig()
  const save = useSaveRankingConfig()
  const publish = usePublishRanking()

  const [config, setConfig] = useState<RankingConfig | null>(null)
  const [tab, setTab] = useState<Tab>("config")
  const [source, setSource] = useState<"draft" | "active">("draft")
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [publishMsg, setPublishMsg] = useState<string | null>(null)
  const [hoveredCriterion, setHoveredCriterion] = useState<string | null>(null)

  useEffect(() => {
    if (configQ.data && !config) setConfig(configQ.data)
  }, [configQ.data, config])

  const fieldOptions = useMemo<FieldOption[]>(() => {
    if (!config) return []
    const seen = new Set<string>()
    const opts: FieldOption[] = []
    for (const c of config.criteria) {
      if (seen.has(c.fieldKey)) continue
      seen.add(c.fieldKey)
      opts.push({ value: c.fieldKey, label: c.label })
    }
    if (!seen.has(INCOME_KEY)) opts.unshift({ value: INCOME_KEY, label: "Venit net / membru" })
    return opts
  }, [config])

  const tieBreakerFields = useMemo<FieldOption[]>(
    () => [{ value: "total_score", label: "Scor total" }, ...fieldOptions],
    [fieldOptions]
  )

  // Contribuția fiecărui criteriu = pondere / suma ponderilor active (enabled && weight>0).
  // Identic cu `scoreApplication` din server (weightSum), deci reflectă scorul final real.
  const { percentById, slices } = useMemo(() => {
    const active = (config?.criteria ?? []).filter((c) => c.enabled && c.weight > 0)
    const weightSum = active.reduce((s, c) => s + c.weight, 0)
    const percentById: Record<string, number> = {}
    const slices: DonutSlice[] = active.map((c, i) => {
      const percent = weightSum > 0 ? (c.weight / weightSum) * 100 : 0
      percentById[c.id] = percent
      return { id: c.id, label: c.label, percent, color: DONUT_PALETTE[i % DONUT_PALETTE.length] }
    })
    return { percentById, slices }
  }, [config?.criteria])

  function scrollToCriterion(id: string) {
    const el = document.getElementById(`criterion-${id}`)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "center" })
    setHoveredCriterion(id)
  }

  if (configQ.isLoading || !config) return <p className="text-muted-foreground">Se încarcă configurarea…</p>
  if (configQ.error) return <p className="text-destructive">Nu am putut încărca configurarea de ranking.</p>

  function patch(next: Partial<RankingConfig>) {
    setConfig((c) => (c ? { ...c, ...next } : c))
    setDirty(true)
    setSavedAt(null)
  }

  async function handleSave() {
    if (!config) return
    const res = await save.mutateAsync(config)
    if (res.success) {
      setDirty(false)
      setSavedAt(Date.now())
    }
  }

  async function handlePublish() {
    setPublishMsg(null)
    if (dirty) await handleSave()
    const res = await publish.mutateAsync()
    if (res.success) {
      setPublishMsg("Versiune publicată. Clasamentul „Versiune publicată” folosește acum aceste reguli.")
      setSource("active")
    } else {
      setPublishMsg(res.error)
    }
  }

  return (
    <div>
      {/* Taburi */}
      <div className="mb-6 flex items-center gap-1 border-b border-border">
        {(
          [
            ["config", "Configurare"],
            ["results", "Clasament"],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "config" ? (
        <div className="space-y-8">
          <div className="lg:flex lg:gap-8">
            <section className="min-w-0 lg:w-[65%]">
              <h2 className="font-serif text-xl font-medium">Criterii de scor</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fiecare criteriu produce un scor normalizat, înmulțit cu ponderea. Venitul pe membru e criteriul
                principal (mai mic = scor mai mare). Procentul de lângă fiecare criteriu arată cât din scorul
                final reprezintă.
              </p>
              <div className="mt-4">
                <CriteriaEditor
                  criteria={config.criteria}
                  onChange={(criteria) => patch({ criteria })}
                  percentById={percentById}
                  hoveredId={hoveredCriterion}
                  onHover={setHoveredCriterion}
                />
              </div>
            </section>

            {/* Donut — desktop: coloană dreapta, sticky, 35% */}
            <aside className="hidden lg:block lg:w-[35%] lg:shrink-0">
              <div className="sticky top-4">
                <CriteriaDonut
                  slices={slices}
                  hoveredId={hoveredCriterion}
                  onHover={setHoveredCriterion}
                  onSelect={scrollToCriterion}
                />
              </div>
            </aside>
          </div>

          <section>
            <h2 className="font-serif text-xl font-medium">Praguri de eligibilitate</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Candidații care nu îndeplinesc aceste condiții sunt marcați neeligibili și scoși din clasament.
            </p>
            <div className="mt-4">
              <EligibilityEditor
                rules={config.eligibility}
                fields={fieldOptions}
                onChange={(eligibility: EligibilityRule[]) => patch({ eligibility })}
              />
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium">Departajări (tie-breakers)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Aplicate în ordine, la egalitate de scor total.
            </p>
            <div className="mt-4">
              <TieBreakerEditor
                tieBreakers={config.tieBreakers}
                fields={tieBreakerFields}
                onChange={(tieBreakers: TieBreaker[]) => patch({ tieBreakers })}
              />
            </div>
          </section>

          {/* Donut — mobil: în josul paginii (click → scroll la criteriu) */}
          <div className="lg:hidden">
            <CriteriaDonut
              slices={slices}
              hoveredId={hoveredCriterion}
              onHover={setHoveredCriterion}
              onSelect={scrollToCriterion}
            />
          </div>

          {/* Acțiuni */}
          <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-sm backdrop-blur">
            <Button onClick={handleSave} disabled={save.isPending || !dirty}>
              {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Salvează configurarea
            </Button>
            <Button variant="secondary" onClick={handlePublish} disabled={publish.isPending}>
              {publish.isPending ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
              Publică versiune
            </Button>
            {savedAt && !dirty ? (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="size-4 text-emerald-500" /> Salvat
              </span>
            ) : dirty ? (
              <span className="text-sm text-amber-600 dark:text-amber-400">Modificări nesalvate</span>
            ) : null}
            {publishMsg ? (
              <span className="inline-flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-1.5 text-sm text-muted-foreground">
                {publishMsg}
                <button
                  type="button"
                  onClick={() => setPublishMsg(null)}
                  aria-label="Închide"
                  className="-mr-1 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-border bg-card p-1">
              {(
                [
                  ["draft", "Previzualizare (config de lucru)"],
                  ["active", "Versiune publicată"],
                ] as ["draft" | "active", string][]
              ).map(([s, label]) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    source === s ? "bg-brand-deep text-white dark:bg-primary dark:text-brand-deep" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            {dirty && source === "draft" ? (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Salvează pentru ca previzualizarea să reflecte ultimele modificări.
              </span>
            ) : null}
          </div>
          <ResultsPanel source={source} />
        </div>
      )}
    </div>
  )
}
