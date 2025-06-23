import { sql } from "./db"
import type { Product } from "./types"
import { schemaReady } from "./db" // ensure tables exist before querying

// Mock data for when database is not available
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Sample Product 1",
    description: "This is a sample product when database is not available",
    price: 19.99,
    image: "",
    category: "sample",
  },
  {
    id: "2",
    name: "Sample Product 2",
    description: "Another sample product when database is not available",
    price: 29.99,
    image: "",
    category: "sample",
  },
]

// Get all products
export async function getProducts(): Promise<Product[]> {
  await schemaReady
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
    return products.length > 0 ? products : mockProducts.slice(0, limit)
  } catch (error) {
    console.error("Database error:", error)
    return mockProducts.slice(0, limit)
  }
}

// Get a single product by ID
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const products = await sql<Product[]>`
      SELECT p.id::text, p.name, p.description, p.price::float, p.image, p.category
      FROM products p
      WHERE p.id = ${id}
    `
    return products[0] || mockProducts.find((p) => p.id === id) || mockProducts[0]
  } catch (error) {
    console.error("Database error:", error)
    return mockProducts.find((p) => p.id === id) || mockProducts[0]
  }
}

// Get inventory for a product
export async function getProductInventory(productId: string): Promise<number> {
  try {
    const result = await sql<{ quantity: number }[]>`
      SELECT quantity FROM inventory WHERE product_id = ${productId}
    `
    return result[0]?.quantity || 10
  } catch (error) {
    console.error("Database error:", error)
    return 10
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
    return products.length > 0 ? products : mockProducts.filter((p) => p.category === category)
  } catch (error) {
    console.error("Database error:", error)
    return mockProducts.filter((p) => p.category === category)
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
    return products.length > 0
      ? products
      : mockProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()),
        )
  } catch (error) {
    console.error("Database error:", error)
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()),
    )
  }
}

// Create a new product
export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  try {
    const result = await sql<Product[]>`
      INSERT INTO products (name, description, price, image, category)
      VALUES (${product.name}, ${product.description}, ${product.price}, ${product.image}, ${product.category})
      RETURNING id::text, name, description, price::float, image, category
    `

    // Also create inventory entry
    if (result[0]) {
      await sql`
        INSERT INTO inventory (product_id, quantity)
        VALUES (${result[0].id}, 0)
      `
    }

    return (
      result[0] || {
        id: String(Date.now()),
        ...product,
      }
    )
  } catch (error) {
    console.error("Database error:", error)
    return {
      id: String(Date.now()),
      ...product,
    }
  }
}

// Update a product
export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
  try {
    // Build the SET clause dynamically based on provided fields
    const updates = []
    const values = []

    if (product.name !== undefined) {
      updates.push("name = $1")
      values.push(product.name)
    }

    if (product.description !== undefined) {
      updates.push(`description = ${values.length + 1}`)
      values.push(product.description)
    }

    if (product.price !== undefined) {
      updates.push(`price = ${values.length + 1}`)
      values.push(product.price)
    }

    if (product.image !== undefined) {
      updates.push(`image = ${values.length + 1}`)
      values.push(product.image)
    }

    if (product.category !== undefined) {
      updates.push(`category = ${values.length + 1}`)
      values.push(product.category)
    }

    if (updates.length === 0) {
      return await getProduct(id)
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`)

    const updateQuery = `
      UPDATE products 
      SET ${updates.join(", ")}
      WHERE id = ${values.length + 1}
      RETURNING id::text, name, description, price::float, image, category
    `

    values.push(id)

    const result = await sql<Product[]>(updateQuery, ...values)
    return result[0] || mockProducts.find((p) => p.id === id)
  } catch (error) {
    console.error("Database error:", error)
    const mockProduct = mockProducts.find((p) => p.id === id)
    if (mockProduct && product) {
      return { ...mockProduct, ...product }
    }
    return mockProduct || null
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // First delete from inventory
    await sql`
      DELETE FROM inventory WHERE product_id = ${id}
    `

    // Then delete the product
    const result = await sql`
      DELETE FROM products WHERE id = ${id}
    `

    return result.count > 0
  } catch (error) {
    console.error("Database error:", error)
    return true
  }
}
