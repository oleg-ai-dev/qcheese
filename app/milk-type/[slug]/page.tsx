import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import Breadcrumb from "@/components/breadcrumb"
import CheeseCard from "@/components/cheese-card"
import type { Metadata } from "next"

// Define types
interface CheeseBasicInfo {
  name: string
  slug: string
}

interface MilkTypeIndex {
  type: string
  slug: string
  count: number
  cheeses: CheeseBasicInfo[]
}

// Generate static params
export async function generateStaticParams() {
  const indexPath = path.join(process.cwd(), "data", "indexes", "milk-types.json")

  try {
    if (fs.existsSync(indexPath)) {
      const milkTypes: MilkTypeIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))

      return milkTypes.map((milkType) => ({
        slug: milkType.slug,
      }))
    }
  } catch (error) {
    console.error("Error generating static params:", error)
  }

  return []
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const indexPath = path.join(process.cwd(), "data", "indexes", "milk-types.json")

  try {
    if (fs.existsSync(indexPath)) {
      const milkTypes: MilkTypeIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
      const milkType = milkTypes.find((mt) => mt.slug === slug)

      if (milkType) {
        const title = `${milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese Guide: Types, Flavors & Pairings`
        const description = `Explore our comprehensive guide to ${milkType.type} milk cheeses. Discover ${milkType.count} varieties with detailed flavor profiles, origins, and perfect pairings.`

        return {
          title,
          description,
          keywords: [
            `${milkType.type} milk cheese`,
            `${milkType.type} cheese types`,
            `${milkType.type} cheese guide`,
            `${milkType.type} cheese varieties`,
          ],
          openGraph: {
            title,
            description,
            type: "website",
            url: `https://qcheese.com/milk-type/${slug}`,
            images: [
              {
                url: `https://qcheese.com/images/milk-types/${slug}.jpg`,
                width: 1200,
                height: 630,
                alt: `${milkType.type} milk cheese varieties`,
              },
            ],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`https://qcheese.com/images/milk-types/${slug}.jpg`],
          },
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Cheese by Milk Type",
    description: "Explore our comprehensive guide to cheese varieties by milk type.",
  }
}

// Page component
export default function MilkTypePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const indexPath = path.join(process.cwd(), "data", "indexes", "milk-types.json")

  // Check if milk type exists
  if (!fs.existsSync(indexPath)) {
    notFound()
  }

  // Read milk type data
  const milkTypes: MilkTypeIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
  const milkType = milkTypes.find((mt) => mt.slug === slug)

  if (!milkType) {
    notFound()
  }

  // Get detailed cheese data for each cheese
  const cheeses = []
  const cheeseDir = path.join(process.cwd(), "data", "cheeses")

  for (const cheese of milkType.cheeses) {
    try {
      const cheeseFilePath = path.join(cheeseDir, `${cheese.slug}.json`)

      if (fs.existsSync(cheeseFilePath)) {
        const cheeseData = JSON.parse(fs.readFileSync(cheeseFilePath, "utf8"))
        cheeses.push(cheeseData)
      }
    } catch (error) {
      console.error(`Error reading cheese data for ${cheese.slug}:`, error)
    }
  }

  // Format JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese Guide`,
    description: `Explore our comprehensive guide to ${milkType.type} milk cheeses. Discover ${milkType.count} varieties with detailed flavor profiles, origins, and perfect pairings.`,
    url: `https://qcheese.com/milk-type/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: milkType.cheeses.slice(0, 10).map((cheese, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://qcheese.com/cheeses/${cheese.slug}`,
        name: cheese.name,
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
      {
        "@type": "ListItem",
        position: 3,
        name: `${milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese`,
        item: `https://qcheese.com/milk-type/${slug}`,
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Milk Types", href: "/milk-type" },
          {
            label: `${milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese`,
            href: `/milk-type/${slug}`,
            isCurrentPage: true,
          },
        ]}
      />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese Guide
        </h1>
        <p className="text-lg text-gray-700">
          Explore our comprehensive guide to {milkType.type} milk cheeses. Discover {milkType.count} varieties with
          detailed flavor profiles, origins, and perfect pairings.
        </p>
      </div>

      {/* Cheese Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cheeses.map((cheese, index) => (
          <CheeseCard
            key={index}
            name={cheese.name}
            slug={cheese.slug}
            country={cheese.country}
            milk={cheese.milk}
            texture={cheese.texture}
            flavor={cheese.flavor}
          />
        ))}
      </div>

      {/* SEO Content Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4">
          About {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese
        </h2>
        <div className="prose max-w-none">
          <p>
            {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} milk cheese is a diverse category of cheese
            made from the milk of {milkType.type}s. These cheeses vary widely in texture, flavor, and aging process,
            offering a rich tapestry of culinary experiences.
          </p>

          <p>
            The unique characteristics of {milkType.type} milk contribute significantly to the flavor profile and
            texture of these cheeses. {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} milk contains
            specific proteins, fats, and enzymes that influence the cheese-making process and the final product.
          </p>

          <h3>Characteristics of {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese</h3>
          <p>
            {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} milk cheeses are known for their{" "}
            {milkType.type === "cow"
              ? "creamy texture and mild flavor"
              : milkType.type === "goat"
                ? "tangy flavor and crumbly texture"
                : milkType.type === "sheep"
                  ? "rich, buttery flavor and firm texture"
                  : "distinctive characteristics"}
            . The fat content in {milkType.type} milk gives these cheeses a{" "}
            {milkType.type === "cow"
              ? "smooth, buttery mouthfeel"
              : milkType.type === "goat"
                ? "clean, bright taste"
                : milkType.type === "sheep"
                  ? "rich, sometimes nutty flavor"
                  : "unique taste profile"}
            .
          </p>

          <h3>Popular {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese Varieties</h3>
          <p>
            Some of the most beloved {milkType.type} milk cheeses include{" "}
            {cheeses
              .slice(0, 3)
              .map((c) => c.name)
              .join(", ")}
            , and many more. Each variety has its own production method, aging process, and flavor profile, making the
            world of {milkType.type} milk cheese incredibly diverse.
          </p>

          <h3>Pairing {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese</h3>
          <p>
            {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} milk cheeses pair wonderfully with a
            variety of accompaniments. Soft varieties often complement fresh fruits and light wines, while aged types
            match well with nuts, honey, and more robust wines or craft beers.
          </p>

          <h3>Cooking with {milkType.type.charAt(0).toUpperCase() + milkType.type.slice(1)} Milk Cheese</h3>
          <p>
            The versatility of {milkType.type} milk cheese makes it an excellent ingredient in cooking. From melting
            into sauces and soups to adding depth to baked dishes, these cheeses can elevate a wide range of recipes
            with their unique flavors and textures.
          </p>
        </div>
      </section>
    </div>
  )
}

