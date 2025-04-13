import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth-utils"

export async function POST() {
  clearAuthCookie()
  return NextResponse.json({ message: "Logged out successfully" })
}
