-- Fișiere încărcate de elevi (adeverințe, foaie matricolă etc.).
-- Documentele sensibile stau într-un bucket R2 PRIVAT; în DB reținem doar cheia
-- obiectului. Se servesc exclusiv prin URL semnate, din rute autentificate.

CREATE TABLE IF NOT EXISTS application_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  field_key TEXT NOT NULL,        -- câmpul de tip fișier de care aparține
  storage_key TEXT NOT NULL,      -- cheia obiectului în R2 (bucket privat)
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_application_files_app ON application_files(application_id);
