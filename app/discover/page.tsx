import Link from "next/link"

export const metadata = {
  title: "Discover Cheeses | QCheese.com",
  description: "Discover new and interesting cheeses based on your preferences and tastes.",
}

export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-[#333333]">Discover Cheeses</h1>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Find Your Perfect Cheese</h2>
        <p className="text-[#555555] mb-6">
          With thousands of cheese varieties available, finding new cheeses to try can be exciting. 
          Use our discovery tools to explore cheeses based on your preferences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#f9f5e7] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3 text-[#6b4c1e]">If you like...</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-[#333333]">Cheddar</p>
                <p className="text-[#555555]">Try: Gouda, Colby, Gruyère</p>
              </div>
              <div>
                <p className="font-medium text-[#333333]">Brie</p>
                <p className="text-[#555555]">Try: Camembert, Saint-André, Brillat-Savarin</p>
              </div>
              <div>
                <p className="font-medium text-[#333333]">Blue Cheese</p>
                <p className="text-[#555555]">Try: Gorgonzola, Roquefort, Stilton</p>
              </div>
              <div>
                <p className="font-medium text-[#333333]">Mozzarella</p>
                <p className="text-[#555555]">Try: Burrata, Oaxaca, Stracciatella</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#f9f5e7] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3 text-[#6b4c1e]">Based on flavor profile...</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-[#333333]">Nutty</p>
                <p className="text-[#555555]">Try: Comté, Emmental, Manchego</p>
              </div>
              <div>
                <p className="font-medium text-[#333333]">Creamy</p>
                <p className="text-[#555555]">Try: Mascarpone, Brillat-Savarin, Délice de Bourgogne</p>
              </div>
              <div>
                <p className="font-medium text-[#333333]">Sharp</p>
                <p className="text-[#555555]">Try: Aged Cheddar, Asiago, Pecorino</p>
              </div>
              <div>
                <p className="font-medium text-[#333333]">Earthy</p>
                <p className="text-[#555555]">Try: Taleggio, Époisses, Reblochon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Cheese Pairing Suggestions</h2>
        <p className="text-[#555555] mb-6">
          Enhance your cheese experience with these classic pairings:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#e6e6e6] rounded-lg p-5">
            <h3 className="text-lg font-bold mb-3 text-[#333333]">Wine Pairings</h3>
            <ul className="space-y-2 text-[#555555]">
              <li><strong>Brie:</strong> Chardonnay, Champagne</li>
              <li><strong>Cheddar:</strong> Cabernet Sauvignon, Merlot</li>
              <li><strong>Blue Cheese:</strong> Port, Sauternes</li>
              <li><strong>Goat Cheese:</strong> Sauvignon Blanc, Pinot Grigio</li>
              <li><strong>Gruyère:</strong> Riesling, Gewürztraminer</li>
            </ul>
          </div>
          
          <div className="border border-[#e6e6e6] rounded-lg p-5">
            <h3 className="text-lg font-bold mb-3 text-[#333333]">Fruit Pairings</h3>
            <ul className="space-y-2 text-[#555555]">
              <li><strong>Brie:</strong> Apples, Grapes</li>
              <li><strong>Cheddar:</strong> Apples, Pears</li>
              <li><strong>Blue Cheese:</strong> Pears, Figs</li>
              <li><strong>Goat Cheese:</strong> Berries, Cherries</li>
              <li><strong>Parmesan:</strong> Grapes, Apricots</li>
            </ul>
          </div>
          
          <div className="border border-[#e6e6e6] rounded-lg p-5">
            <h3 className="text-lg font-bold mb-3 text-[#333333]">Other Accompaniments</h3>
            <ul className="space-y-2 text-[#555555]">
              <li><strong>Brie:</strong> Honey, Walnuts</li>
              <li><strong>Cheddar:</strong> Chutney, Mustard</li>
              <li><strong>Blue Cheese:</strong> Honey, Walnuts</li>
              <li><strong>Goat Cheese:</strong> Herbs, Olive Oil</li>
              <li><strong>Manchego:</strong> Quince Paste, Almonds</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/cheeses" className="btn-primary">
          EXPLORE ALL CHEESES
        </Link>
      </div>
    </div>
  )
}
