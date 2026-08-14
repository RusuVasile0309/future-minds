import type { ComputedField, FieldOption, FieldType, FieldValidation, FormField, FormSection, OptionSource, VisibleWhen } from "./types/form"

/**
 * Schema STATICĂ a formularului de înscriere — sursa unică de adevăr pentru
 * câmpuri, ordine, validări și marcaje „scorabil". Formularul NU mai este
 * editabil din admin; doar ponderile/criteriile din algoritmul de ranking sunt
 * dinamice. Reflectă fidel `docs/formular-elevi-campuri.md`.
 *
 * Comportamentele „inteligente":
 *  - cascadă (`optionsSource` + `dependsOn`) pentru facultate/specializare/limbă;
 *  - excludere reciprocă discipline Bac (`optionsSource: "bac_subject"`);
 *  - vizibilitate condiționată (`visibleWhen`) pentru veniturile părinților/elev;
 *  - `income_per_member` NU e câmp de input — se derivă la scoring.
 */

// ── Județele României (SIRUTA nivel județ) — opțiuni statice pentru `county` ──
export const COUNTIES: string[] = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brăila",
  "Brașov", "București", "Buzău", "Călărași", "Caraș-Severin", "Cluj", "Constanța",
  "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara",
  "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt",
  "Prahova", "Sălaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea",
  "Vâlcea", "Vaslui", "Vrancea",
]

// ── Disciplinele examenului de Bacalaureat (dropdown-uri cu excludere reciprocă) ──
export const BAC_SUBJECTS: string[] = [
  "Limba și literatura română",
  "Limba și literatura maternă",
  "Matematică",
  "Informatică",
  "Fizică",
  "Chimie",
  "Biologie",
  "Istorie",
  "Geografie",
  "Logică, argumentare și comunicare",
  "Psihologie",
  "Economie",
  "Filosofie",
  "Sociologie",
  "Limba engleză",
  "Limba franceză",
  "Limba germană",
  "Limba maghiară",
  "Limba italiană",
  "Limba spaniolă",
]

const opts = (values: string[]): FieldOption[] => values.map((v) => ({ value: v, label: v }))

// Spec compactă pentru un câmp; câmpurile de infrastructură (id/sectionId/…) se
// completează automat la asamblare.
interface FieldSpec {
  key: string
  label: string
  type: FieldType
  required?: boolean
  scorable?: boolean
  helpText?: string
  options?: FieldOption[]
  validation?: FieldValidation
  optionsSource?: OptionSource
  dependsOn?: string[]
  visibleWhen?: VisibleWhen
  requiredTrue?: boolean
  colSpan?: number
  computed?: ComputedField
  derived?: boolean
  align?: "center"
  multiple?: boolean
}

interface SectionSpec {
  id: string
  title: string
  description?: string
  fields: FieldSpec[]
}

const grade: FieldValidation = { min: 1, max: 10 }
// Toate documentele se acceptă DOAR în format PDF.
const docValidation: FieldValidation = { fileTypes: ["pdf"], maxSizeMB: 5 }
const pdfValidation: FieldValidation = { fileTypes: ["pdf"], maxSizeMB: 5 }

