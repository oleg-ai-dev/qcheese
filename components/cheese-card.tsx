import Link from "next/link"

interface CheeseCardProps {
  name: string
  slug: string
  country?: string
  milk?: string
  texture?: string
  flavor?: string
  tags?: string[]
}

export default function CheeseCard({ 
  name, 
  slug, 
  country, 
  milk, 
  texture, 
  flavor,
  tags = []
}: CheeseCardProps) {
  return (
    <Link href={`/cheeses/${slug}`} className="block">
      <div className="relative w-full rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden bg-white border border-[#e6e6e6]">
        {/* Header section */}
        <div className="bg-[#f9f5e7] p-4 rounded-t-lg">
          <h3 className="font-bold text-xl text-[#6b4c1e] truncate">{name}</h3>
        </div>
        
        {/* Information section */}
        <div className="p-4">
          {country && (
            <div className="flex items-center mb-2">
              <span className="text-[#666666]">🌍</span>
              <span className="ml-2 text-[#666666]">{country}</span>
            </div>
          )}
          
          {milk && (
            <div className="flex items-center mb-2">
              <span className="text-[#666666]">🥛</span>
              <span className="ml-2 text-[#666666]">{milk}</span>
            </div>
          )}
          
          {texture && (
            <div className="flex items-center mb-2">
              <span className="text-[#666666]">📋</span>
              <span className="ml-2 text-[#666666]">{texture}</span>
            </div>
          )}
          
          {flavor && (
            <div className="flex items-center mb-2">
              <span className="text-[#666666]">✨</span>
              <span className="ml-2 text-[#666666]">{flavor}</span>
            </div>
          )}
        </div>
        
        {/* Decorative header color bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#e9cfa7]"></div>
      </div>
    </Link>
  );
}
