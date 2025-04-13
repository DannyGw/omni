"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className={`group rounded-lg border overflow-hidden ${featured ? "shadow-md" : ""}`}>
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image || `/placeholder.svg?height=400&width=400`}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-lg mb-2 group-hover:underline">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <Button size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
