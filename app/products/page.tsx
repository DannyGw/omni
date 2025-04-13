import ProductGrid from "@/components/product-grid"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <ProductGrid />
    </div>
  )
}
