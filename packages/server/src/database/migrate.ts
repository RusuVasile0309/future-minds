import { Client } from "pg"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"

// Load .env.local when running locally
function loadEnv() {
  try {
    const envPath = join(__dirname, "../../../../.env.local")
    const content = readFileSync(envPath, "utf-8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eqIdx = trimmed.indexOf("=")
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      let val = trimmed.slice(eqIdx + 1).trim()
      // strip surrounding quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    // .env.local absent in CI/production — env vars already injected
  }
}

async function migrate() {
  loadEnv()

  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  if (!connectionString) throw new Error("DIRECT_URL (or DATABASE_URL) environment variable is not set")

  const client = new Client({ connectionString })
  await client.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    const migrationsDir = join(__dirname, "migrations")
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort()

    for (const filename of files) {
      const { rows } = await client.query(
        "SELECT id FROM _migrations WHERE filename = $1",
        [filename]
      )
      if (rows.length > 0) {
        console.log(`Skipped (already applied): ${filename}`)
        continue
      }

      const sqlText = readFileSync(join(migrationsDir, filename), "utf-8")
      await client.query("BEGIN")
      try {
        await client.query(sqlText)
        await client.query("INSERT INTO _migrations (filename) VALUES ($1)", [filename])
        await client.query("COMMIT")
        console.log(`Applied: ${filename}`)
      } catch (err) {
        await client.query("ROLLBACK")
        throw err
      }
    }

    console.log("Migrations complete.")
  } finally {
    await client.end()
  }
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
