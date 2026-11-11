import nodemailer, { type Transporter } from "nodemailer"
import { FORM_SCHEMA, isFieldVisible } from "@fm/shared"
import type { AnswerValue, ApplicationFile, FormField } from "@fm/shared"

// Trimitere de emailuri prin SMTP (Brevo pe free tier, dar merge cu orice SMTP).
//
// Env (vezi .env.example):
//   SMTP_HOST   = smtp-relay.brevo.com
//   SMTP_PORT   = 587            (465 pentru conexiune TLS implicită)
//   SMTP_USER   = login-ul SMTP din Brevo
//   SMTP_PASS   = cheia SMTP din Brevo (NU parola contului)
//   EMAIL_FROM  = FutureMinds <no-reply@futureminds.ro>  (expeditor verificat în Brevo)
//
// Dacă variabilele lipsesc, trimiterea se omite (fără eroare), ca mediul de dev
// să funcționeze fără cont de email.

interface SmtpConfig {
  host: string
  port: number
  user: string
  pass: string
  from: string
}

function getConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS
  const from = process.env.EMAIL_FROM?.trim()
  if (!host || !user || !pass || !from) return null
  return { host, port: Number(process.env.SMTP_PORT ?? 587), user, pass, from }
}

let transporter: Transporter | null = null
function getTransporter(cfg: SmtpConfig): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465, // 465 = TLS implicit; 587 = STARTTLS
      auth: { user: cfg.user, pass: cfg.pass },
    })
  }
  return transporter
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  )
}

// Transformă valoarea unui câmp într-un text lizibil pentru email. `null` = de omis.
function formatValue(field: FormField, value: AnswerValue, files: ApplicationFile[]): string | null {
  if (field.type === "file") {
    const names = files.filter((f) => f.fieldKey === field.key).map((f) => f.fileName)
    return names.length ? names.join(", ") : null
  }
  if (value === null || value === undefined || value === "") return null
  if (typeof value === "boolean") return value ? "Da" : "Nu"
  if (Array.isArray(value)) {
    if (value.length === 0) return null
    return value.map((v) => field.options?.find((o) => o.value === v)?.label ?? v).join(", ")
  }
  // Select cu opțiuni statice: afișează eticheta, nu codul.
  const opt = field.options?.find((o) => String(o.value) === String(value))
  return opt ? opt.label : String(value)
}

// Perechile label → valoare, grupate pe secțiuni, doar câmpurile vizibile și completate.
function collectSections(
  answers: Record<string, AnswerValue>,
  files: ApplicationFile[]
): { title: string; rows: { label: string; value: string }[] }[] {
  return FORM_SCHEMA.map((section) => ({
    title: section.title,
    rows: section.fields
      .filter((f) => !f.derived && isFieldVisible(f, answers))
      .map((f) => ({ label: f.label, value: formatValue(f, answers[f.key] ?? null, files) }))
      .filter((r): r is { label: string; value: string } => r.value !== null),
  })).filter((s) => s.rows.length > 0)
}

// Paleta de brand FutureMinds (identitatea vizuală — vezi tailwind.config.ts).
const BRAND = {
  ink: "#1E2F40", // navy profund — titluri
  slate: "#44586D", // text secundar
  primary: "#4D6B8A", // albastru-ardezie — accent
  mist: "#D5DEE7", // borduri
  tint: "#EEF2F6", // suprafețe foarte deschise
  amber: "#F2B544", // accent cald
  white: "#FFFFFF",
}
const FONT_BODY =
  "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const FONT_DISPLAY = "'Poppins','Segoe UI',Roboto,Helvetica,Arial,sans-serif"

// Baza publică de la care se servesc asset-urile din packages/web/public.
function appBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "https://burse-future-minds.ro"
  return url.replace(/\/+$/, "")
}

