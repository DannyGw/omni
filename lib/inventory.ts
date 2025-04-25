import { sql } from "./db"
import type { Inventory } from "./types"

// Get inventory for a product
export async function getProductInventory(productId: string): Promise<number> {
  try {
    const result = await sql<{ quantity: number }[]>`
      SELECT quantity FROM inventory WHERE product_id = ${productId}
    `
    return result[0]?.quantity || 0
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to fetch inventory for product ID: ${productId}`)
  }
}

// Update inventory quantity
export async function updateInventory(productId: string, quantity: number): Promise<Inventory> {
  try {
    const result = await sql<Inventory[]>`
      UPDATE inventory
      SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = ${productId}
      RETURNING id, product_id, quantity
    `

    if (result.length === 0) {
      // If no inventory record exists, create one
      const newInventory = await sql<Inventory[]>`
        INSERT INTO inventory (product_id, quantity)
        VALUES (${productId}, ${quantity})
        RETURNING id, product_id, quantity
      `
      return newInventory[0]
    }

    return result[0]
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to update inventory for product ID: ${productId}`)
  }
}

// Get low stock products (less than specified threshold)
export async function getLowStockProducts(threshold = 5): Promise<any[]> {
  try {
    const products = await sql`
      SELECT 
        p.id::text, 
        p.name, 
        p.category, 
        i.quantity
      FROM 
        products p
      JOIN 
        inventory i ON p.id = i.product_id
      WHERE 
        i.quantity < ${threshold}
      ORDER BY 
        i.quantity ASC
    `
    return products
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to fetch low stock products")
  }
}
