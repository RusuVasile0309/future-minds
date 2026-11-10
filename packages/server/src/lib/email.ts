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

function renderHtml(fullName: string, answers: Record<string, AnswerValue>, files: ApplicationFile[]): string {
  const sections = collectSections(answers, files)
  const sectionsHtml = sections
    .map(
      (s) => `
    <h3 style="margin:24px 0 8px;font-size:15px;color:#111;">${escapeHtml(s.title)}</h3>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
      ${s.rows
        .map(
          (r) => `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#555;vertical-align:top;width:45%;">${escapeHtml(r.label)}</td>
        <td style="padding:6px 0;color:#111;vertical-align:top;">${escapeHtml(r.value)}</td>
      </tr>`
        )
        .join("")}
    </table>`
    )
    .join("")

  return `<!doctype html>
<html lang="ro">
<body style="margin:0;background:#f5f5f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;">
  <div style="max-width:640px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border-radius:12px;padding:28px;">
      <h1 style="margin:0 0 4px;font-size:20px;">Cererea ta de bursă a fost înregistrată</h1>
      <p style="margin:0 0 16px;color:#555;font-size:14px;">
        Bună, ${escapeHtml(fullName)}! Am primit cererea ta de bursă FutureMinds.
        Mai jos găsești un rezumat al datelor pe care le-ai transmis.
      </p>
      ${sectionsHtml}
      <p style="margin:24px 0 0;color:#777;font-size:12px;">
        Acesta este un email automat de confirmare. Dacă nu tu ai trimis această cerere, te rugăm să ne contactezi.
      </p>
    </div>
  </div>
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
    console.warn("[email] SMTP neconfigurat — se omite emailul de confirmare.")
    return false
  }

  await getTransporter(cfg).sendMail({
    from: cfg.from,
    to: input.to,
    subject: "Confirmare înscriere bursă FutureMinds",
    html: renderHtml(input.fullName, input.answers, input.files),
    text: renderText(input.fullName, input.answers, input.files),
  })
  return true
}
