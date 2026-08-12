-- Configurarea algoritmului de ranking. Config-ul de lucru (editabil) e un singur
-- rând per cohortă, ținut ca JSONB. La publicare se snapshotează într-o versiune
-- imutabilă, astfel încât un clasament să poată fi reprodus cu regulile din momentul
-- publicării, iar editările ulterioare să nu-l rescrie retroactiv.

CREATE TABLE IF NOT EXISTS ranking_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort TEXT NOT NULL UNIQUE,        -- ex. "2026" — un singur config de lucru per cohortă
  config JSONB NOT NULL,              -- { criteria, eligibility, tieBreakers, income }
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ranking_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version INT NOT NULL,
  cohort TEXT,                        -- ex. "2026"
  config JSONB NOT NULL,              -- snapshot al config-ului la publicare
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  published_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- O singură versiune activă de ranking la un moment dat.
CREATE UNIQUE INDEX IF NOT EXISTS idx_ranking_versions_active
  ON ranking_versions(is_active) WHERE is_active = TRUE;
