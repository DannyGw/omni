import { NextResponse } from "next/server"
import { verifyJWT } from "@/lib/jwt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 400 })
    }

    const payload = verifyJWT(token)

    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({ user: payload })
  } catch (error) {
    console.error("Token validation error:", error)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
