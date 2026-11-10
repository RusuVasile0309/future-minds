import type { AnswerValue } from "./types/application"
import type { IncomeConfig } from "./types/ranking"

/**
 * Pragul de venit net pe membru de familie (lei). Sub acest prag, candidatul se
 * încadrează la criteriul de venit; de la el în sus (>=), nu. Folosit la afișarea
 * din formular și pe pagina de eligibilitate. Eligibilitatea finală la ranking e
 * configurată separat de admin (o regulă `lte` pe `income_per_member`).
 */
export const INCOME_PER_MEMBER_THRESHOLD = 2500

/** Mapare implicită pe cheile câmpurilor de venit din formularul static. */
export const DEFAULT_INCOME_CONFIG: IncomeConfig = {
  studentIncomeKey: "student_income",
  motherIncomeKey: "mother_income",
  fatherIncomeKey: "father_income",
  dependentsKey: "dependents_count",
  motherDeceasedKey: "mother_deceased",
  fatherDeceasedKey: "father_deceased",
  motherSupportsKey: "mother_supports",
  fatherSupportsKey: "father_supports",
}

function num(v: AnswerValue | undefined): number {
  if (typeof v === "number") return v
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(",", "."))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function bool(v: AnswerValue | undefined): boolean {
  return v === true || v === "true"
}

/**
 * Venit net / membru de familie. Venitul unui părinte se ignoră dacă e decedat sau
 * bifează „nu mă susține". Membrii = student + frați/surori în întreținere + părinții
 * în viață. `null` dacă nu există membri (date incomplete). Sursă unică, folosită și
 * la scoring (server), și la validarea/afișarea din formular (client).
 */
export function computeIncomePerMember(
  answers: Record<string, AnswerValue>,
  income: IncomeConfig = DEFAULT_INCOME_CONFIG
): number | null {
  // Un părinte „iese" din calcul dacă e decedat SAU nu bifează că susține financiar.
  const motherOut = bool(answers[income.motherDeceasedKey]) || !bool(answers[income.motherSupportsKey])
  const fatherOut = bool(answers[income.fatherDeceasedKey]) || !bool(answers[income.fatherSupportsKey])

  const studentIncome = num(answers[income.studentIncomeKey])
  const motherIncome = motherOut ? 0 : num(answers[income.motherIncomeKey])
  const fatherIncome = fatherOut ? 0 : num(answers[income.fatherIncomeKey])

  const dependents = Math.max(0, Math.round(num(answers[income.dependentsKey])))
  const members =
    1 +
    dependents +
    (bool(answers[income.motherDeceasedKey]) ? 0 : 1) +
    (bool(answers[income.fatherDeceasedKey]) ? 0 : 1)

  if (members <= 0) return null
  const total = studentIncome + motherIncome + fatherIncome
  return Math.round((total / members) * 100) / 100
}
