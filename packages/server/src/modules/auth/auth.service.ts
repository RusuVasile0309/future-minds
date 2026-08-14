import { sql } from "../../database/db"
import { FilesService } from "../files/files.service"
import type { User, UserRole, RefreshToken, VerificationToken } from "@fm/shared"

function toUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string | null,
    email: row.email as string | null,
    emailVerified: row.email_verified ? new Date(row.email_verified as string) : null,
    image: row.image as string | null,
    role: (row.role as UserRole) ?? "STUDENT",
    firstName: row.first_name as string | null,
    lastName: row.last_name as string | null,
    phone: row.phone as string | null,
    createdAt: new Date(row.created_at as string),
  }
}

export class AuthService {
  // ── User ──────────────────────────────────────────────────────────────────

  static async createUser(data: {
    name?: string | null
    email: string
    password?: string | null
    image?: string | null
    emailVerified?: Date | null
  }): Promise<User> {
    const [row] = await sql`
      INSERT INTO users (name, email, password, image, email_verified)
      VALUES (${data.name ?? null}, ${data.email}, ${data.password ?? null}, ${data.image ?? null}, ${data.emailVerified ?? null})
      RETURNING *
    `
    return toUser(row)
  }

  static async getUserById(id: string): Promise<User | null> {
    const [row] = await sql`SELECT * FROM users WHERE id = ${id}`
    return row ? toUser(row) : null
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const [row] = await sql`SELECT * FROM users WHERE email = ${email}`
    return row ? toUser(row) : null
  }

  static async getUserByAccount(provider: string, providerAccountId: string): Promise<User | null> {
    const [row] = await sql`
      SELECT u.* FROM users u
      JOIN accounts a ON u.id = a.user_id
      WHERE a.provider = ${provider} AND a.provider_account_id = ${providerAccountId}
    `
    return row ? toUser(row) : null
  }

  static async updateUser(
    id: string,
    data: Partial<Pick<User, "name" | "email" | "image" | "emailVerified">>
  ): Promise<User> {
    const [row] = await sql`
      UPDATE users SET
        name           = COALESCE(${data.name ?? null}, name),
        email          = COALESCE(${data.email ?? null}, email),
        image          = COALESCE(${data.image ?? null}, image),
        email_verified = COALESCE(${data.emailVerified ?? null}, email_verified)
      WHERE id = ${id}
      RETURNING *
    `
    return toUser(row)
  }

  static async updateProfile(
    id: string,
    data: { firstName: string; lastName: string; phone: string | null }
  ): Promise<User> {
    const [row] = await sql`
      UPDATE users SET
        first_name = ${data.firstName},
        last_name  = ${data.lastName},
        phone      = ${data.phone ?? null}
      WHERE id = ${id}
      RETURNING *
    `
    return toUser(row)
  }

  // ── User management (admin / super_user) ────────────────────────────────────

  static async getAllUsers(): Promise<User[]> {
    const rows = await sql`SELECT * FROM users ORDER BY created_at DESC`
    return rows.map(toUser)
  }

  static async updateUserRole(id: string, role: UserRole): Promise<User> {
    const [row] = await sql`UPDATE users SET role = ${role} WHERE id = ${id} RETURNING *`
    return toUser(row)
  }

  static async deleteUser(id: string): Promise<void> {
    // Întâi curăță fișierele din R2 (cascade-ul din DB nu atinge storage-ul),
    // apoi șterge userul — CASCADE curăță applications + application_files.
    await FilesService.removeStorageForUser(id)
    await sql`DELETE FROM users WHERE id = ${id}`
  }

  // ── OAuth accounts ─────────────────────────────────────────────────────────

  static async linkAccount(account: {
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }): Promise<void> {
    await sql`
      INSERT INTO accounts (user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
      VALUES (${account.userId}, ${account.type}, ${account.provider}, ${account.providerAccountId},
              ${account.refresh_token ?? null}, ${account.access_token ?? null}, ${account.expires_at ?? null},
              ${account.token_type ?? null}, ${account.scope ?? null}, ${account.id_token ?? null}, ${account.session_state ?? null})
      ON CONFLICT (provider, provider_account_id) DO NOTHING
    `
  }

  // ── Refresh tokens ──────────────────────────────────────────────────────────

  static async createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await sql`
      INSERT INTO refresh_tokens (token, user_id, expires_at)
      VALUES (${token}, ${userId}, ${expiresAt.toISOString()})
    `
  }

  static async getRefreshToken(token: string): Promise<RefreshToken | null> {
    const [row] = await sql`SELECT * FROM refresh_tokens WHERE token = ${token}`
    if (!row) return null
    return {
      id: row.id as string,
      token: row.token as string,
      userId: row.user_id as string,
      expiresAt: new Date(row.expires_at as string),
    }
  }

  static async deleteRefreshToken(token: string): Promise<void> {
    await sql`DELETE FROM refresh_tokens WHERE token = ${token}`
  }

  static async deleteAllRefreshTokensForUser(userId: string): Promise<void> {
    await sql`DELETE FROM refresh_tokens WHERE user_id = ${userId}`
  }

  // ── Email verification tokens (folosite de adapter; utile la email/parolă) ──

  static async createVerificationToken(identifier: string, token: string, expires: Date): Promise<VerificationToken> {
    await sql`DELETE FROM verification_tokens WHERE identifier = ${identifier}`
    await sql`
      INSERT INTO verification_tokens (identifier, token, expires)
      VALUES (${identifier}, ${token}, ${expires.toISOString()})
    `
    return { identifier, token, expires }
  }

  static async consumeVerificationToken(identifier: string, token: string): Promise<VerificationToken | null> {
    const [row] = await sql`
      DELETE FROM verification_tokens
      WHERE identifier = ${identifier} AND token = ${token}
      RETURNING *
    `
    if (!row) return null
    return {
      identifier: row.identifier as string,
      token: row.token as string,
      expires: new Date(row.expires as string),
    }
  }
}
