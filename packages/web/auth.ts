import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import authConfig, { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "./auth.config"
import { createSQLAdapter } from "./lib/auth-adapter"
import { readAndClearOAuthIntent } from "./lib/oauth-intent"
import { AuthService } from "@fm/server"

// Limite anti-brute-force pentru login cu parolă.
const LOGIN_MAX_ATTEMPTS = 8
const LOGIN_WINDOW_MS = 15 * 60 * 1000 // 15 minute

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: createSQLAdapter(),
  session: { strategy: "jwt" },
  trustHost: true,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parolă", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase()
        const password = credentials?.password as string | undefined
        if (!email || !password) return null

        const limited = await AuthService.hitRateLimit(
          `login:${email}`,
          LOGIN_MAX_ATTEMPTS,
          LOGIN_WINDOW_MS
        )
        if (limited) return null

        const user = await AuthService.verifyCredentials(email, password)
        if (!user) return null

        await AuthService.clearRateLimit(`login:${email}`)
        return { id: user.id, email: user.email, name: user.name, image: user.image }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // La „sign in" cu Google fără cont existent, nu creăm tăcut un cont — trimitem
      // utilizatorul la sign-up. Doar intenția explicită de „signup" permite crearea.
      if (account?.provider === "google") {
        const intent = await readAndClearOAuthIntent()
        const existing = user.email ? await AuthService.getUserByEmail(user.email) : null
        if (!existing && intent !== "signup") {
          return `/autentificare/inregistrare?error=no_account&email=${encodeURIComponent(user.email ?? "")}`
        }
      }
      return true
    },

    async jwt({ token, user }) {
      // Initial sign-in — create refresh token + read role from DB
      if (user) {
        const refreshToken = crypto.randomUUID()
        const refreshTokenExpires = new Date(Date.now() + REFRESH_TOKEN_TTL)
        await AuthService.createRefreshToken(user.id!, refreshToken, refreshTokenExpires)

        const dbUser = await AuthService.getUserById(user.id!)
        return {
          ...token,
          accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL,
          refreshToken,
          refreshTokenExpires: refreshTokenExpires.getTime(),
          role: dbUser?.role ?? "STUDENT",
        }
      }

      const now = Date.now()
      if (now < (token.accessTokenExpires as number)) return token

      // Access token expired — validate refresh token in DB
      const dbToken = await AuthService.getRefreshToken(token.refreshToken as string)
      if (!dbToken || now > dbToken.expiresAt.getTime()) {
        if (dbToken) await AuthService.deleteRefreshToken(token.refreshToken as string)
        // End the session: returning null clears the cookie (no errored token to
        // re-issue), which is what avoids the sign-in redirect loop.
        return null
      }

      return { ...token, accessTokenExpires: now + ACCESS_TOKEN_TTL }
    },

    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      session.accessTokenExpires = token.accessTokenExpires as number
      session.role = (token.role ?? "STUDENT") as import("@fm/shared").UserRole
      return session
    },
  },

  events: {
    async signOut(message) {
      if ("token" in message && message.token?.refreshToken) {
        await AuthService.deleteRefreshToken(message.token.refreshToken as string).catch(() => null)
      }
    },
  },

  pages: {
    signIn: "/autentificare/intra",
    error: "/autentificare/eroare",
  },
})
