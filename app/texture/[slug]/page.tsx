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

interface TextureIndex {
  texture: string
  slug: string
  count: number
  cheeses: CheeseBasicInfo[]
}

// Generate static params
export async function generateStaticParams() {
  const indexPath = path.join(process.cwd(), "data", "indexes", "textures.json")

  try {
    if (fs.existsSync(indexPath)) {
      const textures: TextureIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))

      return textures.map((texture) => ({
        slug: texture.slug,
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
  const indexPath = path.join(process.cwd(), "data", "indexes", "textures.json")

  try {
    if (fs.existsSync(indexPath)) {
      const textures: TextureIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
      const texture = textures.find((t) => t.slug === slug)

      if (texture) {
        const title = `${texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese Guide: Types, Flavors & Pairings`
        const description = `Explore our comprehensive guide to ${texture.texture} cheeses. Discover ${texture.count} varieties with detailed flavor profiles, origins, and perfect pairings.`

        return {
          title,
          description,
          keywords: [
            `${texture.texture} cheese`,
            `${texture.texture} cheese types`,
            `${texture.texture} cheese guide`,
            `${texture.texture} cheese varieties`,
          ],
          openGraph: {
            title,
            description,
            type: "website",
            url: `https://qcheese.com/texture/${slug}`,
            images: [
              {
                url: `https://qcheese.com/images/textures/${slug}.jpg`,
                width: 1200,
                height: 630,
                alt: `${texture.texture} cheese varieties`,
              },
            ],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`https://qcheese.com/images/textures/${slug}.jpg`],
          },
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Cheese by Texture",
    description: "Explore our comprehensive guide to cheese varieties by texture.",
  }
}

// Page component
export default function TexturePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const indexPath = path.join(process.cwd(), "data", "indexes", "textures.json")

  // Check if texture exists
  if (!fs.existsSync(indexPath)) {
    notFound()
  }

  // Read texture data
  const textures: TextureIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
  const texture = textures.find((t) => t.slug === slug)

  if (!texture) {
    notFound()
  }

  // Get detailed cheese data for each cheese
  const cheeses = []
  const cheeseDir = path.join(process.cwd(), "data", "cheeses")

  for (const cheese of texture.cheeses.slice(0, 30)) {
    // Limit to 30 for performance
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
    name: `${texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese Guide`,
    description: `Explore our comprehensive guide to ${texture.texture} cheeses. Discover ${texture.count} varieties with detailed flavor profiles, origins, and perfect pairings.`,
    url: `https://qcheese.com/texture/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: texture.cheeses.slice(0, 10).map((cheese, index) => ({
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
        name: "Textures",
        item: "https://qcheese.com/texture",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese`,
        item: `https://qcheese.com/texture/${slug}`,
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
          { label: "Textures", href: "/texture" },
          {
            label: `${texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese`,
            href: `/texture/${slug}`,
            isCurrentPage: true,
          },
        ]}
      />

      {/*  Cheese`, href: `/texture/${slug}`, isCurrentPage: true }
        ]}
      />
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese Guide
        </h1>
        <p className="text-lg text-gray-700">
          Explore our comprehensive guide to {texture.texture} cheeses. Discover {texture.count} varieties with detailed
          flavor profiles, origins, and perfect pairings.
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

      {/* Pagination for large collections */}
      {texture.count > 30 && (
        <div className="flex justify-center mb-8">
          <p className="text-gray-600">
            Showing 30 of {texture.count} cheeses. Explore more by using the search feature.
          </p>
        </div>
      )}

      {/* SEO Content Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4">
          About {texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese
        </h2>
        <div className="prose max-w-none">
          <p>
            {texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} cheeses represent a distinctive
            category in the world of cheese, characterized by their unique mouthfeel and structural properties. The
            texture of cheese is a fundamental aspect that influences not only how we experience it but also how it can
            be used in culinary applications.
          </p>

          <p>
            The development of a {texture.texture} texture in cheese is influenced by various factors including the
            cheese-making process, aging time, moisture content, and the specific cultures and enzymes used. These
            elements work together to create the distinctive consistency that defines this category.
          </p>

          <h3>Characteristics of {texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese</h3>
          <p>
            {texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} cheeses typically exhibit{" "}
            {texture.texture === "soft"
              ? "a high moisture content and a creamy, sometimes runny consistency. They often have delicate flavors and are usually consumed fresh or with minimal aging."
              : texture.texture === "semi-soft"
                ? "a moderate moisture content with a pliable, sometimes elastic consistency. They strike a balance between softness and structure, offering diverse flavor profiles."
                : texture.texture === "semi-hard"
                  ? "a lower moisture content than soft varieties, with a firmer consistency that still yields to pressure. They often develop more complex flavors through aging."
                  : texture.texture === "hard"
                    ? "a low moisture content and a firm, sometimes crystalline structure. They typically undergo extended aging, developing concentrated, complex flavors."
                    : "distinctive textural qualities that set them apart from other cheese varieties"}
          </p>

          <h3>Popular {texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese Varieties</h3>
          <p>
            Notable examples of {texture.texture} cheeses include{" "}
            {cheeses
              .slice(0, 3)
              .map((c) => c.name)
              .join(", ")}
            , and many others. Each variety brings its own unique characteristics while sharing the fundamental{" "}
            {texture.texture} texture that defines this category.
          </p>

          <h3>Culinary Applications</h3>
          <p>
            {texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} cheeses are particularly well-suited
            for{" "}
            {texture.texture === "soft"
              ? "spreading on bread or crackers, incorporating into dips, or enjoying as part of a cheese board. Their creamy consistency adds richness to dishes without requiring melting."
              : texture.texture === "semi-soft"
                ? "melting applications like sandwiches and sauces, as well as being enjoyed on cheese boards. They offer versatility in both cold and heated preparations."
                : texture.texture === "semi-hard"
                  ? "slicing for sandwiches, grating for cooking, and featuring on cheese boards. Their balanced texture makes them adaptable to various culinary uses."
                  : texture.texture === "hard"
                    ? "grating over pasta, risotto, and soups, as well as being cut into chunks for snacking. Their concentrated flavor means a little goes a long way in recipes."
                    : "various culinary applications that take advantage of their unique textural properties"}
          </p>

          <h3>Pairing Suggestions</h3>
          <p>
            When pairing {texture.texture} cheeses, consider complementary flavors and textures.{" "}
            {texture.texture === "soft"
              ? "Fresh fruits, honey, and light white wines often pair beautifully with their delicate flavors and creamy consistency."
              : texture.texture === "semi-soft"
                ? "Medium-bodied wines, fruit preserves, and nuts complement their balanced flavors and pliable texture."
                : texture.texture === "semi-hard"
                  ? "Fuller-bodied wines, dried fruits, and hearty breads match well with their more developed flavors and firmer texture."
                  : texture.texture === "hard"
                    ? "Bold red wines, aged balsamic vinegar, and robust accompaniments stand up to their intense flavors and firm texture."
                    : "Appropriate accompaniments will enhance their distinctive characteristics and create harmonious flavor combinations"}
          </p>
        </div>
      </section>
    </div>
  )
}

