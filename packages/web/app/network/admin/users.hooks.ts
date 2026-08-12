"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usersApi, settingsApi } from "./users.api"
import type { UserRole, AdminSettings } from "@fm/shared"

const USERS_KEY = ["admin", "users"]
const SETTINGS_KEY = ["admin", "settings"]

export function useUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: async () => {
      const res = await usersApi.list()
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })
}

export function useSetUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => usersApi.setRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => {
      const res = await settingsApi.get()
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<AdminSettings>) => settingsApi.update(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: SETTINGS_KEY }),
  })
}
