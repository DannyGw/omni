import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production"

export interface JWTPayload {
  id: string
  email: string
  name?: string | null
  role: string
  iat?: number
  exp?: number
}

export function signJWT(payload: Omit<JWTPayload, "iat" | "exp">, expiresIn = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}
