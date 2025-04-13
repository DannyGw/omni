import type React from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="p-4">
              <Tabs defaultValue="profile" className="w-full" orientation="vertical">
                <TabsList className="flex flex-col items-stretch h-auto bg-transparent space-y-1">
                  <TabsTrigger value="profile" asChild className="justify-start">
                    <Link href="/account/profile">Profile</Link>
                  </TabsTrigger>
                  <TabsTrigger value="orders" asChild className="justify-start">
                    <Link href="/account/orders">Orders</Link>
                  </TabsTrigger>
                  <TabsTrigger value="addresses" asChild className="justify-start">
                    <Link href="/account/addresses">Addresses</Link>
                  </TabsTrigger>
                  <TabsTrigger value="password" asChild className="justify-start">
                    <Link href="/account/password">Change Password</Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card className="p-6">{children}</Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
