import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/hooks/use-cart"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-commerce Store",
  description: "Shop the latest products at great prices",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <CartProvider>
                <div className="relative min-h-screen flex flex-col">
                  <Navbar />
                  <div className="flex-1">{children}</div>
                  <footer className="border-t py-6 md:py-8">
                    <div className="container flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                      <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} E-commerce Store. All rights reserved.
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <a href="#" className="hover:underline">
                          Terms
                        </a>
                        <a href="#" className="hover:underline">
                          Privacy
                        </a>
                        <a href="#" className="hover:underline">
                          Contact
                        </a>
                      </div>
                    </div>
                  </footer>
                </div>
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
