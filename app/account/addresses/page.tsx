import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function AddressesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // This is a placeholder since we don't have actual addresses yet
  const addresses = []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Saved Addresses</h2>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">You don&apos;t have any saved addresses yet.</p>
        </div>
      ) : (
        <div className="space-y-4">{/* Address cards would go here */}</div>
      )}
    </div>
  )
}
