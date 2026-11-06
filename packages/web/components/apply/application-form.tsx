"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, Loader2, Send } from "lucide-react"
import { useMyApplication } from "@/app/network/applications"
import { useSaveApplication, useSubmitApplication } from "@/app/network/applications"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FieldInput } from "@/components/apply/field-input"
import { StatusBadge } from "@/components/apply/status-badge"
import { clearDependentAnswers } from "@/lib/content/form-options"
import {
  applyComputedFields,
  applyParentRules,
  getFormSchema,
  isFieldVisible,
  validateFieldValue,
} from "@fm/shared"
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
      // Pre-completează email/telefon din contul elevului (dacă nu există deja).
      const account = application.account
      if (account?.email && !init.email) init.email = account.email
      if (account?.phone && !init.phone) init.phone = account.phone
      applyComputedFields(init) // ex.: media Bac, dacă notele există deja în draft
      applyParentRules(init) // ex.: părinte decedat → nu susține financiar
      setAnswers(init)
      // Persistă pre-completarea dacă a adăugat ceva (email/telefon din cont).
      if (isDraft && JSON.stringify(init) !== JSON.stringify(application.answers ?? {})) {
        dirty.current = true
      }
      initialized.current = true
    }
  }, [application, isDraft])

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
      // Reguli părinți: decedat → nu susține financiar (câmp dezactivat).
      applyParentRules(next)
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
  // Nu se poate avansa / trimite până când toate câmpurile obligatorii vizibile
  // din pasul curent sunt completate și valide.
  const stepComplete = isStepComplete(section, answers, files)

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

      <StepCarousel step={step} direction={direction}>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-medium">{section.title}</h2>
          {section.description ? <p className="mt-1 text-muted-foreground">{section.description}</p> : null}

          <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
            {section.fields
              .filter((field) => !field.derived && isFieldVisible(field, answers))
              .map((field) => {
                const value = answers[field.key] ?? null
                return (
                  <FieldRow key={field.id} field={field} error={validateFieldValue(field, value, answers)}>
                    <FieldInput
                      field={field}
                      value={value}
                      onChange={(v) => update(field.key, v)}
                      files={files}
                      answers={answers}
                      disabled={isFieldDisabled(field, answers)}
                    />
                  </FieldRow>
                )
              })}
          </div>
        </div>
      </StepCarousel>

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
          <Button onClick={handleSubmit} disabled={submit.isPending || !stepComplete}>
            {submit.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Trimite aplicația
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!stepComplete}>
            Continuă <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// useLayoutEffect pe client, useEffect pe server (evită avertismentul SSR).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

// Tranziția „carusel" între pași: când `step` se schimbă, panoul care iese și cel
// care intră alunecă simultan pe orizontală (sensul dat de `direction`), iar
// înălțimea scenei se animează între cele două. Respectă prefers-reduced-motion.
function StepCarousel({
  step,
  direction,
  duration = 500,
  children,
}: {
  step: number
  direction: 1 | -1
  duration?: number
  children: React.ReactNode
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const prevStep = useRef(step)
  const lastChildren = useRef<React.ReactNode>(children)
  const lastHeight = useRef<number | null>(null)

  const [anim, setAnim] = useState<{ leaving: React.ReactNode; dir: 1 | -1 } | null>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  // Cât timp scena e „în repaus", reține înălțimea curentă — e înălțimea de la care
  // va porni animația la următoarea schimbare de pas.
  useIsoLayoutEffect(() => {
    if (!anim && stageRef.current) lastHeight.current = stageRef.current.offsetHeight
  })

  useIsoLayoutEffect(() => {
    if (step === prevStep.current) {
      lastChildren.current = children
      return
    }
    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const leaving = lastChildren.current
    const dir = direction
    prevStep.current = step
    lastChildren.current = children

    if (reduce) {
      setAnim(null)
      setHeight(undefined)
      return
    }

    // Pornim de la înălțimea pasului care iese…
    setAnim({ leaving, dir })
    setHeight(lastHeight.current ?? stageRef.current?.offsetHeight ?? undefined)

    // …apoi, în frame-ul următor, animăm spre înălțimea pasului care intră.
    const raf = requestAnimationFrame(() => {
      const incoming = stageRef.current?.querySelector<HTMLElement>('[data-carousel="incoming"]')
      if (incoming) setHeight(incoming.offsetHeight)
    })
    const done = setTimeout(() => {
      setAnim(null)
      setHeight(undefined)
    }, duration + 40)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(done)
    }
  }, [step, direction, children, duration])

  return (
    <div
      ref={stageRef}
      className={`relative ${anim ? "overflow-hidden" : ""}`}
      style={
        anim
          ? { height, transition: `height ${duration}ms cubic-bezier(0.65, 0, 0.35, 1)` }
          : undefined
      }
    >
      {anim ? (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 ${
            anim.dir === 1 ? "animate-carousel-out-left" : "animate-carousel-out-right"
          }`}
        >
          {anim.leaving}
        </div>
      ) : null}
      <div
        data-carousel="incoming"
        className={
          anim
            ? `absolute inset-x-0 top-0 ${
                anim.dir === 1 ? "animate-carousel-in-right" : "animate-carousel-in-left"
              }`
            : ""
        }
      >
        {children}
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

// Un câmp este „gol" (necompletat) pentru validarea de obligativitate.
function isEmpty(field: FormField, value: AnswerValue): boolean {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (field.type === "boolean" && typeof value !== "boolean")
  )
}

// Câmp dezactivat prin reguli (ex.: „mă susține financiar" când părintele e decedat).
function isFieldDisabled(field: FormField, answers: Record<string, AnswerValue>): boolean {
  if (field.key === "mother_supports") return answers.mother_deceased === true
  if (field.key === "father_supports") return answers.father_deceased === true
  return false
}

// Toate câmpurile obligatorii VIZIBILE din secțiune sunt completate și valide?
function isStepComplete(
  section: FormSection,
  answers: Record<string, AnswerValue>,
  files: ApplicationFile[]
): boolean {
  const fileKeys = new Set(files.map((f) => f.fieldKey))
  for (const field of section.fields) {
    if (field.derived || !isFieldVisible(field, answers)) continue
    const value = answers[field.key] ?? null
    if (field.required) {
      if (field.type === "file") {
        if (!fileKeys.has(field.key)) return false
        continue
      }
      if (field.requiredTrue) {
        if (value !== true) return false
        continue
      }
      if (isEmpty(field, value)) return false
    }
    // Câmp completat dar invalid (format/interval/corelații) → blochează pasul.
    if (validateFieldValue(field, value, answers)) return false
  }
  return true
}

function FieldRow({
  field,
  error,
  children,
}: {
  field: FormField
  error?: string | null
  children: React.ReactNode
}) {
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
        // Rezervă aceeași înălțime ca linia de ajutor, ca inputurile vecine pe
        // același rând (ex.: Data nașterii lângă CNP) să rămână aliniate.
        <p className="mb-2 mt-0.5 text-xs text-muted-foreground" aria-hidden="true">
          &nbsp;
        </p>
      )}
      {children}
      {error ? <p className="mt-1.5 text-xs text-destructive motion-safe:animate-slide-down">{error}</p> : null}
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
      <span className="flex animate-fade-in items-center gap-1.5 text-xs text-muted-foreground">
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
    return mine.length ? mine.map((f) => f.fileName).join(", ") : "-"
  }
  if (value === null || value === undefined || value === "") return "-"
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
