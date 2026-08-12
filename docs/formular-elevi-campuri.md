# Formular înscriere elevi — specificație câmpuri

> Document de referință pentru câmpurile formularului de aplicare (cohorta curentă).
> Doar specificație — nu conține implementare. Câmpurile marcate „Scorabil" intră în algoritmul de ranking.

## Decizii luate
- **Note Bac:** 3 dropdown-uri libere cu toate disciplinele + **excludere reciprocă** (disciplina aleasă dispare din următoarele dropdown-uri).
- **Facultate:** cascadă pe **3 niveluri** — Universitate → Facultate → Specializare (+ limbă de studiu).
- **CNP:** NU se colectează la aplicare — doar la contractare (reducem expunerea datelor sensibile).
- **Includem tot:** situații speciale, motivație, documente, consimțăminte.

---

## Secțiunea 1 — Date personale
| key | Label | Tip | Oblig. | Scor. | Note |
|---|---|---|---|---|---|
| `last_name` | Nume | text | ✅ | – | |
| `first_name` | Prenume | text | ✅ | – | |
| `birth_date` | Data nașterii | date | ✅ | – | |
| `email` | Email | email | ✅ | – | prefill din cont |
| `phone` | Telefon | tel | ✅ | – | prefill din cont |

## Secțiunea 2 — Adresă
| key | Label | Tip | Oblig. | Scor. | Note |
|---|---|---|---|---|---|
| `county` | Județ | select | ✅ | – | opțiuni din dataset SIRUTA |
| `city` | Localitate | select | ✅ | – | **cascadă** din `county` |
| `street` | Stradă | text | ✅ | – | |
| `street_number` | Număr | text | ✅ | – | |
| `building` | Bloc | text | – | – | |
| `entrance` | Scară | text | – | – | |
| `floor` | Etaj | text | – | – | |
| `apartment` | Apartament | text | – | – | |
| `postal_code` | Cod poștal | text | – | – | text liber (fără API gratuit curat) |
| `environment` | Mediu | select {urban, rural} | ✅ | ✅ | rural = bonus |

## Secțiunea 3 — Rezultate Bac
| key | Label | Tip | Oblig. | Scor. | Note |
|---|---|---|---|---|---|
| `bac_subject_1` | Disciplina 1 | select | ✅ | – | toate disciplinele |
| `bac_grade_1` | Nota 1 | number | ✅ | opțional | step 0.01, min 1.00, max 10.00 |
| `bac_subject_2` | Disciplina 2 | select | ✅ | – | **exclude** valoarea din `subject_1` |
| `bac_grade_2` | Nota 2 | number | ✅ | opțional | step 0.01, min 1.00, max 10.00 |
| `bac_subject_3` | Disciplina 3 | select | ✅ | – | **exclude** `subject_1` + `subject_2` |
| `bac_grade_3` | Nota 3 | number | ✅ | opțional | step 0.01, min 1.00, max 10.00 |
| `bac_average` | Media Bac | number | ✅ | ✅ | mai mare = mai bine |
| `highschool_average` | Media generală liceu | number | ✅ | ✅ | mai mare = mai bine |

## Secțiunea 4 — Facultate (cascadă pe 3 niveluri)
| key | Label | Tip | Oblig. | Scor. | Note |
|---|---|---|---|---|---|
| `university` | Universitate | select {UTCN, UBB} | ✅ | – | |
| `faculty` | Facultate | select | ✅ | – | **cascadă** din `university` |
| `specialization` | Specializare | select | ✅ | – | **cascadă** din `faculty` |
| `study_language` | Limbă studiu | select {RO, EN, HU, DE} | ✅ | – | filtrată după specializare |

## Secțiunea 5 — Situație financiară
| key | Label | Tip | Oblig. | Scor. | Note |
|---|---|---|---|---|---|
| `student_employed` | Sunt angajat | checkbox | – | – | |
| `student_income` | Venit net lunar student (RON) | number | condiționat | – | vizibil dacă `student_employed` bifat |
| `mother_last_name` | Nume mamă | text | ✅ | – | |
| `mother_first_name` | Prenume mamă | text | ✅ | – | |
| `mother_deceased` | Mama decedată | checkbox | – | – | |
| `mother_no_support` | Mama nu mă susține financiar | checkbox | – | – | |
| `mother_income` | Venit net lunar mamă (RON) | number | condiționat | – | ascuns dacă decedată / nu susține |
| `father_last_name` | Nume tată | text | ✅ | – | |
| `father_first_name` | Prenume tată | text | ✅ | – | |
| `father_deceased` | Tatăl decedat | checkbox | – | – | |
| `father_no_support` | Tatăl nu mă susține financiar | checkbox | – | – | |
| `father_income` | Venit net lunar tată (RON) | number | condiționat | – | ascuns dacă decedat / nu susține |
| `dependents_count` | Nr. frați/surori în întreținere | number | ✅ | – | intră în calculul venitului/membru |
| `income_per_member` | Venit net / membru familie | **calculat** | – | ✅ | = (venit student + părinți) / membri; **mai mic = scor mai mare**; NU se completează de user |

## Secțiunea 6 — Situații speciale
Checkbox-uri, toate scorabile (bonus fix per bifă):
| key | Label |
|---|---|
| `orphan_one_parent` | Orfan de un părinte |
| `orphan_both_parents` | Orfan de ambii părinți |
| `institutionalized` | Instituționalizat / plasament |
| `disability_certificate` | Certificat de handicap |
| `single_parent_family` | Familie monoparentală |

> Mediul rural este acoperit de câmpul `environment` din Secțiunea 2.

## Secțiunea 7 — Motivație & documente
Upload-uri în bucket privat (acces doar prin rută admin autentificată).
| key | Label | Tip | Oblig. | Note |
|---|---|---|---|---|
| `motivation_letter` | Scrisoare de motivație | textarea | ✅ | maxlength ~3000 caractere |
| `doc_income` | Adeverințe venit | file | ✅ | |
| `doc_transcript` | Foaie matricolă / diplomă Bac | file | ✅ | |
| `doc_admission` | Dovada admiterii la facultate | file | ✅ | |
| `doc_id` | Copie CI | file | ✅ | |
| `doc_special` | Documente situații speciale | file | – | hotărâri deces/divorț/plasament, certificat handicap |

## Secțiunea 8 — Consimțăminte
| key | Label | Tip | Oblig. | Note |
|---|---|---|---|---|
| `gdpr_consent` | Sunt de acord cu prelucrarea datelor (GDPR) | checkbox | ✅ | trebuie `true` |
| `declaration` | Declar pe propria răspundere că datele sunt corecte | checkbox | ✅ | trebuie `true` |

---

## Note tehnice de atenție
1. **Cascada** (județ→localitate, univ→facultate→specializare, limbă): necesită câmp „dependent select" (opțiuni filtrate după valoarea unui câmp-părinte) — nu e câmp select standard.
2. **Excludere reciprocă Bac:** dropdown-urile 2 și 3 elimină disciplinele deja alese în dropdown-urile anterioare.
3. **`income_per_member`** nu e câmp de input — se derivă la momentul scoring-ului din celelalte câmpuri; ține-l în afara schemei de răspunsuri.

## Direcție ranking (câmpuri scorabile)
| Câmp | Direcție |
|---|---|
| `income_per_member` | mai mic → scor mai mare (criteriul principal) |
| `bac_average` | mai mare → mai bine |
| `highschool_average` | mai mare → mai bine |
| `environment = rural` | bonus fix |
| Situații speciale (Secțiunea 6) | bonus fix per bifă |
