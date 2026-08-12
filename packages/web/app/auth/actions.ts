"use server"

import { signIn, signOut } from "@/auth"
import { setOAuthIntent } from "@/lib/oauth-intent"

export async function googleSignIn() {
  await setOAuthIntent("signin")
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function googleSignUp() {
  await setOAuthIntent("signup")
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}
