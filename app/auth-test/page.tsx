"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AuthTestPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>

      <div className="p-4 border rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Authentication Status</h2>
        {isAuthenticated ? (
          <div>
            <p className="mb-2">Signed in as:</p>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            <Button onClick={() => logout()} className="mt-4">
              Sign Out
            </Button>
          </div>
        ) : (
          <div>
            <p className="mb-4">Not signed in</p>
            <Button onClick={() => router.push("/auth/login")}>Sign In</Button>
          </div>
        )}
      </div>
    </div>
  )
}
