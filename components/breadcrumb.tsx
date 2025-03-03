import Link from "next/link"

interface BreadcrumbItem {
  label: string
  href: string
  isCurrentPage?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.isCurrentPage ? (
              <span className="text-gray-800 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-blue-600">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

