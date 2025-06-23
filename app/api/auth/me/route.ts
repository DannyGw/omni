import { NextResponse } from "next/server"
import { getUserFromSession } from "@/lib/auth-utils"
import { sql } from "@/lib/db"
import { clearAuthCookie } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const session = await getUserFromSession(request)

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Get user details from database
    const users = await sql`
      SELECT id::text, name, email, role
      FROM users
      WHERE id = ${session.id}
    `

    if (users.length === 0) {
      clearAuthCookie()
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user: users[0] })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
