import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Simple query to test the database connection
    const result = await sql`SELECT NOW() as time`

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      serverTime: result[0].time,
    })
  } catch (error) {
    console.error("Database connection error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
