"use client"

import type React from "react"

import Link from "next/link"
import { CartButton } from "@/components/cart-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Menu, X, User, LogOut, Package, Settings } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">STORE</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-foreground/80">
              All Products
            </Link>
            <Link href="/collections" className="transition-colors hover:text-foreground/80">
              Collections
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground/80">
              Contact
            </Link>
          </nav>
        </div>

        <button
          className="inline-flex items-center justify-center md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </button>

        <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <span className="font-bold text-xl">STORE</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <form className="hidden w-full max-w-sm lg:flex items-center" onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="ml-2">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name || "My Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
          )}

          <CartButton />
        </div>
      </div>

      {isMenuOpen && (
        <div className="container pb-4 md:hidden">
          <form className="flex items-center mb-4" onSubmit={handleSearch}>
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="ml-2">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <nav className="grid gap-2">
            <Link href="/products" className="flex items-center py-2" onClick={() => setIsMenuOpen(false)}>
              All Products
            </Link>
            <Link href="/collections" className="flex items-center py-2" onClick={() => setIsMenuOpen(false)}>
              Collections
            </Link>
            <Link href="/about" className="flex items-center py-2" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="flex items-center py-2" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
