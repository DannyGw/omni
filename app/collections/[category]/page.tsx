import { getProductsByCategory } from "@/lib/products"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card"

interface CategoryPageProps {
  params: {
    category: string
  }
}

interface Category {
  name: string
  description: string
}

async function getCategoryDetails(categoryName: string): Promise<Category | null> {
  try {
    const categories = await sql<Category[]>`
      SELECT name, description
      FROM categories
      WHERE name = ${categoryName}
    `
    return categories[0] || null
  } catch (error) {
    console.error("Database error:", error)
    return null
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params
  const categoryDetails = await getCategoryDetails(category)

  if (!categoryDetails) {
    notFound()
  }

  const products = await getProductsByCategory(category)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize mb-2">{categoryDetails.name}</h1>
        <p className="text-muted-foreground">{categoryDetails.description}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-muted-foreground">There are no products in this collection yet.</p>
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
