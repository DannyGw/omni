import { NextResponse } from "next/server"
import { getUserFromSession, hashPassword, verifyPassword } from "@/lib/auth-utils"
import { sql } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const session = await getUserFromSession(request)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get current user with password
    const users = await sql`
      SELECT password FROM users WHERE id = ${session.id}
    `

    if (users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Verify current password
    const isPasswordValid = await verifyPassword(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password
    await sql`
      UPDATE users
      SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${session.id}
    `

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Password update error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
