import { sql } from "../../database/db"
import { SettingsService } from "../settings/settings.service"
import { FORM_SCHEMA } from "@fm/shared"
import { ApplicationsService } from "../applications/applications.service"
import { DEFAULT_INCOME_CONFIG, INCOME_KEY, rankAll, type ScoreInput } from "./scoring"
import type {
  RankingConfig,
  RankingCriterion,
  RankingVersion,
  ScoredApplication,
  FormSection,
  FormField,
} from "@fm/shared"

export class RankingError extends Error {
  constructor(message: string, public code: number = 400) {
    super(message)
    this.name = "RankingError"
  }
}

async function currentCohort(): Promise<string> {
  return (await SettingsService.getCurrentCohort()) ?? "default"
}

function toVersion(row: Record<string, unknown>): RankingVersion {
  return {
    id: row.id as string,
    version: row.version as number,
    cohort: (row.cohort as string | null) ?? null,
    config: row.config as RankingConfig,
    isActive: row.is_active as boolean,
    publishedAt: row.published_at ? new Date(row.published_at as string) : null,
    publishedBy: (row.published_by as string | null) ?? null,
  }
}

// Interval numeric implicit: din validarea câmpului, altfel după semantica cheii.
function numericRange(field: FormField): { min: number; max: number } {
  const v = field.validation
  if (typeof v?.min === "number" && typeof v?.max === "number") return { min: v.min, max: v.max }
  if (/medi|average|grade|nota/i.test(field.key)) return { min: 1, max: 10 }
  return { min: 0, max: 100 }
}

// Construiește un config implicit din câmpurile marcate „scorabil" în schemă.
function buildDefaultConfig(sections: FormSection[]): RankingConfig {
  const criteria: RankingCriterion[] = [
    {
      id: "income",
      fieldKey: INCOME_KEY,
      label: "Venit net / membru de familie",
      kind: "income",
      weight: 3,
      enabled: true,
      direction: "lower",
      min: 0,
      max: 4000,
    },
  ]

  for (const section of sections) {
    for (const field of section.fields) {
      if (!field.scorable || field.archived) continue
      if (field.type === "number") {
        const { min, max } = numericRange(field)
        criteria.push({
          id: field.id,
          fieldKey: field.key,
          label: field.label,
          kind: "numeric",
          weight: 1,
          enabled: true,
          direction: "higher",
          min,
          max,
        })
      } else if (field.type === "boolean") {
        criteria.push({
          id: field.id,
          fieldKey: field.key,
          label: field.label,
          kind: "boolean",
          weight: 1,
          enabled: true,
          bonus: 1,
        })
      } else if (field.type === "select" || field.type === "multiselect") {
        const optionScores: Record<string, number> = {}
        for (const o of field.options ?? []) {
          // Mediul rural primește bonus implicit; restul pornesc de la 0.
          optionScores[o.value] = field.key === "environment" && o.value === "rural" ? 1 : 0
        }
        criteria.push({
          id: field.id,
          fieldKey: field.key,
          label: field.label,
          kind: "option",
          weight: 1,
          enabled: true,
          optionScores,
        })
      }
    }
  }

  return {
    criteria,
    eligibility: [],
    tieBreakers: [{ fieldKey: INCOME_KEY, direction: "lower" }],
    income: DEFAULT_INCOME_CONFIG,
  }
}

export class RankingService {
  // Config de lucru al cohortei curente; dacă nu există, se generează din schema
  // curentă (fără a-l persista — se salvează la prima editare).
  static async getConfig(): Promise<RankingConfig> {
    const cohort = await currentCohort()
    const [row] = await sql`SELECT config FROM ranking_configs WHERE cohort = ${cohort}`
    if (row) return row.config as RankingConfig
    return buildDefaultConfig(FORM_SCHEMA)
  }

  static async saveConfig(config: RankingConfig): Promise<RankingConfig> {
    const cohort = await currentCohort()
    const json = JSON.stringify(config)
    await sql`
      INSERT INTO ranking_configs (cohort, config, updated_at)
      VALUES (${cohort}, ${json}::jsonb, NOW())
      ON CONFLICT (cohort) DO UPDATE SET config = ${json}::jsonb, updated_at = NOW()
    `
    return config
  }

  static async publish(publishedBy: string): Promise<RankingVersion> {
    const config = await this.getConfig()
    if (config.criteria.filter((c) => c.enabled && c.weight > 0).length === 0) {
      throw new RankingError("Configurează cel puțin un criteriu activ înainte de publicare")
    }
    const cohort = await currentCohort()
    const [{ next }] = await sql`SELECT COALESCE(MAX(version) + 1, 1) AS next FROM ranking_versions`
    const json = JSON.stringify(config)

    await sql`UPDATE ranking_versions SET is_active = FALSE WHERE is_active = TRUE`
    const [row] = await sql`
      INSERT INTO ranking_versions (version, cohort, config, is_active, published_at, published_by)
      VALUES (${next as number}, ${cohort}, ${json}::jsonb, TRUE, NOW(), ${publishedBy})
      RETURNING *
    `
    return toVersion(row)
  }

  static async getActiveVersion(): Promise<RankingVersion | null> {
    const [row] = await sql`SELECT * FROM ranking_versions WHERE is_active = TRUE`
    return row ? toVersion(row) : null
  }

  static async listVersions(): Promise<RankingVersion[]> {
    const rows = await sql`SELECT * FROM ranking_versions ORDER BY version DESC`
    return rows.map(toVersion)
  }

  // Clasamentul candidaților. Folosește config-ul cerut ("draft" = de lucru, altfel
  // versiunea activă publicată, cu fallback pe config-ul de lucru).
  static async getResults(source: "draft" | "active" = "active"): Promise<{
    config: RankingConfig
    results: ScoredApplication[]
  }> {
    const config =
      source === "draft" ? await this.getConfig() : (await this.getActiveVersion())?.config ?? (await this.getConfig())

    const rows = await ApplicationsService.listForScoring()
    const inputs: ScoreInput[] = rows.map((r) => ({
      applicationId: r.id,
      fullName: r.fullName,
      email: r.email,
      status: r.status,
      answers: r.answers,
    }))

    return { config, results: rankAll(config, inputs) }
  }
}
