import Link from "next/link"

export const metadata = {
  title: "Cheese Guide | QCheese.com",
  description: "Learn about different types of cheese, their characteristics, and how to enjoy them.",
}

export default function CheeseGuidePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-[#333333]">Cheese Guide</h1>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Understanding Cheese</h2>
        <p className="text-[#555555] mb-4">
          Cheese is a dairy product made from the milk of cows, goats, sheep, and other mammals. 
          It's produced by coagulating milk protein (casein), which separates into curds and whey. 
          The curds are then processed in various ways to create different types of cheese.
        </p>
        <p className="text-[#555555] mb-4">
          The incredible diversity of cheese comes from variations in:
        </p>
        <ul className="list-disc pl-6 mb-6 text-[#555555]">
          <li>Type of milk used (cow, goat, sheep, buffalo, etc.)</li>
          <li>Bacteria and mold cultures added</li>
          <li>Processing techniques (heating, stretching, washing)</li>
          <li>Aging time and conditions</li>
          <li>Regional traditions and methods</li>
        </ul>
      </div>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Cheese Categories</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 text-[#333333]">By Milk Type</h3>
          <p className="text-[#555555] mb-2">
            The type of milk used significantly impacts the flavor, texture, and character of cheese:
          </p>
          <ul className="list-disc pl-6 mb-4 text-[#555555]">
            <li><strong>Cow's milk:</strong> Generally mild and versatile (Cheddar, Gouda, Brie)</li>
            <li><strong>Goat's milk:</strong> Often tangy with distinctive flavor (Chèvre, Bucheron)</li>
            <li><strong>Sheep's milk:</strong> Rich and nutty (Roquefort, Manchego, Pecorino)</li>
            <li><strong>Buffalo milk:</strong> Creamy and rich (Mozzarella di Bufala)</li>
          </ul>
          <Link href="/milk-type" className="text-[#c28135] hover:underline">Explore cheeses by milk type →</Link>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 text-[#333333]">By Texture</h3>
          <p className="text-[#555555] mb-2">
            Cheese textures range from soft and creamy to hard and crystalline:
          </p>
          <ul className="list-disc pl-6 mb-4 text-[#555555]">
            <li><strong>Fresh:</strong> Soft, moist, and unaged (Ricotta, Cottage Cheese)</li>
            <li><strong>Soft-ripened:</strong> Creamy interior with bloomy rind (Brie, Camembert)</li>
            <li><strong>Semi-soft:</strong> Smooth, pliable texture (Havarti, Fontina)</li>
            <li><strong>Semi-hard:</strong> Firm but still moist (Gouda, Cheddar)</li>
            <li><strong>Hard:</strong> Dense, sometimes crystalline (Parmesan, Pecorino)</li>
            <li><strong>Blue:</strong> Veined with blue-green mold (Roquefort, Stilton)</li>
          </ul>
          <Link href="/texture" className="text-[#c28135] hover:underline">Explore cheeses by texture →</Link>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 text-[#333333]">By Origin</h3>
          <p className="text-[#555555] mb-2">
            Many cheeses are deeply connected to their place of origin:
          </p>
          <ul className="list-disc pl-6 mb-4 text-[#555555]">
            <li><strong>France:</strong> Home to hundreds of varieties (Brie, Camembert, Roquefort)</li>
            <li><strong>Italy:</strong> Famous for hard grating and soft fresh cheeses (Parmigiano-Reggiano, Mozzarella)</li>
            <li><strong>Spain:</strong> Known for sheep's milk cheeses (Manchego, Idiazábal)</li>
            <li><strong>Switzerland:</strong> Famous for alpine cheeses (Emmental, Gruyère)</li>
            <li><strong>United Kingdom:</strong> Known for Cheddar and blue cheeses (Stilton)</li>
          </ul>
          <Link href="/origin" className="text-[#c28135] hover:underline">Explore cheeses by origin →</Link>
        </div>
      </div>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Cheese Tasting Guide</h2>
        <p className="text-[#555555] mb-4">
          To fully appreciate cheese, engage all your senses:
        </p>
        <ol className="list-decimal pl-6 mb-6 text-[#555555]">
          <li><strong>Look:</strong> Observe the color, texture, and rind</li>
          <li><strong>Touch:</strong> Feel the firmness and moisture level</li>
          <li><strong>Smell:</strong> Note the aromas, which hint at flavors</li>
          <li><strong>Taste:</strong> Let it warm slightly in your mouth to release full flavors</li>
          <li><strong>Listen:</strong> Some aged cheeses have a slight crunch from protein crystals</li>
        </ol>
        <p className="text-[#555555]">
          For the best tasting experience, serve cheese at room temperature (take it out of refrigeration 30-60 minutes before serving).
        </p>
      </div>
    </div>
  )
}
