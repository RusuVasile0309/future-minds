import { AwsClient } from "aws4fetch"

// Cloudflare R2 (S3-compatible), bucket PRIVAT. Documentele candidaților sunt
// sensibile, deci NU au URL public — se scriu cu SigV4 (aws4fetch) și se citesc
// prin URL semnate temporar, generate din rute autentificate.
//
// Env (vezi .env.example):
//   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
//   + endpoint-ul contului, dat în UNA din două forme:
//     R2_ENDPOINT   = URL-ul complet „S3 API" din Cloudflare
//                     (ex. https://<account_id>.r2.cloudflarestorage.com), SAU
//     R2_ACCOUNT_ID = doar id-ul contului (din care se construiește endpoint-ul)

export class StorageError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.code = code
    this.name = "StorageError"
  }
}

interface R2Config {
  /** Baza endpoint-ului S3, fără „/" final și fără bucket. */
  baseUrl: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}

function getConfig(): R2Config {
  const endpoint = process.env.R2_ENDPOINT?.trim()
  const accountId = process.env.R2_ACCOUNT_ID?.trim()
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET

  // Endpoint-ul complet are prioritate; altfel se derivă din account id.
  const baseUrl = endpoint
    ? endpoint.replace(/\/+$/, "")
    : accountId
      ? `https://${accountId}.r2.cloudflarestorage.com`
      : ""

  if (!baseUrl || !accessKeyId || !secretAccessKey || !bucket) {
    throw new StorageError("Stocarea fișierelor nu este configurată (variabilele R2_*).", 503)
  }
  return { baseUrl, accessKeyId, secretAccessKey, bucket }
}

function client(cfg: R2Config): AwsClient {
  return new AwsClient({
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
    region: "auto", // R2 ignoră regiunea, dar SigV4 o cere
    service: "s3",
  })
}

const EXT_BY_TYPE: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

export const ALLOWED_DOC_TYPES = Object.keys(EXT_BY_TYPE)

// Urcă bytes în R2 sub `<folder>/<uuid>.<ext>` și întoarce CHEIA (nu un URL).
export async function uploadDocument(
  data: ArrayBuffer,
  contentType: string,
  folder = "applications"
): Promise<string> {
  const ext = EXT_BY_TYPE[contentType]
  if (!ext) throw new StorageError(`Tip de fișier nepermis: ${contentType}`, 400)

  const cfg = getConfig()
  const key = `${folder}/${crypto.randomUUID()}.${ext}`
  const endpoint = `${cfg.baseUrl}/${cfg.bucket}/${key}`

  const body = new Uint8Array(data)
  const res = await client(cfg).fetch(endpoint, {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType, "Content-Length": String(body.byteLength) },
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new StorageError(`Încărcarea în R2 a eșuat (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`, 502)
  }
  return key
}

// URL GET semnat, valabil temporar — pentru descărcarea unui document privat.
export async function getSignedUrl(storageKey: string, expiresInSeconds = 300): Promise<string> {
  const cfg = getConfig()
  const endpoint = `${cfg.baseUrl}/${cfg.bucket}/${storageKey}?X-Amz-Expires=${expiresInSeconds}`
  const signed = await client(cfg).sign(new Request(endpoint, { method: "GET" }), {
    aws: { signQuery: true },
  })
  return signed.url
}

export async function deleteObject(storageKey: string): Promise<void> {
  const cfg = getConfig()
  const endpoint = `${cfg.baseUrl}/${cfg.bucket}/${storageKey}`
  await client(cfg).fetch(endpoint, { method: "DELETE" }).catch(() => null)
}
