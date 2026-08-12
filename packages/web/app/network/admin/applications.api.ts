import { apiRequest } from "../utils/request"
import type { ApplicationSummary, ApplicationDetail, ApplicationStatus } from "@fm/shared"

export const adminApplicationsApi = {
  list: () => apiRequest<ApplicationSummary[]>("/api/admin/applications"),

  get: (id: string) => apiRequest<ApplicationDetail>(`/api/admin/applications/${id}`),

  setStatus: (id: string, status: ApplicationStatus) =>
    apiRequest<ApplicationDetail>(`/api/admin/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  fileUrl: (id: string, fileId: string) =>
    apiRequest<{ url: string }>(`/api/admin/applications/${id}/files/${fileId}`),
}
