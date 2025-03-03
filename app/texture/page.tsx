import fs from "fs"
import path from "path"
import Link from "next/link"
import Breadcrumb from "@/components/breadcrumb"
import { ChevronsUpIcon as Cheese } from "lucide-react"
import type { Metadata } from "next"

// Define types
interface TextureIndex {
  texture: string
  slug: string
  count: number
}

// Generate metadata
export const metadata: Metadata = {
  title: "Cheese by Texture: Soft, Semi-Soft, Hard & More",
  description:
    "Explore our comprehensive guide to cheese varieties by texture. Discover how texture affects flavor, usage, and pairings across different cheese types.",
  keywords: [
    "cheese texture",
    "soft cheese",
    "hard cheese",
    "semi-soft cheese",
    "cheese texture guide",
    "cheese varieties by texture",
  ],
  openGraph: {
    title: "Cheese by Texture: Soft, Semi-Soft, Hard & More",
    description:
      "Explore our comprehensive guide to cheese varieties by texture. Discover how texture affects flavor, usage, and pairings across different cheese types.",
    type: "website",
    url: "https://qcheese.com/texture",
    images: [
      {
        url: "https://qcheese.com/images/textures.jpg",
        width: 1200,
        height: 630,
        alt: "Cheese varieties by texture",
      },
    ],
  },
}

// Page component
export default function TexturesPage() {
  // Read texture data
  const indexPath = path.join(process.cwd(), "data", "indexes", "textures.json")
  let textures: TextureIndex[] = []

  try {
    if (fs.existsSync(indexPath)) {
      textures = JSON.parse(fs.readFileSync(indexPath, "utf8"))

      // Sort by count (descending)
      textures.sort((a, b) => b.count - a.count)
    }
  } catch (error) {
    console.error("Error reading textures data:", error)
  }

  // Format JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cheese by Texture",
    description:
      "Explore our comprehensive guide to cheese varieties by texture. Discover how texture affects flavor, usage, and pairings across different cheese types.",
    url: "https://qcheese.com/texture",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: textures.slice(0, 10).map((texture, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://qcheese.com/texture/${texture.slug}`,
        name: `${texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese`,
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
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Textures", href: "/texture", isCurrentPage: true }]} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Cheese by Texture</h1>
        <p className="text-lg text-gray-700">
          Explore our comprehensive guide to cheese varieties by texture. Discover how texture affects flavor, usage,
          and pairings across different cheese types.
        </p>
      </div>

      {/* Textures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {textures.map((texture, index) => (
          <Link
            key={index}
            href={`/texture/${texture.slug}`}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              <Cheese className="h-8 w-8 text-yellow-600 mr-3" />
              <h2 className="text-xl font-bold">
                {texture.texture.charAt(0).toUpperCase() + texture.texture.slice(1)} Cheese
              </h2>
            </div>
            <p className="text-gray-600 mb-2">{texture.count} varieties</p>
            <p className="text-sm text-blue-600">Explore →</p>
          </Link>
        ))}
      </div>

      {/* SEO Content Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4">Understanding Cheese Texture</h2>
        <div className="prose max-w-none">
          <p>
            Texture is one of the most important characteristics of cheese, influencing not only how it feels in the
            mouth but also how it's used in cooking, how it's paired with other foods and beverages, and how it's stored
            and served. The texture of cheese exists on a spectrum from very soft to extremely hard, with numerous
            variations in between.
          </p>

          <h3>What Determines Cheese Texture?</h3>
          <p>Several factors influence the texture of cheese:</p>

          <ul>
            <li>
              <strong>Moisture content:</strong> Generally, the higher the moisture content, the softer the cheese.
            </li>
            <li>
              <strong>Aging time:</strong> As cheese ages, it typically loses moisture and becomes firmer.
            </li>
            <li>
              <strong>Curd treatment:</strong> How the curds are cut, cooked, pressed, and handled affects the final
              texture.
            </li>
            <li>
              <strong>Milk type:</strong> Different animal milks contain varying levels of fat and protein, affecting
              texture.
            </li>
            <li>
              <strong>Cultures and enzymes:</strong> These influence how proteins break down during aging, affecting
              texture development.
            </li>
          </ul>

          <h3>The Texture Spectrum</h3>

          <h4>Fresh Cheese</h4>
          <p>
            Fresh cheeses are unaged and have a high moisture content, resulting in soft, often spreadable textures.
            Examples include cottage cheese, cream cheese, ricotta, and fresh mozzarella. These cheeses typically have
            mild, milky flavors and are highly perishable.
          </p>

          <h4>Soft Cheese</h4>
          <p>
            Soft cheeses have a creamy, sometimes runny consistency. They may have bloomy rinds (like Brie and
            Camembert) or washed rinds (like Epoisses and Taleggio). These cheeses often develop more complex flavors
            than fresh varieties while maintaining a luxurious, spreadable texture.
          </p>

          <h4>Semi-Soft Cheese</h4>
          <p>
            Semi-soft cheeses strike a balance between softness and structure. They're pliable but hold their shape
            well. Examples include Havarti, young Gouda, Fontina, and Monterey Jack. These versatile cheeses often melt
            beautifully, making them excellent for cooking.
          </p>

          <h4>Semi-Hard Cheese</h4>
          <p>
            Semi-hard cheeses have a firmer texture but still yield to pressure. They include varieties like mature
            Cheddar, Gruyère, Emmental, and young Manchego. These cheeses often develop complex flavors through aging
            while maintaining some elasticity.
          </p>

          <h4>Hard Cheese</h4>
          <p>
            Hard cheeses have low moisture content and firm, sometimes crystalline textures. Examples include aged
            Gouda, Parmigiano-Reggiano, aged Manchego, and Pecorino Romano. These cheeses are often aged for extended
            periods, developing concentrated, complex flavors.
          </p>

          <h4>Very Hard Cheese</h4>
          <p>
            Very hard or grating cheeses have extremely low moisture content and are typically used grated or shaved
            rather than eaten in chunks. Examples include aged Parmigiano-Reggiano, aged Pecorino, and Grana Padano.
            These cheeses are prized for their intense, concentrated flavors.
          </p>

          <h3>Texture and Culinary Applications</h3>
          <p>A cheese's texture significantly influences how it can be used in cooking and serving:</p>

          <ul>
            <li>
              <strong>Spreading:</strong> Soft, creamy cheeses are ideal for spreading on bread, crackers, or bagels.
            </li>
            <li>
              <strong>Melting:</strong> Semi-soft and many semi-hard cheeses melt smoothly, making them perfect for
              sandwiches, sauces, and gratins.
            </li>
            <li>
              <strong>Slicing:</strong> Semi-hard cheeses slice cleanly for sandwiches and cheese boards.
            </li>
            <li>
              <strong>Grating:</strong> Hard and very hard cheeses grate well for topping pasta, soups, and salads.
            </li>
            <li>
              <strong>Crumbling:</strong> Some cheeses, particularly certain blue cheeses and feta, have a crumbly
              texture ideal for sprinkling over salads and other dishes.
            </li>
          </ul>

          <p>
            Understanding cheese texture helps in selecting the right cheese for specific culinary applications and in
            creating balanced cheese boards that offer a variety of textural experiences.
          </p>
        </div>
      </section>
    </div>
  )
}

