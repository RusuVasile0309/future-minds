"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { rankingApi } from "./ranking.api"
import type { RankingConfig } from "@fm/shared"

const CONFIG_KEY = ["admin", "ranking", "config"]
const VERSIONS_KEY = ["admin", "ranking", "versions"]
const resultsKey = (source: "draft" | "active") => ["admin", "ranking", "results", source]

export function useRankingConfig() {
  return useQuery({
    queryKey: CONFIG_KEY,
    queryFn: async () => {
      const res = await rankingApi.getConfig()
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })
}

export function useRankingResults(source: "draft" | "active") {
  return useQuery({
    queryKey: resultsKey(source),
    queryFn: async () => {
      const res = await rankingApi.getResults(source)
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })
}

export function useSaveRankingConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (config: RankingConfig) => rankingApi.saveConfig(config),
    onSuccess: (res) => {
      if (!res.success) return
      qc.invalidateQueries({ queryKey: CONFIG_KEY })
      qc.invalidateQueries({ queryKey: resultsKey("draft") })
    },
  })
}

export function usePublishRanking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => rankingApi.publish(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: VERSIONS_KEY })
      qc.invalidateQueries({ queryKey: resultsKey("active") })
    },
  })
}

export function useRankingVersions() {
  return useQuery({
    queryKey: VERSIONS_KEY,
    queryFn: async () => {
      const res = await rankingApi.getVersions()
      if (!res.success) throw new Error(res.error)
      return res.data!
    },
  })
}
