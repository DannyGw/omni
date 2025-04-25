import { sql } from "./db"
import type { Category } from "./types"

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await sql<Category[]>`
      SELECT 
        c.name, 
        c.description, 
        COUNT(p.id) as product_count
      FROM 
        categories c
      LEFT JOIN 
        products p ON c.name = p.category
      GROUP BY 
        c.name, c.description
      ORDER BY 
        c.name
    `
    return categories
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch categories")
  }
}

// Get a single category by name
export async function getCategory(name: string): Promise<Category | null> {
  try {
    const categories = await sql<Category[]>`
      SELECT 
        c.name, 
        c.description, 
        COUNT(p.id) as product_count
      FROM 
        categories c
      LEFT JOIN 
        products p ON c.name = p.category
      WHERE 
        c.name = ${name}
      GROUP BY 
        c.name, c.description
    `
    return categories[0] || null
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to fetch category: ${name}`)
  }
}

// Create a new category
export async function createCategory(category: Omit<Category, "product_count">): Promise<Category> {
  try {
    const result = await sql<Category[]>`
      INSERT INTO categories (name, description)
      VALUES (${category.name}, ${category.description})
      RETURNING name, description, 0 as product_count
    `
    return result[0]
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to create category")
  }
}

// Update a category
export async function updateCategory(name: string, description: string): Promise<Category | null> {
  try {
    const result = await sql<Category[]>`
      UPDATE categories
      SET description = ${description}, updated_at = CURRENT_TIMESTAMP
      WHERE name = ${name}
      RETURNING name, description, 0 as product_count
    `
    return result[0] || null
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to update category: ${name}`)
  }
}

// Delete a category
export async function deleteCategory(name: string): Promise<boolean> {
  try {
    // First update any products using this category to null
    await sql`
      UPDATE products
      SET category = NULL
      WHERE category = ${name}
    `

    // Then delete the category
    const result = await sql`
      DELETE FROM categories WHERE name = ${name}
    `

    return result.count > 0
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to delete category: ${name}`)
  }
}
