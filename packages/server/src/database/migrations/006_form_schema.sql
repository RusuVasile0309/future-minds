-- Schema dinamică a formularului de înscriere.
-- Structura (secțiuni + câmpuri) e relațională (interogabilă, ordonabilă, validată);
-- răspunsurile elevilor stau separat, în JSONB (migrația 008).

CREATE TABLE IF NOT EXISTS form_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES form_sections(id) ON DELETE CASCADE,
  -- slug stabil, imutabil — cheia de legătură cu răspunsurile și rankingul
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  help_text TEXT,
  -- 'text'|'textarea'|'number'|'select'|'multiselect'|'date'|'boolean'|'file'|'email'|'phone'
  type TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  options JSONB,       -- pt. select/multiselect: [{ value, label }]
  validation JSONB,    -- { min, max, minLength, maxLength, regex, fileTypes, maxSizeMB }
  -- adminul marchează dacă acest câmp intră în algoritmul de ranking;
  -- ponderea/direcția/scorurile se configurează separat (migrația 010)
  scorable BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  -- soft-delete: nu ștergem fizic, ca să nu rupem aplicațiile istorice
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_fields_section ON form_fields(section_id);
