"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// 0 = toate rândurile pe o singură pagină.
const PAGE_SIZES = [25, 50, 100, 0] as const

// Paginare pe client: întoarce felia curentă + starea pentru <Pagination />.
// Revine la prima pagină când se schimbă numărul total (ex. la căutare/filtrare).
export function usePagination<T>(items: T[], defaultSize = 50) {
  const [pageSize, setPageSize] = useState<number>(defaultSize)
  const [page, setPage] = useState(0)

  const pageCount = pageSize ? Math.max(1, Math.ceil(items.length / pageSize)) : 1

  useEffect(() => setPage(0), [items.length, pageSize])

  const pageItems = useMemo(
    () => (pageSize ? items.slice(page * pageSize, (page + 1) * pageSize) : items),
    [items, page, pageSize]
  )

  return { pageItems, page, pageCount, pageSize, setPage, setPageSize, total: items.length }
}

export function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  setPage,
  setPageSize,
}: Omit<ReturnType<typeof usePagination>, "pageItems">) {
  if (total === 0) return null
  const from = pageSize ? page * pageSize + 1 : 1
  const to = pageSize ? Math.min(total, (page + 1) * pageSize) : total

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>Pe pagină:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s || "Toți"}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          {from}–{to} din {total}
        </span>
        {pageCount > 1 ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="rounded-md p-1 hover:bg-secondary hover:text-foreground disabled:opacity-40"
              aria-label="Pagina anterioară"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="tabular-nums">
              {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={page >= pageCount - 1}
              className="rounded-md p-1 hover:bg-secondary hover:text-foreground disabled:opacity-40"
              aria-label="Pagina următoare"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
