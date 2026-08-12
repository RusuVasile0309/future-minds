/** Setări globale editabile din portalul admin. */
export interface AdminSettings {
  /** Fereastra de înscriere: dacă e deschisă, candidații pot trimite aplicații. */
  applicationsOpen: boolean
  /** Cohorta curentă (ex. "2026") — țintește formularul, aplicațiile și ranking-ul. */
  currentCohort: string | null
}
