"use client"

import { cn } from "@/lib/utils"

export type DonutSlice = {
  id: string
  label: string
  percent: number
  color: string
}

/** Paletă categorială pornind de la albastrurile brandului. */
export const DONUT_PALETTE = [
  "#1650C8",
  "#3B82F6",
  "#8AB4FF",
  "#0B2F7A",
  "#6D9BEF",
  "#0EA5E9",
  "#14B8A6",
  "#F59E0B",
  "#EF6824",
  "#A855F7",
  "#EC4899",
  "#64748B",
  "#B9CDF5",
]

const SIZE = 200
const CENTER = SIZE / 2
const R_OUTER = 92
const R_INNER = 58

function polar(r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)]
}

function segmentPath(rInner: number, rOuter: number, start: number, end: number): string {
  const [x0, y0] = polar(rOuter, start)
  const [x1, y1] = polar(rOuter, end)
  const [x2, y2] = polar(rInner, end)
  const [x3, y3] = polar(rInner, start)
  const large = end - start > 180 ? 1 : 0
  return `M ${x0} ${y0} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${rInner} ${rInner} 0 ${large} 0 ${x3} ${y3} Z`
}

function fmtPct(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

export function CriteriaDonut({
  slices,
  hoveredId,
  onHover,
  onSelect,
  className,
}: {
  slices: DonutSlice[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  className?: string
}) {
  const hovered = slices.find((s) => s.id === hoveredId) ?? null

  // Unghiurile cumulate, pornind din vârf (sus).
  let acc = 0
  const arcs = slices.map((s) => {
    const start = acc * 3.6
    acc += s.percent
    const end = acc * 3.6
    return { ...s, start, end }
  })

  const single = arcs.length === 1

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Distribuția scorului
      </p>

      {slices.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Activează cel puțin un criteriu cu pondere &gt; 0 ca să vezi distribuția.
        </p>
      ) : (
        <>
          <div className="relative mx-auto mt-4 aspect-square w-full max-w-[260px]">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full">
              {single ? (
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={(R_OUTER + R_INNER) / 2}
                  fill="none"
                  stroke={arcs[0].color}
                  strokeWidth={R_OUTER - R_INNER}
                  className="cursor-pointer"
                  onMouseEnter={() => onHover(arcs[0].id)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => onSelect(arcs[0].id)}
                  style={{
                    transformBox: "view-box",
                    transformOrigin: `${CENTER}px ${CENTER}px`,
                    transform: hoveredId === arcs[0].id ? "scale(1.013)" : undefined,
                    transition: "transform 160ms ease",
                  }}
                />
              ) : (
                arcs.map((a) => {
                  const isHover = a.id === hoveredId
                  const dim = hoveredId !== null && !isHover
                  return (
                    <path
                      key={a.id}
                      d={segmentPath(R_INNER, R_OUTER, a.start, a.end)}
                      fill={a.color}
                      className="cursor-pointer"
                      onMouseEnter={() => onHover(a.id)}
                      onMouseLeave={() => onHover(null)}
                      onClick={() => onSelect(a.id)}
                      style={{
                        transformBox: "view-box",
                        transformOrigin: `${CENTER}px ${CENTER}px`,
                        transform: isHover ? "scale(1.013)" : undefined,
                        transition: "transform 160ms ease, opacity 160ms ease",
                        opacity: dim ? 0.45 : 1,
                      }}
                    />
                  )
                })
              )}
            </svg>

            {/* Etichetă centrală */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
              {hovered ? (
                <>
                  <span className="font-serif text-3xl font-semibold text-foreground">
                    {fmtPct(hovered.percent)}%
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">{hovered.label}</span>
                </>
              ) : (
                <>
                  <span className="font-serif text-3xl font-semibold text-foreground">{slices.length}</span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {slices.length === 1 ? "criteriu activ" : "criterii active"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Legendă (click → scroll la criteriu) */}
          <ul className="mt-5 space-y-0.5">
            {arcs.map((a) => {
              const isHover = a.id === hoveredId
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onMouseEnter={() => onHover(a.id)}
                    onMouseLeave={() => onHover(null)}
                    onClick={() => onSelect(a.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                      isHover ? "bg-secondary/70" : "hover:bg-secondary/40"
                    )}
                  >
                    <span
                      className="size-3 shrink-0 rounded-[4px]"
                      style={{ backgroundColor: a.color }}
                    />
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate",
                        isHover ? "font-medium text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {a.label}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-xs tabular-nums",
                        isHover ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {fmtPct(a.percent)}%
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
