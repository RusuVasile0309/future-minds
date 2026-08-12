-- Versionarea schemei de formular. La publicare se salvează un snapshot JSONB al
-- structurii complete (secțiuni + câmpuri). Fiecare aplicație reține versiunea cu
-- care a fost completată, deci editarea ulterioară a schemei nu rupe aplicațiile.

CREATE TABLE IF NOT EXISTS form_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version INT NOT NULL,
  cohort TEXT,                       -- ex. "2026"
  snapshot JSONB NOT NULL,           -- { sections: [ { ...section, fields: [...] } ] }
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  published_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- O singură versiune activă la un moment dat.
CREATE UNIQUE INDEX IF NOT EXISTS idx_form_versions_active
  ON form_versions(is_active) WHERE is_active = TRUE;
