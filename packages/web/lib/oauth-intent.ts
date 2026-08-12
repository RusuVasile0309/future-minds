"use server"

import { cookies } from "next/headers"

export type OAuthIntent = "signin" | "signup"

const COOKIE_NAME = "oauth_intent"

export async function setOAuthIntent(intent: OAuthIntent): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE_NAME, intent, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 5,
  })
}

export async function readAndClearOAuthIntent(): Promise<OAuthIntent | null> {
  const jar = await cookies()
  const value = jar.get(COOKIE_NAME)?.value
  if (value === "signin" || value === "signup") {
    jar.delete(COOKIE_NAME)
    return value
  }
  return null
}
