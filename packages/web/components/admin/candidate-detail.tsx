"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Download, Loader2, Mail, Phone } from "lucide-react"
import {
  useCandidate,
  useUpdateCandidateStatus,
  useSetLetterScores,
  adminApplicationsApi,
} from "@/app/network/admin"
import { StatusBadge } from "@/components/apply/status-badge"
import { cn } from "@/lib/utils"
import { isFieldVisible } from "@fm/shared"
import type { AnswerValue, ApplicationFile, ApplicationStatus, FormField } from "@fm/shared"

const STATUS_ACTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "submitted", label: "Trimisă" },
  { value: "under_review", label: "În evaluare" },
  { value: "waitlist", label: "Așteptare" },
  { value: "accepted", label: "Acceptată" },
  { value: "rejected", label: "Respinsă" },
]

function formatDate(d: Date | string | null): string {
  if (!d) return "—"
  return new Date(d).toLocaleString("ro-RO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export function CandidateDetail({ id, canScore = false }: { id: string; canScore?: boolean }) {
  const { data, isLoading, error } = useCandidate(id)
  const updateStatus = useUpdateCandidateStatus(id)
  const [statusError, setStatusError] = useState<string | null>(null)

  if (isLoading) return <p className="text-muted-foreground">Se încarcă aplicația…</p>
  if (error) return <p className="text-destructive">Nu am putut încărca aplicația. Încearcă din nou.</p>
  if (!data) return <p className="text-muted-foreground">Aplicația nu a fost găsită.</p>

  const filesByField = (key: string) => data.files.filter((f) => f.fieldKey === key)

  async function setStatus(status: ApplicationStatus) {
    setStatusError(null)
    const res = await updateStatus.mutateAsync(status)
    if (!res.success) setStatusError(res.error)
  }

  return (
    <div>
      <Link
        href="/admin/candidati"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Toți candidații
      </Link>

      {/* Antet candidat */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display-title text-2xl sm:text-3xl">{displayName(data.applicant, data.answers)}</h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              {data.applicant.email ? (
                <a href={`mailto:${data.applicant.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <Mail className="size-3.5" /> {data.applicant.email}
                </a>
              ) : null}
              {phoneOf(data.applicant.phone, data.answers) ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5" /> {phoneOf(data.applicant.phone, data.answers)}
                </span>
              ) : null}
            </div>
          </div>
          <div className="text-right">
            <StatusBadge status={data.status} />
            <p className="mt-2 text-xs text-muted-foreground">Trimisă: {formatDate(data.submittedAt)}</p>
          </div>
        </div>

        {/* Schimbare status */}
        <div className="mt-6 border-t border-border/60 pt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Schimbă statusul</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {STATUS_ACTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                disabled={updateStatus.isPending || data.status === s.value}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed",
                  data.status === s.value
                    ? "bg-brand-deep text-white dark:bg-primary dark:text-brand-deep"
                    : "border border-border bg-background text-foreground hover:border-brand-light disabled:opacity-50"
                )}
              >
                {s.label}
              </button>
            ))}
            {updateStatus.isPending ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
          </div>
          {statusError ? <p className="mt-2 text-sm text-destructive">{statusError}</p> : null}
        </div>
      </div>

      {/* Răspunsuri pe secțiuni */}
      <div className="mt-6 space-y-6">
        {data.sections.map((section) => (
          <div key={section.id} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-lg font-medium">{section.title}</h2>
            <dl className="mt-4 divide-y divide-border/60">
              {section.fields
                .filter((field) => !field.derived && isFieldVisible(field, data.answers))
                .map((field) => (
                  <div key={field.id} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3">
                    <dt className="text-sm text-muted-foreground">{field.label}</dt>
                    <dd className="text-sm text-foreground sm:col-span-2">
                      {field.type === "file" ? (
                        <FileList applicationId={data.id} files={filesByField(field.key)} />
                      ) : (
                        formatAnswer(field, data.answers[field.key])
                      )}
                    </dd>
                  </div>
                ))}
              {section.id === "letters" && canScore ? (
                <LetterScoring
                  id={data.id}
                  coverLetterScore={data.coverLetterScore}
                  recommendationLetterScore={data.recommendationLetterScore}
                />
              ) : null}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}

const LETTER_SCORES = [
  { key: "coverLetterScore", label: "Notă scrisoare de intenție" },
  { key: "recommendationLetterScore", label: "Notă scrisoare de recomandare" },
] as const

// Panou de notare (1–3) al scrisorilor — vizibil doar pentru SUPER_USER. Notele
// contează la ranking (câmpuri `scorable` derivate din schemă).
function LetterScoring({
  id,
  coverLetterScore,
  recommendationLetterScore,
}: {
  id: string
  coverLetterScore: number | null
  recommendationLetterScore: number | null
}) {
  const save = useSetLetterScores(id)
  const [cover, setCover] = useState<number | null>(coverLetterScore)
  const [reco, setReco] = useState<number | null>(recommendationLetterScore)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const values: Record<string, [number | null, (v: number | null) => void]> = {
    coverLetterScore: [cover, setCover],
    recommendationLetterScore: [reco, setReco],
  }
  const dirty = cover !== coverLetterScore || reco !== recommendationLetterScore

  async function onSave() {
    setErr(null)
    setSaved(false)
    const res = await save.mutateAsync({ coverLetterScore: cover, recommendationLetterScore: reco })
    if (res.success) setSaved(true)
    else setErr(res.error)
  }

  return (
    <div className="mt-5 rounded-xl border border-brand-light/60 bg-secondary/40 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Evaluarea ta (1–3)</p>
      <div className="mt-3 space-y-3">
        {LETTER_SCORES.map(({ key, label }) => {
          const [value, setValue] = values[key]
          return (
            <div key={key} className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-foreground">{label}</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setValue(value === n ? null : n)
                      setSaved(false)
                    }}
                    className={cn(
                      "size-8 rounded-lg border text-sm font-medium transition-colors",
                      value === n
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background text-foreground hover:bg-secondary"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={save.isPending || !dirty}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-deep px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-brand-deep"
        >
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Salvează notele
        </button>
        {saved && !dirty ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-500">
            <Check className="size-4" /> Salvat
          </span>
        ) : null}
        {err ? <span className="text-sm text-destructive">{err}</span> : null}
      </div>
    </div>
  )
}

function FileList({ applicationId, files }: { applicationId: string; files: ApplicationFile[] }) {
  if (files.length === 0) return <span className="text-muted-foreground">—</span>
  return (
    <ul className="space-y-1.5">
      {files.map((f) => (
        <li key={f.id}>
          <FileLink applicationId={applicationId} file={f} />
        </li>
      ))}
    </ul>
  )
}

function FileLink({ applicationId, file }: { applicationId: string; file: ApplicationFile }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(false)

  async function open() {
    setErr(false)
    setLoading(true)
    const res = await adminApplicationsApi.fileUrl(applicationId, file.id)
    setLoading(false)
    if (res.success && res.data?.url) {
      window.open(res.data.url, "_blank", "noopener,noreferrer")
    } else {
      setErr(true)
    }
  }

  return (
    <button
      onClick={open}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-primary hover:underline disabled:opacity-50"
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
      {file.fileName}
      {err ? <span className="text-xs text-destructive">(eroare)</span> : null}
    </button>
  )
}

function formatAnswer(field: FormField, value: AnswerValue): string {
  if (value === null || value === undefined || value === "") return "—"
  if (field.type === "boolean") return value ? "Da" : "Nu"
  if (Array.isArray(value)) {
    return value.map((v) => field.options?.find((o) => o.value === v)?.label ?? v).join(", ")
  }
  if (field.type === "select") {
    return field.options?.find((o) => o.value === value)?.label ?? String(value)
  }
  return String(value)
}

// Nume afișat: întâi din răspunsuri (last+first), apoi din profilul contului.
function displayName(
  applicant: { firstName: string | null; lastName: string | null },
  answers: Record<string, AnswerValue>
): string {
  const s = (k: string) => (typeof answers[k] === "string" ? (answers[k] as string).trim() : "")
  const fromAnswers = [s("last_name"), s("first_name")].filter(Boolean).join(" ")
  if (fromAnswers) return fromAnswers
  const fromProfile = [applicant.lastName, applicant.firstName]
    .map((v) => v?.trim() ?? "")
    .filter(Boolean)
    .join(" ")
  return fromProfile || "Candidat"
}

function phoneOf(profilePhone: string | null, answers: Record<string, AnswerValue>): string {
  if (profilePhone) return profilePhone
  return typeof answers.phone === "string" ? answers.phone : ""
}
