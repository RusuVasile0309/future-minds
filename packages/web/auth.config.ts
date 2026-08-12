import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import type { UserRole } from "@fm/shared"

const ACCESS_TOKEN_TTL = 15 * 60 * 1000 // 15 minutes
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000 // 1 week

export { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL }

// Edge-safe config (no DB access) — used by middleware.
export default {
  providers: [Google],
  callbacks: {
    jwt({ token, user }) {
      // On first sign-in the full callback in auth.ts has already set the timestamps.
      // Here we only handle subsequent reads (edge middleware context — no DB access).
      if (user) return token

      const now = Date.now()
      if (now < ((token.accessTokenExpires as number) ?? 0)) return token

      // Access token expired but still inside the refresh window — extend it.
      if (now < ((token.refreshTokenExpires as number) ?? 0)) {
        return { ...token, accessTokenExpires: now + ACCESS_TOKEN_TTL }
      }

      // Refresh window lapsed — end the session. Returning null makes next-auth
      // clear the cookie, so there's no errored token to re-issue and loop on.
      return null
    },

    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      session.accessTokenExpires = token.accessTokenExpires as number
      session.role = ((token.role as UserRole) ?? "STUDENT") as UserRole
      return session
    },
  },
} satisfies NextAuthConfig
