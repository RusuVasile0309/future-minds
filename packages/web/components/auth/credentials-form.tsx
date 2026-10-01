"use client"

import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { credentialsSignIn, type AuthFormState } from "@/app/auth/actions"

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Se procesează…" : label}
    </Button>
  )
}

export function CredentialsForm() {
  const [state, formAction] = useFormState<AuthFormState, FormData>(credentialsSignIn, {})

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nume@exemplu.ro"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Parolă</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="Parola ta"
        />
      </div>

      <SubmitButton label="Autentifică-te" />
    </form>
  )
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" />
      sau
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
