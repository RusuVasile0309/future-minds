import { apiRequest } from "../utils/request"
import type { User, UserRole, AdminSettings } from "@fm/shared"

export const usersApi = {
  list: () => apiRequest<User[]>("/api/admin/users"),

  setRole: (id: string, role: UserRole) =>
    apiRequest<User>(`/api/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),

  remove: (id: string) => apiRequest(`/api/admin/users/${id}`, { method: "DELETE" }),
}

export const settingsApi = {
  get: () => apiRequest<AdminSettings>("/api/admin/settings"),

  update: (patch: Partial<AdminSettings>) =>
    apiRequest<AdminSettings>("/api/admin/settings", { method: "PUT", body: JSON.stringify(patch) }),
}
