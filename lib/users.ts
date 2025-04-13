import { sql } from "./db"
import { hashPassword, verifyPassword } from "./auth-utils"

export interface User {
  id: string
  name: string | null
  email: string
  role: string
}

export interface UserWithPassword extends User {
  password: string
}

// Get user by email
export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  try {
    const users = await sql<UserWithPassword[]>`
      SELECT id::text, name, email, password, role
      FROM users
      WHERE email = ${email}
    `
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

// Get user by id
export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = await sql<User[]>`
      SELECT id::text, name, email, role
      FROM users
      WHERE id = ${id}
    `
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

// Create new user
export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(password)

    const users = await sql<User[]>`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id::text, name, email, role
    `

    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return null
    }

    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}
