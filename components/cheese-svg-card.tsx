import React from 'react';
import Link from 'next/link';

interface CheeseSvgCardProps {
  name: string;
  slug: string;
  country?: string;
  region?: string;
  milk?: string;
  texture?: string;
  flavor?: string;
  rind?: string;
  vegetarian?: string;
  tags?: string[];
}

export default function CheeseSvgCard({
  name,
  slug,
  country,
  region,
  milk,
  texture,
  flavor,
  rind,
  vegetarian,
  tags = []
}: CheeseSvgCardProps) {
  // Limit tags to 5 for display
  const displayTags = tags?.slice(0, 5) || [];
  
  return (
    <Link href={`/cheeses/${slug}`} className="block">
      <div className="relative w-full rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden bg-white border border-[#e6e6e6]">
        {/* Header section */}
        <div className="bg-[#f9f5e7] p-4 rounded-t-lg">
          <h3 className="font-bold text-xl text-[#6b4c1e] truncate">{name}</h3>
        </div>
        
        {/* Tags section */}
        <div className="p-4 flex flex-wrap gap-2">
          {displayTags.map((tag, index) => (
            <span 
              key={index} 
              className="inline-block px-3 py-1 rounded-full text-sm bg-[#f8e8c8] text-[#6b4c1e]"
            >
              {tag}
            </span>
          ))}
          {country && (
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-[#f8e8c8] text-[#6b4c1e]">
              {country}
            </span>
          )}
          {milk && (
            <span className="inline-block px-3 py-1 rounded-full text-sm bg-[#f8e8c8] text-[#6b4c1e]">
              {milk} milk
            </span>
          )}
        </div>
        
        {/* Information grid */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <h4 className="font-semibold text-[#333333]">Origin</h4>
            <p className="text-[#555555]">
              {country}
              {region && region !== "NA" ? `, ${region}` : ""}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#333333]">Milk Type</h4>
            <p className="text-[#555555]">{milk || "Not specified"}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#333333]">Texture</h4>
            <p className="text-[#555555]">{texture || "Not specified"}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#333333]">Flavor</h4>
            <p className="text-[#555555]">{flavor || "Not specified"}</p>
          </div>
          
          {rind && (
            <div>
              <h4 className="font-semibold text-[#333333]">Rind</h4>
              <p className="text-[#555555]">{rind}</p>
            </div>
          )}
          
          {vegetarian && (
            <div>
              <h4 className="font-semibold text-[#333333]">Vegetarian</h4>
              <p className="text-[#555555]">{vegetarian === "TRUE" ? "Yes" : "No"}</p>
            </div>
          )}
        </div>
        
        {/* Decorative cheese icon */}
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 rounded-full bg-[#f8e8c8] opacity-80"></div>
        </div>
      </div>
    </Link>
  );
}
