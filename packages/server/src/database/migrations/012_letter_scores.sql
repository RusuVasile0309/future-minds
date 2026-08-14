-- Note manuale (1–3) acordate de SUPER_USER celor două scrisori (intenție și
-- recomandare). Contează la ranking prin câmpuri `derived` + `scorable` din schemă.
ALTER TABLE applications
  ADD COLUMN cover_letter_score smallint CHECK (cover_letter_score BETWEEN 1 AND 3),
  ADD COLUMN recommendation_letter_score smallint CHECK (recommendation_letter_score BETWEEN 1 AND 3);
