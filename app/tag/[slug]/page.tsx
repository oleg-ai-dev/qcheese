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

interface TagIndex {
  tag: string
  slug: string
  count: number
  cheeses: CheeseBasicInfo[]
}

// Generate static params
export async function generateStaticParams() {
  const indexPath = path.join(process.cwd(), "data", "indexes", "tags.json")

  try {
    if (fs.existsSync(indexPath)) {
      const tags: TagIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))

      return tags.map((tag) => ({
        slug: tag.slug,
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
  const indexPath = path.join(process.cwd(), "data", "indexes", "tags.json")

  try {
    if (fs.existsSync(indexPath)) {
      const tags: TagIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
      const tag = tags.find((t) => t.slug === slug)

      if (tag) {
        const title = `${tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)} Cheese Guide: Types & Varieties`
        const description = `Explore our guide to ${tag.tag} cheeses. Discover ${tag.count} varieties with detailed flavor profiles, origins, and perfect pairings.`

        return {
          title,
          description,
          keywords: [
            `${tag.tag} cheese`,
            `${tag.tag} cheese types`,
            `${tag.tag} cheese guide`,
            `${tag.tag} cheese varieties`,
          ],
          openGraph: {
            title,
            description,
            type: "website",
            url: `https://qcheese.com/tag/${slug}`,
            images: [
              {
                url: `https://qcheese.com/images/tags/${slug}.jpg`,
                width: 1200,
                height: 630,
                alt: `${tag.tag} cheese varieties`,
              },
            ],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`https://qcheese.com/images/tags/${slug}.jpg`],
          },
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Cheese by Tag",
    description: "Explore our comprehensive guide to cheese varieties by characteristic tag.",
  }
}

// Page component
export default function TagPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const indexPath = path.join(process.cwd(), "data", "indexes", "tags.json")

  // Check if tag exists
  if (!fs.existsSync(indexPath)) {
    notFound()
  }

  // Read tag data
  const tags: TagIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
  const tag = tags.find((t) => t.slug === slug)

  if (!tag) {
    notFound()
  }

  // Get detailed cheese data for each cheese
  const cheeses = []
  const cheeseDir = path.join(process.cwd(), "data", "cheeses")

  for (const cheese of tag.cheeses.slice(0, 30)) {
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
    name: `${tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)} Cheese Guide`,
    description: `Explore our guide to ${tag.tag} cheeses. Discover ${tag.count} varieties with detailed flavor profiles, origins, and perfect pairings.`,
    url: `https://qcheese.com/tag/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tag.cheeses.slice(0, 10).map((cheese, index) => ({
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
        name: "Tags",
        item: "https://qcheese.com/tag",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)} Cheese`,
        item: `https://qcheese.com/tag/${slug}`,
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
          { label: "Tags", href: "/tag" },
          {
            label: `${tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)} Cheese`,
            href: `/tag/${slug}`,
            isCurrentPage: true,
          },
        ]}
      />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)} Cheese Guide
        </h1>
        <p className="text-lg text-gray-700">
          Explore our guide to {tag.tag} cheeses. Discover {tag.count} varieties with detailed flavor profiles, origins,
          and perfect pairings.
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
      {tag.count > 30 && (
        <div className="flex justify-center mb-8">
          <p className="text-gray-600">Showing 30 of {tag.count} cheeses. Explore more by using the search feature.</p>
        </div>
      )}

      {/* SEO Content Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4">About {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)} Cheese</h2>
        <div className="prose max-w-none">
          <p>
            Cheeses characterized as "{tag.tag}" represent a distinctive category in the world of cheese. This
            characteristic can refer to various aspects including flavor profile, production method, aging process, or
            other defining features that set these cheeses apart.
          </p>

          <p>
            The "{tag.tag}" quality in cheese can be attributed to several factors, including the type of milk used, the
            specific cultures and enzymes employed in production, the aging environment, and traditional techniques
            passed down through generations of cheese makers.
          </p>

          <h3>What Makes a Cheese "{tag.tag}"?</h3>
          <p>
            A cheese may be classified as "{tag.tag}" based on specific characteristics that are recognizable across
            different varieties. These might include distinctive flavor notes, textural qualities, appearance, or
            production methods that create this defining trait.
          </p>

          <h3>Popular {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)} Cheese Varieties</h3>
          <p>
            Notable examples of {tag.tag} cheeses include{" "}
            {cheeses
              .slice(0, 3)
              .map((c) => c.name)
              .join(", ")}
            , and many others. Each variety brings its own unique characteristics while sharing the fundamental "
            {tag.tag}" quality that defines this category.
          </p>

          <h3>Culinary Applications</h3>
          <p>
            {tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1)} cheeses offer unique culinary possibilities that
            showcase their distinctive characteristics. Whether enjoyed on a cheese board, incorporated into recipes, or
            paired with complementary foods and beverages, these cheeses bring their special qualities to diverse
            gastronomic experiences.
          </p>

          <h3>Pairing Suggestions</h3>
          <p>
            When pairing {tag.tag} cheeses, consider accompaniments that either complement or provide an interesting
            contrast to their distinctive characteristics. Appropriate wines, beers, fruits, nuts, breads, and preserves
            can enhance the experience of these cheeses and create memorable flavor combinations.
          </p>
        </div>
      </section>
    </div>
  )
}

