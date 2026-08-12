import { apiRequest } from "../utils/request"
import type { Application, ApplicationFile, AnswerValue } from "@fm/shared"

export type MyApplication = Application & { files: ApplicationFile[] }

export const applicationsApi = {
  getMine: () => apiRequest<MyApplication>("/api/applications/me"),

  save: (answers: Record<string, AnswerValue>) =>
    apiRequest<Application>("/api/applications/me", { method: "PUT", body: JSON.stringify({ answers }) }),

  submit: () => apiRequest<Application>("/api/applications/me/submit", { method: "POST" }),

  // Upload multipart — fără header JSON, browser-ul setează boundary-ul.
  uploadFile: (file: File, fieldKey: string) => {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("fieldKey", fieldKey)
    return apiRequest<ApplicationFile>("/api/applications/me/files", {
      method: "POST",
      body: fd,
      headers: {}, // suprascrie Content-Type: application/json din apiRequest
    })
  },

  deleteFile: (id: string) => apiRequest(`/api/applications/me/files/${id}`, { method: "DELETE" }),

  fileUrl: (id: string) => apiRequest<{ url: string }>(`/api/applications/me/files/${id}`),
}
