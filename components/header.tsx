"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/cheeses?search=${encodeURIComponent(searchQuery)}`)
    }
  }
  
  return (
    <header className="bg-[#f9f7f2] border-b border-[#e6e6e6] py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-[#c28135]">
              QCheese.com
            </Link>
            <span className="ml-2 text-sm text-[#888888]">The Ultimate Cheese Directory</span>
          </div>

          <nav className="flex items-center space-x-6">
            <Link href="/cheese-guide" className="text-[#888888] hover:text-[#c28135] transition-colors">
              Cheese Guide
            </Link>
            <Link href="/discover" className="text-[#888888] hover:text-[#c28135] transition-colors">
              Discover
            </Link>
            <Link href="/about" className="text-[#888888] hover:text-[#c28135] transition-colors">
              About
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search cheeses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-[#e0e0e0] rounded-full py-2 px-4 pl-10 text-sm w-40 md:w-48 focus:outline-none focus:ring-2 focus:ring-[#c28135] focus:border-transparent"
              />
              <button type="submit" className="absolute left-3 top-2.5 h-4 w-4 text-[#aaaaaa]">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </nav>
        </div>
      </div>
    </header>
  )
}
