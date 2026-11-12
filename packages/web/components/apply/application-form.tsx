"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ClipboardCheck, ExternalLink, Loader2, Pencil, Send } from "lucide-react"
import { useMyApplication } from "@/app/network/applications"
import { useSaveApplication, useSubmitApplication, applicationsApi } from "@/app/network/applications"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FieldInput, fieldFloats } from "@/components/apply/field-input"
import { StatusBadge } from "@/components/apply/status-badge"
import { clearDependentAnswers } from "@/lib/content/form-options"
import {
  applyComputedFields,
  applyCnpBirthDate,
  applyParentRules,
  computeIncomePerMember,
  getFormSchema,
  isFieldVisible,
  validateFieldValue,
  INCOME_PER_MEMBER_THRESHOLD,
} from "@fm/shared"
import type { AnswerValue, ApplicationFile, ApplicationStatus, FormField, FormSection } from "@fm/shared"

// Schema formularului este STATICĂ (definită în @fm/shared).
const sections = getFormSchema()
// Pasul suplimentar de la final: „Verifică și trimite" (index = sections.length).
const REVIEW_STEP = sections.length
const TOTAL_STEPS = sections.length + 1

// Reținem pasul curent (și dacă a ajuns la verificare) în localStorage, per aplicație,
// ca utilizatorul să fie readus de unde a rămas la revenirea pe /aplica. E o
// comoditate per-browser; răspunsurile reale se salvează pe server.
const PROGRESS_PREFIX = "fm-apply-progress-"

function loadProgress(appId: string): { step: number; reachedReview: boolean } | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(PROGRESS_PREFIX + appId)
    if (!raw) return null
    const p = JSON.parse(raw) as { step?: unknown; reachedReview?: unknown }
    if (typeof p.step === "number") return { step: p.step, reachedReview: !!p.reachedReview }
  } catch {
    /* localStorage indisponibil / JSON corupt → pornim de la zero */
  }
  return null
}

function saveProgress(appId: string, step: number, reachedReview: boolean) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(PROGRESS_PREFIX + appId, JSON.stringify({ step, reachedReview }))
  } catch {
    /* localStorage plin / blocat → ignorăm (convenție, nu date critice) */
  }
}

