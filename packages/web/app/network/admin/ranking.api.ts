import { apiRequest } from "../utils/request"
import type { RankingConfig, RankingVersion, ScoredApplication } from "@fm/shared"

export interface RankingResults {
  config: RankingConfig
  results: ScoredApplication[]
}

export const rankingApi = {
  getConfig: () => apiRequest<RankingConfig>("/api/admin/ranking/config"),

  saveConfig: (config: RankingConfig) =>
    apiRequest<RankingConfig>("/api/admin/ranking/config", { method: "PUT", body: JSON.stringify(config) }),

  publish: () => apiRequest<RankingVersion>("/api/admin/ranking/publish", { method: "POST" }),

  getResults: (source: "draft" | "active" = "active") =>
    apiRequest<RankingResults>(`/api/admin/ranking/results?source=${source}`),

  getVersions: () => apiRequest<RankingVersion[]>("/api/admin/ranking/versions"),
}
