export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "date"
  | "boolean"
  | "file"
  | "email"
  | "phone"

export interface FieldOption {
  value: string
  label: string
}

export interface FieldValidation {
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  regex?: string
  fileTypes?: string[]
  maxSizeMB?: number
}

// Sursă dinamică de opțiuni pentru câmpurile în cascadă (rezolvată în client din
// dataset-uri: universități, discipline Bac). Câmpurile cu opțiuni statice au
// `options` populat și `optionsSource` absent.
export type OptionSource = "faculty" | "specialization" | "study_language" | "bac_subject"

// O condiție elementară pe un alt câmp din formular.
export interface FieldCondition {
  field: string
  // Afișează când `field` este exact egal cu această valoare.
  equals?: string | number | boolean
  // Afișează când valoarea (booleană) a lui `field` corespunde: true = bifat, false = nebifat.
  truthy?: boolean
}

// Vizibilitate condiționată: `all` = ȘI logic, `any` = SAU logic.
export interface VisibleWhen {
  all?: FieldCondition[]
  any?: FieldCondition[]
}

export interface FormField {
  id: string
  sectionId: string
  key: string
  label: string
  helpText: string | null
  type: FieldType
  required: boolean
  options: FieldOption[] | null
  validation: FieldValidation | null
  scorable: boolean
  sortOrder: number
  archived: boolean
  // ── Comportamente ale schemei statice ──────────────────────────────────────
  // Opțiuni derivate dintr-un dataset în funcție de `dependsOn` (cascadă).
  optionsSource?: OptionSource
  // Câmpurile-părinte de care depinde acest câmp (cascadă / excludere reciprocă).
  dependsOn?: string[]
  // Afișat doar când condițiile sunt îndeplinite (altfel ascuns și ignorat la validare).
  visibleWhen?: VisibleWhen
  // Câmp boolean care trebuie să fie `true` pentru a trece validarea (consimțăminte).
  requiredTrue?: boolean
}

export interface FormSection {
  id: string
  title: string
  description: string | null
  sortOrder: number
  fields: FormField[]
}
