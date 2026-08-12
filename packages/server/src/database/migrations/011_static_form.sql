-- 011: Formular STATIC.
-- Schema formularului nu mai este dinamică (definită în cod: @fm/shared FORM_SCHEMA).
-- Renunțăm la infrastructura de form builder și versionare a formularului.
-- Ponderile/criteriile de ranking rămân dinamice (ranking_configs / ranking_versions).

-- Legătura aplicație → versiune de formular nu mai există.
ALTER TABLE applications DROP COLUMN IF EXISTS form_version_id;

-- Tabelele form builder (CASCADE curăță constrângerile / indecșii dependenți).
DROP TABLE IF EXISTS form_versions CASCADE;
DROP TABLE IF EXISTS form_fields CASCADE;
DROP TABLE IF EXISTS form_sections CASCADE;
