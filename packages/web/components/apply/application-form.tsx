"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react"
import { useMyApplication } from "@/app/network/applications"
import { useSaveApplication, useSubmitApplication } from "@/app/network/applications"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FieldInput } from "@/components/apply/field-input"
import { StatusBadge } from "@/components/apply/status-badge"
import { clearDependentAnswers } from "@/lib/content/form-options"
import { applyComputedFields, getFormSchema, isFieldVisible } from "@fm/shared"
import type { AnswerValue, ApplicationFile, ApplicationStatus, FormField, FormSection } from "@fm/shared"

// Schema formularului este STATICĂ (definită în @fm/shared).
const sections = getFormSchema()

export function ApplicationForm() {
  const appQ = useMyApplication()
  const save = useSaveApplication()
  const submit = useSubmitApplication()

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [step, setStep] = useState(0)
  // Direcția tranziției: 1 = înainte, -1 = înapoi. Reglează sensul de alunecare.
  const [direction, setDirection] = useState<1 | -1>(1)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const initialized = useRef(false)
  const dirty = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const application = appQ.data
  const isDraft = application?.status === "draft"

  useEffect(() => {
    if (application && !initialized.current) {
      const init = { ...(application.answers ?? {}) }
      applyComputedFields(init) // ex.: media Bac, dacă notele există deja în draft
      setAnswers(init)
      initialized.current = true
    }
  }, [application])

  // Auto-save debounce (doar în draft, doar după o editare).
  useEffect(() => {
    if (!isDraft || !dirty.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await save.mutateAsync(answers)
      if (res.success) setSavedAt(Date.now())
    }, 1200)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, isDraft])

  if (appQ.isLoading) {
    return <p className="text-muted-foreground">Se încarcă formularul…</p>
  }
  if (appQ.error) {
    return <p className="text-destructive">Nu am putut încărca formularul. Încearcă din nou.</p>
  }

  const files: ApplicationFile[] = application?.files ?? []

  // Aplicație deja trimisă — vedere read-only.
  if (application && !isDraft) {
    return <SubmittedView sections={sections} answers={application.answers} files={files} status={application.status} />
  }

  const update = (key: string, v: AnswerValue) => {
    dirty.current = true
    setAnswers((a) => {
      const next = { ...a, [key]: v }
      // Cascadă / excludere Bac: golește câmpurile dependente când părintele se schimbă.
      clearDependentAnswers(next, key)
      // Recalculează câmpurile derivate (ex.: media Bac din cele 3 note).
      applyComputedFields(next)
      return next
    })
  }

  async function persist() {
    if (dirty.current) {
      await save.mutateAsync(answers)
      setSavedAt(Date.now())
    }
  }

  async function goNext() {
    await persist()
    setDirection(1)
    setStep((s) => Math.min(s + 1, sections.length - 1))
  }
  async function goPrev() {
    await persist()
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }

  async function handleSubmit() {
    setSubmitError(null)
    await persist()
    const res = await submit.mutateAsync()
    if (!res.success) setSubmitError(res.error)
  }

  const section = sections[step]
  const isLast = step === sections.length - 1

  return (
    <div>
      {/* Progres */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Pasul {step + 1} din {sections.length}
          </span>
          <SaveIndicator saving={save.isPending} savedAt={savedAt} />
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / sections.length) * 100}%` }}
          />
        </div>
      </div>

      <div
        key={step}
        className={`rounded-2xl border border-border bg-card p-6 motion-reduce:animate-none sm:p-8 ${
          direction === 1 ? "animate-step-in-right" : "animate-step-in-left"
        }`}
      >
        <h2 className="font-serif text-2xl font-medium">{section.title}</h2>
        {section.description ? <p className="mt-1 text-muted-foreground">{section.description}</p> : null}

        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
          {section.fields
            .filter((field) => !field.derived && isFieldVisible(field, answers))
            .map((field) => (
              <FieldRow key={field.id} field={field}>
                <FieldInput
                  field={field}
                  value={answers[field.key] ?? null}
                  onChange={(v) => update(field.key, v)}
                  files={files}
                  answers={answers}
                />
              </FieldRow>
            ))}
        </div>
      </div>

      {submitError ? (
        <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between">
        <Button variant="ghost" onClick={goPrev} disabled={step === 0}>
          <ArrowLeft className="size-4" /> Înapoi
        </Button>

        {isLast ? (
          <Button onClick={handleSubmit} disabled={submit.isPending}>
            {submit.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Trimite aplicația
          </Button>
        ) : (
          <Button onClick={goNext}>
            Continuă <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Lățimea pe grid-ul de 12 coloane (de la breakpoint-ul `sm`); pe mobil rând întreg.
const COL_SPAN: Record<number, string> = {
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  6: "sm:col-span-6",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  12: "sm:col-span-12",
}

function FieldRow({ field, children }: { field: FormField; children: React.ReactNode }) {
  const spanClass = COL_SPAN[field.colSpan ?? 12] ?? "sm:col-span-12"
  return (
    <div className={`col-span-1 ${spanClass} ${field.align === "center" ? "text-center" : ""}`}>
      <Label htmlFor={field.key}>
        {field.label}
        {field.required ? <span className="ml-1 text-primary">*</span> : null}
      </Label>
      {field.helpText && field.type !== "textarea" ? (
        <p className="mb-2 mt-0.5 text-xs text-muted-foreground">{field.helpText}</p>
      ) : (
        <div className="mt-1.5" />
      )}
      {children}
    </div>
  )
}

function SaveIndicator({ saving, savedAt }: { saving: boolean; savedAt: number | null }) {
  if (saving)
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="size-3 animate-spin" /> Se salvează…
      </span>
    )
  if (savedAt)
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="size-3 text-emerald-500" /> Salvat
      </span>
    )
  return null
}

function SubmittedView({
  sections,
  answers,
  files,
  status,
}: {
  sections: FormSection[]
  answers: Record<string, AnswerValue>
  files: ApplicationFile[]
  status: ApplicationStatus
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-light/60 bg-secondary/40 p-6">
        <Check className="size-6 text-emerald-500" />
        <div className="flex-1">
          <h2 className="font-serif text-xl font-medium">Aplicația ta a fost trimisă</h2>
          <p className="text-sm text-muted-foreground">
            Îți mulțumim! O vom evalua conform criteriilor. Nu mai poți edita răspunsurile.
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-serif text-lg font-medium">{section.title}</h3>
            <dl className="mt-4 divide-y divide-border/60">
              {section.fields
                .filter((field) => !field.derived && isFieldVisible(field, answers))
                .map((field) => (
                  <div key={field.id} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3">
                    <dt className="text-sm text-muted-foreground">{field.label}</dt>
                    <dd className="text-sm text-foreground sm:col-span-2">
                      {formatAnswer(field, answers[field.key], files)}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatAnswer(field: FormField, value: AnswerValue, files: ApplicationFile[]): string {
  if (field.type === "file") {
    const mine = files.filter((f) => f.fieldKey === field.key)
    return mine.length ? mine.map((f) => f.fileName).join(", ") : "—"
  }
  if (value === null || value === undefined || value === "") return "—"
  if (field.type === "boolean") return value ? "Da" : "Nu"
  if (Array.isArray(value)) {
    return value
      .map((v) => field.options?.find((o) => o.value === v)?.label ?? v)
      .join(", ")
  }
  if (field.type === "select") {
    return field.options?.find((o) => o.value === value)?.label ?? String(value)
  }
  return String(value)
}
