import ProductGrid from "@/components/product-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroSection } from "@/components/hero-section"
import { DatabaseWarning } from "@/components/database-warning"

// Check if DATABASE_URL is defined
const isDatabaseUrlDefined = typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <div className="container px-4 py-12 mx-auto">
        {!isDatabaseUrlDefined && <DatabaseWarning />}

        <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Products</h2>
        <FeaturedProducts />

        <div className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight mb-8">All Products</h2>
          <ProductGrid />
        </div>
      </div>
    </main>
  )
}
