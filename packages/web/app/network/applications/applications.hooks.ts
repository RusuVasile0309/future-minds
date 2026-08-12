"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { applicationsApi } from "./applications.api"
import type { AnswerValue } from "@fm/shared"

const MY_APP_KEY = ["application", "me"]

export function useMyApplication() {
  return useQuery({
    queryKey: MY_APP_KEY,
    queryFn: async () => {
      const res = await applicationsApi.getMine()
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })
}

// Salvarea nu invalidează cache-ul (starea e ținută local în renderer, ca să nu
// se piardă focusul); se folosește pentru auto-save.
export function useSaveApplication() {
  return useMutation({
    mutationFn: (answers: Record<string, AnswerValue>) => applicationsApi.save(answers),
  })
}

export function useSubmitApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => applicationsApi.submit(),
    onSuccess: () => qc.invalidateQueries({ queryKey: MY_APP_KEY }),
  })
}

export function useUploadFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ file, fieldKey }: { file: File; fieldKey: string }) =>
      applicationsApi.uploadFile(file, fieldKey),
    onSuccess: () => qc.invalidateQueries({ queryKey: MY_APP_KEY }),
  })
}

export function useDeleteFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => applicationsApi.deleteFile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: MY_APP_KEY }),
  })
}
