import type { DefaultSession } from "next-auth"
import type { UserRole } from "@fm/shared"

declare module "next-auth" {
  interface Session {
    role: UserRole
    accessTokenExpires: number
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole
    accessTokenExpires?: number
    refreshToken?: string
    refreshTokenExpires?: number
  }
}
