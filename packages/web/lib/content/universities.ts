/**
 * Dataset universități → facultăți → specializări (+ limbi de studiu) pentru
 * cascada din formularul de înscriere (Secțiunea 4 — Facultate).
 *
 * Sursă: „Specializari Facultati - Future Minds" (UTCN + UBB, Cluj-Napoca).
 * Structura alimentează câmpurile dependente `university` → `faculty` →
 * `specialization`, iar limbile filtrează câmpul `study_language`.
 *
 * Actualizează AICI lista atunci când se schimbă oferta; toate cascadele
 * și validările derivă din acest fișier (single source of truth).
 */

export type StudyLanguage = "RO" | "EN" | "HU" | "DE";

export interface Specialization {
  /** Denumire afișată (și valoare stocată în răspuns). */
  name: string;
  /**
   * Limbile de studiu disponibile pentru specializare. Lipsă/gol = toate
   * limbile sunt eligibile (nu le mai listăm, ca să nu omitem vreuna).
   */
  languages?: StudyLanguage[];
}

export interface Faculty {
  name: string;
  specializations: Specialization[];
}

export interface University {
  /** Cod scurt folosit ca valoare a câmpului `university`. */
  code: string;
  /** Denumire completă (afișată în pagini/detaliu). */
  name: string;
  faculties: Faculty[];
}

export const UNIVERSITIES: University[] = [
  {
    code: "UTCN",
    name: "Universitatea Tehnică din Cluj-Napoca",
    faculties: [
      {
        name: "Automatică și Calculatoare",
        specializations: [
          { name: "Calculatoare" },
          { name: "Tehnologia Informației" },
          { name: "Automatică și Informatică Aplicată" },
        ],
      },
      {
        name: "Construcții",
        specializations: [
          { name: "Construcții civile, industriale și agricole (CCIA)" },
          { name: "Căi ferate, drumuri și poduri (CFDP)" },
          { name: "Amenajări și construcții hidrotehnice (ACH)" },
          { name: "Inginerie urbană și dezvoltare regională (IUDR)" },
          { name: "Inginerie economică în construcții" },
          { name: "Măsurători terestre și cadastru" },
        ],
      },
      {
        name: "Electronică, Telecomunicații și Tehnologia Informației",
        specializations: [
          { name: "Electronică Aplicată" },
          { name: "Tehnologii și Sisteme de Telecomunicații" },
          { name: "Microelectronică, Optoelectronică și Nanotehnologii" },
          { name: "Inginerie Economică în Domeniul Electric, Electronic și Energetic" },
        ],
      },
      {
        name: "Autovehicule Rutiere, Mecatronică și Mecanică",
        specializations: [
          { name: "Autovehicule Rutiere" },
          { name: "Ingineria Transporturilor și a Traficului" },
          { name: "Mecatronică" },
          { name: "Mașini și Instalații pentru Agricultură și Industria Alimentară" },
          { name: "Mecanică Fină și Nanotehnologii" },
          { name: "Sisteme și Echipamente Termice" },
        ],
      },
      {
        name: "Inginerie Industrială, Robotică și Managementul Producției",
        specializations: [
          { name: "Tehnologia Construcțiilor de Mașini" },
          { name: "Design Industrial" },
          { name: "Robotică" },
          { name: "Inginerie Economică Industrială" },
        ],
      },
      {
        name: "Inginerie Electrică",
        specializations: [
          { name: "Electrotehnică" },
          { name: "Instrumentație și Achiziția Datelor" },
          { name: "Electronică de Putere și Acționări Electrice" },
          { name: "Electromecanică" },
          { name: "Ingineria Sistemelor Electroenergetice" },
          { name: "Inginerie Medicală" },
          { name: "Inginerie Economică în domeniul Electric, Electronic și Energetic" },
        ],
      },
      {
        name: "Ingineria Materialelor și a Mediului",
        specializations: [
          { name: "Știința Materialelor" },
          { name: "Ingineria Procesării Materialelor" },
          { name: "Ingineria și Protecția Mediului în Industrie" },
        ],
      },
      {
        name: "Inginerie a Instalațiilor",
        specializations: [
          { name: "Instalații pentru construcții" },
        ],
      },
      {
        name: "Arhitectură și Urbanism",
        specializations: [
          { name: "Arhitectură" },
        ],
      },
    ],
  },
  {
    code: "UBB",
    name: "Universitatea Babeș-Bolyai",
    faculties: [
      {
        name: "Matematică și Informatică",
        specializations: [
          { name: "Informatică" },
          { name: "Inteligență Artificială" },
          { name: "Ingineria Informației" },
          { name: "Matematică-Informatică" },
        ],
      },
      {
        name: "Științe Economice și Gestiunea Afacerilor",
        specializations: [
          { name: "Informatică Economică" },
        ],
      },
    ],
  },
];

