"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, FileText, Trash2, Loader2, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useUploadFile, useDeleteFile } from "@/app/network/applications"
import { resolveFieldOptions } from "@/lib/content/form-options"
import type { AnswerValue, ApplicationFile, FormField } from "@fm/shared"

export function FieldInput({
  field,
  value,
  onChange,
  files,
  answers,
  disabled,
}: {
  field: FormField
  value: AnswerValue
  onChange: (v: AnswerValue) => void
  files: ApplicationFile[]
  answers: Record<string, AnswerValue>
  disabled?: boolean
}) {
  const options = resolveFieldOptions(field, answers)

  // Câmp calculat automat (ex.: media Bac) — read-only, valoarea vine din `answers`.
  if (field.computed) {
    return (
      <Input
        type="number"
        value={(value as number | string) ?? ""}
        readOnly
        disabled
        placeholder="Se calculează automat"
        className="bg-secondary/40"
      />
    )
  }

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
          placeholder={field.helpText ?? ""}
        />
      )

    case "number":
      return (
        <Input
          type="number"
          value={(value as number | string) ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          disabled={disabled}
          min={field.validation?.min}
          max={field.validation?.max}
          step="any"
        />
      )

    case "date":
      return <DateSelect value={(value as string) ?? null} onChange={onChange} disabled={disabled} />


    case "email":
      return (
        <Input type="email" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      )

    case "phone":
      return (
        <Input type="tel" value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
      )

    case "boolean":
      return (
        <div className="flex gap-2">
          {[
            { v: true, label: "Da" },
            { v: false, label: "Nu" },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.v)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                value === opt.v
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )

    case "select": {
      // Câmp în cascadă fără opțiuni încă (părinte necompletat).
      const waitingForParent = !!field.optionsSource && options.length === 0
      return (
        <CustomSelect
          ariaLabel={field.label}
          placeholder={waitingForParent ? "Alege mai întâi câmpul anterior…" : "Alege…"}
          disabled={disabled || waitingForParent}
          value={(value as string) ?? null}
          options={options}
          onChange={(v) => onChange(v)}
        />
      )
    }

    case "multiselect": {
      const arr = Array.isArray(value) ? (value as string[]) : []
      return (
        <div className="flex flex-col gap-2">
          {options.map((o) => {
            const checked = arr.includes(o.value)
            return (
              <label key={o.value} className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onChange(checked ? arr.filter((x) => x !== o.value) : [...arr, o.value])}
                  className="size-4 rounded border-input accent-[color:hsl(var(--primary))]"
                />
                {o.label}
              </label>
            )
          })}
        </div>
      )
    }

    case "file":
      return <FileField field={field} files={files} disabled={disabled} />

    default:
      return (
        <Input
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          minLength={field.validation?.minLength}
          maxLength={field.validation?.maxLength}
        />
      )
  }
}

