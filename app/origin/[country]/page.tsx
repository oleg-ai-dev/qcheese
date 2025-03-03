import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import Link from "next/link"
import Breadcrumb from "@/components/breadcrumb"
import CheeseCard from "@/components/cheese-card"
import type { Metadata } from "next"

// Define types
interface CheeseBasicInfo {
  name: string
  slug: string
}

interface RegionIndex {
  region: string
  slug: string
  count: number
  cheeses: CheeseBasicInfo[]
}

interface CountryIndex {
  country: string
  slug: string
  count: number
  cheeses: CheeseBasicInfo[]
  regions: RegionIndex[]
}

// Generate static params
export async function generateStaticParams() {
  const indexPath = path.join(process.cwd(), "data", "indexes", "countries.json")

  try {
    if (fs.existsSync(indexPath)) {
      const countries: CountryIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
      return countries.map(country => ({
        country: country.slug
      }))
    }
  } catch (error) {
    console.error("Error generating static params:", error)
  }

  return []
}

// Generate metadata
export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const { country } = params
  const indexPath = path.join(process.cwd(), "data", "indexes", "countries.json")

  try {
    if (fs.existsSync(indexPath)) {
      const countries: CountryIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
      const countryData = countries.find((c) => c.slug === country)

      if (countryData) {
        const title = `${countryData.country} Cheese Guide: Traditional Varieties & Flavors`
        const description = `Explore ${countryData.count} traditional cheese varieties from ${countryData.country}. Learn about regional specialties, flavor profiles, and perfect pairings.`

        return {
          title,
          description,
          keywords: [
            `${countryData.country} cheese`,
            `${countryData.country} cheese types`,
            `${countryData.country} cheese guide`,
            `traditional ${countryData.country} cheese`,
          ],
          openGraph: {
            title,
            description,
            type: "website",
            url: `https://qcheese.com/origin/${country}`,
            images: [
              {
                url: `https://qcheese.com/images/countries/${country}.jpg`,
                width: 1200,
                height: 630,
                alt: `${countryData.country} cheese varieties`,
              },
            ],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`https://qcheese.com/images/countries/${country}.jpg`],
          },
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Country Cheese Guide",
    description: "Explore our comprehensive guide to country cheese varieties.",
  }
}

// Page component
export default function CountryPage({ params }: { params: { country: string } }) {
  const { country } = params
  const indexPath = path.join(process.cwd(), "data", "indexes", "countries.json")

  // Check if country exists
  if (!fs.existsSync(indexPath)) {
    notFound()
  }

  // Read country data
  const countries: CountryIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
  const countryData = countries.find((c) => c.slug === country)

  if (!countryData) {
    notFound()
  }

  // Get detailed cheese data for each cheese (limit to 30 for performance)
  const cheeses = []
  const cheeseDir = path.join(process.cwd(), "data", "cheeses")

  for (const cheese of countryData.cheeses.slice(0, 30)) {
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
    name: `${countryData.country} Cheese Guide`,
    description: `Explore ${countryData.count} traditional cheese varieties from ${countryData.country}. Learn about regional specialties, flavor profiles, and perfect pairings.`,
    url: `https://qcheese.com/origin/${countryData.slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: countryData.cheeses.slice(0, 10).map((cheese, index) => ({
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
        name: "Origins",
        item: "https://qcheese.com/origin",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: countryData.country,
        item: `https://qcheese.com/origin/${countryData.slug}`,
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
          { label: "Origins", href: "/origin" },
          { label: countryData.country, href: `/origin/${countryData.slug}`, isCurrentPage: true },
        ]}
      />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{countryData.country} Cheese Guide</h1>
        <p className="text-lg text-gray-700">
          Explore {countryData.count} traditional cheese varieties from {countryData.country}. Learn about regional
          specialties, flavor profiles, and perfect pairings.
        </p>
      </div>

      {/* Regions Section (if available) */}
      {countryData.regions.length > 0 && (
        <section className="content-section mb-8">
          <h2 className="text-2xl font-bold mb-4">Regions of {countryData.country}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryData.regions.map((region, index) => (
              <Link
                key={index}
                href={`/origin/${countryData.slug}/${region.slug}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg mb-1">{region.region}</h3>
                <p className="text-sm text-gray-600">{region.count} cheese varieties</p>
              </Link>
            ))}
          </div>
        </section>
      )}

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
      {countryData.count > 30 && (
        <div className="flex justify-center mb-8">
          <p className="text-gray-600">
            Showing 30 of {countryData.count} cheeses. Explore more by browsing regions or using the search feature.
          </p>
        </div>
      )}

      {/* SEO Content Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4">About {countryData.country} Cheese</h2>
        <div className="prose max-w-none">
          <p>
            {countryData.country} has a rich tradition of cheese-making, with varieties that reflect the country's
            diverse landscapes, climate, and cultural heritage. From the lush pastures to the mountainous regions, each
            area contributes unique characteristics to the cheeses produced there.
          </p>

          <p>
            The cheese-making traditions of {countryData.country} have been passed down through generations, with many
            producers still using time-honored methods alongside modern techniques to create exceptional products. The
            country's cheese industry is characterized by a commitment to quality, authenticity, and respect for
            traditional practices.
          </p>

          <h3>Characteristics of {countryData.country} Cheese</h3>
          <p>
            {countryData.country} cheeses are known for their distinctive flavors, textures, and aromas. The country's
            cheese-making traditions have been influenced by its geography, climate, and cultural exchanges with
            neighboring regions, resulting in a diverse range of cheese styles.
          </p>

          <h3>Popular {countryData.country} Cheese Varieties</h3>
          <p>
            Some of the most beloved cheese varieties from {countryData.country} include{" "}
            {cheeses
              .slice(0, 3)
              .map((c) => c.name)
              .join(", ")}
            , and many more. Each variety has its own unique characteristics, production methods, and cultural
            significance.
          </p>

          <h3>Pairing {countryData.country} Cheese</h3>
          <p>
            {countryData.country} cheeses pair wonderfully with local wines, beers, and traditional accompaniments. The
            diverse range of flavors and textures makes these cheeses versatile additions to cheese boards, cooking, and
            culinary experiences.
          </p>

          <h3>Exploring {countryData.country} Cheese Culture</h3>
          <p>
            To truly appreciate the cheese culture of {countryData.country}, consider the regional specialties, seasonal
            variations, and traditional serving methods. Many of these cheeses are protected by designation of origin
            regulations, ensuring their authenticity and connection to specific geographical areas.
          </p>
        </div>
      </section>
    </div>
  )
}
