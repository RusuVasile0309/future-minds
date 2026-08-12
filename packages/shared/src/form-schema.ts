import type { FieldOption, FieldType, FieldValidation, FormField, FormSection, OptionSource, VisibleWhen } from "./types/form"

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
}

interface SectionSpec {
  id: string
  title: string
  description?: string
  fields: FieldSpec[]
}

const grade: FieldValidation = { min: 1, max: 10 }
const docValidation: FieldValidation = { fileTypes: ["pdf", "jpg", "jpeg", "png", "webp"], maxSizeMB: 10 }

const SECTIONS: SectionSpec[] = [
  {
    id: "personal",
    title: "Date personale",
    fields: [
      { key: "last_name", label: "Nume", type: "text", required: true },
      { key: "first_name", label: "Prenume", type: "text", required: true },
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
      { key: "street", label: "Stradă", type: "text", required: true },
      { key: "street_number", label: "Număr", type: "text", required: true },
      { key: "building", label: "Bloc", type: "text" },
      { key: "entrance", label: "Scară", type: "text" },
      { key: "floor", label: "Etaj", type: "text" },
      { key: "apartment", label: "Apartament", type: "text" },
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
      { key: "bac_subject_1", label: "Disciplina 1", type: "select", required: true, options: opts(BAC_SUBJECTS) },
      { key: "bac_grade_1", label: "Nota 1", type: "number", required: true, validation: grade },
      {
        key: "bac_subject_2",
        label: "Disciplina 2",
        type: "select",
        required: true,
        optionsSource: "bac_subject",
        dependsOn: ["bac_subject_1"],
      },
      { key: "bac_grade_2", label: "Nota 2", type: "number", required: true, validation: grade },
      {
        key: "bac_subject_3",
        label: "Disciplina 3",
        type: "select",
        required: true,
        optionsSource: "bac_subject",
        dependsOn: ["bac_subject_1", "bac_subject_2"],
      },
      { key: "bac_grade_3", label: "Nota 3", type: "number", required: true, validation: grade },
      { key: "bac_average", label: "Media Bacalaureat", type: "number", required: true, scorable: true, validation: grade },
      {
        key: "highschool_average",
        label: "Media generală liceu",
        type: "number",
        required: true,
        scorable: true,
        validation: grade,
      },
    ],
  },
  {
    id: "faculty",
    title: "Facultate",
    description: "Alege universitatea, apoi facultatea, specializarea și limba de studiu.",
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
      { key: "mother_last_name", label: "Nume mamă", type: "text", required: true },
      { key: "mother_first_name", label: "Prenume mamă", type: "text", required: true },
      { key: "mother_deceased", label: "Mama este decedată", type: "boolean" },
      { key: "mother_no_support", label: "Mama nu mă susține financiar", type: "boolean" },
      {
        key: "mother_income",
        label: "Venit net lunar mamă (RON)",
        type: "number",
        visibleWhen: {
          all: [
            { field: "mother_deceased", truthy: false },
            { field: "mother_no_support", truthy: false },
          ],
        },
      },
      { key: "father_last_name", label: "Nume tată", type: "text", required: true },
      { key: "father_first_name", label: "Prenume tată", type: "text", required: true },
      { key: "father_deceased", label: "Tatăl este decedat", type: "boolean" },
      { key: "father_no_support", label: "Tatăl nu mă susține financiar", type: "boolean" },
      {
        key: "father_income",
        label: "Venit net lunar tată (RON)",
        type: "number",
        visibleWhen: {
          all: [
            { field: "father_deceased", truthy: false },
            { field: "father_no_support", truthy: false },
          ],
        },
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
      { key: "orphan_one_parent", label: "Orfan de un părinte", type: "boolean", scorable: true },
      { key: "orphan_both_parents", label: "Orfan de ambii părinți", type: "boolean", scorable: true },
      { key: "institutionalized", label: "Instituționalizat / plasament", type: "boolean", scorable: true },
      { key: "disability_certificate", label: "Certificat de handicap", type: "boolean", scorable: true },
      { key: "single_parent_family", label: "Familie monoparentală", type: "boolean", scorable: true },
    ],
  },
  {
    id: "documents",
    title: "Motivație & documente",
    description: "Documentele se încarcă într-un spațiu privat, accesibil doar echipei de evaluare.",
    fields: [
      {
        key: "motivation_letter",
        label: "Scrisoare de motivație",
        type: "textarea",
        required: true,
        helpText: "Maxim 3000 de caractere.",
        validation: { maxLength: 3000 },
      },
      { key: "doc_income", label: "Adeverințe de venit", type: "file", required: true, validation: docValidation },
      { key: "doc_transcript", label: "Foaie matricolă / diplomă Bac", type: "file", required: true, validation: docValidation },
      { key: "doc_admission", label: "Dovada admiterii la facultate", type: "file", required: true, validation: docValidation },
      { key: "doc_id", label: "Copie carte de identitate", type: "file", required: true, validation: docValidation },
      {
        key: "doc_special",
        label: "Documente situații speciale",
        type: "file",
        helpText: "Hotărâri deces/divorț/plasament, certificat de handicap etc.",
        validation: docValidation,
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

function conditionMet(cond: { field: string; equals?: unknown; truthy?: boolean }, answers: Record<string, unknown>): boolean {
  const v = answers[cond.field]
  if (cond.equals !== undefined) return v === cond.equals
  if (cond.truthy !== undefined) return Boolean(v === true || v === "true") === cond.truthy
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
