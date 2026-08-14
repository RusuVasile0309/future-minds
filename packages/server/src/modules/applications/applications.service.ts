import { sql } from "../../database/db"
import { SettingsService } from "../settings/settings.service"
import { FilesService } from "../files/files.service"
import { FORM_SCHEMA, isFieldVisible } from "@fm/shared"
import type {
  Application,
  ApplicationStatus,
  ApplicationSummary,
  ApplicationDetail,
  ApplicantUser,
  AnswerValue,
  FormSection,
  LetterScores,
} from "@fm/shared"

export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: number = 400
  ) {
    super(message)
    this.name = "ApplicationError"
  }
}

const STATUSES: ApplicationStatus[] = [
  "draft",
  "submitted",
  "under_review",
  "accepted",
  "rejected",
  "waitlist",
]

function toApplication(row: Record<string, unknown>): Application {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    cohort: row.cohort as string,
    status: row.status as ApplicationStatus,
    answers: (row.answers as Record<string, AnswerValue>) ?? {},
    coverLetterScore: row.cover_letter_score != null ? Number(row.cover_letter_score) : null,
    recommendationLetterScore:
      row.recommendation_letter_score != null ? Number(row.recommendation_letter_score) : null,
    submittedAt: row.submitted_at ? new Date(row.submitted_at as string) : null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  }
}

async function currentCohort(): Promise<string> {
  return (await SettingsService.getCurrentCohort()) ?? "default"
}

