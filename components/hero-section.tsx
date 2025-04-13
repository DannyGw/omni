import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Shop the Latest Trends</h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Discover our curated collection of premium products at unbeatable prices.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button variant="outline" size="lg">
            <Link href="/collections">View Collections</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
