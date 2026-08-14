import { apiRequest } from "../utils/request"
import type { ApplicationSummary, ApplicationDetail, ApplicationStatus, LetterScores } from "@fm/shared"

export const adminApplicationsApi = {
  list: () => apiRequest<ApplicationSummary[]>("/api/admin/applications"),

  get: (id: string) => apiRequest<ApplicationDetail>(`/api/admin/applications/${id}`),

  setStatus: (id: string, status: ApplicationStatus) =>
    apiRequest<ApplicationDetail>(`/api/admin/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  setLetterScores: (id: string, scores: LetterScores) =>
    apiRequest<ApplicationDetail>(`/api/admin/applications/${id}/scores`, {
      method: "PATCH",
      body: JSON.stringify(scores),
    }),

  fileUrl: (id: string, fileId: string) =>
    apiRequest<{ url: string }>(`/api/admin/applications/${id}/files/${fileId}`),
}