const SECTIONS: SectionSpec[] = [
  {
    id: "personal",
    title: "Date personale",
    fields: [
      { key: "last_name", label: "Nume", type: "text", required: true, colSpan: 6 },
      { key: "first_name", label: "Prenume", type: "text", required: true, colSpan: 6 },
      { key: "birth_date", label: "Data nașterii", type: "date", required: true },
      { key: "email", label: "Email", type: "email", required: true, helpText: "Prefill din contul tău." },
      { key: "phone", label: "Telefon", type: "phone", required: true, helpText: "Prefill din contul tău." },
    ],
  },
  {
    id: "address",
    title: "Adresă",
    fields: [
      { key: "county", label: "Județ", type: "select", required: true, options: opts(COUNTIES) },
      { key: "city", label: "Localitate", type: "text", required: true },
      { key: "street", label: "Stradă", type: "text", required: true, colSpan: 9 },
      { key: "street_number", label: "Număr", type: "text", required: true, colSpan: 3 },
      { key: "building", label: "Bloc", type: "text", colSpan: 6 },
      { key: "entrance", label: "Scară", type: "text", colSpan: 6 },
      { key: "floor", label: "Etaj", type: "text", colSpan: 6 },
      { key: "apartment", label: "Apartament", type: "text", colSpan: 6 },
      { key: "postal_code", label: "Cod poștal", type: "text" },
      {
        key: "environment",
        label: "Mediu",
        type: "select",
        required: true,
        scorable: true,
        options: [
          { value: "urban", label: "Urban" },
          { value: "rural", label: "Rural" },
        ],
      },
    ],
  },
  {
    id: "bac",
    title: "Rezultate Bacalaureat",
    fields: [
      { key: "bac_subject_1", label: "Disciplina 1", type: "select", required: true, options: opts(BAC_SUBJECTS), colSpan: 6 },
      { key: "bac_grade_1", label: "Nota 1", type: "number", required: true, validation: grade, colSpan: 6 },
      {
        key: "bac_subject_2",
        label: "Disciplina 2",
        type: "select",
        required: true,
        optionsSource: "bac_subject",
        dependsOn: ["bac_subject_1"],
        colSpan: 6,
      },
      { key: "bac_grade_2", label: "Nota 2", type: "number", required: true, validation: grade, colSpan: 6 },
      {
        key: "bac_subject_3",
        label: "Disciplina 3",
        type: "select",
        required: true,
        optionsSource: "bac_subject",
        dependsOn: ["bac_subject_1", "bac_subject_2"],
        colSpan: 6,
      },
      { key: "bac_grade_3", label: "Nota 3", type: "number", required: true, validation: grade, colSpan: 6 },
      {
        key: "bac_average",
        label: "Media Bacalaureat",
        type: "number",
        required: true,
        scorable: true,
        validation: grade,
        helpText: "Calculată automat ca media aritmetică a celor 3 note.",
        computed: { kind: "average", from: ["bac_grade_1", "bac_grade_2", "bac_grade_3"] },
      },
      {
        key: "highschool_average",
        label: "Media generală liceu",
        type: "number",
        required: true,
        scorable: true,
        validation: grade,
      },
      {
        key: "bac_diploma",
        label: "Diploma de Bacalaureat",
        type: "file",
        required: true,
        helpText: "Atașează diploma de Bacalaureat în format PDF (scanată).",
        validation: docValidation,
      },
    ],
  },
  {
    id: "faculty",
    title: "Facultate",
    description:
      "Alege universitatea, apoi facultatea, specializarea și limba de studiu. Selectează și completează notele DOAR pentru semestrele deja încheiate.",
    fields: [
      {
        key: "university",
        label: "Universitate",
        type: "select",
        required: true,
        options: [
          { value: "UTCN", label: "Universitatea Tehnică din Cluj-Napoca" },
          { value: "UBB", label: "Universitatea Babeș-Bolyai" },
        ],
      },
      {
        key: "faculty",
        label: "Facultate",
        type: "select",
        required: true,
        optionsSource: "faculty",
        dependsOn: ["university"],
      },
      {
        key: "specialization",
        label: "Specializare",
        type: "select",
        required: true,
        optionsSource: "specialization",
        dependsOn: ["university", "faculty"],
      },
      {
        key: "study_language",
        label: "Limbă de studiu",
        type: "select",
        required: true,
        optionsSource: "study_language",
        dependsOn: ["university", "faculty", "specialization"],
      },
      {
        key: "study_year",
        label: "Anul de studiu",
        type: "select",
        required: true,
        helpText: "Anul în care ești acum (sau în care intri, dacă completezi înainte de începerea facultății).",
        options: [
          { value: "1", label: "Anul 1 (încep / în curs)" },
          { value: "2", label: "Anul 2" },
          { value: "3", label: "Anul 3" },
          { value: "4", label: "Anul 4" },
        ],
      },
      {
        key: "admission_grade",
        label: "Media de admitere",
        type: "number",
        required: true,
        scorable: true,
        validation: grade,
      },
      // Mediile semestriale ale anilor deja ÎNCHEIAȚI. Un câmp devine vizibil doar
      // dacă anul de studiu ales e cel puțin cu 1 peste anul semestrului (an încheiat).
      { key: "grade_y1_s1", label: "Media anul 1, sem. 1", type: "number", validation: grade, colSpan: 6, required: true, visibleWhen: { all: [{ field: "study_year", gte: 2 }] } },
      { key: "grade_y1_s2", label: "Media anul 1, sem. 2", type: "number", validation: grade, colSpan: 6, required: true, visibleWhen: { all: [{ field: "study_year", gte: 2 }] } },
      { key: "grade_y2_s1", label: "Media anul 2, sem. 1", type: "number", validation: grade, colSpan: 6, required: true, visibleWhen: { all: [{ field: "study_year", gte: 3 }] } },
      { key: "grade_y2_s2", label: "Media anul 2, sem. 2", type: "number", validation: grade, colSpan: 6, required: true, visibleWhen: { all: [{ field: "study_year", gte: 3 }] } },
      { key: "grade_y3_s1", label: "Media anul 3, sem. 1", type: "number", validation: grade, colSpan: 6, required: true, visibleWhen: { all: [{ field: "study_year", gte: 4 }] } },
      { key: "grade_y3_s2", label: "Media anul 3, sem. 2", type: "number", validation: grade, colSpan: 6, required: true, visibleWhen: { all: [{ field: "study_year", gte: 4 }] } },
      // Media agregată a facultății = media semestrelor ÎNCHEIATE (câmpuri de mai sus).
      // `derived` (nu se randează) + `scorable` → un singur criteriu de ranking, corect
      // indiferent de anul de studiu (bobocii fără semestre nu sunt penalizați pe 6 criterii).
      {
        key: "faculty_average",
        label: "Media facultate",
        type: "number",
        scorable: true,
        derived: true,
        validation: grade,
        computed: {
          kind: "average",
          from: ["grade_y1_s1", "grade_y1_s2", "grade_y2_s1", "grade_y2_s2", "grade_y3_s1", "grade_y3_s2"],
        },
      },
    ],
  },
  {
    id: "finance",
    title: "Situație financiară",
    fields: [
      { key: "student_employed", label: "Sunt angajat", type: "boolean" },
      {
        key: "student_income",
        label: "Venit net lunar (RON)",
        type: "number",
        helpText: "Venitul tău net lunar.",
        visibleWhen: { all: [{ field: "student_employed", truthy: true }] },
      },
      { key: "mother_last_name", label: "Nume mamă", type: "text", required: true, colSpan: 6 },
      { key: "mother_first_name", label: "Prenume mamă", type: "text", required: true, colSpan: 6 },
      { key: "mother_deceased", label: "Mama este decedată", type: "boolean", colSpan: 6 },
      { key: "mother_supports", label: "Mama mă susține financiar", type: "boolean", colSpan: 6 },
      {
        key: "mother_income",
        label: "Venit net lunar mamă (RON)",
        type: "number",
        // Venitul se cere doar dacă mama susține financiar (implicit și în viață).
        visibleWhen: { all: [{ field: "mother_supports", truthy: true }] },
      },
      { key: "father_last_name", label: "Nume tată", type: "text", required: true, colSpan: 6 },
      { key: "father_first_name", label: "Prenume tată", type: "text", required: true, colSpan: 6 },
      { key: "father_deceased", label: "Tatăl este decedat", type: "boolean", colSpan: 6 },
      { key: "father_supports", label: "Tata mă susține financiar", type: "boolean", colSpan: 6 },
      {
        key: "father_income",
        label: "Venit net lunar tată (RON)",
        type: "number",
        visibleWhen: { all: [{ field: "father_supports", truthy: true }] },
      },
      {
        key: "dependents_count",
        label: "Nr. frați/surori în întreținere",
        type: "number",
        required: true,
        helpText: "Intră în calculul venitului pe membru de familie.",
        validation: { min: 0 },
      },
    ],
  },
  {
    id: "special",
    title: "Situații speciale",
    description: "Bifează situațiile care ți se aplică. Fiecare bifă poate aduce punctaj suplimentar.",
    fields: [
      // Statutul de orfan NU se mai întreabă aici — se derivă din bifele „decedat"
      // ale părinților (secțiunea „Situație financiară"). Rămân `derived` +
      // `scorable` ca să conteze la ranking, dar nu se randează în formular.
      {
        key: "orphan_one_parent",
        label: "Orfan de un părinte",
        type: "boolean",
        scorable: true,
        derived: true,
      },
      {
        key: "orphan_both_parents",
        label: "Orfan de ambii părinți",
        type: "boolean",
        scorable: true,
        derived: true,
      },
      { key: "institutionalized", label: "Instituționalizat / plasament", type: "boolean", scorable: true },
      { key: "disability_certificate", label: "Certificat de handicap", type: "boolean", scorable: true },
      { key: "single_parent_family", label: "Familie monoparentală", type: "boolean", scorable: true },
    ],
  },
  {
    id: "documents",
    title: "Documente",
    description: "Documentele se încarcă într-un spațiu privat, accesibil doar echipei de evaluare.",
    fields: [
      { key: "doc_income", label: "Adeverințe de venit", type: "file", required: true, validation: docValidation, colSpan: 6, multiple: true },
      { key: "doc_transcript", label: "Foaie matricolă / diplomă Bac", type: "file", required: true, validation: docValidation, colSpan: 6 },
      { key: "doc_admission", label: "Dovada admiterii la facultate", type: "file", required: true, validation: docValidation, colSpan: 6 },
      { key: "doc_id", label: "Copie carte de identitate", type: "file", required: true, validation: docValidation, colSpan: 6 },
      {
        key: "doc_special",
        label: "Documente situații speciale",
        type: "file",
        helpText: "Hotărâri deces/divorț/plasament, certificat de handicap etc. Poți încărca mai multe fișiere.",
        validation: docValidation,
        colSpan: 12,
        align: "center",
        multiple: true,
      },
    ],
  },
  {
    id: "consent",
    title: "Consimțăminte",
    fields: [
      {
        key: "gdpr_consent",
        label: "Sunt de acord cu prelucrarea datelor mele cu caracter personal (GDPR)",
        type: "boolean",
        required: true,
        requiredTrue: true,
      },
      {
        key: "declaration",
        label: "Declar pe propria răspundere că datele furnizate sunt corecte",
        type: "boolean",
        required: true,
        requiredTrue: true,
      },
    ],
  },
  {
    id: "letters",
    title: "Scrisori",
    description:
      "Ultimul pas: încarcă scrisoarea de intenție și scrisoarea de recomandare, ambele în format PDF.",
    fields: [
      {
        key: "cover_letter",
        label: "Scrisoare de intenție (PDF)",
        type: "file",
        required: true,
        helpText:
          "Spune-ne câte ceva despre tine, despre planurile tale de viitor și de ce crezi că ești potrivit/ă pentru această bursă. Un fișier PDF, maxim 5 MB.",
        validation: pdfValidation,
      },
      {
        key: "recommendation_letter",
        label: "Scrisoare de recomandare (PDF)",
        type: "file",
        required: true,
        helpText: "Din partea unui profesor de liceu sau de facultate. Un fișier PDF, maxim 5 MB.",
        validation: pdfValidation,
      },
      // Note manuale (1–3) acordate de SUPER_USER după citirea scrisorilor. NU se
      // completează de candidat (`derived`), dar rămân `scorable` → intră la ranking.
      {
        key: "cover_letter_score",
        label: "Notă scrisoare de intenție",
        type: "number",
        scorable: true,
        derived: true,
        validation: { min: 1, max: 3 },
      },
      {
        key: "recommendation_letter_score",
        label: "Notă scrisoare de recomandare",
        type: "number",
        scorable: true,
        derived: true,
        validation: { min: 1, max: 3 },
      },
    ],
  },
]

