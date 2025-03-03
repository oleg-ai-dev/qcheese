import fs from "fs"
import path from "path"
import Link from "next/link"
import Breadcrumb from "@/components/breadcrumb"
import { MapPin } from "lucide-react"
import type { Metadata } from "next"

// Define types
interface CountryIndex {
  country: string
  slug: string
  count: number
}

// Generate metadata
export const metadata: Metadata = {
  title: "Cheese by Country of Origin: Traditional Varieties Worldwide",
  description:
    "Explore our comprehensive guide to cheese varieties by country of origin. Discover traditional cheese-making techniques and regional specialties from around the world.",
  keywords: [
    "cheese origin",
    "cheese by country",
    "traditional cheese",
    "regional cheese",
    "cheese varieties by country",
  ],
  openGraph: {
    title: "Cheese by Country of Origin: Traditional Varieties Worldwide",
    description:
      "Explore our comprehensive guide to cheese varieties by country of origin. Discover traditional cheese-making techniques and regional specialties from around the world.",
    type: "website",
    url: "https://qcheese.com/origin",
    images: [
      {
        url: "https://qcheese.com/images/origins.jpg",
        width: 1200,
        height: 630,
        alt: "Cheese varieties by country of origin",
      },
    ],
  },
}

// Page component
export default function OriginsPage() {
  // Read country data
  const indexPath = path.join(process.cwd(), "data", "indexes", "countries.json")
  let countries: CountryIndex[] = []

  try {
    if (fs.existsSync(indexPath)) {
      const fullCountries = JSON.parse(fs.readFileSync(indexPath, "utf8"))

      // Extract just what we need and sort by count (descending)
      countries = fullCountries
        .map((country: CountryIndex) => ({
          country: country.country,
          slug: country.slug,
          count: country.count,
        }))
        .sort((a: { country: string; slug: string; count: number }, b: { country: string; slug: string; count: number }) => b.count - a.count)
    }
  } catch (error) {
    console.error("Error reading countries data:", error)
  }

  // Format JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cheese by Country of Origin",
    description:
      "Explore our comprehensive guide to cheese varieties by country of origin. Discover traditional cheese-making techniques and regional specialties from around the world.",
    url: "https://qcheese.com/origin",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: countries.slice(0, 10).map((country, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://qcheese.com/origin/${country.slug}/all`,
        name: `${country.country} Cheese`,
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
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Origins", href: "/origin", isCurrentPage: true }]} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Cheese by Country of Origin</h1>
        <p className="text-lg text-gray-700">
          Explore our comprehensive guide to cheese varieties by country of origin. Discover traditional cheese-making
          techniques and regional specialties from around the world.
        </p>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {countries.map((country, index) => (
          <Link
            key={index}
            href={`/origin/${country.slug}/all`}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-yellow-600 mr-3" />
              <h2 className="text-xl font-bold">{country.country} Cheese</h2>
            </div>
            <p className="text-gray-600 mb-2">{country.count} varieties</p>
            <p className="text-sm text-blue-600">Explore →</p>
          </Link>
        ))}
      </div>

      {/* SEO Content Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4">Cheese Traditions Around the World</h2>
        <div className="prose max-w-none">
          <p>
            Cheese-making traditions vary dramatically across different countries and regions, reflecting local
            climates, available ingredients, cultural practices, and historical developments. These geographical
            distinctions have given rise to the incredible diversity of cheese varieties we enjoy today.
          </p>

          <h3>European Cheese Traditions</h3>
          <p>
            Europe is home to some of the world's most renowned cheese-producing countries, each with distinctive
            traditions:
          </p>

          <h4>France</h4>
          <p>
            France boasts one of the richest cheese heritages in the world, with hundreds of varieties ranging from
            soft, bloomy-rind cheeses like Brie and Camembert to firm mountain cheeses like Beaufort and Comté. The
            French system of Appellation d'Origine Protégée (AOP) protects traditional cheese-making methods and
            regional specificity.
          </p>

          <h4>Italy</h4>
          <p>
            Italian cheese-making traditions are deeply rooted in regional identity, from the hard, aged
            Parmigiano-Reggiano of Emilia-Romagna to the soft, fresh Mozzarella of Campania. Many Italian cheeses are
            protected by Denominazione di Origine Protetta (DOP) status, ensuring they are made according to traditional
            methods in their regions of origin.
          </p>

          <h4>Spain</h4>
          <p>
            Spanish cheese traditions reflect the country's diverse landscapes and climates, from the sheep's milk
            Manchego of La Mancha to the blue-veined Cabrales of Asturias. Many Spanish cheeses have Denominación de
            Origen Protegida (DOP) status, preserving traditional production methods.
          </p>

          <h4>United Kingdom</h4>
          <p>
            British cheese-making has experienced a renaissance in recent decades, with traditional varieties like
            Cheddar, Stilton, and Lancashire being joined by innovative new creations. Regional specialties reflect
            local farming traditions and historical development.
          </p>

          <h3>North American Cheese Traditions</h3>
          <p>
            While North American cheese-making has historically been influenced by European traditions, it has developed
            its own distinctive character:
          </p>

          <h4>United States</h4>
          <p>
            American cheese-making combines European influences with innovation and experimentation. From traditional
            varieties like Colby and Monterey Jack to the vibrant artisanal cheese scene that has emerged in recent
            decades, American cheese reflects the country's diverse cultural heritage and agricultural landscape.
          </p>

          <h4>Canada</h4>
          <p>
            Canadian cheese traditions blend French and English influences with unique local developments. Quebec's soft
            cheeses reflect French heritage, while cheddar-style cheeses are prominent in other regions. Canadian
            cheese-makers are increasingly gaining international recognition for their quality and innovation.
          </p>

          <h3>Global Cheese Perspectives</h3>
          <p>Beyond Europe and North America, cheese-making traditions exist in many cultures worldwide:</p>

          <h4>Middle East and North Africa</h4>
          <p>
            These regions have ancient cheese-making traditions, with varieties like feta, halloumi, and labneh playing
            important roles in local cuisines. Many of these cheeses are designed to withstand hot climates and are
            often preserved in brine or dried.
          </p>

          <h4>South America</h4>
          <p>
            South American cheese traditions blend indigenous practices with European influences brought by colonizers.
            Countries like Brazil, Argentina, and Colombia have developed distinctive regional varieties that reflect
            local tastes and available ingredients.
          </p>

          <h4>Asia</h4>
          <p>
            While not traditionally known for cheese production, countries like India have long-standing traditions of
            making fresh cheeses like paneer. In recent years, cheese production has expanded in countries like Japan,
            China, and South Korea, both preserving traditional methods and developing new approaches.
          </p>

          <p>
            Exploring cheese by country of origin offers a fascinating window into cultural traditions, agricultural
            practices, and culinary innovation around the world. Each cheese tells a story of its place of origin and
            the people who have developed and preserved these traditions through generations.
          </p>
        </div>
      </section>
    </div>
  )
}
