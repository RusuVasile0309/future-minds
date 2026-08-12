import type { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters"
import { AuthService } from "@fm/server"

function toAdapterUser(user: {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
}): AdapterUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email ?? "",
    emailVerified: user.emailVerified,
    image: user.image,
  }
}

export function createSQLAdapter(): Adapter {
  return {
    async createUser(user) {
      const created = await AuthService.createUser({
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      })
      return toAdapterUser(created)
    },

    async getUser(id) {
      const user = await AuthService.getUserById(id)
      return user ? toAdapterUser(user) : null
    },

    async getUserByEmail(email) {
      const user = await AuthService.getUserByEmail(email)
      return user ? toAdapterUser(user) : null
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const user = await AuthService.getUserByAccount(provider, providerAccountId)
      return user ? toAdapterUser(user) : null
    },

    async updateUser(user) {
      const updated = await AuthService.updateUser(user.id, {
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        image: user.image ?? undefined,
        emailVerified: user.emailVerified ?? undefined,
      })
      return toAdapterUser(updated)
    },

    async linkAccount(account: AdapterAccount) {
      await AuthService.linkAccount({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state as string | null,
      })
    },

    async createVerificationToken({ identifier, token, expires }) {
      return AuthService.createVerificationToken(identifier, token, expires)
    },

    async useVerificationToken({ identifier, token }) {
      return AuthService.consumeVerificationToken(identifier, token)
    },
  }
}
