-- Setări globale key-value (JSONB). Chei folosite:
--   applications_open      → bool, dacă înscrierile sunt deschise
--   active_form_version    → id-ul versiunii de formular active (redundant cu is_active)
--   active_ranking_config  → id-ul configului de ranking activ
--   current_cohort         → text, ex. "2026"
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
