import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"

// Define types
interface CheeseBasicInfo {
  name: string
  slug: string
  country: string
  milk: string
  texture: string
  flavor?: string
}

export async function GET() {
  try {
    // Try to read from master index first
    const masterIndexPath = path.join(process.cwd(), "data", "indexes", "master.json")
    
    if (fs.existsSync(masterIndexPath)) {
      const masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, "utf8"))
      
      // Extract and enhance the data we need
      const cheeses = masterIndex.cheeses.map((cheese: any) => ({
        name: cheese.name,
        slug: cheese.slug,
        country: cheese.country,
        milk: cheese.milk,
        texture: cheese.texture,
        // Add flavor if available
        ...(cheese.flavor && { flavor: cheese.flavor })
      }))
      
      return NextResponse.json({
        totalCheeses: masterIndex.totalCheeses,
        cheeses
      })
    }
    
    // If master index doesn't exist, read directly from cheese files
    const cheeseDir = path.join(process.cwd(), "data", "cheeses")
    
    if (fs.existsSync(cheeseDir)) {
      const files = fs.readdirSync(cheeseDir)
        .filter(file => file.endsWith(".json"))
      
      const totalCheeses = files.length
      
      // Read all cheese files
      const cheeses: CheeseBasicInfo[] = files.map(file => {
        const cheeseData = JSON.parse(fs.readFileSync(path.join(cheeseDir, file), "utf8"))
        return {
          name: cheeseData.name,
          slug: cheeseData.slug,
          country: cheeseData.country,
          milk: cheeseData.milk,
          texture: cheeseData.texture,
          flavor: cheeseData.flavor
        }
      })
      
      return NextResponse.json({
        totalCheeses,
        cheeses
      })
    }
    
    // If no data is available, return a fallback
    return NextResponse.json({
      totalCheeses: 0,
      cheeses: []
    })
  } catch (error) {
    console.error("Error fetching cheese data:", error)
    return NextResponse.json(
      { error: "Failed to fetch cheese data" },
      { status: 500 }
    )
  }
}
