import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword, setAuthCookie } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUsers = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id::text, name, email, role
    `

    if (newUsers.length === 0) {
      return NextResponse.json({ message: "Failed to create user" }, { status: 500 })
    }

    const user = newUsers[0]

    // Set auth cookie
    setAuthCookie(user.id, user.role)

    // Return user info
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