function buildField(spec: FieldSpec, sectionId: string, sortOrder: number): FormField {
  return {
    id: spec.key,
    sectionId,
    key: spec.key,
    label: spec.label,
    helpText: spec.helpText ?? null,
    type: spec.type,
    required: spec.required ?? false,
    options: spec.options ?? null,
    validation: spec.validation ?? null,
    scorable: spec.scorable ?? false,
    sortOrder,
    archived: false,
    optionsSource: spec.optionsSource,
    dependsOn: spec.dependsOn,
    visibleWhen: spec.visibleWhen,
    requiredTrue: spec.requiredTrue,
    colSpan: spec.colSpan,
    computed: spec.computed,
    derived: spec.derived,
    align: spec.align,
    multiple: spec.multiple,
  }
}

export const FORM_SCHEMA: FormSection[] = SECTIONS.map((section, si) => ({
  id: section.id,
  title: section.title,
  description: section.description ?? null,
  sortOrder: si,
  fields: section.fields.map((f, fi) => buildField(f, section.id, fi)),
}))

/** Copie a schemei statice (același conținut în orice apel). */
export function getFormSchema(): FormSection[] {
  return FORM_SCHEMA
}

/** Toate câmpurile, în ordine (utile la validare / scoring). */
export function allFields(): FormField[] {
  return FORM_SCHEMA.flatMap((s) => s.fields)
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(",", "."))
    return Number.isFinite(n) ? n : null
  }
  return null
}

