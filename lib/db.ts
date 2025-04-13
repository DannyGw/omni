import { neon } from "@neondatabase/serverless"

// Create a SQL client using the DATABASE_URL environment variable
const sql = neon(process.env.DATABASE_URL!)

export { sql }