function renderHtml(fullName: string, answers: Record<string, AnswerValue>, files: ApplicationFile[]): string {
  const sections = collectSections(answers, files)
  const base = appBaseUrl()

  const sectionsHtml = sections
    .map(
      (s) => `
      <tr><td style="padding:26px 32px 0 32px;">
        <div style="font-family:${FONT_DISPLAY};font-size:11px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:${BRAND.primary};border-left:3px solid ${BRAND.amber};padding-left:10px;margin-bottom:8px;">${escapeHtml(s.title)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:${FONT_BODY};font-size:14px;line-height:1.45;">
          ${s.rows
            .map(
              (r) => `
          <tr>
            <td style="padding:9px 14px 9px 12px;color:${BRAND.slate};vertical-align:top;width:42%;border-bottom:1px solid ${BRAND.tint};">${escapeHtml(r.label)}</td>
            <td style="padding:9px 0;color:${BRAND.ink};font-weight:500;vertical-align:top;border-bottom:1px solid ${BRAND.tint};">${escapeHtml(r.value)}</td>
          </tr>`
            )
            .join("")}
        </table>
      </td></tr>`
    )
    .join("")

  return `<!doctype html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Confirmare înscriere bursă FutureMinds</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.tint};font-family:${FONT_BODY};color:${BRAND.ink};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Cererea ta de bursă FutureMinds a fost înregistrată — rezumatul datelor transmise.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.tint};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:100%;background:${BRAND.white};border:1px solid ${BRAND.mist};border-radius:16px;overflow:hidden;">

        <!-- Header navy cu logo -->
        <tr><td style="background:${BRAND.ink};padding:26px 32px;" align="center">
          <img src="${base}/futureminds-logo-alb.png" alt="FutureMinds" height="28" style="height:28px;width:auto;display:block;border:0;">
        </td></tr>
        <tr><td style="height:4px;background:${BRAND.amber};font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Intro -->
        <tr><td style="padding:32px 32px 4px 32px;">
          <h1 style="margin:0 0 10px 0;font-family:${FONT_DISPLAY};font-size:22px;line-height:1.3;color:${BRAND.ink};font-weight:700;">Cererea ta de bursă a fost înregistrată</h1>
          <p style="margin:0;color:${BRAND.slate};font-size:15px;line-height:1.55;">
            Bună, ${escapeHtml(fullName)}! Am primit cererea ta de bursă <strong style="color:${BRAND.ink};">FutureMinds</strong>. Mai jos găsești un rezumat al datelor pe care le-ai transmis.
          </p>
        </td></tr>

        <!-- Badge status -->
        <tr><td style="padding:18px 32px 0 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:${BRAND.tint};border:1px solid ${BRAND.mist};border-radius:999px;padding:8px 16px;font-family:${FONT_DISPLAY};font-size:13px;font-weight:600;color:${BRAND.primary};">
              &#10003;&nbsp; Cerere trimisă cu succes
            </td>
          </tr></table>
        </td></tr>

        ${sectionsHtml}

        <!-- Footer -->
        <tr><td style="padding:30px 32px 34px 32px;">
          <div style="border-top:1px solid ${BRAND.mist};padding-top:18px;">
            <p style="margin:0 0 6px 0;color:${BRAND.slate};font-size:12px;line-height:1.6;">
              Acesta este un email automat de confirmare. Dacă nu tu ai trimis această cerere, te rugăm să ne contactezi.
            </p>
            <p style="margin:0;color:${BRAND.primary};font-size:12px;font-weight:600;">
              FutureMinds · <a href="${base}" style="color:${BRAND.primary};text-decoration:none;">burse-future-minds.ro</a>
            </p>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function renderText(fullName: string, answers: Record<string, AnswerValue>, files: ApplicationFile[]): string {
  const sections = collectSections(answers, files)
  const body = sections
    .map((s) => `## ${s.title}\n` + s.rows.map((r) => `${r.label}: ${r.value}`).join("\n"))
    .join("\n\n")
  return `Bună, ${fullName}!\n\nAm primit cererea ta de bursă FutureMinds. Rezumatul datelor transmise:\n\n${body}\n\nAcesta este un email automat de confirmare.`
}

/**
 * Trimite candidatului emailul de confirmare cu toate datele transmise în cerere.
 * Întoarce `true` dacă s-a trimis, `false` dacă SMTP nu e configurat.
 * Aruncă doar la erori reale de trimitere (apelantul le tratează best-effort).
 */
export async function sendApplicationConfirmation(input: {
  to: string
  fullName: string
  answers: Record<string, AnswerValue>
  files: ApplicationFile[]
}): Promise<boolean> {
  const cfg = getConfig()
  if (!cfg) {
    // Arată exact ce variabilă lipsește ca să fie clar de ce s-a omis.
    const missing = (
      [
        ["SMTP_HOST", process.env.SMTP_HOST],
        ["SMTP_USER", process.env.SMTP_USER],
        ["SMTP_PASS", process.env.SMTP_PASS],
        ["EMAIL_FROM", process.env.EMAIL_FROM],
      ] as const
    )
      .filter(([, v]) => !v?.trim())
      .map(([k]) => k)
    console.warn(`[email] SMTP neconfigurat — se omite emailul. Variabile lipsă: ${missing.join(", ")}`)
    return false
  }

  console.info(
    `[email] Trimit confirmare → to=${input.to} from=${cfg.from} host=${cfg.host}:${cfg.port} secure=${cfg.port === 465}`
  )
  try {
    const info = await getTransporter(cfg).sendMail({
      from: cfg.from,
      to: input.to,
      subject: "Confirmare înscriere bursă FutureMinds",
      html: renderHtml(input.fullName, input.answers, input.files),
      text: renderText(input.fullName, input.answers, input.files),
    })
    console.info(
      `[email] Trimis OK → messageId=${info.messageId} accepted=${JSON.stringify(info.accepted)} ` +
        `rejected=${JSON.stringify(info.rejected)} response=${info.response}`
    )
    return true
  } catch (e) {
    const err = e as { code?: string; responseCode?: number; response?: string; message?: string }
    console.error(
      `[email] EȘEC trimitere → to=${input.to} code=${err.code} responseCode=${err.responseCode} ` +
        `response=${err.response ?? err.message}`
    )
    throw e
  }
}
