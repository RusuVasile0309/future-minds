import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let _sql: NeonQueryFunction<false, false> | null = null

function getSQL(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    // The driver issues each query as an HTTP POST via global fetch, which
    // Next.js patches and caches. Two identical queries (same SQL text and
    // params) therefore serve the first response forever — a read whose text
    // never varies, like a settings lookup, pins itself to whatever the value
    // was on first call and never sees a later write. Opt every query out.
    _sql = neon(process.env.DATABASE_URL, { fetchOptions: { cache: "no-store" } })
  }
  return _sql
}

// Lazy proxy: the connection is created on first use, so importing this module
// at build time (e.g. from a service imported into a Next.js route) is safe.
export const sql: NeonQueryFunction<false, false> = new Proxy(function () {} as unknown as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args) {
    return (getSQL() as unknown as (...a: unknown[]) => unknown)(...args)
  },
  get(_target, prop) {
    return (getSQL() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
