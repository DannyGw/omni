import ProductCard from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/products"

export async function FeaturedProducts() {
  try {
    const products = await getFeaturedProducts(4)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} featured />
        ))}
      </div>
    )
  } catch (error) {
    console.error("Error loading featured products:", error)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 h-80 animate-pulse" />
        ))}
      </div>
    )
  }
}
