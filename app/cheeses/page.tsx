"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import CheeseCard from "@/components/cheese-card"

// Define types
interface CheeseBasicInfo {
  name: string
  slug: string
  country: string
  milk: string
  texture: string
  flavor?: string
}

// Loading component
function CheeseListLoading() {
  return (
    <div className="col-span-3 text-center py-12">
      <p className="text-xl text-[#666666]">Loading cheeses...</p>
    </div>
  )
}

// Main content component that uses searchParams
function CheeseListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const pageParam = searchParams.get("page") || "1"
  const currentPage = parseInt(pageParam, 10)
  
  const [cheeses, setCheeses] = useState<CheeseBasicInfo[]>([])
  const [totalCheeses, setTotalCheeses] = useState(0)
  const [filteredCheeses, setFilteredCheeses] = useState<CheeseBasicInfo[]>([])
  const [displayedCheeses, setDisplayedCheeses] = useState<CheeseBasicInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    milk: searchParams.get("milk") || "",
    country: searchParams.get("country") || "",
    texture: searchParams.get("texture") || ""
  })
  
  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredCheeses.length / itemsPerPage)
  
  // Load cheeses
  useEffect(() => {
    // In a real implementation, this would be done at build time or via API
    const loadCheeses = async () => {
      try {
        setLoading(true)
        
        // Fetch the master index which contains all cheeses
        const response = await fetch('/api/cheeses')
        if (!response.ok) {
          throw new Error('Failed to fetch cheeses')
        }
        
        const data = await response.json()
        setCheeses(data.cheeses)
        setTotalCheeses(data.totalCheeses)
        
        // Apply initial filters
        applyFilters(data.cheeses, searchQuery, filters)
        setLoading(false)
      } catch (error) {
        console.error("Error loading cheese data:", error)
        
        // Fallback to sample data if API fails
        const sampleCheeses = generateSampleCheeses()
        setCheeses(sampleCheeses)
        setTotalCheeses(1187) // Total count from the database
        applyFilters(sampleCheeses, searchQuery, filters)
        setLoading(false)
      }
    }
    
    loadCheeses()
  }, [searchQuery])
  
  // Generate sample cheeses for fallback
  const generateSampleCheeses = (): CheeseBasicInfo[] => {
    // This is a much larger sample dataset to better demonstrate pagination
    const countries = ["France", "Italy", "Spain", "United Kingdom", "Switzerland", "Netherlands", "Greece", "Germany", "Denmark", "Sweden", "Norway", "Belgium", "Portugal", "Austria", "Ireland", "United States", "Canada", "Australia", "New Zealand", "Argentina", "Brazil", "Mexico", "Japan", "India", "South Africa", "Egypt", "Morocco", "Turkey", "Russia", "Poland"]
    const milkTypes = ["Cow", "Goat", "Sheep", "Buffalo", "Mixed"]
    const textures = ["Soft", "Semi-soft", "Semi-hard", "Hard", "Blue", "Fresh", "Crumbly", "Creamy"]
    const flavors = ["Mild", "Medium", "Sharp", "Tangy", "Sweet", "Nutty", "Earthy", "Spicy", "Pungent", "Buttery", "Creamy", "Fruity", "Herbal", "Smoky", "Caramel", "Salty"]
    
    const sampleCheeses: CheeseBasicInfo[] = []
    
    // Generate 100 sample cheeses
    for (let i = 0; i < 100; i++) {
      const country = countries[Math.floor(Math.random() * countries.length)]
      const milk = milkTypes[Math.floor(Math.random() * milkTypes.length)]
      const texture = textures[Math.floor(Math.random() * textures.length)]
      const flavor1 = flavors[Math.floor(Math.random() * flavors.length)]
      const flavor2 = flavors[Math.floor(Math.random() * flavors.length)]
      
      sampleCheeses.push({
        name: `Sample Cheese ${i + 1}`,
        slug: `sample-cheese-${i + 1}`,
        country,
        milk,
        texture,
        flavor: `${flavor1}, ${flavor2}`
      })
    }
    
    // Add our specific examples to ensure they're included
    sampleCheeses.push(
      {
        name: "Cheddar",
        slug: "uk-cow-cheddar",
        country: "United Kingdom",
        milk: "Cow",
        texture: "Hard",
        flavor: "Sharp, tangy"
      },
      {
        name: "Brie de Meaux",
        slug: "france-cow-brie-de-meaux",
        country: "France",
        milk: "Cow",
        texture: "Soft",
        flavor: "Buttery, creamy"
      },
      {
        name: "Manchego",
        slug: "spain-sheep-manchego",
        country: "Spain",
        milk: "Sheep",
        texture: "Semi-hard",
        flavor: "Nutty, sweet"
      },
      {
        name: "Gorgonzola",
        slug: "italy-cow-gorgonzola",
        country: "Italy",
        milk: "Cow",
        texture: "Blue",
        flavor: "Spicy, sharp"
      },
      {
        name: "Feta",
        slug: "greece-sheep-feta",
        country: "Greece",
        milk: "Sheep",
        texture: "Soft",
        flavor: "Tangy, salty"
      },
      {
        name: "Gouda",
        slug: "netherlands-cow-gouda",
        country: "Netherlands",
        milk: "Cow",
        texture: "Semi-hard",
        flavor: "Sweet, nutty"
      }
    )
    
    return sampleCheeses
  }
  
  // Apply filters function
  const applyFilters = (cheeses: CheeseBasicInfo[], query: string, filters: {milk: string, country: string, texture: string}) => {
    let filtered = [...cheeses]
    
    // Apply search query if present
    if (query) {
      filtered = filtered.filter(cheese => 
        cheese.name.toLowerCase().includes(query.toLowerCase()) ||
        cheese.country.toLowerCase().includes(query.toLowerCase()) ||
        cheese.milk.toLowerCase().includes(query.toLowerCase()) ||
        cheese.texture.toLowerCase().includes(query.toLowerCase()) ||
        (cheese.flavor && cheese.flavor.toLowerCase().includes(query.toLowerCase()))
      )
    }
    
    // Apply milk filter
    if (filters.milk) {
      filtered = filtered.filter(cheese => 
        cheese.milk.toLowerCase() === filters.milk.toLowerCase()
      )
    }
    
    // Apply country filter
    if (filters.country) {
      filtered = filtered.filter(cheese => 
        cheese.country.toLowerCase() === filters.country.toLowerCase()
      )
    }
    
    // Apply texture filter
    if (filters.texture) {
      filtered = filtered.filter(cheese => 
        cheese.texture.toLowerCase().includes(filters.texture.toLowerCase())
      )
    }
    
    setFilteredCheeses(filtered)
  }
  
  // Update displayed cheeses when filtered cheeses or page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setDisplayedCheeses(filteredCheeses.slice(startIndex, endIndex))
  }, [filteredCheeses, currentPage, itemsPerPage])
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target
    const filterKey = id.split("-")[0] // Extract filter name from id
    
    const newFilters = {
      ...filters,
      [filterKey]: value
    }
    
    setFilters(newFilters)
    
    // Update URL with new filters
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (newFilters.milk) params.set("milk", newFilters.milk)
    if (newFilters.country) params.set("country", newFilters.country)
    if (newFilters.texture) params.set("texture", newFilters.texture)
    params.set("page", "1") // Reset to page 1 when filters change
    
    router.push(`/cheeses?${params.toString()}`)
    
    // Apply filters
    applyFilters(cheeses, searchQuery, newFilters)
  }
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/cheeses?${params.toString()}`)
  }
  
  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, last page, current page, and pages around current
      pages.push(1)
      
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = 4
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(-1) // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(-2) // -2 represents ellipsis
      }
      
      // Add last page if not already included
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }
  
  // Extract unique values for filter dropdowns
  const getUniqueValues = (field: keyof CheeseBasicInfo) => {
    const values = new Set<string>()
    cheeses.forEach(cheese => {
      if (cheese[field]) {
        values.add(String(cheese[field]).toLowerCase())
      }
    })
    return Array.from(values).sort()
  }
  
  const uniqueCountries = getUniqueValues('country')
  const uniqueMilkTypes = getUniqueValues('milk')
  const uniqueTextures = getUniqueValues('texture')
  
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 text-[#333333]">All Cheeses</h1>
      <p className="text-xl text-[#666666] mb-8">
        Explore our collection of {totalCheeses.toLocaleString()} cheese varieties from around the world
        {searchQuery && <span> • Showing results for "{searchQuery}"</span>}
      </p>
      
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <Link href="/milk-type" className="tag-pill">By Milk Type</Link>
          <Link href="/origin" className="tag-pill">By Origin</Link>
          <Link href="/texture" className="tag-pill">By Texture</Link>
        </div>
        
        <div className="bg-[#f9f5e7] p-4 rounded-lg mb-8">
          <h2 className="text-lg font-bold mb-2 text-[#6b4c1e]">Filter Cheeses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="milk-filter" className="block text-[#333333] text-sm font-medium mb-1">Milk Type</label>
              <select 
                id="milk-filter" 
                value={filters.milk}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c28135]"
              >
                <option value="">All Milk Types</option>
                {uniqueMilkTypes.map(milk => (
                  <option key={milk} value={milk}>
                    {milk.charAt(0).toUpperCase() + milk.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="country-filter" className="block text-[#333333] text-sm font-medium mb-1">Country</label>
              <select 
                id="country-filter" 
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c28135]"
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>
                    {country.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="texture-filter" className="block text-[#333333] text-sm font-medium mb-1">Texture</label>
              <select 
                id="texture-filter" 
                value={filters.texture}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#c28135]"
              >
                <option value="">All Textures</option>
                {uniqueTextures.map(texture => (
                  <option key={texture} value={texture}>
                    {texture.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="col-span-3 text-center py-12">
          <p className="text-xl text-[#666666]">Loading cheeses...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCheeses.length > 0 ? (
              displayedCheeses.map((cheese, index) => (
                <CheeseCard
                  key={index}
                  name={cheese.name}
                  slug={cheese.slug}
                  country={cheese.country}
                  milk={cheese.milk}
                  texture={cheese.texture}
                  flavor={cheese.flavor}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-xl text-[#666666]">No cheeses found matching your criteria.</p>
                <p className="text-[#666666] mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
          
          {filteredCheeses.length > itemsPerPage && (
            <div className="mt-12 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-[#e0e0e0] text-[#666666] rounded-l-md hover:bg-[#f9f5e7] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {getPageNumbers().map((page, index) => (
                  page < 0 ? (
                    <span 
                      key={`ellipsis-${index}`}
                      className="px-4 py-2 bg-white border border-[#e0e0e0] text-[#666666]"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border ${
                        page === currentPage 
                          ? 'bg-[#c28135] text-white border-[#c28135]' 
                          : 'bg-white text-[#666666] border-[#e0e0e0] hover:bg-[#f9f5e7]'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 bg-white border border-[#e0e0e0] text-[#666666] rounded-r-md hover:bg-[#f9f5e7] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
          
          <div className="mt-6 text-center text-[#666666]">
            {filteredCheeses.length > 0 && (
              <p>
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredCheeses.length)} to {Math.min(currentPage * itemsPerPage, filteredCheeses.length)} of {filteredCheeses.length} cheeses
                {filteredCheeses.length < totalCheeses && ` (filtered from ${totalCheeses} total)`}
              </p>
            )}
          </div>
        </>
      )}
    </>
  )
}

// Main page component with Suspense boundary
export default function CheesesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={<CheeseListLoading />}>
        <CheeseListContent />
      </Suspense>
    </div>
  )
}
