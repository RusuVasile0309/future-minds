-- Aplicațiile elevilor. Răspunsurile stau în JSONB, cheiate pe `key`-ul câmpului
-- (stabil). Fiecare aplicație e ancorată pe versiunea de formular cu care a fost
-- completată și pe cohortă, deci editarea ulterioară a schemei nu o rupe.

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  form_version_id UUID REFERENCES form_versions(id) ON DELETE SET NULL,
  cohort TEXT NOT NULL DEFAULT 'default',
  status TEXT NOT NULL DEFAULT 'draft', -- draft|submitted|under_review|accepted|rejected|waitlist
  answers JSONB NOT NULL DEFAULT '{}',  -- { "<field_key>": <value> }
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- o aplicație per elev per cohortă (poate reveni s-o editeze)
  UNIQUE(user_id, cohort)
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_cohort ON applications(cohort);
CREATE INDEX IF NOT EXISTS idx_applications_answers_gin ON applications USING GIN (answers);
