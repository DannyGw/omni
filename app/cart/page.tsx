"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, updateItemQuantity, clearCart, cartTotal } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    // In a real app, you would redirect to a checkout page or process
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || `/placeholder.svg?height=100&width=100`}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <Link href={`/products/${item.id}`} className="font-medium hover:underline">
                      {item.name}
                    </Link>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)} each</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="sm" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                        +
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="outline" className="w-full mt-4" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
