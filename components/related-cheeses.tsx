import CheeseCard from "./cheese-card"

interface RelatedCheese {
  name: string
  slug: string
  country?: string
  milk?: string
  texture?: string
  flavor?: string
}

interface RelatedCheesesProps {
  cheeses: RelatedCheese[]
  title?: string
}

export default function RelatedCheeses({ cheeses, title = "Related Cheeses" }: RelatedCheesesProps) {
  if (!cheeses || cheeses.length === 0) {
    return null
  }

  return (
    <section className="content-section">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cheeses.slice(0, 6).map((cheese, index) => (
          <CheeseCard
            key={index}
            name={cheese.name}
            slug={cheese.slug}
            country={cheese.country}
            milk={cheese.milk}
            texture={cheese.texture}
            flavor={cheese.flavor}
          />
        ))}
      </div>
    </section>
  )
}

