import fs from "fs"
import path from "path"
import Link from "next/link"
import Breadcrumb from "@/components/breadcrumb"
import { Milk } from "lucide-react"
import type { Metadata } from "next"

// Define types
interface MilkTypeIndex {
  type: string
  slug: string
  count: number
}

// Generate metadata
export const metadata: Metadata = {
  title: "Cheese by Milk Type: Cow, Goat, Sheep & More",
  description:
    "Explore our comprehensive guide to cheese varieties by milk type. Discover how different milks create unique flavors, textures, and characteristics.",
  keywords: [
    "milk type cheese",
    "cow milk cheese",
    "goat milk cheese",
    "sheep milk cheese",
    "buffalo milk cheese",
    "cheese milk types",
  ],
  openGraph: {
    title: "Cheese by Milk Type: Cow, Goat, Sheep & More",
    description:
      "Explore our comprehensive guide to cheese varieties by milk type. Discover how different milks create unique flavors, textures, and characteristics.",
    type: "website",
    url: "https://qcheese.com/milk-type",
    images: [
      {
        url: "https://qcheese.com/images/milk-types.jpg",
        width: 1200,
        height: 630,
        alt: "Cheese varieties by milk type",
      },
    ],
  },
}

// Page component
export default function MilkTypesPage() {
  // Read milk type data
  const indexPath = path.join(process.cwd(), "data", "indexes", "milk-types.json")
  let milkTypes: MilkTypeIndex[] = []

  try {
    if (fs.existsSync(indexPath)) {
      milkTypes = JSON.parse(fs.readFileSync(indexPath, "utf8"))

      // Sort by count (descending)
      milkTypes.sort((a, b) => b.count - a.count)
    }
  } catch (error) {
    console.error("Error reading milk types data:", error)
  }

  // Format JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cheese by Milk Type",
    description:
      "Explore our comprehensive guide to cheese varieties by milk type. Discover how different milks create unique flavors, textures, and characteristics.",
    url: "https://qcheese.com/milk-type",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: milkTypes.slice(0, 10).map((milkType, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://qcheese.com/milk-type/${milkType.slug}`,
        name: `${milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese`,
      })),
    },
  }

  // Format breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://qcheese.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Milk Types",
        item: "https://qcheese.com/milk-type",
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Milk Types", href: "/milk-type", isCurrentPage: true }]} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Cheese by Milk Type</h1>
        <p className="text-lg text-gray-700">
          Explore our comprehensive guide to cheese varieties by milk type. Discover how different milks create unique
          flavors, textures, and characteristics.
        </p>
      </div>

      {/* Milk Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {milkTypes.map((milkType, index) => (
          <Link
            key={index}
            href={`/milk-type/${milkType.slug}`}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Milk className="h-8 w-8 text-yellow-600 mr-3" />
              <h2 className="text-xl font-bold">
                {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese
              </h2>
            </div>
            <p className="text-gray-600 mb-2">{milkType.count} varieties</p>
            <p className="text-sm text-blue-600">Explore →</p>
          </Link>
        ))}
      </div>

      {/* SEO Content Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4">Understanding Cheese by Milk Type</h2>
        <div className="prose max-w-none">
          <p>
            The type of milk used in cheese production is one of the most fundamental factors that influence a cheese's
            flavor, texture, aroma, and overall character. Different animal milks contain varying levels of fat,
            protein, and other components that create distinctive qualities in the finished cheese.
          </p>

          <h3>Cow Milk Cheese</h3>
          <p>
            Cow milk is the most commonly used milk in cheese production worldwide. It produces cheeses with a mild,
            creamy flavor profile that serves as an excellent canvas for various aging techniques and flavor additions.
            Cow milk cheeses range from soft, fresh varieties like Brie and Camembert to aged, hard cheeses like Cheddar
            and Parmigiano-Reggiano.
          </p>

          <h3>Goat Milk Cheese</h3>
          <p>
            Goat milk creates cheeses with a distinctive tangy flavor and often a bright white color. The fat molecules
            in goat milk are smaller than those in cow milk, resulting in a different mouthfeel and digestibility.
            Popular goat milk cheeses include Chèvre, Bucheron, and Crottin.
          </p>

          <h3>Sheep Milk Cheese</h3>
          <p>
            Sheep milk is higher in fat and protein than both cow and goat milk, producing rich, buttery cheeses with
            complex flavors. Notable sheep milk cheeses include Roquefort, Manchego, and Pecorino Romano. These cheeses
            often have a distinctive lanolin note and develop wonderful nutty flavors when aged.
          </p>

          <h3>Buffalo Milk Cheese</h3>
          <p>
            Buffalo milk contains significantly more fat and protein than cow milk, creating exceptionally rich and
            creamy cheeses. The most famous buffalo milk cheese is Mozzarella di Bufala Campana from Italy, prized for
            its tender texture and subtle flavor.
          </p>

          <h3>Mixed Milk Cheese</h3>
          <p>
            Some cheesemakers blend milks from different animals to create unique flavor profiles that combine the best
            characteristics of each milk type. These mixed milk cheeses offer complex flavors and textures that cannot
            be achieved with a single milk source.
          </p>

          <h3>Factors Affecting Milk Quality</h3>
          <p>
            The quality and character of milk—and consequently, cheese—are influenced by numerous factors including:
          </p>

          <ul>
            <li>Animal breed and genetics</li>
            <li>Animal diet and grazing practices</li>
            <li>Seasonal variations</li>
            <li>Geographical location and terroir</li>
            <li>Farming practices (conventional vs. organic)</li>
          </ul>

          <p>
            These variables create the incredible diversity of cheese varieties available today, with each milk type
            contributing its own special characteristics to the world of cheese.
          </p>
        </div>
      </section>
    </div>
  )
}

