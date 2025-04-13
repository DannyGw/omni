import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, Settings, BarChart3 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-muted/40 border-r hidden md:block">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/products">
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/orders">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Orders
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/customers">
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="border-b p-4 bg-background/95 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div className="md:hidden">
                <h2 className="font-bold">Admin Panel</h2>
              </div>
              <div className="ml-auto">
                <Button variant="outline" asChild>
                  <Link href="/">View Store</Link>
                </Button>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
