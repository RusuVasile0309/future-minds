-- Note manuale (0–1, în pași de 0.25) acordate de SUPER_USER celor trei sub-câmpuri
-- de implicare (job / proiecte / voluntariat). Media lor formează criteriul unic
-- „Implicare" la ranking (câmp `implicare_score`, derived + scorable, pondere 5).
ALTER TABLE applications
  ADD COLUMN implicare_job_score numeric(3, 2) CHECK (implicare_job_score IN (0, 0.25, 0.5, 0.75, 1)),
  ADD COLUMN implicare_proiecte_score numeric(3, 2) CHECK (implicare_proiecte_score IN (0, 0.25, 0.5, 0.75, 1)),
  ADD COLUMN implicare_voluntariat_score numeric(3, 2) CHECK (implicare_voluntariat_score IN (0, 0.25, 0.5, 0.75, 1));
