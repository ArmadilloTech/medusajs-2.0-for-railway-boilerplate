import { listRegions } from "@/lib/data/regions"
import FeaturedProducts from "@/modules/home/components/featured-products"
import SkeletonFeaturedProducts from "@/modules/skeletons/templates/skeleton-featured-products"
import { Metadata } from "next"
import { Suspense } from "react"
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Phone,
  Scissors,
  Shield,
  Smartphone,
  Star,
  Truck,
  ShoppingCart,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCollectionByHandle } from "@/lib/data/collections"
import { listProducts } from "@/lib/data/products"
import { getProductPrice } from "@/lib/util/get-product-price"

export const dynamicParams = true

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export async function generateStaticParams() {
  const countryCodes = await listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )
  return countryCodes.map((countryCode) => ({ countryCode }))
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Professional Barbershop Supplies
                <span className="text-blue-400"> Delivered Fast</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 leading-relaxed">
                Get premium barbershop products delivered to your shop in under 2 hours. Track your order in real-time
                and never run out of essentials again.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full shadow-md text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full shadow-md text-lg px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Download App
                  <Smartphone className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Free delivery over $100
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  2-hour delivery
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                  Live tracking
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/packagethumb.jpg"
                alt="Barbershop supplies and delivery"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl border border-gray-700 animate-float-x animate-float-y"
              />
              <div className="absolute -bottom-6 -left-6 bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-900 rounded-full p-2">
                    <Truck className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Order #1234</p>
                    <p className="text-sm text-gray-400">Arriving in 45 mins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">500+</div>
              <div className="text-gray-400 mt-2">Partner Barbershops</div>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">10K+</div>
              <div className="text-gray-400 mt-2">Products Available</div>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">2hr</div>
              <div className="text-gray-400 mt-2">Average Delivery</div>
            </div>
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl sm:text-4xl font-bold text-blue-400">99%</div>
              <div className="text-gray-400 mt-2">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section (custom, dark themed) */}
      <section id="featured" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Products</h2>
            <p className="mt-4 text-xl text-gray-400">Top-selling items trusted by professional barbers</p>
          </div>
          {/* Custom featured products grid */}
          <FeaturedProductsSection countryCode={countryCode} />
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full shadow-md text-lg px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section (static cards) */}
      <section id="products" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything Your Barbershop Needs</h2>
            <p className="mt-4 text-xl text-gray-400">Premium products from top brands, delivered when you need them</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Scissors className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Cutting Tools</h3>
                <p className="text-gray-400 mb-4">
                  Professional clippers, trimmers, scissors, and razors from leading brands
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Wahl, Andis, Oster
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Professional grade
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Warranty included
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Hair Products</h3>
                <p className="text-gray-400 mb-4">Pomades, gels, shampoos, and styling products for every hair type</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Suavecito, Layrite, Reuzel
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Bulk pricing available
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Fast-moving inventory
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Sanitation</h3>
                <p className="text-gray-400 mb-4">
                  Disinfectants, sanitizers, and cleaning supplies for health compliance
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Barbicide, King Research
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Health board approved
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Bulk discounts
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Delivery Section (static) */}
      <section id="delivery" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Lightning-Fast Delivery with Real-Time Tracking
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Never run out of supplies again. Our Instacart-style delivery service gets your products to you in under
                2 hours, with live GPS tracking every step of the way.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-900 rounded-full p-2 mt-1">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Same-Day Delivery</h3>
                    <p className="text-gray-400">
                      Order by 3 PM for same-day delivery. Emergency orders available 24/7.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-900 rounded-full p-2 mt-1">
                    <MapPin className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Live GPS Tracking</h3>
                    <p className="text-gray-400">Watch your delivery driver in real-time, just like rideshare apps.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-900 rounded-full p-2 mt-1">
                    <Truck className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Professional Drivers</h3>
                    <p className="text-gray-400">Vetted, uniformed drivers who understand barbershop needs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-slide-in-right">
              <Image
                src="/phoneBack.jpg"
                alt="Delivery tracking interface"
                width={400}
                height={500}
                className="rounded-2xl shadow-xl border border-gray-700"
              />
              <div className="absolute top-4 left-4 bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">Driver en route</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section (static) */}
      <section id="app" className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-slide-in-left">
              <Image
                src="/mapPhone.jpg"
                alt="Mobile app interface"
                width={300}
                height={600}
                className="mx-auto rounded-3xl shadow-2xl border border-gray-700"
              />
              <div className="absolute -top-4 -right-4 bg-gray-800 rounded-full p-3 shadow-lg border border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Shop Anywhere with Our Mobile App</h2>
              <p className="text-xl text-blue-100 mb-8">
                Order supplies on the go, track deliveries, manage your account, and get exclusive mobile-only deals.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-gray-200">One-tap reordering of your favorites</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-gray-200">Push notifications for order updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-gray-200">Exclusive mobile app discounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-gray-200">Barcode scanning for quick orders</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full shadow-md text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 transition-colors">
                  <Image
                    src="/mac-os.png"
                    alt="App Store"
                    width={32}
                    height={32}
                    className="mr-2"
                  />
                  Download for iOS
                </Button>
                <Button size="lg" className="rounded-full shadow-md text-lg px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 transition-colors">
                  <Image
                    src="/Play-Store-icon.png"
                    alt="Google Play"
                    width={32}
                    height={32}
                    className="mr-2"
                  />
                  Download for Android
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (static) */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Trusted by Barbershops Everywhere</h2>
            <p className="mt-4 text-xl text-gray-400">See what our customers are saying</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "BarberPro Supply has revolutionized how we manage inventory. The 2-hour delivery is a game-changer
                  when we're running low on essentials."
                </p>
                <div>
                  <p className="font-semibold text-white">Mike Rodriguez</p>
                  <p className="text-sm text-gray-400">Owner, Classic Cuts</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The mobile app makes ordering so easy. I can restock while I'm cutting hair, and the live tracking
                  lets me know exactly when to expect delivery."
                </p>
                <div>
                  <p className="font-semibold text-white">Sarah Johnson</p>
                  <p className="text-sm text-gray-400">Master Barber, Fade Factory</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "Best wholesale prices in the city, and the customer service is outstanding. They really understand
                  what barbershops need."
                </p>
                <div>
                  <p className="font-semibold text-white">Tony Martinez</p>
                  <p className="text-sm text-gray-400">Owner, Tony's Barbershop</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section (static) */}
      <section className="py-20 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to Transform Your Supply Chain?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of barbershops who trust BarberPro Supply for fast, reliable delivery of professional
            products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full shadow-md text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full shadow-md text-lg px-8 py-4 border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent transition-colors"
            >
              Schedule a Demo
              <Phone className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

