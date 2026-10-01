"use client"

import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import {
  checkEmailStep,
  credentialsSignUp,
  type AuthFormState,
  type EmailStepState,
} from "@/app/auth/actions"

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Se procesează…" : label}
    </Button>
  )
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {message}
    </p>
  )
}

export function SignUpWizard() {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")

  const [emailState, emailAction] = useFormState<EmailStepState, FormData>(checkEmailStep, {})
  const [signUpState, signUpAction] = useFormState<AuthFormState, FormData>(credentialsSignUp, {})

  // Când pasul 1 trece (email valid + disponibil), rețin emailul și avansez.
  useEffect(() => {
    if (emailState.email) {
      setEmail(emailState.email)
      setStep(2)
    }
  }, [emailState.email])

  if (step === 1) {
    return (
      <form action={emailAction} className="space-y-4">
        <ErrorMessage message={emailState.error} />
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={email}
            placeholder="nume@exemplu.ro"
          />
        </div>
        <SubmitButton label="Continuă" />
      </form>
    )
  }

  return (
    <form action={signUpAction} className="space-y-4">
      <ErrorMessage message={signUpState.error} />

      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
        <span className="truncate text-muted-foreground">{email}</span>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="ml-3 shrink-0 font-medium text-primary hover:underline"
        >
          Schimbă
        </button>
      </div>

      <input type="hidden" name="email" value={email} />

      <div className="space-y-1.5">
        <Label htmlFor="password">Parolă</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Minim 8 caractere"
        />
        <p className="text-xs text-muted-foreground">
          Minim 8 caractere, cu cel puțin o literă mare, una mică și o cifră sau un caracter special.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirmă parola</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="Reintrodu parola"
        />
      </div>

      <SubmitButton label="Creează cont" />
    </form>
  )
}
