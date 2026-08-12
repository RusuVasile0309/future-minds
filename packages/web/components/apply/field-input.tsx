"use client"

import { useRef, useState } from "react"
import { Upload, FileText, Trash2, Loader2 } from "lucide-react"
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
      return (
        <Input
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )

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
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          disabled={disabled || waitingForParent}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">{waitingForParent ? "Alege mai întâi câmpul anterior…" : "Alege…"}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
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
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    const res = await upload.mutateAsync({ file, fieldKey: field.key })
    if (!res.success) setError(res.error)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
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
          Încarcă fișier
        </Button>
        {field.validation?.maxSizeMB ? (
          <span className="text-xs text-muted-foreground">max {field.validation.maxSizeMB} MB</span>
        ) : null}
      </div>

      {mine.length > 0 ? (
        <ul className="mt-3 space-y-2">
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
