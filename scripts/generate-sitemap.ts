import fs from "fs"
import path from "path"

// Define types
interface CheeseBasicInfo {
  name: string
  slug: string
}

interface IndexItem {
  slug: string
  count: number
  cheeses: CheeseBasicInfo[]
}

interface CountryIndex extends IndexItem {
  country: string
  regions: {
    region: string
    slug: string
    count: number
    cheeses: CheeseBasicInfo[]
  }[]
}

// Helper function to create directory if it doesn't exist
function ensureDirectoryExists(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

// Function to generate sitemap XML
function generateSitemapXML(
  urls: Array<{ url: string; lastmod: string; priority: string; images?: Array<{ url: string; title: string }> }>,
  filename: string,
) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'

  urls.forEach((item) => {
    xml += "  <url>\n"
    xml += `    <loc>https://qcheese.com${item.url}</loc>\n`
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`
    xml += `    <priority>${item.priority}</priority>\n`

    if (item.images && item.images.length > 0) {
      item.images.forEach((image) => {
        xml += "    <image:image>\n"
        xml += `      <image:loc>${image.url}</image:loc>\n`
        xml += `      <image:title>${image.title}</image:title>\n`
        xml += "    </image:image>\n"
      })
    }

    xml += "  </url>\n"
  })

  xml += "</urlset>"

  fs.writeFileSync(filename, xml)
}

// Function to generate sitemap index XML
function generateSitemapIndexXML(sitemaps: Array<{ url: string; lastmod: string }>, filename: string) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  sitemaps.forEach((item) => {
    xml += "  <sitemap>\n"
    xml += `    <loc>https://qcheese.com${item.url}</loc>\n`
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`
    xml += "  </sitemap>\n"
  })

  xml += "</sitemapindex>"

  fs.writeFileSync(filename, xml)
}

// Main function to generate sitemaps
async function main() {
  try {
    console.log("Starting sitemap generation...")

    // Create sitemap directory
    const sitemapDir = path.join(process.cwd(), "public", "sitemap")
    ensureDirectoryExists(sitemapDir)

    const today = new Date().toISOString().split("T")[0]
    const sitemapFiles: Array<{ url: string; lastmod: string }> = []

    // Generate cheese sitemap
    const cheeseDir = path.join(process.cwd(), "data", "cheeses")
    const cheeseFiles = fs.readdirSync(cheeseDir)

    // Split cheese files into chunks of 5000
    const cheeseChunkSize = 5000
    const cheeseChunks = []
    for (let i = 0; i < cheeseFiles.length; i += cheeseChunkSize) {
      cheeseChunks.push(cheeseFiles.slice(i, i + cheeseChunkSize))
    }

    // Generate sitemap for each chunk
    for (let i = 0; i < cheeseChunks.length; i++) {
      const cheeseUrls = cheeseChunks[i].map((file) => {
        const slug = file.replace(".json", "")
        return {
          url: `/cheeses/${slug}`,
          lastmod: today,
          priority: "1.0",
          images: [
            {
              url: `https://qcheese.com/images/cheeses/${slug}.jpg`,
              title: `${slug.replace(/-/g, " ")} cheese`,
            },
          ],
        }
      })

      const cheeseFilename = path.join(sitemapDir, `cheeses-${i + 1}.xml`)
      generateSitemapXML(cheeseUrls, cheeseFilename)

      sitemapFiles.push({
        url: `/sitemap/cheeses-${i + 1}.xml`,
        lastmod: today,
      })

      console.log(`Generated cheese sitemap ${i + 1} with ${cheeseUrls.length} URLs`)
    }

    // Generate milk type sitemap
    const milkTypesPath = path.join(process.cwd(), "data", "indexes", "milk-types.json")
    if (fs.existsSync(milkTypesPath)) {
      const milkTypes = JSON.parse(fs.readFileSync(milkTypesPath, "utf8")) as IndexItem[]

      const milkTypeUrls = milkTypes.map((item) => ({
        url: `/milk-type/${item.slug}`,
        lastmod: today,
        priority: "0.8",
      }))

      const milkTypeFilename = path.join(sitemapDir, "milk-types.xml")
      generateSitemapXML(milkTypeUrls, milkTypeFilename)

      sitemapFiles.push({
        url: "/sitemap/milk-types.xml",
        lastmod: today,
      })

      console.log(`Generated milk type sitemap with ${milkTypeUrls.length} URLs`)
    }

    // Generate country sitemap
    const countriesPath = path.join(process.cwd(), "data", "indexes", "countries.json")
    if (fs.existsSync(countriesPath)) {
      const countries = JSON.parse(fs.readFileSync(countriesPath, "utf8")) as CountryIndex[]

      const countryUrls = countries.map((item) => ({
        url: `/origin/${item.slug}/all`,
        lastmod: today,
        priority: "0.8",
      }))

      // Add region URLs
      countries.forEach((country) => {
        country.regions.forEach((region) => {
          countryUrls.push({
            url: `/origin/${country.slug}/${region.slug}`,
            lastmod: today,
            priority: "0.7",
          })
        })
      })

      const countryFilename = path.join(sitemapDir, "countries.xml")
      generateSitemapXML(countryUrls, countryFilename)

      sitemapFiles.push({
        url: "/sitemap/countries.xml",
        lastmod: today,
      })

      console.log(`Generated country sitemap with ${countryUrls.length} URLs`)
    }

    // Generate texture sitemap
    const texturesPath = path.join(process.cwd(), "data", "indexes", "textures.json")
    if (fs.existsSync(texturesPath)) {
      const textures = JSON.parse(fs.readFileSync(texturesPath, "utf8")) as IndexItem[]

      const textureUrls = textures.map((item) => ({
        url: `/texture/${item.slug}`,
        lastmod: today,
        priority: "0.8",
      }))

      const textureFilename = path.join(sitemapDir, "textures.xml")
      generateSitemapXML(textureUrls, textureFilename)

      sitemapFiles.push({
        url: "/sitemap/textures.xml",
        lastmod: today,
      })

      console.log(`Generated texture sitemap with ${textureUrls.length} URLs`)
    }

    // Generate flavor sitemap
    const flavorsPath = path.join(process.cwd(), "data", "indexes", "flavors.json")
    if (fs.existsSync(flavorsPath)) {
      const flavors = JSON.parse(fs.readFileSync(flavorsPath, "utf8")) as IndexItem[]

      const flavorUrls = flavors.map((item) => ({
        url: `/flavor/${item.slug}`,
        lastmod: today,
        priority: "0.8",
      }))

      const flavorFilename = path.join(sitemapDir, "flavors.xml")
      generateSitemapXML(flavorUrls, flavorFilename)

      sitemapFiles.push({
        url: "/sitemap/flavors.xml",
        lastmod: today,
      })

      console.log(`Generated flavor sitemap with ${flavorUrls.length} URLs`)
    }

    // Generate tag sitemap
    const tagsPath = path.join(process.cwd(), "data", "indexes", "tags.json")
    if (fs.existsSync(tagsPath)) {
      const tags = JSON.parse(fs.readFileSync(tagsPath, "utf8")) as IndexItem[]

      const tagUrls = tags.map((item) => ({
        url: `/tag/${item.slug}`,
        lastmod: today,
        priority: "0.7",
      }))

      const tagFilename = path.join(sitemapDir, "tags.xml")
      generateSitemapXML(tagUrls, tagFilename)

      sitemapFiles.push({
        url: "/sitemap/tags.xml",
        lastmod: today,
      })

      console.log(`Generated tag sitemap with ${tagUrls.length} URLs`)
    }

    // Generate static page sitemap
    const staticUrls = [
      { url: "/", lastmod: today, priority: "1.0" },
      { url: "/about", lastmod: today, priority: "0.5" },
      { url: "/contact", lastmod: today, priority: "0.5" },
      { url: "/compare", lastmod: today, priority: "0.6" },
      { url: "/cheese-guide", lastmod: today, priority: "0.8" },
    ]

    const staticFilename = path.join(sitemapDir, "static.xml")
    generateSitemapXML(staticUrls, staticFilename)

    sitemapFiles.push({
      url: "/sitemap/static.xml",
      lastmod: today,
    })

    console.log(`Generated static sitemap with ${staticUrls.length} URLs`)

    // Generate sitemap index
    const sitemapIndexFilename = path.join(sitemapDir, "sitemap.xml")
    generateSitemapIndexXML(sitemapFiles, sitemapIndexFilename)

    console.log("Sitemap generation complete!")
  } catch (error) {
    console.error("Error generating sitemaps:", error)
    process.exit(1)
  }
}

// Run the main function
main()
