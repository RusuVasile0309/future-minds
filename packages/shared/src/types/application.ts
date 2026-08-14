import type { FormSection } from "./form"

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "waitlist"

export type AnswerValue = string | number | boolean | string[] | null

export interface ApplicationFile {
  id: string
  applicationId: string
  fieldKey: string
  fileName: string
  contentType: string
  sizeBytes: number
  uploadedAt: Date
}

export interface Application {
  id: string
  userId: string
  cohort: string
  status: ApplicationStatus
  answers: Record<string, AnswerValue>
  /** Notă manuală (1–3) a scrisorii de intenție, acordată de SUPER_USER. */
  coverLetterScore: number | null
  /** Notă manuală (1–3) a scrisorii de recomandare, acordată de SUPER_USER. */
  recommendationLetterScore: number | null
  submittedAt: Date | null
  createdAt: Date
  updatedAt: Date
  files?: ApplicationFile[]
}

/** Notele manuale (1–3) pentru cele două scrisori. `null` = neacordată. */
export interface LetterScores {
  coverLetterScore: number | null
  recommendationLetterScore: number | null
}

// ── Vedere admin ──────────────────────────────────────────────────────────────

/** Datele de cont ale candidatului (din tabela `users`). */
export interface ApplicantUser {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  phone: string | null
}

/** Rând din lista de candidați (fără răspunsurile complete). */
export interface ApplicationSummary {
  id: string
  status: ApplicationStatus
  cohort: string
  submittedAt: Date | null
  createdAt: Date
  applicant: ApplicantUser
  /** Nume afișat, derivat din răspunsuri (fallback: profil cont / email). */
  fullName: string
  /** Nr. de fișiere atașate — pentru un indicator rapid în tabel. */
  fileCount: number
}

/** Aplicație completă pentru ecranul de detaliu admin. */
export interface ApplicationDetail extends Application {
  applicant: ApplicantUser
  files: ApplicationFile[]
  /** Schema după care se randează răspunsurile (snapshot-ul versiunii completate). */
  sections: FormSection[]
}
