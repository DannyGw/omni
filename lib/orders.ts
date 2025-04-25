import { sql } from "./db"
import type { Order, OrderItem } from "./types"

// Create a new order
export async function createOrder(
  userId: string,
  items: { productId: string; quantity: number; price: number }[],
): Promise<Order> {
  try {
    // Calculate total
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Start a transaction
    const result = await sql.begin(async (tx) => {
      // Create order
      const orderResult = await tx<Order[]>`
        INSERT INTO orders (user_id, total, status)
        VALUES (${userId}, ${total}, 'pending')
        RETURNING id::text, user_id, status, total, created_at
      `

      const order = orderResult[0]

      // Create order items
      for (const item of items) {
        await tx`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (${order.id}, ${item.productId}, ${item.quantity}, ${item.price})
        `

        // Update inventory
        await tx`
          UPDATE inventory
          SET quantity = quantity - ${item.quantity}
          WHERE product_id = ${item.productId} AND quantity >= ${item.quantity}
        `
      }

      return order
    })

    return result
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to create order")
  }
}

// Get orders for a user
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const orders = await sql<Order[]>`
      SELECT 
        id::text, 
        user_id, 
        status, 
        total::float, 
        created_at
      FROM 
        orders
      WHERE 
        user_id = ${userId}
      ORDER BY 
        created_at DESC
    `
    return orders
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to fetch orders for user ID: ${userId}`)
  }
}

// Get a single order with items
export async function getOrder(orderId: string): Promise<Order & { items: OrderItem[] }> {
  try {
    const orders = await sql<Order[]>`
      SELECT 
        id::text, 
        user_id, 
        status, 
        total::float, 
        created_at
      FROM 
        orders
      WHERE 
        id = ${orderId}
    `

    if (orders.length === 0) {
      throw new Error(`Order not found: ${orderId}`)
    }

    const order = orders[0]

    const items = await sql<OrderItem[]>`
      SELECT 
        oi.id,
        oi.product_id,
        p.name as product_name,
        p.image as product_image,
        oi.quantity,
        oi.price::float
      FROM 
        order_items oi
      JOIN 
        products p ON oi.product_id = p.id
      WHERE 
        oi.order_id = ${orderId}
    `

    return { ...order, items }
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to fetch order: ${orderId}`)
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  try {
    const result = await sql<Order[]>`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
      RETURNING id::text, user_id, status, total::float, created_at
    `

    if (result.length === 0) {
      throw new Error(`Order not found: ${orderId}`)
    }

    return result[0]
  } catch (error) {
    console.error("Database error:", error)
    throw new Error(`Failed to update order status: ${orderId}`)
  }
}
