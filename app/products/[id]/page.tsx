import Image from "next/image"
import { notFound } from "next/navigation"
import { getProduct } from "@/lib/products"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.image || `/placeholder.svg?height=600&width=600`}
            alt={product.name}
            width={600}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</div>

          <div className="prose mb-8">
            <p>{product.description}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}
