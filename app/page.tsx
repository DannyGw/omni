import ProductGrid from "@/components/product-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroSection } from "@/components/hero-section"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <div className="container px-4 py-12 mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Featured Products</h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 h-80 animate-pulse" />
              ))}
            </div>
          }
        >
          <FeaturedProducts />
        </Suspense>

        <div className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight mb-8">All Products</h2>
          <ProductGrid />
        </div>
      </div>
    </main>
  )
}
