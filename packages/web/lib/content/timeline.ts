/**
 * Fereastra de înscriere a ediției curente — sursă unică pentru datele afișate pe
 * site (home, Bursa, CTA). Dacă trebuie schimbate des / din admin, se pot muta în
 * setările din DB; deocamdată sunt constante de conținut.
 *
 * Ediția noiembrie 2026: lansare 12 nov, termen 23 dec (fereastră de 6 săptămâni).
 */
export const APPLICATION_LAUNCH_LABEL = "12 noiembrie 2026"
export const APPLICATION_DEADLINE_LABEL = "23 decembrie 2026"
/** Durata ferestrei de înscriere (12 nov – 23 dec inclusiv = 42 de zile = 6 săptămâni). */
export const APPLICATION_WINDOW_WEEKS = 6
/** Numărul de burse din ediția curentă. */
export const SCHOLARSHIPS_THIS_EDITION = 5
