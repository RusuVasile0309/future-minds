import { apiRequest } from "../utils/request"
import type { ApplicationSummary, ApplicationDetail, ApplicationStatus, EvaluatorScores } from "@fm/shared"

export const adminApplicationsApi = {
  list: () => apiRequest<ApplicationSummary[]>("/api/admin/applications"),

  get: (id: string) => apiRequest<ApplicationDetail>(`/api/admin/applications/${id}`),

  setStatus: (id: string, status: ApplicationStatus) =>
    apiRequest<ApplicationDetail>(`/api/admin/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  setEvaluatorScores: (id: string, scores: EvaluatorScores) =>
    apiRequest<ApplicationDetail>(`/api/admin/applications/${id}/scores`, {
      method: "PATCH",
      body: JSON.stringify(scores),
    }),

  fileUrl: (id: string, fileId: string) =>
    apiRequest<{ url: string }>(`/api/admin/applications/${id}/files/${fileId}`),

  remove: (id: string) => apiRequest(`/api/admin/applications/${id}`, { method: "DELETE" }),
}