export function ApplicationForm() {
  const appQ = useMyApplication()
  const save = useSaveApplication()
  const submit = useSubmitApplication()

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [step, setStep] = useState(0)
  // Direcția tranziției: 1 = înainte, -1 = înapoi. Reglează sensul de alunecare.
  const [direction, setDirection] = useState<1 | -1>(1)
  // Afișează erorile de obligativitate pe pasul curent (după o încercare de avansare).
  const [showErrors, setShowErrors] = useState(false)
  // A ajuns utilizatorul măcar o dată la pasul de verificare? (activează scurtătura „înapoi la verificare").
  const [reachedReview, setReachedReview] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const initialized = useRef(false)
  const dirty = useRef(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Ancoră pentru derularea la începutul formularului + titlul pasului (F2).
  const topRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  // La următoarea aterizare pe un pas, pune focus pe primul câmp invalid (nu pe titlu).
  const focusInvalidOnLand = useRef(false)
  // Sari peste comportamentul F2 (scroll+focus) la o singură schimbare de pas
  // (ex.: restaurarea pasului salvat la încărcare — nu vrem un salt al paginii).
  const skipScrollOnce = useRef(false)
  const mounted = useRef(false)
  // Fișierele într-un ref, ca efectul pe `step` să le citească fără să le adauge în deps.
  const filesRef = useRef<ApplicationFile[]>([])

  const application = appQ.data
  const isDraft = application?.status === "draft"
  filesRef.current = application?.files ?? []

  useEffect(() => {
    if (application && !initialized.current) {
      const init = { ...(application.answers ?? {}) }
      // Pre-completează email/telefon din contul elevului (dacă nu există deja).
      const account = application.account
      if (account?.email && !init.email) init.email = account.email
      if (account?.phone && !init.phone) init.phone = account.phone
      applyComputedFields(init) // ex.: media Bac, dacă notele există deja în draft
      applyCnpBirthDate(init) // data nașterii derivată din CNP (read-only)
      applyParentRules(init) // ex.: părinte decedat → nu susține financiar
      setAnswers(init)
      // Persistă pre-completarea dacă a adăugat ceva (email/telefon din cont).
      if (isDraft && JSON.stringify(init) !== JSON.stringify(application.answers ?? {})) {
        dirty.current = true
      }
      // Readu utilizatorul la pasul la care a rămas (doar pentru ciorne).
      if (isDraft) {
        const saved = loadProgress(application.id)
        if (saved) {
          if (saved.reachedReview) setReachedReview(true)
          const target = Math.min(Math.max(saved.step, 0), REVIEW_STEP)
          if (target !== 0) {
            skipScrollOnce.current = true // nu derula pagina la restaurare
            setStep(target)
          }
        }
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

  // Odată ajuns la pasul de verificare, ține minte (activează scurtătura).
  useEffect(() => {
    if (step === REVIEW_STEP) setReachedReview(true)
  }, [step])

  // Reține progresul (pasul + dacă a ajuns la verificare) per aplicație.
  useEffect(() => {
    if (!initialized.current || !application || !isDraft) return
    saveProgress(application.id, step, reachedReview)
  }, [step, reachedReview, application, isDraft])

  // F2: la schimbarea pasului, derulează sus și pune focus pe titlul pasului
  // (sau pe primul câmp invalid, dacă tocmai am sărit acolo dintr-o validare).
  // Nu rulează la montarea inițială (primul pas apare deja sus).
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    // Restaurarea pasului salvat nu trebuie să miște pagina.
    if (skipScrollOnce.current) {
      skipScrollOnce.current = false
      return
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    if (focusInvalidOnLand.current) {
      focusInvalidOnLand.current = false
      const key = step < REVIEW_STEP ? firstInvalidKey(sections[step], answers, filesRef.current) : null
      if (key) {
        focusField(key)
        return
      }
    }
    // Focus pe titlu (preventScroll ca să nu anuleze derularea lină de mai sus).
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

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
      // Data nașterii se re-derivă din CNP (câmp read-only).
      applyCnpBirthDate(next)
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

  // Trece la un pas dat (resetează semnalarea erorilor — pas „curat").
  function goToStep(target: number, dir: 1 | -1) {
    setShowErrors(false)
    setDirection(dir)
    setStep(target)
  }

  async function goNext() {
    if (step >= REVIEW_STEP) return
    const section = sections[step]
    // F1: dacă pasul e incomplet, nu avansăm — arătăm erorile și sărim la primul câmp invalid.
    if (!isStepComplete(section, answers, files)) {
      setShowErrors(true)
      const key = firstInvalidKey(section, answers, files)
      if (key) focusField(key)
      return
    }
    await persist()
    goToStep(Math.min(step + 1, REVIEW_STEP), 1)
  }

  async function goPrev() {
    await persist()
    goToStep(Math.max(step - 1, 0), -1)
  }

  // „Modifică" din pasul de verificare → sare la secțiunea respectivă.
  async function editSection(idx: number) {
    await persist()
    goToStep(idx, idx > step ? 1 : -1)
  }

  // Scurtătură „înapoi la verificare" (disponibilă după ce a ajuns la pasul final).
  async function goToReview() {
    await persist()
    goToStep(REVIEW_STEP, 1)
  }

  async function handleSubmit() {
    setSubmitError(null)
    // Verifică toate secțiunile; dacă una e incompletă, sari la ea și evidențiază problema.
    const firstBad = sections.findIndex((s) => !isStepComplete(s, answers, files))
    if (firstBad !== -1) {
      await persist()
      setShowErrors(true)
      focusInvalidOnLand.current = true
      setDirection(-1)
      setStep(firstBad)
      return
    }
    await persist()
    const res = await submit.mutateAsync()
    if (!res.success) setSubmitError(res.error)
  }

  const isReview = step === REVIEW_STEP
  const section = isReview ? null : sections[step]

  return (
    <div>
      <div ref={topRef} className="scroll-mt-24" aria-hidden />

      {/* Progres */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            Pasul {step + 1} din {TOTAL_STEPS}
          </span>
          <SaveIndicator saving={save.isPending} savedAt={savedAt} />
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <StepCarousel step={step} direction={direction}>
        {isReview ? (
          <ReviewStep
            sections={sections}
            answers={answers}
            files={files}
            headingRef={headingRef}
            onEdit={editSection}
          />
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h2 ref={headingRef} tabIndex={-1} className="font-serif text-2xl font-medium outline-none">
              {section!.title}
            </h2>
            {section!.description ? <p className="mt-1 text-muted-foreground">{section!.description}</p> : null}

            <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12 sm:gap-y-7 lg:gap-x-6 lg:gap-y-9">
              {section!.fields
                .filter((field) => !field.derived && isFieldVisible(field, answers))
                .map((field) => {
                  const value = answers[field.key] ?? null
                  return (
                    <FieldRow key={field.id} field={field} error={fieldRowError(field, value, answers, files, showErrors)}>
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

            {section!.id === "finance" ? <IncomeSummary answers={answers} /> : null}
          </div>
        )}
      </StepCarousel>

      {submitError ? (
        <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={goPrev} disabled={step === 0}>
          <ArrowLeft className="size-4" /> Înapoi
        </Button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Scurtătură spre pasul final, doar după ce a ajuns acolo o dată. */}
          {reachedReview && !isReview ? (
            <Button variant="secondary" onClick={goToReview}>
              <ClipboardCheck className="size-4" /> Mergi la final
            </Button>
          ) : null}

          {isReview ? (
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
    </div>
  )
}

// useLayoutEffect pe client, useEffect pe server (evită avertismentul SSR).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

// Caută primul câmp obligatoriu VIZIBIL necompletat sau completat invalid din
// secțiune (în ordinea de afișare). Întoarce `field.key` sau null dacă e complet.
function firstInvalidKey(
  section: FormSection,
  answers: Record<string, AnswerValue>,
  files: ApplicationFile[]
): string | null {
  const fileKeys = new Set(files.map((f) => f.fieldKey))
  for (const field of section.fields) {
    if (field.derived || !isFieldVisible(field, answers)) continue
    const value = answers[field.key] ?? null
    if (field.required) {
      if (field.type === "file") {
        if (!fileKeys.has(field.key)) return field.key
        continue
      }
      if (field.requiredTrue) {
        if (value !== true) return field.key
        continue
      }
      if (isEmpty(field, value)) return field.key
    }
    if (validateFieldValue(field, value, answers)) return field.key
  }
  // Criteriul de venit peste prag → trimite la primul câmp de venit.
  if (section.id === "finance") {
    const perMember = computeIncomePerMember(answers)
    if (perMember !== null && perMember >= INCOME_PER_MEMBER_THRESHOLD) return "student_income"
  }
  return null
}

// Derulează la câmpul cu cheia dată și pune focus pe input-ul lui (dacă există).
function focusField(key: string) {
  if (typeof document === "undefined") return
  const row = document.getElementById(`field-row-${key}`)
  const input = document.getElementById(key) as HTMLElement | null
  const anchor = row ?? input
  anchor?.scrollIntoView({ behavior: "smooth", block: "center" })
  if (input) requestAnimationFrame(() => input.focus({ preventScroll: true }))
}

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

  // Animația depinde DOAR de schimbarea pasului. `children` e intenționat în afara
  // dependențelor: e un obiect JSX nou la fiecare render, așa că dacă ar fi aici,
  // orice re-render din timpul animației (ex. auto-save comută `isPending`) ar
  // re-rula efectul, i-ar anula din cleanup `setTimeout`-ul de finalizare, iar
  // scena ar rămâne blocată cu `overflow-hidden` + înălțime fixă (cardul tăiat).
  useIsoLayoutEffect(() => {
    if (step === prevStep.current) return

    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const leaving = lastChildren.current
    const dir = direction
    prevStep.current = step

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
  }, [step, direction, duration])

  // Rulează după fiecare render (ordine: DUPĂ efectul de mai sus, ca acela să
  // citească încă `lastChildren` dinainte de schimbare pentru panoul care iese).
  // Reține conținutul curent (devine „cel care iese" la următoarea tranziție) și,
  // cât timp scena e în repaus, înălțimea curentă — punctul de start al animației.
  useIsoLayoutEffect(() => {
    lastChildren.current = children
    if (!anim && stageRef.current) lastHeight.current = stageRef.current.offsetHeight
  })

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

// Câmpurile de venit: când sunt obligatorii și goale, arătăm explicit un mesaj de
// eroare sub câmp (ca la celelalte erori), pe lângă blocarea butonului „Continuă".
const INCOME_FIELD_KEYS = new Set(["student_income", "mother_income", "father_income"])

function fieldRowError(
  field: FormField,
  value: AnswerValue,
  answers: Record<string, AnswerValue>,
  files: ApplicationFile[],
  showErrors: boolean
): string | null {
  // Veniturile obligatorii goale: mesaj mereu vizibil (comportament existent).
  if (INCOME_FIELD_KEYS.has(field.key) && field.required && isEmpty(field, value)) {
    return "Completează venitul net lunar."
  }
  // F1: după o încercare de avansare, semnalează câmpurile obligatorii necompletate.
  if (showErrors && field.required) {
    if (field.type === "file") {
      if (!files.some((f) => f.fieldKey === field.key)) return "Încarcă documentul cerut."
    } else if (field.requiredTrue) {
      if (value !== true) return "Bifează pentru a putea continua."
    } else if (isEmpty(field, value)) {
      return "Acest câmp este obligatoriu."
    }
  }
  return validateFieldValue(field, value, answers)
}

// Rezumatul venitului pe membru de familie, afișat în secțiunea financiară. Peste
// prag (≥ 2500 lei) arată un avertisment, dar NU blochează trimiterea — eligibilitatea
// finală se decide la evaluare.
function IncomeSummary({ answers }: { answers: Record<string, AnswerValue> }) {
  const hasIncome = [...INCOME_FIELD_KEYS].some((k) => {
    const v = answers[k]
    return v !== undefined && v !== null && v !== ""
  })
  if (!hasIncome) return null

  const perMember = computeIncomePerMember(answers)
  if (perMember === null) return null

  const over = perMember >= INCOME_PER_MEMBER_THRESHOLD
  const money = (n: number) => n.toLocaleString("ro-RO", { maximumFractionDigits: 2 })

  return (
    <div
      className={`mt-6 rounded-xl border p-4 text-sm ${
        over
          ? "border-destructive/40 bg-destructive/5 text-destructive"
          : "border-border bg-secondary/40 text-muted-foreground"
      }`}
    >
      <p>
        Venit net estimat / membru de familie:{" "}
        <strong className={over ? "" : "text-foreground"}>{money(perMember)} lei</strong>
      </p>
      {over ? (
        <p className="mt-1.5">
          Depășește pragul de {money(INCOME_PER_MEMBER_THRESHOLD)} lei/membru, deci nu îndeplinești criteriul de venit
          și nu poți trimite aplicația.
        </p>
      ) : (
        <p className="mt-1.5">Se încadrează sub pragul de {money(INCOME_PER_MEMBER_THRESHOLD)} lei/membru.</p>
      )}
    </div>
  )
}

// Câmp dezactivat prin reguli (ex.: „mă susține financiar" când părintele e decedat).
function isFieldDisabled(field: FormField, answers: Record<string, AnswerValue>): boolean {
  if (field.key === "mother_supports") return answers.mother_deceased === true
  if (field.key === "father_supports") return answers.father_deceased === true
  // Data nașterii e mereu read-only: se completează automat din CNP.
  if (field.key === "birth_date") return true
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
  // Criteriu de venit: peste prag (≥ 2500 lei/membru) → nu se poate avansa/trimite.
  if (section.id === "finance") {
    const perMember = computeIncomePerMember(answers)
    if (perMember !== null && perMember >= INCOME_PER_MEMBER_THRESHOLD) return false
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

  // Câmpuri cu etichetă flotantă (text/număr/select/dată): numele e în input,
  // deci nu mai punem etichetă deasupra. Textul de ajutor coboară sub input.
  if (fieldFloats(field)) {
    return (
      <div
        id={`field-row-${field.key}`}
        className={`col-span-1 ${spanClass} ${field.align === "center" ? "text-center" : ""}`}
      >
        {children}
        {field.helpText ? <p className="mt-1.5 text-xs text-muted-foreground">{field.helpText}</p> : null}
        {error ? <p className="mt-1.5 text-xs text-destructive motion-safe:animate-slide-down">{error}</p> : null}
      </div>
    )
  }

  return (
    <div
      id={`field-row-${field.key}`}
      className={`col-span-1 ${spanClass} ${field.align === "center" ? "text-center" : ""}`}
    >
      <Label htmlFor={field.key}>
        {field.label}
        {field.required ? <span className="ml-1 text-primary">*</span> : null}
      </Label>
      {field.helpText ? (
        <p className="mb-2 mt-0.5 text-xs text-muted-foreground">{field.helpText}</p>
      ) : (
        // Rezervă aceeași înălțime ca linia de ajutor, ca inputurile vecine pe
        // același rând să rămână aliniate.
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

// ── Pasul final: „Verifică și trimite" (C4) ───────────────────────────────────

function ReviewStep({
  sections,
  answers,
  files,
  headingRef,
  onEdit,
}: {
  sections: FormSection[]
  answers: Record<string, AnswerValue>
  files: ApplicationFile[]
  headingRef: React.Ref<HTMLHeadingElement>
  onEdit: (idx: number) => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 ref={headingRef} tabIndex={-1} className="font-serif text-2xl font-medium outline-none">
        Verifică și trimite
      </h2>
      <p className="mt-1 text-muted-foreground">
        Verifică datele de mai jos. Poți modifica orice secțiune înainte de a trimite — după trimitere nu mai poți edita.
      </p>

      <div className="mt-8 space-y-4">
        {sections.map((section, idx) => {
          const complete = isStepComplete(section, answers, files)
          const visibleFields = section.fields.filter((f) => !f.derived && isFieldVisible(f, answers))
          return (
            <div key={section.id} className="rounded-xl border border-border bg-background/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-serif text-lg font-medium">{section.title}</h3>
                  {complete ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" /> Complet
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                      <AlertTriangle className="size-3" /> Incomplet
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onEdit(idx)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Pencil className="size-3.5" /> Modifică
                </button>
              </div>

              <dl className="mt-4 divide-y divide-border/60">
                {visibleFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-3">
                    <dt className="text-sm text-muted-foreground">{field.label}</dt>
                    <dd className="text-sm text-foreground sm:col-span-2">
                      <ReviewValue field={field} value={answers[field.key]} files={files} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Valoarea unui câmp în rezumat. Pentru fișiere arată numele + buton „Deschide"
// (URL semnat pe termen scurt), ca elevul să verifice că a încărcat ce trebuie.
function ReviewValue({
  field,
  value,
  files,
}: {
  field: FormField
  value: AnswerValue
  files: ApplicationFile[]
}) {
  if (field.type === "file") {
    const mine = files.filter((f) => f.fieldKey === field.key)
    if (mine.length === 0) return <span className="text-muted-foreground">—</span>
    return (
      <ul className="space-y-1.5">
        {mine.map((f) => (
          <li key={f.id}>
            <OpenFileButton id={f.id} name={f.fileName} />
          </li>
        ))}
      </ul>
    )
  }
  return <span>{formatAnswer(field, value, files)}</span>
}

function OpenFileButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)

  async function open() {
    // Deschidem tab-ul sincron (altfel blocantele de pop-up îl opresc după await),
    // apoi îl direcționăm spre URL-ul semnat.
    const tab = window.open("", "_blank", "noopener,noreferrer")
    setLoading(true)
    try {
      const res = await applicationsApi.fileUrl(id)
      if (res.success && res.data?.url) {
        if (tab) tab.location.href = res.data.url
        else window.open(res.data.url, "_blank", "noopener,noreferrer")
      } else {
        tab?.close()
      }
    } catch {
      tab?.close()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={open}
      disabled={loading}
      className="inline-flex max-w-full items-center gap-1.5 text-primary underline-offset-2 hover:underline disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-3.5 shrink-0 animate-spin" /> : <ExternalLink className="size-3.5 shrink-0" />}
      <span className="truncate">{name}</span>
    </button>
  )
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
