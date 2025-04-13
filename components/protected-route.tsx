"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
      } else if (adminOnly && !isAdmin) {
        router.push("/")
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, adminOnly, router])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  if (!isAuthenticated || (adminOnly && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
