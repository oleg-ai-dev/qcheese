import Link from "next/link"
import fs from "fs"
import path from "path"
import CheeseCard from "@/components/cheese-card"
import { Milk, Globe, ChevronsUpIcon as Cheese } from "lucide-react"

// Define types
interface CheeseBasicInfo {
  name: string
  slug: string
  country: string
  milk: string
  type: string
  texture: string
}

interface MasterIndex {
  totalCheeses: number
  cheeses: CheeseBasicInfo[]
}

// Generate metadata
export const metadata = {
  title: "QCheese.com - The Ultimate Cheese Directory",
  description:
    "Explore our comprehensive cheese directory with detailed information on flavors, origins, and pairings for cheese lovers.",
  keywords: ["cheese", "cheese types", "cheese guide", "cheese directory", "cheese pairings"],
}

// Get data at build time
export default function Home() {
  // In a real implementation, this would be done at build time
  // For simplicity, we're doing it in the component
  const masterIndexPath = path.join(process.cwd(), "data", "indexes", "master.json")
  let featuredCheeses: CheeseBasicInfo[] = []
  let totalCheeses = 0

  try {
    if (fs.existsSync(masterIndexPath)) {
      const masterIndex: MasterIndex = JSON.parse(fs.readFileSync(masterIndexPath, "utf8"))
      totalCheeses = masterIndex.totalCheeses

      // Get 6 random cheeses for featured section
      featuredCheeses = masterIndex.cheeses.sort(() => 0.5 - Math.random()).slice(0, 6)
    }
  } catch (error) {
    console.error("Error reading master index:", error)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#f9f5e7] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#333333]">Discover the World of Cheese</h1>
            <p className="text-xl text-[#666666] mb-8">
              Explore {totalCheeses.toLocaleString()} cheeses from around the world with our detailed
              and updated information on flavors, origins, and properties.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/cheeses"
                className="btn-primary"
              >
                EXPLORE CHEESES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-[#333333]">Explore by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Milk Types Card */}
            <div className="category-card">
              <h3 className="text-xl font-bold mb-4 text-[#333333]">Milk Types</h3>
              <p className="text-[#666666] mb-6">
                Discover cheeses made from cow, goat, sheep, and other milk varieties.
              </p>
              <Link href="/milk-type" className="category-button">
                Explore Milk Types
              </Link>
            </div>

            {/* Origins Card */}
            <div className="category-card">
              <h3 className="text-xl font-bold mb-4 text-[#333333]">Origins</h3>
              <p className="text-[#666666] mb-6">
                Journey through cheese-making traditions from different countries.
              </p>
              <Link href="/origin" className="category-button">
                Explore Origins
              </Link>
            </div>

            {/* Textures Card */}
            <div className="category-card">
              <h3 className="text-xl font-bold mb-4 text-[#333333]">Textures</h3>
              <p className="text-[#666666] mb-6">
                From soft and creamy to hard and crumbly, find your perfect texture.
              </p>
              <Link href="/texture" className="category-button">
                Explore Textures
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cheeses */}
      <section className="py-16 bg-[#f4f2ed]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-[#333333]">Featured Cheeses</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCheeses.map((cheese, index) => (
              <CheeseCard
                key={index}
                name={cheese.name}
                slug={cheese.slug}
                country={cheese.country}
                milk={cheese.milk}
                texture={cheese.texture}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/cheeses"
              className="btn-primary"
            >
              EXPLORE ALL CHEESES
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-[#333333]">The Ultimate Cheese Directory</h2>

          <div className="prose lg:prose-lg mx-auto text-[#666666]">
            <p>
              Welcome to QCheese.com, your comprehensive guide to the world of cheese. Our directory features detailed
              information on thousands of cheese varieties from around the globe, helping cheese enthusiasts discover
              new flavors, learn about traditional production methods, and find perfect pairings.
            </p>

            <p>
              Whether you're a casual cheese lover or a connoisseur, our extensive database provides valuable insights
              into the characteristics, origins, and flavor profiles of each cheese. From creamy Brie to aged Cheddar,
              from tangy goat cheese to nutty Gruyère, we cover the full spectrum of cheese varieties.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
