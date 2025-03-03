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
      const params = []

      for (const country of countries) {
        // Add "all" region for each country
        params.push({
          country: country.slug,
          region: "all",
        })
        
        // Add specific regions
        for (const region of country.regions) {
          params.push({
            country: country.slug,
            region: region.slug,
          })
        }
      }

      return params
    }
  } catch (error) {
    console.error("Error generating static params:", error)
  }

  return []
}

// Generate metadata
export async function generateMetadata({ params }: { params: { country: string; region: string } }): Promise<Metadata> {
  const { country, region: regionSlug } = params
  const indexPath = path.join(process.cwd(), "data", "indexes", "countries.json")

  try {
    if (fs.existsSync(indexPath)) {
      const countries: CountryIndex[] = JSON.parse(fs.readFileSync(indexPath, "utf8"))
      const countryData = countries.find((c) => c.slug === country)

      if (countryData) {
        // Special handling for "all" region
        if (regionSlug === "all") {
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
              url: `https://qcheese.com/origin/${country}/all`,
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
        
        // Regular region handling
        const regionData = countryData.regions.find((r) => r.slug === regionSlug)

        if (regionData) {
          const title = `${regionData.region}, ${countryData.country} Cheese Guide: Regional Specialties`
          const description = `Discover ${regionData.count} traditional cheese varieties from ${regionData.region}, ${countryData.country}. Explore regional specialties, flavor profiles, and pairings.`

          return {
            title,
            description,
            keywords: [
              `${regionData.region} cheese`,
              `${countryData.country} regional cheese`,
              `${regionData.region} ${countryData.country} cheese`,
              `traditional ${regionData.region} cheese`,
            ],
            openGraph: {
              title,
              description,
              type: "website",
              url: `https://qcheese.com/origin/${country}/${regionSlug}`,
              images: [
                {
                  url: `https://qcheese.com/images/regions/${country}-${regionSlug}.jpg`,
                  width: 1200,
                  height: 630,
                  alt: `${regionData.region}, ${countryData.country} cheese varieties`,
                },
              ],
            },
            twitter: {
              card: "summary_large_image",
              title,
              description,
              images: [`https://qcheese.com/images/regions/${country}-${regionSlug}.jpg`],
            },
          }
        }
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Regional Cheese Guide",
    description: "Explore our comprehensive guide to regional cheese varieties.",
  }
}

// Page component
export default function RegionPage({ params }: { params: { country: string; region: string } }) {
  const { country, region: regionSlug } = params
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

  // Special handling for "all" region
  if (regionSlug === "all") {
    return renderCountryPage(countryData)
  }

  // Find region data
  const regionData = countryData.regions.find((r) => r.slug === regionSlug)

  if (!regionData) {
    notFound()
  }

  // Get detailed cheese data for each cheese
  const cheeses = []
  const cheeseDir = path.join(process.cwd(), "data", "cheeses")

  for (const cheese of regionData.cheeses) {
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
    name: `${regionData.region}, ${countryData.country} Cheese Guide`,
    description: `Discover ${regionData.count} traditional cheese varieties from ${regionData.region}, ${countryData.country}. Explore regional specialties, flavor profiles, and pairings.`,
    url: `https://qcheese.com/origin/${country}/${regionSlug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: regionData.cheeses.slice(0, 10).map((cheese, index) => ({
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
        item: `https://qcheese.com/origin/${country}/all`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: regionData.region,
        item: `https://qcheese.com/origin/${country}/${regionSlug}`,
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
          { label: countryData.country, href: `/origin/${country}/all` },
          { label: regionData.region, href: `/origin/${country}/${regionSlug}`, isCurrentPage: true },
        ]}
      />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {regionData.region}, {countryData.country} Cheese Guide
        </h1>
        <p className="text-lg text-gray-700">
          Discover {regionData.count} traditional cheese varieties from {regionData.region}, {countryData.country}.
          Explore regional specialties, flavor profiles, and pairings.
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
        <h2 className="text-2xl font-bold mb-4">About {regionData.region} Cheese</h2>
        <div className="prose max-w-none">
          <p>
            {regionData.region} is a renowned cheese-producing region in {countryData.country}, known for its
            distinctive cheese varieties that reflect the local terroir, traditions, and expertise. The unique
            geographical features and climate of {regionData.region} contribute to the exceptional quality and character
            of its cheeses.
          </p>

          <p>
            The cheese-making traditions of {regionData.region} have been preserved and refined over generations, with
            many producers maintaining time-honored methods while embracing innovation. This balance of tradition and
            progress has established {regionData.region} as a significant contributor to {countryData.country}'s rich
            cheese heritage.
          </p>

          <h3>Characteristics of {regionData.region} Cheese</h3>
          <p>
            Cheeses from {regionData.region} are characterized by their unique flavor profiles, textures, and production
            methods. The region's specific climate, soil, and native flora influence the milk used in cheese production,
            resulting in products with a distinct sense of place.
          </p>

          <h3>Popular {regionData.region} Cheese Varieties</h3>
          <p>
            Among the most celebrated cheese varieties from {regionData.region} are{" "}
            {cheeses
              .slice(0, 3)
              .map((c) => c.name)
              .join(", ")}
            , each showcasing the region's cheese-making expertise and cultural heritage. These cheeses have earned
            recognition for their quality and authentic representation of {regionData.region}'s terroir.
          </p>

          <h3>Pairing {regionData.region} Cheese</h3>
          <p>
            The cheeses of {regionData.region} pair exceptionally well with local wines, ciders, or beers, creating
            harmonious flavor combinations that highlight the region's gastronomic traditions. Traditional
            accompaniments such as regional fruits, nuts, and breads also complement these cheeses beautifully.
          </p>

          <h3>Exploring {regionData.region} Cheese Culture</h3>
          <p>
            To fully appreciate the cheese culture of {regionData.region}, consider the historical context, seasonal
            variations, and traditional serving methods. Many of these cheeses are integral to local culinary traditions
            and celebrations, reflecting the region's cultural identity and heritage.
          </p>
        </div>
      </section>
    </div>
  )
}

// Helper function to render the country page (for "all" region)
function renderCountryPage(countryData: CountryIndex) {
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
    url: `https://qcheese.com/origin/${countryData.slug}/all`,
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
        item: `https://qcheese.com/origin/${countryData.slug}/all`,
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
          { label: countryData.country, href: `/origin/${countryData.slug}/all`, isCurrentPage: true },
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
