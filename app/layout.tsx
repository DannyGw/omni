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
    generator: 'daniel-getachew.vercel.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?
family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..
900;1,400..900&display=swap" rel="stylesheet">
    </head>
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