/** Valoarea unui câmp calculat (ex. media Bac) din răspunsurile curente, sau `null`. */
export function computeFieldValue(field: FormField, answers: Record<string, unknown>): number | null {
  const c = field.computed
  if (!c) return null
  if (c.kind === "average") {
    const nums = c.from.map((k) => toNumber(answers[k])).filter((n): n is number => n !== null)
    if (nums.length === 0) return null
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length
    return Math.round(avg * 100) / 100
  }
  return null
}

/**
 * Sincronizează câmpurile calculate în obiectul de răspunsuri (mutează pe loc).
 * Ex.: media Bac se completează automat pe măsură ce se introduc cele 3 note.
 */
export function applyComputedFields(answers: Record<string, unknown>): void {
  for (const field of allFields()) {
    if (!field.computed) continue
    const v = computeFieldValue(field, answers)
    if (v === null) delete answers[field.key]
    else answers[field.key] = v
  }
}

function conditionMet(
  cond: { field: string; equals?: unknown; truthy?: boolean; gte?: number },
  answers: Record<string, unknown>
): boolean {
  const v = answers[cond.field]
  if (cond.equals !== undefined) return v === cond.equals
  if (cond.truthy !== undefined) return Boolean(v === true || v === "true") === cond.truthy
  if (cond.gte !== undefined) {
    const n = toNumber(v)
    return n !== null && n >= cond.gte
  }
  return true
}

/**
 * Un câmp este vizibil dacă nu are `visibleWhen` sau dacă toate condițiile din
 * `all` și cel puțin una din `any` sunt îndeplinite pe baza răspunsurilor curente.
 */
export function isFieldVisible(field: FormField, answers: Record<string, unknown>): boolean {
  const w = field.visibleWhen
  if (!w) return true
  if (w.all && !w.all.every((c) => conditionMet(c, answers))) return false
  if (w.any && !w.any.some((c) => conditionMet(c, answers))) return false
  return true
}
