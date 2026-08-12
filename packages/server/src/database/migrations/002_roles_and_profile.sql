-- Roluri de acces + câmpuri de profil de bază.
-- Datele de aplicație (medie, venit etc.) NU stau aici — sunt dinamice, în JSONB.
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN', 'SUPER_USER');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'STUDENT';
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
