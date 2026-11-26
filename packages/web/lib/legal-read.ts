"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * Evidența „documentul a fost parcurs până la final", ținută în localStorage.
 * Modalul din formular marchează documentul când utilizatorul ajunge cu scroll-ul
 * la capăt; formularul reacționează prin evenimentul `LEGAL_READ_EVENT` (aceeași
 * filă) sau `storage` (alte file). Cheia include versiunea documentului: dacă
 * textul se schimbă, candidatul trebuie să-l parcurgă din nou.
 *
 * Este o garanție de UX, nu una criptografică: nu putem dovedi server-side
 * că cineva a citit un text, doar că a fost pus să ajungă la final.
 */
export const LEGAL_DOCS = [
  { id: "confidentialitate", href: "/confidentialitate", label: "Politica de confidențialitate (GDPR)", version: "2026-11-11" },
  { id: "consimtaminte", href: "/consimtaminte", label: "Declarația de consimțământ", version: "2026-11-26" },
] as const

const LEGAL_READ_EVENT = "fm:legal-read"

export type LegalDocId = (typeof LEGAL_DOCS)[number]["id"]

const keyOf = (doc: (typeof LEGAL_DOCS)[number]) => `fm:legal-read:${doc.id}:${doc.version}`

export function markLegalDocRead(id: LegalDocId) {
  const doc = LEGAL_DOCS.find((d) => d.id === id)
  if (!doc) return
  try {
    localStorage.setItem(keyOf(doc), "1")
  } catch {
    // localStorage indisponibil (mod privat etc.) — starea rămâne doar în memorie, mai jos.
  }
  memoryRead.add(id)
  window.dispatchEvent(new Event(LEGAL_READ_EVENT))
}

// Fallback când localStorage nu e disponibil: ține starea pe durata paginii.
const memoryRead = new Set<LegalDocId>()

function readState(): Record<LegalDocId, boolean> {
  const state = {} as Record<LegalDocId, boolean>
  for (const doc of LEGAL_DOCS) {
    try {
      state[doc.id] = memoryRead.has(doc.id) || localStorage.getItem(keyOf(doc)) === "1"
    } catch {
      state[doc.id] = memoryRead.has(doc.id)
    }
  }
  return state
}

/** Starea „citit" a documentelor, reactivă la parcurgerea lor în alte file. */
export function useLegalDocsRead() {
  const [read, setRead] = useState<Record<LegalDocId, boolean>>(() =>
    Object.fromEntries(LEGAL_DOCS.map((d) => [d.id, false])) as Record<LegalDocId, boolean>,
  )

  const refresh = useCallback(() => setRead(readState()), [])

  useEffect(() => {
    refresh()
    window.addEventListener(LEGAL_READ_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(LEGAL_READ_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [refresh])

  return { read, allRead: LEGAL_DOCS.every((d) => read[d.id]) }
}
