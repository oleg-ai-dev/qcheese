import Link from "next/link"

interface TagListProps {
  tags: string[]
}

export default function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap">
      {tags.map((tag, index) => (
        <Link key={index} href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`} className="tag-pill">
          {tag}
        </Link>
      ))}
    </div>
  )
}

