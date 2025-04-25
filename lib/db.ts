import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a mock SQL client for when DATABASE_URL is not available
const mockSql = async (...args: any[]) => {
  console.error("DATABASE_URL environment variable is not defined")
  return []
}

// Configure neon to use WebSocket for better connection stability
neonConfig.fetchConnectionCache = true

// Check if DATABASE_URL is defined
const isDatabaseUrlDefined = typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0

// Create a SQL client with proper error handling
const sql = isDatabaseUrlDefined ? neon(process.env.DATABASE_URL) : mockSql

// Create a Drizzle client for more structured queries (optional)
const db = isDatabaseUrlDefined ? drizzle(sql) : null

export { sql, db }
