import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define paths that require authentication
  const isAdminPath = pathname.startsWith("/admin")
  const isAccountPath = pathname.startsWith("/account")
  const isCheckoutPath = pathname.startsWith("/checkout")

  // Check for session cookie
  const sessionCookie = request.cookies.get("session")

  // If no session and trying to access protected routes
  if (!sessionCookie && (isAdminPath || isAccountPath || isCheckoutPath)) {
    const url = new URL(`/auth/login`, request.url)
    url.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(url)
  }

  // If session exists, verify it
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value)

      // If user is not an admin and trying to access admin routes
      if (isAdminPath && session.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      // Invalid session format, redirect to login
      if (isAdminPath || isAccountPath || isCheckoutPath) {
        const url = new URL(`/auth/login`, request.url)
        url.searchParams.set("callbackUrl", request.url)
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout"],
}
