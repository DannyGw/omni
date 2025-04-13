import { sql } from "./db"
import type { Product } from "./types"

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await sql<Product[]>`
      SELECT p.id::text, p.name, p.description, p.price::float, p.image, p.category
      FROM products p
      JOIN inventory i ON p.id = i.product_id
      WHERE i.quantity > 0
      ORDER BY p.created_at DESC
    `
    return products
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

// Get a single product by ID
export async function getProduct(id: string): Promise<Product | undefined> {
  try {
    const products = await sql<Product[]>`
      SELECT p.id::text, p.name, p.description, p.price::float, p.image, p.category
      FROM products p
      WHERE p.id = ${id}
    `
    return products[0]
  } catch (error) {
    console.error("Database error:", error)
    return undefined
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const products = await sql<Product[]>`
      SELECT p.id::text, p.name, p.description, p.price::float, p.image, p.category
      FROM products p
      JOIN inventory i ON p.id = i.product_id
      WHERE p.category = ${category} AND i.quantity > 0
      ORDER BY p.created_at DESC
    `
    return products
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const searchTerm = `%${query.toLowerCase()}%`
    const products = await sql<Product[]>`
      SELECT p.id::text, p.name, p.description, p.price::float, p.image, p.category
      FROM products p
      JOIN inventory i ON p.id = i.product_id
      WHERE 
        (LOWER(p.name) LIKE ${searchTerm} OR 
         LOWER(p.description) LIKE ${searchTerm} OR 
         LOWER(p.category) LIKE ${searchTerm})
        AND i.quantity > 0
      ORDER BY p.created_at DESC
    `
    return products
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}

// Get inventory for a product
export async function getProductInventory(productId: string): Promise<number> {
  try {
    const result = await sql<{ quantity: number }[]>`
      SELECT quantity FROM inventory WHERE product_id = ${productId}
    `
    return result[0]?.quantity || 0
  } catch (error) {
    console.error("Database error:", error)
    return 0
  }
}

// Get featured products (products with highest inventory)
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    const products = await sql<Product[]>`
      SELECT p.id::text, p.name, p.description, p.price::float, p.image, p.category
      FROM products p
      JOIN inventory i ON p.id = i.product_id
      WHERE i.quantity > 0
      ORDER BY i.quantity DESC, p.created_at DESC
      LIMIT ${limit}
    `
    return products
  } catch (error) {
    console.error("Database error:", error)
    return []
  }
}
