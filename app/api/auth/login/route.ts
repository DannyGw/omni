import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyPassword, setAuthCookie } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get user from database
    const users = await sql`
      SELECT id::text, name, email, password, role
      FROM users
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Set auth cookie
    setAuthCookie(user.id, user.role)

    // Return user info (without password)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
