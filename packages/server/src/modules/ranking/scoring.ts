import type {
  AnswerValue,
  RankingConfig,
  RankingCriterion,
  EligibilityRule,
  IncomeConfig,
  CriterionScore,
  ScoredApplication,
  ApplicationStatus,
} from "@fm/shared"
import { applyComputedFields } from "@fm/shared"

// Cheia sintetică a criteriului de venit calculat.
export const INCOME_KEY = "income_per_member"

// Chei derivate: statutul de orfan nu se mai întreabă în formular, ci se calculează
// din bifele „decedat" ale părinților. Rămân câmpuri `scorable` în schemă.
export const ORPHAN_ONE_KEY = "orphan_one_parent"
export const ORPHAN_BOTH_KEY = "orphan_both_parents"

// Mapare implicită pe cheile din specificația formularului (docs/formular-elevi-campuri.md).
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

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(1, n))
}

/**
 * Venit net / membru de familie.
 * Venitul unui părinte se ignoră dacă e decedat sau bifează „nu mă susține".
 * Membrii = student + frați/surori în întreținere + părinții în viață.
 */
export function computeIncomePerMember(
  answers: Record<string, AnswerValue>,
  income: IncomeConfig
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

/**
 * Adaugă câmpurile derivate consumate la scoring. Statutul de orfan se calculează
 * din bifele „decedat" ale părinților (nu se mai colectează în formular): un părinte
 * decedat → orfan de un părinte; ambii → orfan de ambii părinți.
 */
export function withDerivedAnswers(
  answers: Record<string, AnswerValue>,
  income: IncomeConfig
): Record<string, AnswerValue> {
  const deceased =
    (bool(answers[income.motherDeceasedKey]) ? 1 : 0) + (bool(answers[income.fatherDeceasedKey]) ? 1 : 0)
  const next: Record<string, AnswerValue> = {
    ...answers,
    [ORPHAN_ONE_KEY]: deceased === 1,
    [ORPHAN_BOTH_KEY]: deceased === 2,
  }
  // Recalculează câmpurile calculate (ex.: media Bac) — nu ne bazăm pe valoarea din client.
  applyComputedFields(next)
  return next
}

// Normalizează un criteriu la [0,1] și întoarce și valoarea brută pentru afișare.
function scoreCriterion(
  criterion: RankingCriterion,
  answers: Record<string, AnswerValue>,
  incomePerMember: number | null
): { raw: CriterionScore["raw"]; normalized: number } {
  switch (criterion.kind) {
    case "income": {
      const raw = incomePerMember
      if (raw === null) return { raw: null, normalized: 0 }
      const min = criterion.min ?? 0
      const max = criterion.max ?? Math.max(min + 1, 5000)
      const span = max - min || 1
      const pos = clamp01((raw - min) / span)
      // implicit „lower" = venit mai mic → scor mai mare
      const normalized = criterion.direction === "higher" ? pos : 1 - pos
      return { raw, normalized }
    }
    case "numeric": {
      const raw = num(answers[criterion.fieldKey])
      const min = criterion.min ?? 0
      const max = criterion.max ?? Math.max(min + 1, 10)
      const span = max - min || 1
      const pos = clamp01((raw - min) / span)
      const normalized = criterion.direction === "lower" ? 1 - pos : pos
      return { raw, normalized }
    }
    case "option": {
      const scores = criterion.optionScores ?? {}
      const values = Object.values(scores)
      const maxScore = values.length ? Math.max(...values, 0) : 0
      const answer = answers[criterion.fieldKey]
      if (Array.isArray(answer)) {
        // multiselect: însumează punctele opțiunilor bifate
        const sum = answer.reduce((acc, v) => acc + (scores[v] ?? 0), 0)
        const denom = maxScore > 0 ? maxScore : 1
        return { raw: answer.join(", "), normalized: clamp01(sum / denom) }
      }
      const key = typeof answer === "string" ? answer : ""
      const rawScore = scores[key] ?? 0
      const denom = maxScore > 0 ? maxScore : 1
      return { raw: key || null, normalized: clamp01(rawScore / denom) }
    }
    case "boolean": {
      const checked = bool(answers[criterion.fieldKey])
      return { raw: checked, normalized: checked ? 1 : 0 }
    }
    default:
      return { raw: null, normalized: 0 }
  }
}

export function scoreApplication(
  config: RankingConfig,
  answers: Record<string, AnswerValue>,
  incomePerMember: number | null
): { total: number; percent: number; breakdown: CriterionScore[] } {
  const active = config.criteria.filter((c) => c.enabled && c.weight > 0)
  const breakdown: CriterionScore[] = []
  let total = 0
  let weightSum = 0

  for (const c of active) {
    const { raw, normalized } = scoreCriterion(c, answers, incomePerMember)
    const contribution = normalized * c.weight
    total += contribution
    weightSum += c.weight
    breakdown.push({
      criterionId: c.id,
      label: c.label,
      raw,
      normalized: Math.round(normalized * 1000) / 1000,
      weight: c.weight,
      contribution: Math.round(contribution * 1000) / 1000,
    })
  }

  const percent = weightSum > 0 ? Math.round((total / weightSum) * 1000) / 10 : 0
  return { total: Math.round(total * 1000) / 1000, percent, breakdown }
}

export function checkEligibility(
  rules: EligibilityRule[],
  answers: Record<string, AnswerValue>,
  incomePerMember: number | null
): string[] {
  const failed: string[] = []
  for (const rule of rules) {
    const rawValue = rule.fieldKey === INCOME_KEY ? incomePerMember ?? 0 : answers[rule.fieldKey]
    let ok = true
    switch (rule.op) {
      case "gte":
        ok = num(rawValue as AnswerValue) >= Number(rule.value ?? 0)
        break
      case "lte":
        ok = num(rawValue as AnswerValue) <= Number(rule.value ?? 0)
        break
      case "eq":
        ok = String(rawValue ?? "") === String(rule.value ?? "")
        break
      case "is_true":
        ok = bool(rawValue as AnswerValue)
        break
    }
    if (!ok) failed.push(rule.label)
  }
  return failed
}

export interface ScoreInput {
  applicationId: string
  fullName: string
  email: string | null
  status: ApplicationStatus
  answers: Record<string, AnswerValue>
}

// Comparator pentru tie-breaker: întoarce diferența (desc după direcție).
function compareBy(
  a: ScoredApplication,
  b: ScoredApplication,
  fieldKey: string,
  direction: "higher" | "lower",
  answersById: Map<string, Record<string, AnswerValue>>
): number {
  const get = (s: ScoredApplication): number => {
    if (fieldKey === "total_score") return s.total
    if (fieldKey === INCOME_KEY) return s.incomePerMember ?? Number.POSITIVE_INFINITY
    return num(answersById.get(s.applicationId)?.[fieldKey])
  }
  const va = get(a)
  const vb = get(b)
  return direction === "higher" ? vb - va : va - vb
}

export function rankAll(config: RankingConfig, inputs: ScoreInput[]): ScoredApplication[] {
  const answersById = new Map<string, Record<string, AnswerValue>>()

  const scored: ScoredApplication[] = inputs.map((input) => {
    // Injectează câmpurile derivate (statut orfan din bifele „decedat").
    const answers = withDerivedAnswers(input.answers, config.income)
    answersById.set(input.applicationId, answers)
    const incomePerMember = computeIncomePerMember(answers, config.income)
    const failedRules = checkEligibility(config.eligibility, answers, incomePerMember)
    const { total, percent, breakdown } = scoreApplication(config, answers, incomePerMember)
    return {
      applicationId: input.applicationId,
      fullName: input.fullName,
      email: input.email,
      status: input.status,
      eligible: failedRules.length === 0,
      failedRules,
      incomePerMember,
      total,
      percent,
      breakdown,
      rank: null,
    }
  })

  // Eligibilii se clasează; neeligibilii rămân fără rang, la coadă.
  const eligible = scored.filter((s) => s.eligible)
  const ineligible = scored.filter((s) => !s.eligible)

  eligible.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total
    for (const tb of config.tieBreakers) {
      const d = compareBy(a, b, tb.fieldKey, tb.direction, answersById)
      if (d !== 0) return d
    }
    return a.fullName.localeCompare(b.fullName, "ro")
  })

  eligible.forEach((s, i) => (s.rank = i + 1))
  ineligible.sort((a, b) => b.total - a.total)

  return [...eligible, ...ineligible]
}
