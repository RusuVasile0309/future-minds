// Public surface of @fm/server — imported directly into Next.js routes.
export { sql } from "./database/db"
export { AuthService } from "./modules/auth/auth.service"
export { SettingsService } from "./modules/settings/settings.service"
export { ApplicationsService, ApplicationError } from "./modules/applications/applications.service"
export { FilesService } from "./modules/files/files.service"
export { RankingService, RankingError } from "./modules/ranking/ranking.service"
export { computeIncomePerMember, rankAll, INCOME_KEY, DEFAULT_INCOME_CONFIG } from "./modules/ranking/scoring"
export { StorageError, ALLOWED_DOC_TYPES } from "./lib/storage"

// Further service modules are re-exported here as they are added (users).
