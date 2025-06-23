import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

neonConfig.fetchConnectionCache = true

/**
 * Pick the first defined connection string out of all the common names
 * Vercel/Neon expose for Postgres.
 */
function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL_NO_SSL ||
    process.env.PGHOST_UNPOOLED
  )
}

const DATABASE_URL = resolveDatabaseUrl()

if (!DATABASE_URL) {
  console.warn("⚠️  No Postgres connection string found. The app will run with mock data only.")
}

// Fallback no-op sql client when DATABASE_URL missing
const mockSql = async () => []

// Real or mock SQL client
export const sql = DATABASE_URL ? neon(DATABASE_URL) : (mockSql as any)
export const db = DATABASE_URL ? drizzle(sql) : null

// ---------------------------------------------------------------------------
// 2️⃣  AUTOMATIC SCHEMA INITIALISATION
// ---------------------------------------------------------------------------
declare global {
  // ensures initSchema runs only once per Lambda/Edge cold start
  // eslint-disable-next-line no-var
  var __SCHEMA_READY__: Promise<void> | undefined
}

if (!globalThis.__SCHEMA_READY__) {
  globalThis.__SCHEMA_READY__ = initSchema()
}

export const schemaReady = globalThis.__SCHEMA_READY__

async function initSchema() {
  if (!DATABASE_URL) return // running with mock database

  // Each statement is sent separately because Neon does not allow
  // multiple commands in a single prepared statement.
  await sql`CREATE TABLE IF NOT EXISTS categories (
    name          TEXT PRIMARY KEY,
    description   TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  );`

  await sql`CREATE TABLE IF NOT EXISTS products (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    description   TEXT,
    price         NUMERIC(10,2) NOT NULL,
    image         TEXT,
    category      TEXT REFERENCES categories(name) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  );`

  await sql`CREATE TABLE IF NOT EXISTS inventory (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity      INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  );`

  await sql`CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT,
    email         TEXT UNIQUE NOT NULL,
    password      TEXT NOT NULL,
    role          TEXT DEFAULT 'customer',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  );`

  await sql`CREATE TABLE IF NOT EXISTS orders (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users(id),
    status        TEXT DEFAULT 'pending',
    total         NUMERIC(10,2) NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
  );`

  await sql`CREATE TABLE IF NOT EXISTS order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id    UUID REFERENCES products(id),
    quantity      INTEGER NOT NULL,
    price         NUMERIC(10,2) NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
  );`

  console.info("✅ Database schema is ready")
}
