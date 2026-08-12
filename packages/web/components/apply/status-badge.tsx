import type { ApplicationStatus } from "@fm/shared"

const MAP: Record<ApplicationStatus, { label: string; cls: string }> = {
  draft: { label: "Ciornă", cls: "bg-secondary text-muted-foreground" },
  submitted: { label: "Trimisă", cls: "bg-brand-primary/10 text-brand-primary dark:text-primary" },
  under_review: { label: "În evaluare", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  accepted: { label: "Acceptată", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  rejected: { label: "Respinsă", cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" },
  waitlist: { label: "Listă de așteptare", cls: "bg-secondary text-brand-deep dark:text-primary" },
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const s = MAP[status]
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>{s.label}</span>
}
