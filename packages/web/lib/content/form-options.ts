/**
 * Rezolvarea opțiunilor DINAMICE pentru câmpurile în cascadă din formularul
 * static (facultate → specializare → limbă) și excluderea reciprocă a
 * disciplinelor de Bacalaureat. Sursele de date (universități) sunt locale
 * clientului; schema (`@fm/shared`) declară doar `optionsSource` + `dependsOn`.
 */

import type { AnswerValue, FieldOption, FormField } from "@fm/shared"
import { BAC_SUBJECTS, FORM_SCHEMA } from "@fm/shared"
import {
  facultyOptions,
  specializationOptions,
  languageOptions,
} from "@/lib/content/universities"

function str(v: AnswerValue | undefined): string {
  return typeof v === "string" ? v : ""
}

/**
 * Opțiunile efective ale unui câmp, în funcție de răspunsurile curente:
 *  - câmpuri cu opțiuni statice → `field.options`;
 *  - cascadă universitate → `optionsSource` din dataset;
 *  - discipline Bac → lista completă minus disciplinele deja alese în câmpurile-părinte.
 */
export function resolveFieldOptions(field: FormField, answers: Record<string, AnswerValue>): FieldOption[] {
  if (!field.optionsSource) return field.options ?? []

  switch (field.optionsSource) {
    case "faculty":
      return facultyOptions(str(answers.university))
    case "specialization":
      return specializationOptions(str(answers.university), str(answers.faculty))
    case "study_language":
      return languageOptions(str(answers.university), str(answers.faculty), str(answers.specialization))
    case "bac_subject": {
      const taken = new Set((field.dependsOn ?? []).map((k) => str(answers[k])).filter(Boolean))
      return BAC_SUBJECTS.filter((s) => !taken.has(s)).map((s) => ({ value: s, label: s }))
    }
    default:
      return []
  }
}

// Map: cheie-părinte → câmpurile care depind direct de ea.
const CHILDREN: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {}
  for (const section of FORM_SCHEMA) {
    for (const field of section.fields) {
      for (const parent of field.dependsOn ?? []) {
        ;(map[parent] ??= []).push(field.key)
      }
    }
  }
  return map
})()

/**
 * Golește recursiv răspunsurile câmpurilor dependente atunci când un câmp-părinte
 * se schimbă (cascadă univ→facultate→…; excludere Bac). Mutează `answers`.
 */
export function clearDependentAnswers(answers: Record<string, AnswerValue>, changedKey: string): void {
  for (const childKey of CHILDREN[changedKey] ?? []) {
    if (answers[childKey] !== undefined && answers[childKey] !== null && answers[childKey] !== "") {
      delete answers[childKey]
    }
    clearDependentAnswers(answers, childKey)
  }
}