function FileField({ field, files, disabled }: { field: FormField; files: ApplicationFile[]; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useUploadFile()
  const del = useDeleteFile()
  const [error, setError] = useState<string | null>(null)
  const mine = files.filter((f) => f.fieldKey === field.key)

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files
    if (!picked || picked.length === 0) return
    setError(null)
    // Încărcare secvențială (fiecare fișier = un POST); câmpul poate accepta mai multe.
    for (const file of Array.from(picked)) {
      const res = await upload.mutateAsync({ file, fieldKey: field.key })
      if (!res.success) {
        setError(res.error)
        break
      }
    }
    if (inputRef.current) inputRef.current.value = ""
  }

  const centered = field.align === "center"

  return (
    <div className={centered ? "text-center" : undefined}>
      <div className={`flex flex-wrap items-center gap-2 ${centered ? "justify-center" : ""}`}>
        <input
          ref={inputRef}
          type="file"
          multiple={field.multiple}
          className="hidden"
          onChange={onPick}
          accept={field.validation?.fileTypes?.map((t) => `.${t}`).join(",")}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled || upload.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Încarcă {field.multiple ? "fișiere" : "fișier"}
        </Button>
      </div>
      {field.validation?.maxSizeMB ? (
        <p className="mt-1.5 text-xs text-muted-foreground">max {field.validation.maxSizeMB} MB</p>
      ) : null}

      {mine.length > 0 ? (
        <ul className="mt-3 space-y-2 text-left">
          {mine.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <FileText className="size-4 shrink-0 text-primary" />
                <span className="truncate">{f.fileName}</span>
              </span>
              {!disabled ? (
                <button
                  onClick={() => del.mutate(f.id)}
                  className="rounded p-1 text-muted-foreground hover:text-destructive"
                  aria-label="Șterge fișierul"
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

// ── Selector de dată prietenos (Zi / Lună / An) — pentru data nașterii ─────────

const MONTHS_RO = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
]

interface DateParts {
  y: number | null
  m: number | null
  d: number | null
}

function parseISO(v: string | null): DateParts {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v ?? "")
  return m ? { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) } : { y: null, m: null, d: null }
}

const pad = (n: number) => String(n).padStart(2, "0")

// Zile valide într-o lună (ține cont de ani bisecți când avem anul).
function daysInMonth(year: number | null, month: number | null): number {
  if (!month) return 31
  return new Date(year ?? 2001, month, 0).getDate()
}

function DateSelect({
  value,
  onChange,
  disabled,
}: {
  value: string | null
  onChange: (v: AnswerValue) => void
  disabled?: boolean
}) {
  const [parts, setParts] = useState<DateParts>(() => parseISO(value))

  // Sincronizează starea locală când sosește o valoare completă din exterior
  // (ex. la încărcarea draft-ului). Selecțiile parțiale nu se pierd.
  useEffect(() => {
    const p = parseISO(value)
    if (p.y && p.m && p.d) setParts(p)
  }, [value])

  const now = new Date()
  const maxYear = now.getFullYear() - 15
  const minYear = now.getFullYear() - 70
  const years: number[] = []
  for (let y = maxYear; y >= minYear; y--) years.push(y)
  const days = Array.from({ length: daysInMonth(parts.y, parts.m) }, (_, i) => i + 1)

  function update(next: DateParts) {
    // Corectează ziua dacă luna/anul o fac invalidă (ex. 31 → 30, 29 feb).
    let d = next.d
    if (d && next.m) {
      const max = daysInMonth(next.y, next.m)
      if (d > max) d = max
    }
    const fixed = { ...next, d }
    setParts(fixed)
    onChange(fixed.y && fixed.m && fixed.d ? `${fixed.y}-${pad(fixed.m)}-${pad(fixed.d)}` : null)
  }

  const toNum = (v: string | null) => (v ? Number(v) : null)

  return (
    <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-2">
      <CustomSelect
        ariaLabel="Ziua"
        placeholder="Zi"
        disabled={disabled}
        value={parts.d != null ? String(parts.d) : null}
        options={days.map((d) => ({ value: String(d), label: String(d) }))}
        onChange={(v) => update({ ...parts, d: toNum(v) })}
      />
      <CustomSelect
        ariaLabel="Luna"
        placeholder="Lună"
        disabled={disabled}
        value={parts.m != null ? String(parts.m) : null}
        options={MONTHS_RO.map((label, i) => ({ value: String(i + 1), label }))}
        onChange={(v) => update({ ...parts, m: toNum(v) })}
      />
      <CustomSelect
        ariaLabel="Anul"
        placeholder="An"
        disabled={disabled}
        value={parts.y != null ? String(parts.y) : null}
        options={years.map((y) => ({ value: String(y), label: String(y) }))}
        onChange={(v) => update({ ...parts, y: toNum(v) })}
      />
    </div>
  )
}

// ── Dropdown custom cu înălțime maximă și scroll (înlocuiește <select> nativ) ──

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  ariaLabel,
}: {
  value: string | null
  onChange: (v: string | null) => void
  options: { value: string; label: string }[]
  placeholder: string
  disabled?: boolean
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    // Derulează DOAR în interiorul listei la opțiunea selectată (fără să miște
    // scroll-ul paginii — `scrollIntoView` centra tot viewport-ul, cauzând un salt).
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>("[data-active='true']")
    if (list && active) {
      list.scrollTop = active.offsetTop - list.clientHeight / 2 + active.clientHeight / 2
    }
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between gap-1 rounded-lg border border-input bg-background px-3 text-sm transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg"
        >
          {options.map((o) => {
            const active = o.value === value
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  data-active={active}
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors hover:bg-secondary ${
                    active ? "bg-secondary font-medium text-primary" : "text-foreground"
                  }`}
                >
                  {o.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
