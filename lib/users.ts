import { sql } from "./db"
import bcryptjs from "bcryptjs"
import type { User, UserWithPassword } from "./types"

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
    throw new Error(`Failed to fetch user by email: ${email}`)
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
    throw new Error(`Failed to fetch user by ID: ${id}`)
  }
}

// Create new user
export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10)

    const users = await sql<User[]>`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id::text, name, email, role
    `

    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to create user")
  }
}

// Update user profile
export async function updateUser(id: string, data: { name?: string; email?: string }): Promise<User | null> {
  try {
    // Build the SET clause dynamically based on provided fields
    const updates = []
    const values = []

    if (data.name !== undefined) {
      updates.push("name = $1")
      values.push(data.name)
    }

    if (data.email !== undefined) {
      updates.push(`email = $${values.length + 1}`)
      values.push(data.email)
    }

    if (updates.length === 0) {
      return await getUserById(id)
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(", ")}
      WHERE id = $${values.length + 1}
      RETURNING id::text, name, email, role
    `

    values.push(id)

    const result = await sql<User[]>(updateQuery, ...values)
    return result[0] || null
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to update user: ${id}`)
  }
}

// Update user password
export async function updatePassword(id: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await bcryptjs.hash(newPassword, 10)

    const result = await sql`
      UPDATE users
      SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    return result.count > 0
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to update password for user: ${id}`)
  }
}

// Get all users (admin only)
export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await sql<User[]>`
      SELECT id::text, name, email, role
      FROM users
      ORDER BY created_at DESC
    `
    return users
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch users")
  }
}
