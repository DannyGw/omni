import { NextResponse } from "next/server"
import { getUserFromSession } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const session = await getUserFromSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if email is already taken by another user
    if (email !== session.email) {
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${email} AND id != ${session.id}
      `
      if (existingUser.length > 0) {
        return NextResponse.json({ message: "Email is already in use" }, { status: 409 })
      }
    }

    // Update user profile
    await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${session.id}
    `

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
