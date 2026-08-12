"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminApplicationsApi } from "./applications.api"
import type { ApplicationStatus } from "@fm/shared"

const LIST_KEY = ["admin", "applications"]
const detailKey = (id: string) => ["admin", "application", id]

export function useCandidates() {
  return useQuery({
    queryKey: LIST_KEY,
    queryFn: async () => {
      const res = await adminApplicationsApi.list()
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: detailKey(id),
    queryFn: async () => {
      const res = await adminApplicationsApi.get(id)
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })
}

export function useUpdateCandidateStatus(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (status: ApplicationStatus) => adminApplicationsApi.setStatus(id, status),
    onSuccess: (res) => {
      if (!res.success) return
      qc.invalidateQueries({ queryKey: detailKey(id) })
      qc.invalidateQueries({ queryKey: LIST_KEY })
    },
  })
}
