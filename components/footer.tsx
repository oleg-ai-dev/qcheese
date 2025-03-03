import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">QCheese.com</h3>
            <p className="text-[#dddddd] text-sm">
              Your comprehensive guide to the world of cheese.
              <br />
              Featuring thousands of cheese varieties from around the world.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/milk-type/cow" className="text-[#dddddd] hover:text-white">Cow Milk Cheeses</Link></li>
              <li><Link href="/milk-type/sheep" className="text-[#dddddd] hover:text-white">Sheep Milk Cheeses</Link></li>
              <li><Link href="/milk-type/goat" className="text-[#dddddd] hover:text-white">Goat Milk Cheeses</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Origins</h4>
            <ul className="space-y-2">
              <li><Link href="/origin/france" className="text-[#dddddd] hover:text-white">French Cheeses</Link></li>
              <li><Link href="/origin/italy" className="text-[#dddddd] hover:text-white">Italian Cheeses</Link></li>
              <li><Link href="/origin/spain" className="text-[#dddddd] hover:text-white">Spanish Cheeses</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-[#dddddd] hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-[#dddddd] hover:text-white">Contact</Link></li>
              <li><Link href="/sitemap.xml" className="text-[#dddddd] hover:text-white">Sitemap</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-[#aaaaaa] text-sm">
          <p>&copy; {new Date().getFullYear()} QCheese.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
