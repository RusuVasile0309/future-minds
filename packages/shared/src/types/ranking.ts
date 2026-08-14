import type { ApplicationStatus } from "./application"

// ── Configurarea algoritmului de ranking ─────────────────────────────────────

/** Cum se transformă un câmp într-un scor normalizat [0,1]. */
export type CriterionKind =
  | "numeric" // câmp number: normalizat pe intervalul [min,max], cu direcție
  | "option" // câmp select/multiselect: scor per opțiune
  | "boolean" // câmp checkbox: bonus dacă e bifat
  | "income" // criteriu calculat: venit net / membru de familie (mai mic = mai bine)

export type Direction = "higher" | "lower"

export interface RankingCriterion {
  /** Id stabil în cadrul config-ului. */
  id: string
  /** Cheia câmpului din formular (sau "income_per_member" pentru criteriul calculat). */
  fieldKey: string
  /** Etichetă afișată (cache din label-ul câmpului). */
  label: string
  kind: CriterionKind
  /** Pondere aplicată scorului normalizat. 0 = criteriu ignorat. */
  weight: number
  /** Activ în calcul. */
  enabled: boolean

  // numeric / income
  direction?: Direction
  min?: number
  max?: number

  // option: valoare opțiune → puncte brute (normalizate prin max-ul configurat)
  optionScores?: Record<string, number>

  // boolean: puncte brute când e bifat (normalizate la 1)
  bonus?: number
}

export type EligibilityOp = "gte" | "lte" | "eq" | "is_true"

export interface EligibilityRule {
  id: string
  fieldKey: string
  op: EligibilityOp
  value?: number | string
  label: string
}

export interface TieBreaker {
  /** Cheie câmp, "income_per_member" sau "total_score". */
  fieldKey: string
  direction: Direction
}

/** Maparea câmpurilor din care se derivă venitul net / membru de familie. */
export interface IncomeConfig {
  studentIncomeKey: string
  motherIncomeKey: string
  fatherIncomeKey: string
  dependentsKey: string
  motherDeceasedKey: string
  fatherDeceasedKey: string
  /** Venitul unui părinte se ia în calcul doar dacă bifează „mă susține financiar". */
  motherSupportsKey: string
  fatherSupportsKey: string
}

export interface RankingConfig {
  criteria: RankingCriterion[]
  eligibility: EligibilityRule[]
  tieBreakers: TieBreaker[]
  income: IncomeConfig
}

export interface RankingVersion {
  id: string
  version: number
  cohort: string | null
  config: RankingConfig
  isActive: boolean
  publishedAt: Date | null
  publishedBy: string | null
}

// ── Rezultatul scoring-ului ───────────────────────────────────────────────────

export interface CriterionScore {
  criterionId: string
  label: string
  /** Valoarea brută a câmpului (afișare). */
  raw: number | string | boolean | null
  /** Scor normalizat [0,1]. */
  normalized: number
  weight: number
  /** Contribuția ponderată la total (weight × normalized). */
  contribution: number
}

export interface ScoredApplication {
  applicationId: string
  fullName: string
  email: string | null
  status: ApplicationStatus
  eligible: boolean
  /** Motivele neeligibilității (reguli picate). */
  failedRules: string[]
  /** Venit net / membru de familie, calculat. */
  incomePerMember: number | null
  /** Scor total ponderat. */
  total: number
  /** Procent din scorul maxim posibil (Σ ponderi). */
  percent: number
  breakdown: CriterionScore[]
  /** Poziția în clasament (1 = primul); null pentru neeligibili. */
  rank: number | null
}
