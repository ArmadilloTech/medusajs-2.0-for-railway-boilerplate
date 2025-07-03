import { listCollections } from "@/lib/data/collections"
import { getRegion } from "@/lib/data/regions"
import ProductRail from "@/modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  countryCode,
}: {
  countryCode: string
}) {
  const { collections } = await listCollections({
    limit: "10",
    fields: "*products",
  })
  const region = await getRegion(countryCode)

  if (!collections || !region) {
    return null
  }

  // Only show the collection named 'Featured' (case-insensitive)
  const featuredCollection = collections.find(
    (c) => c.title.toLowerCase() === "featured"
  )

  if (!featuredCollection) {
    return null
  }

  return (
    <ul className="flex flex-col gap-x-6 bg-neutral-100">
      <li key={featuredCollection.id}>
        <ProductRail collection={featuredCollection} region={region} />
      </li>
    </ul>
  )
}
