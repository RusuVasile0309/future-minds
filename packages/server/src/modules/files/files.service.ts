import { sql } from "../../database/db"
import { uploadDocument, getSignedUrl, deleteObject, ALLOWED_DOC_TYPES, StorageError } from "../../lib/storage"
import type { ApplicationFile } from "@fm/shared"

export { StorageError, ALLOWED_DOC_TYPES }

function toFile(row: Record<string, unknown>): ApplicationFile {
  return {
    id: row.id as string,
    applicationId: row.application_id as string,
    fieldKey: row.field_key as string,
    fileName: row.file_name as string,
    contentType: row.content_type as string,
    sizeBytes: row.size_bytes as number,
    uploadedAt: new Date(row.uploaded_at as string),
  }
}

export class FilesService {
  static async attach(
    applicationId: string,
    fieldKey: string,
    upload: { data: ArrayBuffer; contentType: string; fileName: string; size: number }
  ): Promise<ApplicationFile> {
    const storageKey = await uploadDocument(upload.data, upload.contentType, "applications")
    const [row] = await sql`
      INSERT INTO application_files (application_id, field_key, storage_key, file_name, content_type, size_bytes)
      VALUES (${applicationId}, ${fieldKey}, ${storageKey}, ${upload.fileName}, ${upload.contentType}, ${upload.size})
      RETURNING *
    `
    return toFile(row)
  }

  static async listForApplication(applicationId: string): Promise<ApplicationFile[]> {
    const rows = await sql`
      SELECT * FROM application_files WHERE application_id = ${applicationId} ORDER BY uploaded_at
    `
    return rows.map(toFile)
  }

  static async getById(id: string): Promise<(ApplicationFile & { storageKey: string }) | null> {
    const [row] = await sql`SELECT * FROM application_files WHERE id = ${id}`
    if (!row) return null
    return { ...toFile(row), storageKey: row.storage_key as string }
  }

  // Verifică proprietarul aplicației căreia îi aparține fișierul.
  static async ownerOf(fileId: string): Promise<string | null> {
    const [row] = await sql`
      SELECT a.user_id FROM application_files f
      JOIN applications a ON a.id = f.application_id
      WHERE f.id = ${fileId}
    `
    return row ? (row.user_id as string) : null
  }

  static async signedUrl(id: string): Promise<string | null> {
    const file = await this.getById(id)
    if (!file) return null
    return getSignedUrl(file.storageKey)
  }

  static async remove(id: string): Promise<void> {
    const file = await this.getById(id)
    if (!file) return
    await deleteObject(file.storageKey)
    await sql`DELETE FROM application_files WHERE id = ${id}`
  }

  // Șterge din R2 toate fișierele aplicațiilor unui user. Rândurile din DB se
  // curăță separat (ON DELETE CASCADE la ștergerea userului/aplicației). Best-effort:
  // dacă un obiect nu se poate șterge, continuăm ca să nu blocăm ștergerea userului.
  static async removeStorageForUser(userId: string): Promise<void> {
    const rows = await sql`
      SELECT f.storage_key FROM application_files f
      JOIN applications a ON a.id = f.application_id
      WHERE a.user_id = ${userId}
    `
    for (const row of rows) {
      try {
        await deleteObject(row.storage_key as string)
      } catch {
        // ignoră eroarea per fișier (obiect deja lipsă / R2 indisponibil)
      }
    }
  }
}
