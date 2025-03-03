import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import Breadcrumb from "@/components/breadcrumb"
import TagList from "@/components/tag-list"
import RelatedCheeses from "@/components/related-cheeses"
import type { Metadata } from "next"

// Define types
interface CheeseData {
  name: string
  slug: string
  milk: string
  country: string
  region: string
  family: string
  type: string
  fat_content: string
  calcium_content: string
  texture: string
  rind: string
  color: string
  flavor: string
  aroma: string
  vegetarian: string
  vegan: string
  synonyms: string
  alt_spellings: string
  producers: string
  description: string
  history: string
  productionProcess: string
  flavorProfile: string
  pairings: string
  faqs: Array<{ question: string; answer: string }>
  tags: string[]
  longTailKeywords: string[]
  nutritionalInfo: {
    fatContent: string
    calciumContent: string
  }
  lastUpdated: string
}

interface RelatedCheese {
  name: string
  slug: string
  country?: string
  milk?: string
  texture?: string
  flavor?: string
}

// Generate static params
export async function generateStaticParams() {
  const cheeseDir = path.join(process.cwd(), "data", "cheeses")

  try {
    if (fs.existsSync(cheeseDir)) {
      const files = fs.readdirSync(cheeseDir)

      return files
        .filter((file) => file.endsWith(".json"))
        .map((file) => ({
          slug: file.replace(".json", ""),
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
  const cheeseFilePath = path.join(process.cwd(), "data", "cheeses", `${slug}.json`)

  try {
    if (fs.existsSync(cheeseFilePath)) {
      const cheeseData: CheeseData = JSON.parse(fs.readFileSync(cheeseFilePath, "utf8"))

      // Check if name already ends with "Cheese"
      const displayName = cheeseData.name.endsWith("Cheese") 
        ? cheeseData.name 
        : `${cheeseData.name} Cheese`

      const title = `${displayName}: ${cheeseData.country} ${cheeseData.milk} Milk Guide`
      const description = `Explore ${cheeseData.name}, a ${cheeseData.texture} ${cheeseData.milk} milk cheese from ${cheeseData.country}. Learn about its history, flavor profile, and perfect pairings!`

      return {
        title,
        description,
        keywords: [...cheeseData.longTailKeywords, ...cheeseData.tags],
        openGraph: {
          title,
          description,
          type: "article",
          url: `https://qcheese.com/cheeses/${slug}`,
        },
        twitter: {
          card: "summary",
          title,
          description,
        },
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Cheese Details",
    description: "Explore this delicious cheese variety and learn about its characteristics and pairings.",
  }
}

// Page component
export default function CheesePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const cheeseFilePath = path.join(process.cwd(), "data", "cheeses", `${slug}.json`)

  // Check if cheese exists
  if (!fs.existsSync(cheeseFilePath)) {
    // For demo purposes, handle sample cheeses from the cheeses page
    if (slug === "uk-cow-cheddar" || 
        slug === "france-cow-brie-de-meaux" || 
        slug === "spain-sheep-manchego" || 
        slug === "italy-cow-gorgonzola" || 
        slug === "greece-sheep-feta" || 
        slug === "netherlands-cow-gouda") {
      
      // Create sample data for demo cheeses
      const sampleData: Record<string, CheeseData> = {
        "uk-cow-cheddar": {
          name: "Cheddar",
          slug: "uk-cow-cheddar",
          country: "United Kingdom",
          milk: "Cow",
          texture: "Hard",
          flavor: "Sharp, tangy",
          region: "Somerset",
          family: "Cheddar",
          type: "hard",
          fat_content: "Medium",
          calcium_content: "High",
          rind: "Natural",
          color: "Pale yellow to orange",
          aroma: "Earthy",
          vegetarian: "FALSE",
          vegan: "FALSE",
          synonyms: "Somerset Cheddar",
          alt_spellings: "NA",
          producers: "Various",
          description: "Cheddar is a widely popular hard cheese originating from the English village of Cheddar in Somerset. It has a relatively hard, pale yellow to orange, pliable texture, and its flavor is sharp and tangy.",
          history: "Cheddar cheese has been produced in England since at least the 12th century. It is the most popular cheese in the UK and one of the most popular in the world.",
          productionProcess: "Cheddar is made through a process called 'cheddaring', where the curds are cut, stacked, and turned to drain the whey. The cheese is then aged for varying periods to develop its flavor.",
          flavorProfile: "Cheddar has a sharp, pungent flavor that becomes more pronounced with age. It can range from mild to extra sharp, depending on the aging time.",
          pairings: "Cheddar pairs well with apples, grapes, and pears. It also goes well with hearty breads, crackers, and is excellent in cooking.",
          faqs: [
            {
              question: "How long is Cheddar aged?",
              answer: "Cheddar can be aged anywhere from 2 months to several years. The longer it ages, the sharper and more complex its flavor becomes."
            },
            {
              question: "Why is some Cheddar orange?",
              answer: "The orange color in some Cheddar cheeses comes from the addition of annatto, a natural food coloring derived from the seeds of the achiote tree."
            }
          ],
          tags: ["hard cheese", "cow milk cheese", "English cheese", "sharp cheese", "cooking cheese"],
          longTailKeywords: ["traditional English Cheddar", "sharp Cheddar cheese", "Somerset Cheddar"],
          nutritionalInfo: {
            fatContent: "Medium",
            calciumContent: "High"
          },
          lastUpdated: "2025-03-02T04:49:20.963Z"
        },
        // Add other sample cheeses here...
        "netherlands-cow-gouda": {
          name: "Gouda",
          slug: "netherlands-cow-gouda",
          country: "Netherlands",
          milk: "Cow",
          texture: "Semi-hard",
          flavor: "Sweet, nutty",
          region: "South Holland",
          family: "Gouda",
          type: "semi-hard",
          fat_content: "Medium",
          calcium_content: "High",
          rind: "Waxed",
          color: "Pale yellow",
          aroma: "Mild, sweet",
          vegetarian: "FALSE",
          vegan: "FALSE",
          synonyms: "Dutch Gouda",
          alt_spellings: "NA",
          producers: "Various",
          description: "Gouda is a mild, yellow cheese made from cow's milk. It is one of the most popular cheeses worldwide. The cheese is named after the city of Gouda in the Netherlands, where it was traditionally traded.",
          history: "Gouda cheese has been produced in the Netherlands since the 12th century, making it one of the oldest recorded cheeses still made today.",
          productionProcess: "Gouda is made by washing the curds with warm water before pressing, which removes some of the lactose and creates its characteristic sweet flavor. The cheese is then shaped into wheels, brined, and coated in wax for aging.",
          flavorProfile: "Young Gouda is mild and sweet with a smooth, creamy texture. As it ages, it develops a deeper, more complex flavor with caramel notes and a firmer, sometimes crystalline texture.",
          pairings: "Gouda pairs well with fruits like apples and pears, as well as nuts. It complements beer excellently, particularly amber ales and lagers. Aged Gouda pairs wonderfully with full-bodied red wines.",
          faqs: [
            {
              question: "What is the difference between young and aged Gouda?",
              answer: "Young Gouda (aged 1-6 months) is mild, soft, and sweet. Aged Gouda (1-3 years) becomes harder, darker, and develops a more complex, caramelized flavor with crunchy protein crystals."
            },
            {
              question: "Why is Gouda often covered in red or yellow wax?",
              answer: "The wax coating serves to protect the cheese during aging, preventing mold growth and moisture loss. Different colors often indicate different ages or varieties."
            }
          ],
          tags: ["semi-hard cheese", "cow milk cheese", "Dutch cheese", "sweet cheese", "waxed rind"],
          longTailKeywords: ["traditional Dutch Gouda", "aged Gouda cheese", "Holland Gouda"],
          nutritionalInfo: {
            fatContent: "Medium",
            calciumContent: "High"
          },
          lastUpdated: "2025-03-02T04:49:20.963Z"
        }
      }
      
      // Return the sample cheese if it exists
      if (sampleData[slug]) {
        const cheeseData = sampleData[slug]
        
        // Create sample related cheeses
        const relatedCheeses: RelatedCheese[] = [
          {
            name: "Edam",
            slug: "netherlands-cow-edam",
            country: "Netherlands",
            milk: "Cow",
            texture: "Semi-hard"
          },
          {
            name: "Maasdam",
            slug: "netherlands-cow-maasdam",
            country: "Netherlands",
            milk: "Cow",
            texture: "Semi-hard"
          }
        ]
        
        return renderCheesePage(cheeseData, relatedCheeses)
      }
    }
    
    notFound()
  }

  // Read cheese data
  const cheeseData: CheeseData = JSON.parse(fs.readFileSync(cheeseFilePath, "utf8"))

  // Find related cheeses (same country or milk type)
  const relatedCheeses: RelatedCheese[] = []
  const cheeseDir = path.join(process.cwd(), "data", "cheeses")
  const files = fs.readdirSync(cheeseDir)

  // Get up to 6 related cheeses
  for (const file of files) {
    if (file === `${slug}.json`) continue

    try {
      const relatedCheeseData: CheeseData = JSON.parse(fs.readFileSync(path.join(cheeseDir, file), "utf8"))

      if (
        relatedCheeseData.country === cheeseData.country ||
        relatedCheeseData.milk === cheeseData.milk ||
        relatedCheeseData.texture === cheeseData.texture
      ) {
        relatedCheeses.push({
          name: relatedCheeseData.name,
          slug: relatedCheeseData.slug,
          country: relatedCheeseData.country,
          milk: relatedCheeseData.milk,
          texture: relatedCheeseData.texture,
          flavor: relatedCheeseData.flavor
        })

        if (relatedCheeses.length >= 6) break
      }
    } catch (error) {
      console.error(`Error reading related cheese data for ${file}:`, error)
    }
  }

  return renderCheesePage(cheeseData, relatedCheeses)
}

// Helper function to render the cheese page
function renderCheesePage(cheeseData: CheeseData, relatedCheeses: RelatedCheese[]) {
  // Check if name already ends with "Cheese"
  const displayName = cheeseData.name.toLowerCase().endsWith("cheese") 
    ? cheeseData.name 
    : `${cheeseData.name} Cheese`
  
  // Format JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    description: cheeseData.description,
    category: "Food",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: "",
      priceCurrency: "",
      url: `https://qcheese.com/cheeses/${cheeseData.slug}`,
    },
    brand: {
      "@type": "Brand",
      name: cheeseData.producers || "Various Producers",
    },
    countryOfOrigin: {
      "@type": "Country",
      name: cheeseData.country,
    },
    nutrition: {
      "@type": "NutritionInformation",
      fatContent: cheeseData.nutritionalInfo.fatContent,
      calciumContent: cheeseData.nutritionalInfo.calciumContent,
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
        name: "Cheeses",
        item: "https://qcheese.com/cheeses",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cheeseData.name,
        item: `https://qcheese.com/cheeses/${cheeseData.slug}`,
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
          { label: "Cheeses", href: "/cheeses" },
          { label: cheeseData.name, href: `/cheeses/${cheeseData.slug}`, isCurrentPage: true },
        ]}
      />

      {/* Cheese Header */}
      <div className="bg-white rounded-lg shadow-sm border border-[#e6e6e6] overflow-hidden mb-8">
        {/* Header section */}
        <div className="bg-[#f9f5e7] p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#6b4c1e]">{displayName}</h1>
        </div>
        
        <div className="p-6">
          {/* Tags section */}
          <div className="mb-6 flex flex-wrap gap-2">
            {cheeseData.tags.slice(0, 10).map((tag, index) => (
              <span 
                key={index} 
                className="inline-block px-3 py-1 rounded-full text-sm bg-[#f8e8c8] text-[#6b4c1e]"
              >
                {tag}
              </span>
            ))}
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-[#f8e8c8] text-[#6b4c1e]">
              {cheeseData.country}
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-[#f8e8c8] text-[#6b4c1e]">
              {cheeseData.milk} milk
            </span>
          </div>

          {/* Information grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#333333] text-lg">Origin</h3>
              <p className="text-[#555555]">
                {cheeseData.country}
                {cheeseData.region && cheeseData.region !== "NA" ? `, ${cheeseData.region}` : ""}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#333333] text-lg">Milk Type</h3>
              <p className="text-[#555555]">{cheeseData.milk || "Not specified"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#333333] text-lg">Texture</h3>
              <p className="text-[#555555]">{cheeseData.texture || "Not specified"}</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#333333] text-lg">Flavor</h3>
              <p className="text-[#555555]">{cheeseData.flavor || "Not specified"}</p>
            </div>

            {cheeseData.aroma && cheeseData.aroma !== "NA" && (
              <div>
                <h3 className="font-semibold text-[#333333] text-lg">Aroma</h3>
                <p className="text-[#555555]">{cheeseData.aroma}</p>
              </div>
            )}

            {cheeseData.color && cheeseData.color !== "NA" && (
              <div>
                <h3 className="font-semibold text-[#333333] text-lg">Color</h3>
                <p className="text-[#555555]">{cheeseData.color}</p>
              </div>
            )}

            {cheeseData.rind && cheeseData.rind !== "NA" && (
              <div>
                <h3 className="font-semibold text-[#333333] text-lg">Rind</h3>
                <p className="text-[#555555]">{cheeseData.rind}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-[#333333] text-lg">Vegetarian</h3>
              <p className="text-[#555555]">{cheeseData.vegetarian === "TRUE" ? "Yes" : "No"}</p>
            </div>
          </div>

          {cheeseData.synonyms && cheeseData.synonyms !== "NA" && (
            <div className="mt-6">
              <h3 className="font-semibold text-[#333333] text-lg">Also Known As</h3>
              <p className="text-[#555555]">{cheeseData.synonyms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">What is {cheeseData.name}?</h2>
        <div className="prose max-w-none text-[#555555]">
          <p>{cheeseData.description}</p>
        </div>
      </section>

      {/* History Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">History of {cheeseData.name}</h2>
        <div className="prose max-w-none text-[#555555]">
          <p>{cheeseData.history}</p>
        </div>
      </section>

      {/* Production Process Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">How {cheeseData.name} is Made</h2>
        <div className="prose max-w-none text-[#555555]">
          <p>{cheeseData.productionProcess}</p>
        </div>
      </section>

      {/* Flavor Profile Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Flavor Profile</h2>
        <div className="prose max-w-none text-[#555555]">
          <p>{cheeseData.flavorProfile}</p>
        </div>
      </section>

      {/* Pairings Section */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Perfect Pairings for {cheeseData.name}</h2>
        <div className="prose max-w-none text-[#555555]">
          <p>{cheeseData.pairings}</p>
        </div>
      </section>

      {/* Nutritional Information */}
      <section className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Nutritional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-[#333333] text-lg">Fat Content</h3>
            <p className="text-[#555555]">{cheeseData.nutritionalInfo.fatContent}</p>
          </div>

          <div>
            <h3 className="font-semibold text-[#333333] text-lg">Calcium Content</h3>
            <p className="text-[#555555]">{cheeseData.nutritionalInfo.calciumContent}</p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      {cheeseData.faqs && cheeseData.faqs.length > 0 && (
        <section className="content-section">
          <h2 className="text-2xl font-bold mb-4 text-[#333333]">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {cheeseData.faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="font-bold text-lg mb-2 text-[#333333]">{faq.question}</h3>
                <p className="text-[#555555]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Cheeses Section */}
      {relatedCheeses.length > 0 && (
        <RelatedCheeses cheeses={relatedCheeses} />
      )}
    </div>
  )
}