/** Eticheta afișată pentru fiecare limbă de studiu. */
export const STUDY_LANGUAGE_LABELS: Record<StudyLanguage, string> = {
  RO: "Română",
  EN: "Engleză",
  HU: "Maghiară",
  DE: "Germană",
};

/** Opțiuni pentru câmpul `university` (select nivel 1). Afișăm codul scurt (UTCN / UBB). */
export function universityOptions(): { value: string; label: string }[] {
  return UNIVERSITIES.map((u) => ({ value: u.code, label: u.code }));
}

/** Facultăți pentru o universitate dată (select nivel 2, cascadă). */
export function facultyOptions(universityCode: string): { value: string; label: string }[] {
  const uni = UNIVERSITIES.find((u) => u.code === universityCode);
  if (!uni) return [];
  return uni.faculties.map((f) => ({ value: f.name, label: f.name }));
}

/**
 * Valoare „nespecificat" pentru specializare — oferită la TOATE facultățile,
 * pentru cazul în care specializarea studentului nu e în listă. E răspuns valid
 * (non-gol, deci trece de obligativitate), iar la limba de studiu deblochează
 * toate limbile (vezi `languageOptions`).
 */
export const SPECIALIZATION_UNSPECIFIED = "-";

const ALL_LANGUAGES = Object.keys(STUDY_LANGUAGE_LABELS) as StudyLanguage[];

/** Specializări pentru o facultate dată (select nivel 3, cascadă). */
export function specializationOptions(
  universityCode: string,
  facultyName: string,
): { value: string; label: string }[] {
  const uni = UNIVERSITIES.find((u) => u.code === universityCode);
  const fac = uni?.faculties.find((f) => f.name === facultyName);
  if (!fac) return [];
  // Varianta „-" apare prima, la orice facultate.
  return [
    { value: SPECIALIZATION_UNSPECIFIED, label: SPECIALIZATION_UNSPECIFIED },
    ...fac.specializations.map((s) => ({ value: s.name, label: s.name })),
  ];
}

/** Limbile de studiu disponibile pentru o specializare dată (filtrează `study_language`). */
export function languageOptions(
  universityCode: string,
  facultyName: string,
  specializationName: string,
): { value: StudyLanguage; label: string }[] {
  // „-" (specializare nespecificată) → oferă toate limbile, ca formularul să poată continua.
  if (specializationName === SPECIALIZATION_UNSPECIFIED) {
    return ALL_LANGUAGES.map((l) => ({ value: l, label: STUDY_LANGUAGE_LABELS[l] }));
  }
  const uni = UNIVERSITIES.find((u) => u.code === universityCode);
  const fac = uni?.faculties.find((f) => f.name === facultyName);
  const spec = fac?.specializations.find((s) => s.name === specializationName);
  if (!spec) return [];
  const langs = spec.languages?.length ? spec.languages : ALL_LANGUAGES;
  return langs.map((l) => ({ value: l, label: STUDY_LANGUAGE_LABELS[l] }));
}