// Prefixate cu `u_` din join-ul pe users.
function toApplicant(row: Record<string, unknown>): ApplicantUser {
  return {
    id: row.u_id as string,
    email: (row.email as string | null) ?? null,
    firstName: (row.u_first as string | null) ?? null,
    lastName: (row.u_last as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
  }
}

// Nume afișat: întâi din răspunsurile formularului, apoi din profilul contului.
function deriveFullName(answers: Record<string, AnswerValue>, row: Record<string, unknown>): string {
  const a = (k: string) => {
    const v = answers?.[k]
    return typeof v === "string" ? v.trim() : ""
  }
  const fromAnswers = [a("last_name"), a("first_name")].filter(Boolean).join(" ")
  if (fromAnswers) return fromAnswers

  const fromProfile = [row.u_last, row.u_first]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .join(" ")
  if (fromProfile) return fromProfile

  const name = row.u_name as string | null
  if (name && name.trim()) return name.trim()
  return (row.email as string | null) ?? "—"
}

function toSummary(row: Record<string, unknown>): ApplicationSummary {
  const answers = (row.answers as Record<string, AnswerValue>) ?? {}
  return {
    id: row.id as string,
    status: row.status as ApplicationStatus,
    cohort: row.cohort as string,
    submittedAt: row.submitted_at ? new Date(row.submitted_at as string) : null,
    createdAt: new Date(row.created_at as string),
    applicant: toApplicant(row),
    fullName: deriveFullName(answers, row),
    fileCount: Number(row.file_count ?? 0),
  }
}

export class ApplicationsService {
  // ── Elev (owner) ────────────────────────────────────────────────────────────

  static async getForUser(userId: string): Promise<Application | null> {
    const cohort = await currentCohort()
    const [row] = await sql`
      SELECT * FROM applications WHERE user_id = ${userId} AND cohort = ${cohort}
    `
    return row ? toApplication(row) : null
  }

  static async getOrCreateDraft(userId: string): Promise<Application> {
    const existing = await this.getForUser(userId)
    if (existing) return existing

    const cohort = await currentCohort()
    const [row] = await sql`
      INSERT INTO applications (user_id, cohort)
      VALUES (${userId}, ${cohort})
      ON CONFLICT (user_id, cohort) DO UPDATE SET updated_at = NOW()
      RETURNING *
    `
    return toApplication(row)
  }

  static async saveAnswers(userId: string, answers: Record<string, AnswerValue>): Promise<Application> {
    const app = await this.getOrCreateDraft(userId)
    if (app.status !== "draft") {
      throw new ApplicationError("Aplicația a fost deja trimisă și nu mai poate fi editată.", 409)
    }
    const [row] = await sql`
      UPDATE applications
      SET answers = ${JSON.stringify(answers)}::jsonb, updated_at = NOW()
      WHERE id = ${app.id}
      RETURNING *
    `
    return toApplication(row)
  }

  static async submit(userId: string): Promise<Application> {
    if (!(await SettingsService.getApplicationsOpen())) {
      throw new ApplicationError("Înscrierile sunt închise momentan.", 403)
    }
    const app = await this.getOrCreateDraft(userId)
    if (app.status !== "draft") {
      throw new ApplicationError("Aplicația a fost deja trimisă.", 409)
    }

    const files = await FilesService.listForApplication(app.id)
    const fileKeys = new Set(files.map((f) => f.fieldKey))
    const missing = this.missingRequired(FORM_SCHEMA, app.answers, fileKeys)
    if (missing.length > 0) {
      throw new ApplicationError(`Completează câmpurile obligatorii: ${missing.join(", ")}`, 400)
    }

    const [row] = await sql`
      UPDATE applications
      SET status = 'submitted', submitted_at = NOW(), updated_at = NOW()
      WHERE id = ${app.id}
      RETURNING *
    `
    return toApplication(row)
  }

  private static missingRequired(
    sections: FormSection[],
    answers: Record<string, AnswerValue>,
    fileKeys: Set<string>
  ): string[] {
    const missing: string[] = []
    for (const section of sections) {
      for (const field of section.fields) {
        // Câmpurile derivate (ex. statut orfan) nu se completează manual.
        if (field.derived) continue
        if (!field.required) continue
        // Câmpurile ascunse de condiții (ex. venit părinte decedat) nu se cer.
        if (!isFieldVisible(field, answers)) continue
        if (field.type === "file") {
          if (!fileKeys.has(field.key)) missing.push(field.label)
          continue
        }
        // Consimțăminte: trebuie bifate explicit (true).
        if (field.requiredTrue) {
          if (answers[field.key] !== true) missing.push(field.label)
          continue
        }
        const v = answers[field.key]
        const empty =
          v === undefined ||
          v === null ||
          v === "" ||
          (Array.isArray(v) && v.length === 0) ||
          (field.type === "boolean" && typeof v !== "boolean")
        if (empty) missing.push(field.label)
      }
    }
    return missing
  }

  // ── Admin ────────────────────────────────────────────────────────────────────

  static async listAll(): Promise<ApplicationSummary[]> {
    const cohort = await currentCohort()
    const rows = await sql`
      SELECT
        a.id, a.status, a.cohort, a.submitted_at, a.created_at, a.answers,
        u.id AS u_id, u.email, u.name AS u_name,
        u.first_name AS u_first, u.last_name AS u_last, u.phone,
        (SELECT COUNT(*) FROM application_files f WHERE f.application_id = a.id) AS file_count
      FROM applications a
      JOIN users u ON u.id = a.user_id
      WHERE a.cohort = ${cohort} AND a.status <> 'draft'
      ORDER BY a.submitted_at DESC NULLS LAST, a.created_at DESC
    `
    return rows.map(toSummary)
  }

  static async getDetail(id: string): Promise<ApplicationDetail | null> {
    const [row] = await sql`
      SELECT
        a.*,
        u.id AS u_id, u.email, u.name AS u_name,
        u.first_name AS u_first, u.last_name AS u_last, u.phone
      FROM applications a
      JOIN users u ON u.id = a.user_id
      WHERE a.id = ${id}
    `
    if (!row) return null

    const files = await FilesService.listForApplication(id)

    return {
      ...toApplication(row),
      applicant: toApplicant(row),
      files,
      sections: FORM_SCHEMA,
    }
  }

  static async getById(id: string): Promise<Application | null> {
    const [row] = await sql`SELECT * FROM applications WHERE id = ${id}`
    return row ? toApplication(row) : null
  }

  // Date minime pentru scoring: id + nume + email + status + răspunsuri, într-un query.
  static async listForScoring(): Promise<
    { id: string; fullName: string; email: string | null; status: ApplicationStatus; answers: Record<string, AnswerValue> }[]
  > {
    const cohort = await currentCohort()
    const rows = await sql`
      SELECT
        a.id, a.status, a.answers, a.cover_letter_score, a.recommendation_letter_score,
        u.email, u.name AS u_name, u.first_name AS u_first, u.last_name AS u_last
      FROM applications a
      JOIN users u ON u.id = a.user_id
      WHERE a.cohort = ${cohort} AND a.status <> 'draft'
      ORDER BY a.submitted_at DESC NULLS LAST, a.created_at DESC
    `
    return rows.map((row) => {
      const answers = { ...((row.answers as Record<string, AnswerValue>) ?? {}) }
      // Injectează notele manuale ale scrisorilor ca răspunsuri „derivate" pentru scoring.
      if (row.cover_letter_score != null) answers.cover_letter_score = Number(row.cover_letter_score)
      if (row.recommendation_letter_score != null)
        answers.recommendation_letter_score = Number(row.recommendation_letter_score)
      return {
        id: row.id as string,
        fullName: deriveFullName(answers, row),
        email: (row.email as string | null) ?? null,
        status: row.status as ApplicationStatus,
        answers,
      }
    })
  }

  static async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    if (!STATUSES.includes(status)) throw new ApplicationError(`Status invalid: ${status}`)
    const [row] = await sql`
      UPDATE applications SET status = ${status}, updated_at = NOW() WHERE id = ${id} RETURNING *
    `
    if (!row) throw new ApplicationError("Aplicația nu există", 404)
    return toApplication(row)
  }

  // Notele manuale (1–3) ale scrisorilor — doar SUPER_USER (impus în rută). `null` = neacordată.
  static async setLetterScores(id: string, scores: LetterScores): Promise<Application> {
    const validate = (v: number | null, label: string): number | null => {
      if (v === null) return null
      if (!Number.isInteger(v) || v < 1 || v > 3) throw new ApplicationError(`${label} trebuie să fie 1, 2 sau 3`)
      return v
    }
    const cover = validate(scores.coverLetterScore, "Nota scrisorii de intenție")
    const reco = validate(scores.recommendationLetterScore, "Nota scrisorii de recomandare")
    const [row] = await sql`
      UPDATE applications
      SET cover_letter_score = ${cover}, recommendation_letter_score = ${reco}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    if (!row) throw new ApplicationError("Aplicația nu există", 404)
    return toApplication(row)
  }
}
