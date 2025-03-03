import fs from "fs"
import path from "path"
import { parse } from "csv-parse/sync"
import slugify from "slugify"
import * as dotenv from "dotenv"

// Deepseek API configuration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = 'sk-d37b9be6a70d44a78cda1ad4d4c50b8a';

// Define types
interface CheeseRawData {
  url: string
  milk: string
  country: string
  region: string
  family: string
  type: string
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
}

interface EnrichedCheeseData extends CheeseRawData {
  name: string
  slug: string
  description: string
  history: string
  productionProcess: string
  flavorProfile: string
  pairings: string
  culinaryApplications: string[]
  faqs: Array<{ question: string; answer: string }>
  tags: string[]
  longTailKeywords: string[]
  seoKeywords: string[]
  similarCheeses: Array<{ name: string; description: string }>
  nutritionalInfo: {
    fatContent: string
    calciumContent: string
  }
  lastUpdated: string
}

// Helper function to create directory if it doesn't exist create directory if it doesn't exist
function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

// Helper function to generate a slug
function generateSlug(cheese: CheeseRawData): string {
  const name = path.basename(cheese.url).replace("https://www.cheese.com/", "").replace("/", "")
  const country = cheese.country ? cheese.country.split(",")[0].trim().toLowerCase() : "unknown"
  const milk = cheese.milk ? cheese.milk.split(",")[0].trim().toLowerCase() : ""

  return slugify(`${country}-${milk}-${name}`, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

// Helper function to extract cheese name from URL
function extractCheeseName(url: string): string {
  const name = path.basename(url).replace("https://www.cheese.com/", "").replace("/", "")
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Function to enrich cheese data with OpenAI
async function enrichCheeseData(cheese: CheeseRawData): Promise<EnrichedCheeseData> {
  const name = extractCheeseName(cheese.url)

  try {
    const prompt = `
      I need detailed information about ${name} cheese.
      
      Here's what I know:
      - Milk type: ${cheese.milk || "Unknown"}
      - Country of origin: ${cheese.country || "Unknown"}
      - Type: ${cheese.type || "Unknown"}
      If ${name} is not widely documented, include a similar_cheeses key with 3-5 comparable cheeses and a brief explanation of their similarities.
    `

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "Act as a cheese expert and provide detailed, accurate, and engaging information. Format the response in JSON, ensuring it is clean, well-structured, and ready for use in web applications or content management systems. Prioritize accuracy and include unique insights where possible. If the cheese is obscure, acknowledge this and suggest similar cheeses. Maintain an enthusiastic and informative tone that reflects a deep appreciation for artisanal cheese culture. The JSON output should include the following keys: 1. description (200-300 words): A detailed overview of the cheese, including its origin, texture, appearance, and unique characteristics. 2. history (150-200 words): The origins, cultural significance, and role in cheesemaking traditions. 3. production_process (150-200 words): The milk type, curdling method, aging process, and any special techniques used. 4. flavor_profile (100-150 words): A sensory description of its taste, aroma, and texture. 5. pairings (150-200 words): Traditional and innovative food and drink pairings, including wines, beers, and accompaniments. 6. culinary_applications: Array of 3-5 specific culinary uses (e.g. ['Melts well in grilled cheese', 'Ideal for cheese boards', 'Perfect for grating over pasta']). 7. faqs (5 items): Common questions and answers about the cheese, such as its flavor, aging, and comparisons to other cheeses. 8. tags (50 items): A list of descriptive keywords for categorization or SEO. 9. seo_keywords: Array of 20 long-tail SEO phrases like 'best Swiss cow milk cheese' or 'how to use Aarewasser in fondue'. 10. nutritional_Info: { fatContent: string, calciumContent: string }"},
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.debug('Raw API response:', JSON.stringify(responseData, null, 2));
    
    if (!responseData.choices?.[0]?.message?.content) {
      console.error('Invalid API response structure:', responseData);
      throw new Error('Invalid API response structure');
    }
    
    const content = responseData.choices[0].message.content;
    console.debug('Content before parsing:', content);
    
    let enrichedData;
    try {
      enrichedData = JSON.parse(content);
      console.debug('Enriched data for', name, ':', JSON.stringify(enrichedData, null, 2));
    } catch (parseError) {
      console.error('Failed to parse content:', content);
      throw parseError;
    }

    // Extract and validate nutritional info
    const nutritionalInfo = enrichedData.nutritional_Info || {};
    const similarCheeses = enrichedData.similar_cheeses || [];

    return {
      ...cheese,
      name,
      slug: generateSlug(cheese),
      description: enrichedData.description || "Description unavailable",
      history: enrichedData.history || "History unavailable",
      productionProcess: enrichedData.production_process || "Production process unavailable",
      flavorProfile: enrichedData.flavor_profile || "Flavor profile unavailable",
      pairings: enrichedData.pairings || "Pairing information unavailable",
      culinaryApplications: enrichedData.culinary_applications || ["Versatile table cheese", "Suitable for cooking", "Can be used in various dishes"],
      faqs: enrichedData.faqs || [
        { question: `What is ${name} cheese?`, answer: "Information unavailable" },
        { question: `What does ${name} cheese taste like?`, answer: "Information unavailable" },
        { question: `How is ${name} cheese made?`, answer: "Information unavailable" },
        { question: `What pairs well with ${name} cheese?`, answer: "Information unavailable" },
        { question: `Is ${name} cheese vegetarian?`, answer: cheese.vegetarian === "TRUE" ? "Yes" : "No" },
      ],
      tags: enrichedData.tags || [
        `${cheese.milk || "unknown"} milk`,
        cheese.country || "unknown origin",
        cheese.texture || "unknown texture",
      ],
      longTailKeywords: enrichedData.longTailKeywords || [
        `${name} cheese characteristics`,
        `${name} cheese origin`,
        `${name} cheese flavor`,
      ],
      seoKeywords: enrichedData.seo_keywords || [],
      similarCheeses: similarCheeses,
      nutritionalInfo: {
        fatContent: nutritionalInfo.fatContent || "Not specified",
        calciumContent: nutritionalInfo.calciumContent || "Not specified",
      },
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error enriching data for ${name}:`, error)

    // Return default data if API call fails
    return {
      ...cheese,
      name,
      slug: generateSlug(cheese),
      description: "Description unavailable",
      history: "History unavailable",
      productionProcess: "Production process unavailable",
      flavorProfile: "Flavor profile unavailable",
      pairings: "Pairing information unavailable",
      culinaryApplications: ["Versatile table cheese", "Suitable for cooking", "Can be used in various dishes"],
      faqs: [
        { question: `What is ${name} cheese?`, answer: "Information unavailable" },
        { question: `What does ${name} cheese taste like?`, answer: "Information unavailable" },
        { question: `How is ${name} cheese made?`, answer: "Information unavailable" },
        { question: `What pairs well with ${name} cheese?`, answer: "Information unavailable" },
        { question: `Is ${name} cheese vegetarian?`, answer: cheese.vegetarian === "TRUE" ? "Yes" : "No" },
      ],
      tags: [
        `${cheese.milk || "unknown"} milk`,
        cheese.country || "unknown origin",
        cheese.texture || "unknown texture",
      ],
      longTailKeywords: [`${name} cheese characteristics`, `${name} cheese origin`, `${name} cheese flavor`],
      seoKeywords: [],
      similarCheeses: [],
      nutritionalInfo: {
        fatContent: "Not specified",
        calciumContent: "Not specified",
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}

// Function to process cheese data in batches
async function processCheeseBatches(cheeses: CheeseRawData[], batchSize = 100) {
  const totalCheeses = cheeses.length
  const batches = Math.ceil(totalCheeses / batchSize)

  console.log(`Processing ${totalCheeses} cheeses in ${batches} batches of ${batchSize}`)

  // Create directories for data
  ensureDirectoryExists(path.join(process.cwd(), "data"))
  ensureDirectoryExists(path.join(process.cwd(), "data", "cheeses"))

  // Process in batches
  for (let i = 0; i < batches; i++) {
    const start = i * batchSize
    const end = Math.min(start + batchSize, totalCheeses)
    const batch = cheeses.slice(start, end)

    console.log(`Processing batch ${i + 1}/${batches} (items ${start + 1}-${end})`)

    // Process each cheese in the batch with rate limiting
    for (let j = 0; j < batch.length; j++) {
      const cheese = batch[j]
      console.log(`Processing cheese ${start + j + 1}/${totalCheeses}: ${extractCheeseName(cheese.url)}`)

      try {
        const slug = generateSlug(cheese)
        const filePath = path.join(process.cwd(), "data", "cheeses", `${slug}.json`)
        
        // Skip if file already exists
        if (fs.existsSync(filePath)) {
          console.log(`Skipping ${extractCheeseName(cheese.url)} - JSON file already exists`)
          continue
        }

        const enrichedData = await enrichCheeseData(cheese)
        fs.writeFileSync(filePath, JSON.stringify(enrichedData, null, 2))

        // Rate limiting: 1200 calls per minute = 20 calls per second
        // Wait 50ms between calls to stay under the limit
        if (j < batch.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      } catch (error) {
        console.error(`Error processing cheese ${extractCheeseName(cheese.url)}:`, error)
      }
    }

    console.log(`Completed batch ${i + 1}/${batches}`)
  }
}

// Function to generate index data
function generateIndexData(cheeses: EnrichedCheeseData[]) {
  console.log("Generating index data...")

  // Create directories for index data
  ensureDirectoryExists(path.join(process.cwd(), "data", "indexes"))

  // Generate milk type indexes
  const milkTypes = new Set<string>()
  cheeses.forEach((cheese) => {
    if (cheese.milk) {
      cheese.milk.split(",").forEach((milk) => {
        milkTypes.add(milk.trim().toLowerCase())
      })
    }
  })

  const milkTypeIndex = Array.from(milkTypes).map((milk) => {
    const milkCheeses = cheeses.filter(
      (cheese) => cheese.milk && cheese.milk.toLowerCase().includes(milk.toLowerCase()),
    )
    return {
      type: milk,
      slug: slugify(milk, { lower: true, strict: true }),
      count: milkCheeses.length,
      cheeses: milkCheeses.map((c) => ({ name: c.name, slug: c.slug })),
    }
  })

  fs.writeFileSync(
    path.join(process.cwd(), "data", "indexes", "milk-types.json"),
    JSON.stringify(milkTypeIndex, null, 2),
  )

  // Generate country indexes
  const countries = new Set<string>()
  cheeses.forEach((cheese) => {
    if (cheese.country) {
      cheese.country.split(",").forEach((country) => {
        countries.add(country.trim())
      })
    }
  })

  const countryIndex = Array.from(countries).map((country) => {
    const countryCheeses = cheeses.filter((cheese) => cheese.country && cheese.country.includes(country))

    // Generate region sub-indexes for this country
    const regions = new Set<string>()
    countryCheeses.forEach((cheese) => {
      if (cheese.region && cheese.region !== "NA") {
        cheese.region.split(",").forEach((region) => {
          regions.add(region.trim())
        })
      }
    })

    const regionIndexes = Array.from(regions).map((region) => {
      const regionCheeses = countryCheeses.filter((cheese) => cheese.region && cheese.region.includes(region))
      return {
        region,
        slug: slugify(region, { lower: true, strict: true }),
        count: regionCheeses.length,
        cheeses: regionCheeses.map((c) => ({ name: c.name, slug: c.slug })),
      }
    })

    return {
      country,
      slug: slugify(country, { lower: true, strict: true }),
      count: countryCheeses.length,
      cheeses: countryCheeses.map((c) => ({ name: c.name, slug: c.slug })),
      regions: regionIndexes,
    }
  })

  fs.writeFileSync(path.join(process.cwd(), "data", "indexes", "countries.json"), JSON.stringify(countryIndex, null, 2))

  // Generate texture indexes
  const textures = new Set<string>()
  cheeses.forEach((cheese) => {
    if (cheese.texture) {
      cheese.texture.split(",").forEach((texture) => {
        textures.add(texture.trim().toLowerCase())
      })
    }
  })

  const textureIndex = Array.from(textures).map((texture) => {
    const textureCheeses = cheeses.filter(
      (cheese) => cheese.texture && cheese.texture.toLowerCase().includes(texture.toLowerCase()),
    )
    return {
      texture,
      slug: slugify(texture, { lower: true, strict: true }),
      count: textureCheeses.length,
      cheeses: textureCheeses.map((c) => ({ name: c.name, slug: c.slug })),
    }
  })

  fs.writeFileSync(path.join(process.cwd(), "data", "indexes", "textures.json"), JSON.stringify(textureIndex, null, 2))

  // Generate flavor indexes
  const flavors = new Set<string>()
  cheeses.forEach((cheese) => {
    if (cheese.flavor) {
      cheese.flavor.split(",").forEach((flavor) => {
        flavors.add(flavor.trim().toLowerCase())
      })
    }
  })

  const flavorIndex = Array.from(flavors).map((flavor) => {
    const flavorCheeses = cheeses.filter(
      (cheese) => cheese.flavor && cheese.flavor.toLowerCase().includes(flavor.toLowerCase()),
    )
    return {
      flavor,
      slug: slugify(flavor, { lower: true, strict: true }),
      count: flavorCheeses.length,
      cheeses: flavorCheeses.map((c) => ({ name: c.name, slug: c.slug })),
    }
  })

  fs.writeFileSync(path.join(process.cwd(), "data", "indexes", "flavors.json"), JSON.stringify(flavorIndex, null, 2))

  // Generate tag indexes from enriched data
  const tags = new Set<string>()
  cheeses.forEach((cheese) => {
    cheese.tags.forEach((tag) => {
      tags.add(tag.toLowerCase())
    })
  })

  const tagIndex = Array.from(tags).map((tag) => {
    const tagCheeses = cheeses.filter((cheese) => cheese.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
    return {
      tag,
      slug: slugify(tag, { lower: true, strict: true }),
      count: tagCheeses.length,
      cheeses: tagCheeses.map((c) => ({ name: c.name, slug: c.slug })),
    }
  })

  fs.writeFileSync(path.join(process.cwd(), "data", "indexes", "tags.json"), JSON.stringify(tagIndex, null, 2))

  // Generate master index with all cheese data
  const masterIndex = {
    totalCheeses: cheeses.length,
    cheeses: cheeses.map((c) => ({
      name: c.name,
      slug: c.slug,
      country: c.country,
      milk: c.milk,
      type: c.type,
      texture: c.texture,
    })),
  }

  fs.writeFileSync(path.join(process.cwd(), "data", "indexes", "master.json"), JSON.stringify(masterIndex, null, 2))

  console.log("Index data generation complete")
}

// Main function to process the CSV file
async function main() {
  try {
    console.log("Starting data processing...")

    // Read the CSV file
    const csvFilePath = path.join(process.cwd(), "cheese_details.csv")
    const csvData = fs.readFileSync(csvFilePath, "utf8")

    // Parse the CSV data
    const cheeses = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    }) as CheeseRawData[]

    console.log(`Found ${cheeses.length} cheeses in CSV`)

    // Process the cheese data in batches
    await processCheeseBatches(cheeses)

    // Read the enriched data
    const cheeseDir = path.join(process.cwd(), "data", "cheeses")
    const cheeseFiles = fs.readdirSync(cheeseDir)

    const enrichedCheeses = cheeseFiles
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(cheeseDir, file)
        const data = fs.readFileSync(filePath, "utf8")
        return JSON.parse(data) as EnrichedCheeseData
      })

    // Generate index data
    generateIndexData(enrichedCheeses)

    console.log("Data processing complete!")
  } catch (error) {
    console.error("Error processing data:", error)
    process.exit(1)
  }
}

// Run the main function
main()
