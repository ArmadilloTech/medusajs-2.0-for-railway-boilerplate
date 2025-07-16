import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Scissors,
  Shield,
  Star,
  Truck,
  ShoppingCart,
  Heart,
  Eye,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const dynamicParams = true

export const metadata = {
  title: "Blade Box",
  description:
    "Experience the ultimate convenience—get premium barbershop products delivered straight to your door with Blade Box. Elevate your grooming game, anytime, anywhere.",
  openGraph: {
    images: [
      {
        url: "/packagethumb.jpg",
        width: 1200,
        height: 630,
        alt: "Blade Box delivery driver bringing barbershop products",
      },
    ],
  },
}

export async function generateStaticParams() {
  const countryCodes = await (await import("@/lib/data/regions")).listRegions().then(
    (regions) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )
  return countryCodes.map((countryCode) => ({ countryCode }))
}

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const { countryCode } = params

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Product Slider */}
      <section className="py-8 bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
              {/* Example product cards, replace with dynamic data if needed */}
              <Card className="min-w-[300px] bg-white border-blue-100 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <Image
                      src="/placeholder.svg?height=200&width=280"
                      alt="Featured Product"
                      width={280}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg bg-blue-50"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      50% OFF
                    </div>
                    <div className="absolute top-2 left-2 flex space-x-2">
                      <Button size="sm" variant="ghost" className="p-2 bg-white/80 hover:bg-blue-50">
                        <Heart className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-2 bg-white/80 hover:bg-blue-50">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">Wahl Professional 5-Star Series</h3>
                  <p className="text-gray-700 text-sm mb-3">Complete clipper and trimmer set</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">$149.99</span>
                      <span className="text-lg text-gray-400 line-through ml-2">$299.99</span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* ...repeat for other hero products... */}
              {/* You can add more cards here as in the provided ProductCatalog */}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section id="new-arrivals" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-black">New Arrivals</h2>
            <Button
              variant="outline"
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-900"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <Card
                key={i}
                className="bg-white border-blue-100 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group"
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Image
                      src="/placeholder.svg?height=150&width=200"
                      alt={`New Product ${i + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg bg-blue-50"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      NEW
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-black mb-1">Product Name {i + 1}</h3>
                  <p className="text-xs text-gray-500 mb-2">Brand Name</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">${(Math.random() * 100 + 20).toFixed(2)}</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1">
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Deals */}
      <section id="best-deals" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-black">Best Deals</h2>
            <Button
              variant="outline"
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-900"
            >
              View All Deals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="bg-white border-blue-100 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <Image
                      src="/placeholder.svg?height=200&width=250"
                      alt={`Deal Product ${i + 1}`}
                      width={250}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg bg-blue-50"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.floor(Math.random() * 50 + 20)}% OFF
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">Deal Product {i + 1}</h3>
                  <p className="text-gray-700 text-sm mb-3">Professional grade equipment</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-blue-600">${(Math.random() * 100 + 50).toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ${(Math.random() * 50 + 100).toFixed(2)}
                      </span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Slider */}
      <section id="brands" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black text-center mb-12">Our Brands</h2>
          <div className="flex overflow-x-auto space-x-8 pb-4 scrollbar-hide">
            {["Wahl", "Andis", "Oster", "Babyliss Pro", "Suavecito", "Layrite", "Reuzel", "Barbicide"].map(
              (brand, i) => (
                <div key={i} className="min-w-[150px] text-center">
                  <div className="bg-white border border-blue-100 rounded-lg p-6 hover:bg-blue-50 transition-colors cursor-pointer">
                    <Image
                      src="/placeholder.svg?height=80&width=120"
                      alt={brand}
                      width={120}
                      height={80}
                      className="mx-auto mb-4 filter brightness-0 invert-0 opacity-70 hover:opacity-100 transition-opacity"
                    />
                    <h3 className="text-black font-semibold">{brand}</h3>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Featured Brand */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">Featured Brand: Wahl Professional</h2>
              <p className="text-xl text-gray-700 mb-8">
                Discover the complete range of Wahl Professional tools trusted by barbers worldwide for over 100 years.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  <span className="text-black">Professional grade quality</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  <span className="text-black">Industry leading warranty</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                  <span className="text-black">Trusted by professionals</span>
                </div>
              </div>
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Shop Wahl Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-white/80 border-blue-100 backdrop-blur">
                  <CardContent className="p-4">
                    <Image
                      src="/placeholder.svg?height=120&width=150"
                      alt={`Wahl Product ${i + 1}`}
                      width={150}
                      height={120}
                      className="w-full h-24 object-cover rounded mb-3 bg-blue-50"
                    />
                    <h4 className="text-black font-semibold text-sm mb-1">Wahl Product {i + 1}</h4>
                    <p className="text-blue-600 font-bold">${(Math.random() * 100 + 50).toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Slider */}
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black text-center mb-12">Shop by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border-blue-100 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Scissors className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Clippers & Trimmers</h3>
                <p className="text-gray-700 text-sm mb-4">Professional cutting tools</p>
                <p className="text-blue-600 font-semibold">250+ Products</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Hair Products</h3>
                <p className="text-gray-700 text-sm mb-4">Pomades, gels & styling</p>
                <p className="text-blue-600 font-semibold">180+ Products</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Sanitation</h3>
                <p className="text-gray-700 text-sm mb-4">Disinfectants & cleaning</p>
                <p className="text-blue-600 font-semibold">95+ Products</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Accessories</h3>
                <p className="text-gray-700 text-sm mb-4">Capes, brushes & tools</p>
                <p className="text-blue-600 font-semibold">120+ Products</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Savings/Sale Products */}
      <section id="sale" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Current Savings</h2>
            <p className="text-xl text-gray-700">Limited time offers - Don't miss out!</p>
          </div>
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            {[...Array(6)].map((_, i) => (
              <Card
                key={i}
                className="min-w-[280px] bg-white border-blue-100 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <Image
                      src="/placeholder.svg?height=180&width=250"
                      alt={`Sale Product ${i + 1}`}
                      width={250}
                      height={180}
                      className="w-full h-40 object-cover rounded-lg bg-blue-50"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.floor(Math.random() * 60 + 20)}% OFF
                    </div>
                    <div className="absolute bottom-2 left-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      Limited Time
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">Sale Product {i + 1}</h3>
                  <p className="text-gray-700 text-sm mb-3">Professional equipment on sale</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-blue-600">${(Math.random() * 80 + 30).toFixed(2)}</span>
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ${(Math.random() * 50 + 100).toFixed(2)}
                      </span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">500+</div>
              <div className="text-gray-700 mt-2">Partner Barbershops</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-700 mt-2">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">2hr</div>
              <div className="text-gray-700 mt-2">Average Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">99%</div>
              <div className="text-gray-700 mt-2">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
                Lightning-Fast Delivery with Real-Time Tracking
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Never run out of supplies again. Our Instacart-style delivery service gets your products to you in under
                2 hours, with live GPS tracking every step of the way.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Same-Day Delivery</h3>
                    <p className="text-gray-700">
                      Order by 3 PM for same-day delivery. Emergency orders available 24/7.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Live GPS Tracking</h3>
                    <p className="text-gray-700">Watch your delivery driver in real-time, just like rideshare apps.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Professional Drivers</h3>
                    <p className="text-gray-700">Vetted, uniformed drivers who understand barbershop needs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/phoneBack.jpg"
                alt="Delivery tracking interface"
                width={400}
                height={500}
                className="rounded-2xl shadow-xl border border-blue-100 bg-blue-50"
              />
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-blue-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-black">Driver en route</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black">Trusted by Barbershops Everywhere</h2>
            <p className="mt-4 text-xl text-gray-700">See what our customers are saying</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-blue-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "BarberPro Supply has revolutionized how we manage inventory. The 2-hour delivery is a game-changer
                  when we're running low on essentials."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/account-block.jpg"
                    alt="Customer"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-black">Mike Rodriguez</p>
                    <p className="text-sm text-gray-500">Owner, Classic Cuts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-blue-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The mobile app makes ordering so easy. I can restock while I'm cutting hair, and the live tracking
                  lets me know exactly when to expect delivery."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/account-block.jpg"
                    alt="Customer"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-black">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Master Barber, Fade Factory</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-blue-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Best wholesale prices in the city, and the customer service is outstanding. They really understand
                  what barbershops need."
                </p>
                <div className="flex items-center">
                  <Image
                    src="/account-block.jpg"
                    alt="Customer"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-black">Tony Martinez</p>
                    <p className="text-sm text-gray-500">Owner, Tony's Barbershop</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
