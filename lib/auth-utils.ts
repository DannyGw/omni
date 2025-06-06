import bcryptjs from "bcryptjs"
import { cookies } from "next/headers"

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return await bcryptjs.hash(password, 10)
}

// Verify a password against a hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcryptjs.compare(password, hashedPassword)
}

// Generate a secure random token
export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  randomValues.forEach((val) => {
    result += chars.charAt(val % chars.length)
  })
  return result
}

// Set auth cookie
export function setAuthCookie(userId: string, role: string): void {
  try {
    // Create a session token
    const sessionToken = generateToken()

    // Set cookie expiry to 7 days
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)

    // Set the cookie
    cookies().set({
      name: "session",
      value: JSON.stringify({ userId, role, token: sessionToken }),
      expires,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
  } catch (error) {
    console.error("Error setting auth cookie:", error)
  }
}

// Clear auth cookie
export function clearAuthCookie(): void {
  try {
    cookies().delete("session")
  } catch (error) {
    console.error("Error clearing auth cookie:", error)
  }
}

// Get user from session
export async function getUserFromSession(request: Request): Promise<{ id: string; role: string } | null> {
  try {
    const cookieHeader = request.headers.get("cookie")
    if (!cookieHeader) return null

    const cookies = cookieHeader.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        if (key === "session") {
          try {
            acc.session = JSON.parse(decodeURIComponent(value))
          } catch (e) {
            // Invalid JSON in cookie
          }
        }
        return acc
      },
      { session: null } as { session: { userId: string; role: string; token: string } | null },
    )

    if (!cookies.session) return null

    return {
      id: cookies.session.userId,
      role: cookies.session.role,
    }
  } catch (error) {
    console.error("Error getting user from session:", error)
    return null
  }
}
