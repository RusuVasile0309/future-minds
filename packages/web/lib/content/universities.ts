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
  /** Limbile de studiu disponibile pentru specializare. */
  languages: StudyLanguage[];
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
          { name: "Calculatoare", languages: ["RO", "EN"] },
          { name: "Tehnologia Informației", languages: ["RO"] },
          { name: "Automatică și Informatică Aplicată", languages: ["RO", "EN"] },
        ],
      },
      {
        name: "Construcții",
        specializations: [
          { name: "Construcții civile, industriale și agricole (CCIA)", languages: ["RO", "EN"] },
          { name: "Căi ferate, drumuri și poduri (CFDP)", languages: ["RO"] },
          { name: "Amenajări și construcții hidrotehnice (ACH)", languages: ["RO"] },
          { name: "Inginerie urbană și dezvoltare regională (IUDR)", languages: ["RO"] },
          { name: "Inginerie economică în construcții", languages: ["RO"] },
          { name: "Măsurători terestre și cadastru", languages: ["RO"] },
        ],
      },
      {
        name: "Electronică, Telecomunicații și Tehnologia Informației",
        specializations: [
          { name: "Electronică Aplicată", languages: ["RO", "EN"] },
          { name: "Tehnologii și Sisteme de Telecomunicații", languages: ["RO", "EN"] },
          { name: "Microelectronică, Optoelectronică și Nanotehnologii", languages: ["RO"] },
          { name: "Inginerie Economică în Domeniul Electric, Electronic și Energetic", languages: ["RO"] },
        ],
      },
      {
        name: "Autovehicule Rutiere, Mecatronică și Mecanică",
        specializations: [
          { name: "Autovehicule Rutiere", languages: ["RO"] },
          { name: "Ingineria Transporturilor și a Traficului", languages: ["RO"] },
          { name: "Mecatronică", languages: ["RO"] },
          { name: "Mașini și Instalații pentru Agricultură și Industria Alimentară", languages: ["RO"] },
          { name: "Mecanică Fină și Nanotehnologii", languages: ["RO"] },
          { name: "Sisteme și Echipamente Termice", languages: ["RO"] },
        ],
      },
      {
        name: "Inginerie Industrială, Robotică și Managementul Producției",
        specializations: [
          { name: "Tehnologia Construcțiilor de Mașini", languages: ["RO"] },
          { name: "Design Industrial", languages: ["RO"] },
          { name: "Robotică", languages: ["RO"] },
          { name: "Inginerie Economică Industrială", languages: ["RO"] },
        ],
      },
      {
        name: "Inginerie Electrică",
        specializations: [
          { name: "Electrotehnică", languages: ["RO"] },
          { name: "Instrumentație și Achiziția Datelor", languages: ["RO"] },
          { name: "Electronică de Putere și Acționări Electrice", languages: ["RO"] },
          { name: "Electromecanică", languages: ["RO"] },
          { name: "Ingineria Sistemelor Electroenergetice", languages: ["RO"] },
          { name: "Inginerie Medicală", languages: ["RO"] },
          { name: "Inginerie Economică în domeniul Electric, Electronic și Energetic", languages: ["RO"] },
        ],
      },
      {
        name: "Ingineria Materialelor și a Mediului",
        specializations: [
          { name: "Știința Materialelor", languages: ["RO"] },
          { name: "Ingineria Procesării Materialelor", languages: ["RO"] },
          { name: "Ingineria și Protecția Mediului în Industrie", languages: ["RO"] },
        ],
      },
      {
        name: "Inginerie a Instalațiilor",
        specializations: [
          { name: "Instalații pentru construcții", languages: ["RO"] },
        ],
      },
      {
        name: "Arhitectură și Urbanism",
        specializations: [
          { name: "Arhitectură", languages: ["RO"] },
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
          { name: "Informatică", languages: ["RO", "EN", "HU", "DE"] },
          { name: "Inteligență Artificială", languages: ["EN"] },
          { name: "Ingineria Informației", languages: ["EN", "HU"] },
          { name: "Matematică-Informatică", languages: ["RO", "EN", "HU"] },
        ],
      },
      {
        name: "Științe Economice și Gestiunea Afacerilor",
        specializations: [
          { name: "Informatică Economică", languages: ["RO", "HU"] },
          { name: "Statistică economică și data science", languages: ["RO"] },
          { name: "Contabilitate și informatică de gestiune", languages: ["RO"] },
        ],
      },
      {
        name: "Fizică",
        specializations: [
          { name: "Fizică Informatică", languages: ["RO", "HU"] },
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

/** Opțiuni pentru câmpul `university` (select nivel 1). */
export function universityOptions(): { value: string; label: string }[] {
  return UNIVERSITIES.map((u) => ({ value: u.code, label: u.name }));
}

/** Facultăți pentru o universitate dată (select nivel 2, cascadă). */
export function facultyOptions(universityCode: string): { value: string; label: string }[] {
  const uni = UNIVERSITIES.find((u) => u.code === universityCode);
  if (!uni) return [];
  return uni.faculties.map((f) => ({ value: f.name, label: f.name }));
}

/** Specializări pentru o facultate dată (select nivel 3, cascadă). */
export function specializationOptions(
  universityCode: string,
  facultyName: string,
): { value: string; label: string }[] {
  const uni = UNIVERSITIES.find((u) => u.code === universityCode);
  const fac = uni?.faculties.find((f) => f.name === facultyName);
  if (!fac) return [];
  return fac.specializations.map((s) => ({ value: s.name, label: s.name }));
}

/** Limbile de studiu disponibile pentru o specializare dată (filtrează `study_language`). */
export function languageOptions(
  universityCode: string,
  facultyName: string,
  specializationName: string,
): { value: StudyLanguage; label: string }[] {
  const uni = UNIVERSITIES.find((u) => u.code === universityCode);
  const fac = uni?.faculties.find((f) => f.name === facultyName);
  const spec = fac?.specializations.find((s) => s.name === specializationName);
  if (!spec) return [];
  return spec.languages.map((l) => ({ value: l, label: STUDY_LANGUAGE_LABELS[l] }));
}
