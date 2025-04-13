import { searchProducts } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { notFound } from "next/navigation"

interface SearchPageProps {
  searchParams: { q: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q

  if (!query) {
    notFound()
  }

  const products = await searchProducts(query)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Search results for: <span className="text-muted-foreground">"{query}"</span>
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground">Try searching for something else or browse our categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
