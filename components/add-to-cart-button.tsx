"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { toast } = useToast()

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button variant="ghost" size="icon" onClick={increaseQuantity}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        <Button size="lg" onClick={handleAddToCart} className="flex-1">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
