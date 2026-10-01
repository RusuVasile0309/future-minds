"use server"

import { z } from "zod"
import { AuthError } from "next-auth"
import { signIn, signOut } from "@/auth"
import { setOAuthIntent } from "@/lib/oauth-intent"
import { AuthService } from "@fm/server"

const REDIRECT_TO = "/contul-meu"

export async function googleSignIn() {
  await setOAuthIntent("signin")
  await signIn("google", { redirectTo: REDIRECT_TO })
}

export async function googleSignUp() {
  await setOAuthIntent("signup")
  await signIn("google", { redirectTo: REDIRECT_TO })
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}

// ── Email + parolă ─────────────────────────────────────────────────────────────

export type AuthFormState = { error?: string }

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Introdu o adresă de email validă."),
  password: z.string().min(1, "Introdu parola."),
})

// Parola: minim 8 caractere, cel puțin o literă mare, una mică și o cifră sau
// un caracter special.
const passwordSchema = z
  .string()
  .min(8, "Parola trebuie să aibă cel puțin 8 caractere.")
  .max(200)
  .regex(/[a-z]/, "Parola trebuie să conțină cel puțin o literă mică.")
  .regex(/[A-Z]/, "Parola trebuie să conțină cel puțin o literă mare.")
  .regex(/[\d\W]/, "Parola trebuie să conțină cel puțin o cifră sau un caracter special.")

const emailStepSchema = z.object({
  email: z.string().trim().toLowerCase().email("Introdu o adresă de email validă."),
})

const signUpSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Introdu o adresă de email validă."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirmă parola."),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Parolele nu coincid.",
    path: ["confirmPassword"],
  })

// Pasul 1 al înregistrării: validează emailul și verifică să nu existe deja.
export type EmailStepState = { error?: string; email?: string }

export async function checkEmailStep(
  _prev: EmailStepState,
  formData: FormData
): Promise<EmailStepState> {
  const parsed = emailStepSchema.safeParse({ email: formData.get("email") })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email invalid." }
  }

  const existing = await AuthService.getUserByEmail(parsed.data.email)
  if (existing) {
    return { error: "Există deja un cont cu acest email. Autentifică-te." }
  }

  return { email: parsed.data.email }
}

export async function credentialsSignIn(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Date invalide." }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: REDIRECT_TO,
    })
  } catch (error) {
    // `signIn` cu `redirectTo` aruncă un redirect pe succes — trebuie re-aruncat.
    if (error instanceof AuthError) {
      return { error: "Email sau parolă incorecte." }
    }
    throw error
  }
  return {}
}

export async function credentialsSignUp(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Date invalide." }
  }

  const user = await AuthService.registerWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })
  if (!user) {
    return { error: "Există deja un cont cu acest email. Autentifică-te." }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: REDIRECT_TO,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      // Contul s-a creat, dar auto-login a eșuat — trimite la pagina de login.
      return { error: "Contul a fost creat. Autentifică-te cu emailul și parola." }
    }
    throw error
  }
  return {}
}
