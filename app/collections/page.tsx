import { sql } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Category {
  name: string
  description: string
  product_count: number
}

// Mock categories for when database is not available
const mockCategories: Category[] = [
  {
    name: "electronics",
    description: "Latest gadgets and electronic devices",
    product_count: 12,
  },
  {
    name: "clothing",
    description: "Fashion and apparel for all seasons",
    product_count: 24,
  },
  {
    name: "home",
    description: "Furniture and home decor items",
    product_count: 18,
  },
]

async function getCategories(): Promise<Category[]> {
  try {
    const categories = await sql<Category[]>`
      SELECT 
        c.name, 
        c.description, 
        COUNT(p.id) as product_count
      FROM 
        categories c
      LEFT JOIN 
        products p ON c.name = p.category
      GROUP BY 
        c.name, c.description
      ORDER BY 
        c.name
    `
    return categories.length > 0 ? categories : mockCategories
  } catch (error) {
    console.error("Database error:", error)
    return mockCategories
  }
}

export default async function CollectionsPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Collections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.name} href={`/collections/${category.name}`}>
            <Card className="overflow-hidden h-full transition-all hover:shadow-md">
              <div className="aspect-video bg-muted relative">
                <Image
                  src={`/placeholder.svg?height=300&width=600&text=${category.name}`}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold capitalize mb-2">{category.name}</h2>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <p className="text-sm">{category.product_count} products</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
