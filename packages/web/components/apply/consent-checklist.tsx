"use client"

import { useState } from "react"
import { Check, FileText } from "lucide-react"
import { LegalDocModal } from "@/components/legal/legal-doc-modal"
import { LEGAL_DOCS, useLegalDocsRead, type LegalDocId } from "@/lib/legal-read"
import type { AnswerValue, FormField } from "@fm/shared"

// Fiecare consimțământ are documentul lui, care trebuie parcurs până la final.
const DOC_FOR_FIELD: Record<string, LegalDocId> = {
  gdpr_consent: "confidentialitate",
  declaration: "consimtaminte",
}

/**
 * Pasul „Consimțăminte": câte o bifă pentru fiecare consimțământ, cu linkul spre
 * document lângă ea. Documentul se deschide într-un modal; bifa se deblochează
 * abia când utilizatorul a derulat modalul până la final.
 */
export function ConsentChecklist({
  fields,
  answers,
  onChange,
  errorFor,
}: {
  fields: FormField[]
  answers: Record<string, AnswerValue>
  onChange: (key: string, value: AnswerValue) => void
  errorFor: (field: FormField) => string | null
}) {
  const { read } = useLegalDocsRead()
  const [openDoc, setOpenDoc] = useState<LegalDocId | null>(null)

  return (
    <div className="mt-8">
      <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm">
        <p className="font-medium text-foreground">Cum bifezi consimțămintele</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
          <li>Apasă pe documentul din dreptul fiecărei căsuțe; se deschide într-o fereastră.</li>
          <li>Derulează textul până la final. Căsuța rămâne blocată până atunci.</li>
          <li>Închide fereastra și bifează căsuța deblocată.</li>
        </ol>
      </div>

      <div className="mt-5 space-y-4">
        {fields.map((field) => {
          const docId = DOC_FOR_FIELD[field.key]
          const doc = LEGAL_DOCS.find((d) => d.id === docId)
          const checked = answers[field.key] === true
          const docRead = !doc || read[doc.id]
          // O bifă deja salvată în ciornă rămâne editabilă (poate fi debifată).
          const locked = !docRead && !checked
          const error = errorFor(field) ?? null

          return (
            <div key={field.id} id={`field-row-${field.key}`}>
              <div
                className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                  checked ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                }`}
              >
                <input
                  id={field.key}
                  type="checkbox"
                  checked={checked}
                  disabled={locked}
                  onChange={(e) => onChange(field.key, e.target.checked)}
                  aria-describedby={`${field.key}-doc`}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={field.key}
                    className={`text-sm font-medium ${locked ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer text-foreground"}`}
                  >
                    {field.label}
                    {field.required ? <span className="ml-1 text-primary">*</span> : null}
                  </label>

                  {doc ? (
                    <div id={`${field.key}-doc`} className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <button
                        type="button"
                        onClick={() => setOpenDoc(doc.id)}
                        className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-2 hover:underline"
                      >
                        <FileText className="size-4" />
                        {doc.label}
                      </button>
                      {docRead ? (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Check className="size-4 text-primary" /> Parcurs
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Deschide și derulează până la final pentru a bifa</span>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
              {error ? (
                <p className="mt-1.5 text-xs text-destructive motion-safe:animate-slide-down">
                  {locked ? "Parcurge mai întâi documentul de mai sus, până la final." : error}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>

      <LegalDocModal docId={openDoc} onClose={() => setOpenDoc(null)} />
    </div>
  )
}
