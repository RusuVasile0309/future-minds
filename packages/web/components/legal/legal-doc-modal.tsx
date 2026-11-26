"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { PrivacyPolicyBody } from "@/components/legal/privacy-policy-body"
import { ConsentDocumentBody } from "@/components/legal/consent-document-body"
import { LEGAL_DOCS, markLegalDocRead, type LegalDocId } from "@/lib/legal-read"

// Cât de aproape de capăt (px) considerăm că utilizatorul a ajuns la final.
const BOTTOM_TOLERANCE = 24

/**
 * Afișează un document legal într-un modal. Când utilizatorul derulează până la
 * capăt (sau documentul încape integral pe ecran), documentul se marchează ca
 * parcurs, iar căsuța corespunzătoare din formular se deblochează.
 */
export function LegalDocModal({ docId, onClose }: { docId: LegalDocId | null; onClose: () => void }) {
  const doc = LEGAL_DOCS.find((d) => d.id === docId)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [reachedEnd, setReachedEnd] = useState(false)

  const check = useCallback(() => {
    const el = scrollRef.current
    if (!el || !docId) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - BOTTOM_TOLERANCE) {
      setReachedEnd(true)
      markLegalDocRead(docId)
    }
  }, [docId])

  // La fiecare deschidere pornim de la zero; verificăm și imediat (document scurt / ecran mare).
  useEffect(() => {
    setReachedEnd(false)
    if (!docId) return
    const t = window.setTimeout(check, 100)
    return () => window.clearTimeout(t)
  }, [docId, check])

  return (
    <Modal
      open={!!docId}
      onClose={onClose}
      title={doc?.label ?? ""}
      description="Derulează până la finalul documentului pentru a putea bifa căsuța din formular."
      className="max-w-3xl"
    >
      <div
        ref={scrollRef}
        onScroll={check}
        tabIndex={0}
        className="max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-background p-5 text-[0.95rem] leading-relaxed text-muted-foreground sm:p-7"
      >
        {docId === "confidentialitate" ? <PrivacyPolicyBody /> : null}
        {docId === "consimtaminte" ? <ConsentDocumentBody /> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className={`text-sm ${reachedEnd ? "font-medium text-primary" : "text-muted-foreground"}`} aria-live="polite">
          {reachedEnd ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-4" /> Ai ajuns la finalul documentului. Poți închide și bifa căsuța.
            </span>
          ) : (
            "Încă nu ai ajuns la final — continuă să derulezi."
          )}
        </p>
        <Button type="button" variant={reachedEnd ? "default" : "secondary"} onClick={onClose}>
          Închide
        </Button>
      </div>
    </Modal>
  )
}
