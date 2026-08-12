import { sql } from "../../database/db"

const APPLICATIONS_OPEN_KEY = "applications_open"
const CURRENT_COHORT_KEY = "current_cohort"

export class SettingsService {
  static async getSetting<T = unknown>(key: string): Promise<T | null> {
    const [row] = await sql`SELECT value FROM app_settings WHERE key = ${key}`
    return row ? (row.value as T) : null
  }

  static async setSetting(key: string, value: unknown): Promise<void> {
    const json = JSON.stringify(value)
    await sql`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES (${key}, ${json}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${json}::jsonb, updated_at = NOW()
    `
  }

  // Fereastra de înscriere. Implicit închisă până e deschisă explicit.
  static async getApplicationsOpen(): Promise<boolean> {
    const value = await this.getSetting<boolean>(APPLICATIONS_OPEN_KEY)
    return value === true
  }

  static async setApplicationsOpen(open: boolean): Promise<void> {
    await this.setSetting(APPLICATIONS_OPEN_KEY, open)
  }

  // Cohorta curentă (ex. "2026"). Folosită la publicarea versiunilor și la aplicații.
  static async getCurrentCohort(): Promise<string | null> {
    return this.getSetting<string>(CURRENT_COHORT_KEY)
  }

  static async setCurrentCohort(cohort: string): Promise<void> {
    await this.setSetting(CURRENT_COHORT_KEY, cohort)
  }
}
