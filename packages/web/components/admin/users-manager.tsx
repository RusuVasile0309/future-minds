"use client"

import { useMemo, useState } from "react"
import { Loader2, Search, Trash2 } from "lucide-react"
import { useUsers, useSetUserRole, useDeleteUser } from "@/app/network/admin"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { User, UserRole } from "@fm/shared"

const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: "Student",
  ADMIN: "Admin",
  SUPER_USER: "Super user",
}

const ROLE_BADGE: Record<UserRole, string> = {
  STUDENT: "bg-secondary text-muted-foreground",
  ADMIN: "bg-brand-primary/10 text-brand-primary dark:text-primary",
  SUPER_USER: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
}

function fullName(u: User): string {
  const composed = [u.lastName, u.firstName].filter(Boolean).join(" ")
  return composed || u.name || "—"
}

export function UsersManager({ currentUserId, canManage }: { currentUserId: string; canManage: boolean }) {
  const { data, isLoading, error } = useUsers()
  const setRole = useSetUserRole()
  const removeUser = useDeleteUser()
  const [query, setQuery] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data ?? []
    return (data ?? []).filter(
      (u) => fullName(u).toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q)
    )
  }, [data, query])

  if (isLoading) return <p className="text-muted-foreground">Se încarcă utilizatorii…</p>
  if (error) return <p className="text-destructive">Nu am putut încărca utilizatorii.</p>

  async function changeRole(id: string, role: UserRole) {
    setActionError(null)
    setBusyId(id)
    const res = await setRole.mutateAsync({ id, role })
    setBusyId(null)
    if (!res.success) setActionError(res.error)
  }

  async function handleDelete(u: User) {
    setActionError(null)
    if (!confirm(`Ștergi definitiv utilizatorul ${fullName(u)} (${u.email ?? "fără email"})? Aplicația și documentele lui se șterg odată cu el.`)) {
      return
    }
    setBusyId(u.id)
    const res = await removeUser.mutateAsync(u.id)
    setBusyId(null)
    if (!res.success) setActionError(res.error)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {rows.length} {rows.length === 1 ? "utilizator" : "utilizatori"}
        </p>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Caută nume sau email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {actionError ? <p className="mt-3 text-sm text-destructive">{actionError}</p> : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Utilizator</th>
                <th className="px-5 py-3 font-medium">Rol</th>
                <th className="px-5 py-3 font-medium">Cont creat</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((u) => {
                const isSelf = u.id === currentUserId
                const busy = busyId === u.id
                return (
                  <tr key={u.id} className={cn("hover:bg-secondary/40", isSelf && "bg-secondary/30")}>
                    <td className="px-5 py-4">
                      <span className="font-medium">
                        {fullName(u)}
                        {isSelf ? <span className="ml-2 text-xs text-muted-foreground">(tu)</span> : null}
                      </span>
                      <span className="block text-xs text-muted-foreground">{u.email ?? "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      {canManage && !isSelf ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            disabled={busy}
                            onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
                          >
                            {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                              <option key={r} value={r}>
                                {ROLE_LABELS[r]}
                              </option>
                            ))}
                          </select>
                          {busy ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
                        </div>
                      ) : (
                        <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", ROLE_BADGE[u.role])}>
                          {ROLE_LABELS[u.role]}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString("ro-RO", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {canManage && !isSelf ? (
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={busy}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-destructive disabled:opacity-50"
                        >
                          <Trash2 className="size-3.5" /> Șterge
                        </button>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Niciun utilizator găsit.</p>
        ) : null}
      </div>

      {!canManage ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Doar un <strong>Super user</strong> poate schimba roluri sau șterge utilizatori.
        </p>
      ) : null}
    </div>
  )
}
