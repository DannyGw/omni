import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

// This is a placeholder since we don't have actual orders yet
// In a real app, you would fetch orders from your database
const mockOrders = [
  {
    id: "ORD-1234",
    date: new Date(2023, 5, 15),
    status: "Delivered",
    total: 129.99,
    items: 3,
  },
  {
    id: "ORD-5678",
    date: new Date(2023, 4, 28),
    status: "Processing",
    total: 79.95,
    items: 2,
  },
  {
    id: "ORD-9012",
    date: new Date(2023, 3, 10),
    status: "Cancelled",
    total: 49.99,
    items: 1,
  },
]

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order History</h2>

      {mockOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven&apos;t placed any orders yet.</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {mockOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <div>
                  <h3 className="font-medium">Order #{order.id}</h3>
                  <p className="text-sm text-muted-foreground">Placed on {formatDate(order.date)}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">${order.total.toFixed(2)}</div>
                  <div className="text-sm">{order.items} items</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div
                  className={`text-sm px-2 py-1 rounded-full ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/account/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
