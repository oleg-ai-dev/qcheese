import Link from "next/link"

export const metadata = {
  title: "About QCheese.com | The Ultimate Cheese Directory",
  description: "Learn about QCheese.com, our mission, and our passion for documenting the world's cheese varieties.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-[#333333]">About QCheese.com</h1>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Our Mission</h2>
        <p className="text-[#555555] mb-4">
          QCheese.com was created with a simple mission: to document and celebrate the incredible diversity of cheese from around the world. 
          We aim to be the most comprehensive, accurate, and accessible resource for cheese enthusiasts, from casual fans to connoisseurs.
        </p>
        <p className="text-[#555555] mb-4">
          Our database currently features detailed information on over 1,100 cheese varieties, with new additions being made regularly. 
          For each cheese, we provide information on origin, milk type, texture, flavor profile, production methods, and traditional pairings.
        </p>
      </div>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Our Story</h2>
        <p className="text-[#555555] mb-4">
          QCheese.com began as a passion project by a group of cheese enthusiasts who were frustrated by the lack of a comprehensive online cheese resource. 
          What started as a small database of favorite cheeses quickly grew into an ambitious project to document every notable cheese variety in existence.
        </p>
        <p className="text-[#555555] mb-4">
          Our team now includes food historians, dairy scientists, and culinary experts who work together to ensure the accuracy and depth of our cheese profiles. 
          We collaborate with cheesemakers, affineurs, and cheese shops around the world to continually expand and refine our database.
        </p>
      </div>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2 text-[#333333]">Accuracy</h3>
            <p className="text-[#555555] mb-4">
              We're committed to providing accurate, well-researched information about each cheese. 
              Our profiles are based on authoritative sources, direct communication with producers, and firsthand tasting notes.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-[#333333]">Accessibility</h3>
            <p className="text-[#555555] mb-4">
              We believe cheese knowledge should be accessible to everyone. 
              We avoid jargon when possible and explain technical terms when they're necessary.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-[#333333]">Appreciation</h3>
            <p className="text-[#555555] mb-4">
              We celebrate the cultural heritage, craftsmanship, and traditions behind each cheese. 
              We respect the artisans who dedicate their lives to preserving and evolving cheese-making techniques.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-[#333333]">Education</h3>
            <p className="text-[#555555] mb-4">
              We aim to educate cheese lovers about the incredible diversity of cheese and encourage exploration beyond familiar varieties. 
              We believe understanding enhances appreciation.
            </p>
          </div>
        </div>
      </div>
      
      <div className="content-section">
        <h2 className="text-2xl font-bold mb-4 text-[#333333]">Contact Us</h2>
        <p className="text-[#555555] mb-4">
          We welcome feedback, corrections, and suggestions for additions to our database. 
          If you're a cheesemaker or retailer interested in having your products featured, we'd love to hear from you.
        </p>
        <p className="text-[#555555] mb-6">
          For all inquiries, please email us at <Link href="/contact" className="text-[#c28135] hover:underline">contact@qcheese.com</Link>.
        </p>
        
        <div className="mt-8 text-center">
          <Link href="/" className="btn-primary">
            EXPLORE OUR CHEESE DIRECTORY
          </Link>
        </div>
      </div>
    </div>
  )
}
