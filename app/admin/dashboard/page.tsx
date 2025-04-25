import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getDashboardStats() {
  try {
    // Get product count
    const productCount = await sql<[{ count: number }]>`
      SELECT COUNT(*) as count FROM products
    `

    // Get user count
    const userCount = await sql<[{ count: number }]>`
      SELECT COUNT(*) as count FROM users
    `

    // Get order count
    const orderCount = await sql<[{ count: number }]>`
      SELECT COUNT(*) as count FROM orders
    `

    // Get total revenue
    const revenue = await sql<[{ total: string | number | null }]>`
      SELECT COALESCE(SUM(total), 0) as total FROM orders
    `

    // Get low stock products
    const lowStock = await sql<[{ count: number }]>`
      SELECT COUNT(*) as count FROM inventory WHERE quantity < 5
    `

    // Ensure revenue is a number
    const revenueValue = revenue[0]?.total ? Number.parseFloat(revenue[0].total.toString()) : 0

    return {
      productCount: productCount[0]?.count || 0,
      userCount: userCount[0]?.count || 0,
      orderCount: orderCount[0]?.count || 0,
      revenue: revenueValue,
      lowStock: lowStock[0]?.count || 0,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      productCount: 0,
      userCount: 0,
      orderCount: 0,
      revenue: 0,
      lowStock: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {stats.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error connecting to database: {stats.error}</p>
          <p className="text-sm mt-2">Make sure your DATABASE_URL environment variable is correctly set.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.userCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orderCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${typeof stats.revenue === "number" ? stats.revenue.toFixed(2) : "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.error ? (
            <div className="text-red-500">
              <p>Failed to connect to database. Please check your environment variables.</p>
              <p className="mt-2 text-sm">
                <strong>Important:</strong> You need to add the DATABASE_URL environment variable to your Vercel
                project.
              </p>
              <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                <p className="font-mono">1. Go to your Vercel project settings</p>
                <p className="font-mono">2. Navigate to "Environment Variables"</p>
                <p className="font-mono">3. Add DATABASE_URL with your Neon database connection string</p>
                <p className="font-mono">4. Redeploy your application</p>
              </div>
            </div>
          ) : (
            <div className="text-green-500">Successfully connected to database.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