async function FeaturedProductsSection({ countryCode }: { countryCode: string }) {
  // Get the 'Featured' collection by handle
  const collection = await getCollectionByHandle("featured")
  if (!collection) {
    return (
      <div className="text-center text-gray-400">No featured collection found.</div>
    )
  }
  // Get up to 3 products from the collection
  const { response: { products } } = await listProducts({
    countryCode,
    queryParams: {
      collection_id: collection.id,
      limit: 3,
    } as any,
  })
  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-400">No featured products available.</div>
    )
  }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const { cheapestPrice } = getProductPrice({ product })
        return (
          <Card key={product.id} className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 animate-fade-in-up flex flex-col">
            <div className="relative w-full h-64 flex items-center justify-center bg-gray-900 rounded-t-xl overflow-hidden">
              {product.thumbnail ? (
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  style={{ objectFit: "contain" }}
                  className="transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between p-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-blue-400">
                  {cheapestPrice ? cheapestPrice.calculated_price : "-"}
                </span>
                <AddToCartButton productId={product.id} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// AddToCartButton is a placeholder for now; you can wire up cart logic as needed
function AddToCartButton({ productId }: { productId: string }) {
  return (
    <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow flex items-center gap-2">
      <ShoppingCart className="w-4 h-4" />
      Add to Cart
    </Button>
  )
}
